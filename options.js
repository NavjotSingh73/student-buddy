document.addEventListener("DOMContentLoaded", async () => {
  // Load saved settings
  const stored = await chrome.storage.local.get(["apiKey", "hintLevel", "clicksBeforeSolution"]);
  if (stored.apiKey) document.getElementById("apiKey").value = stored.apiKey;
  if (stored.hintLevel) document.getElementById("hintLevel").value = stored.hintLevel;
  if (stored.clicksBeforeSolution) document.getElementById("clicksBeforeSolution").value = stored.clicksBeforeSolution;

  document.getElementById("save").addEventListener("click", async () => {
    const apiKey = document.getElementById("apiKey").value.trim();
    const hintLevel = document.getElementById("hintLevel").value;
    const clicksBeforeSolution = parseInt(document.getElementById("clicksBeforeSolution").value, 10);

    await chrome.storage.local.set({
      apiKey,
      hintLevel,
      clicksBeforeSolution
    });

    const status = document.getElementById("status");
    status.textContent = "✅ Settings saved!";
    setTimeout(() => status.textContent = "", 2000);
  });
});
