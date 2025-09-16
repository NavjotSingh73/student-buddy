// content.js — injects Buddy widget and panel
(function () {
    console.log("Student Buddy content script loaded");

    function createBuddyWidget() {
        if (document.getElementById("student-buddy-widget")) return;

        const wrapper = document.createElement("div");
        wrapper.id = "student-buddy-widget";
        Object.assign(wrapper.style, {
            position: "fixed",
            right: "16px",
            bottom: "16px",
            width: "56px",
            height: "56px",
            borderRadius: "28px",
            background: "#2b6cb0",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2147483647,
            fontFamily: "Arial, sans-serif",
            boxShadow: "0 6px 18px rgba(0,0,0,0.2)"
        });
        wrapper.innerText = "Buddy";
        document.body.appendChild(wrapper);

        wrapper.addEventListener("click", openPanel);
    }

    function openPanel() {
        if (document.getElementById("student-buddy-panel")) {
            document.getElementById("student-buddy-panel").remove();
            return;
        }
        const panel = document.createElement("div");
        panel.id = "student-buddy-panel";
        Object.assign(panel.style, {
            position: "fixed",
            right: "16px",
            bottom: "80px",
            width: "380px",
            maxHeight: "60vh",
            overflow: "auto",
            zIndex: 2147483647,
            background: "white",
            color: "#111",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            padding: "12px",
            fontFamily: "Arial, sans-serif",
            fontSize: "13px"
        });

        panel.innerHTML = `
<div style="display:flex;gap:8px;align-items:center;">
    <input id="sb-input" placeholder="Paste problem or select text on page" style="flex:1;padding:8px;font-size:13px"/>
    <button id="sb-hint" style="padding:6px 8px">Hint</button>
</div>
<div style="margin-top:8px;">
    <button id="sb-step" style="margin-right:6px">Next Step</button>
    <button id="sb-pseudo" style="margin-right:6px">Pseudocode</button>
</div>
<div id="sb-response" style="margin-top:12px;white-space:pre-wrap;"></div>
`;
        document.body.appendChild(panel);

        // Add event listeners for buttons
        panel.querySelector("#sb-hint").addEventListener("click", () => {
            sendBuddyRequest("concept");
        });
        panel.querySelector("#sb-step").addEventListener("click", () => {
            sendBuddyRequest("step");
        });
        panel.querySelector("#sb-pseudo").addEventListener("click", () => {
            sendBuddyRequest("pseudocode");
        });

        function sendBuddyRequest(hintLevel) {
            const input = panel.querySelector("#sb-input").value.trim();
            const responseDiv = panel.querySelector("#sb-response");
            if (!input) {
                responseDiv.textContent = "Please enter a problem statement.";
                return;
            }
            responseDiv.textContent = "Thinking...";
            chrome.runtime.sendMessage(
                { type: "request_hint", problemText: input, hintLevel },
                (response) => {
                    if (chrome.runtime.lastError) {
                        responseDiv.textContent = "Error: " + chrome.runtime.lastError.message;
                    } else if (response && response.ok) {
                        responseDiv.textContent = response.reply;
                    } else {
                        responseDiv.textContent = "Error: " + (response && response.error ? response.error : "Unknown error");
                    }
                }
            );
        }
    }

    // Initialize the widget on page load
    createBuddyWidget();
})();