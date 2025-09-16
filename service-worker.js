const DEFAULT_MODEL = "gemini-pro"; // Not used, but kept for reference


chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ hintLevel: "concept", clicksBeforeSolution: 2 });
});

async function callLLM(apiKey, prompt, maxTokens = 512) {
    const resp = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    maxOutputTokens: maxTokens,
                    temperature: 0.6
                }
            })
        }
    );

    if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Gemini API error ${resp.status}: ${txt}`);
    }
    const data = await resp.json();
    return (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0].text
    ) || JSON.stringify(data);
}

function buildPrompt(problemText, hintLevel) {
    // Example implementation, replace with your logic
    return `Give a ${hintLevel} hint for the following problem:\n${problemText}`;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Service worker received message:", message);
    (async () => {
        try {
            if (message.type === "request_hint") {
                const { problemText, hintLevel } = message;
                const stored = await chrome.storage.local.get(["apiKey"]);
                const apiKey = stored.apiKey;
                if (!apiKey) throw new Error("No API key set. Open extension options to set it.");
                const prompt = buildPrompt(problemText, hintLevel);
                const reply = await callLLM(apiKey, prompt, 300);
                sendResponse({ ok: true, reply });
                return;
            }

            if (message.type === "show_solution") {
                // check clicksBeforeSolution restriction
                const stored = await chrome.storage.local.get(["apiKey", "clicksBeforeSolution"]);
                const apiKey = stored.apiKey;
                const clicksRequired = stored.clicksBeforeSolution || 2;
                if (!apiKey) throw new Error("No API key set. Open extension options to set it.");

                // Require an explicit confirm flag in message to guard accidental reveals
                if (!message.confirmed) {
                    sendResponse({
                        ok: false,
                        error: `Safe mode: you must set confirmed=true to reveal solutions. Click the 'Show Solution' button and accept the confirmation.`
                    });
                    return;
                }

                const prompt = buildPrompt(message.problemText, "solution");
                const reply = await callLLM(apiKey, prompt, 800);
                sendResponse({ ok: true, reply });
                return;
            }
        } catch (err) {
            console.error("Service worker error:", err);
            sendResponse({ ok: false, error: err.message });
        }
    })();
    // Return true to indicate you wish to send a response asynchronously
    return true;
});