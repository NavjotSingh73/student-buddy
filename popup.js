document.addEventListener("DOMContentLoaded", () => {
  const getHelpBtn = document.getElementById("getHelpBtn");
  const problemInput = document.getElementById("problemInput");
  const responseDiv = document.getElementById("response");

  // Show loading spinner/message
  function showLoading() {
    responseDiv.innerHTML = `<p><em>Thinking... hang on 🧠</em></p>`;
  }

  // Render mentor-style hints
  function renderResponse(text) {
    responseDiv.innerHTML = "";

    // Try to break down into steps if the model returns numbered points
    const steps = text.split(/\n(?=\d+\.)/);
    if (steps.length > 1) {
      const ul = document.createElement("ul");
      steps.forEach(step => {
        const li = document.createElement("li");
        li.textContent = step.trim();
        ul.appendChild(li);
      });
      responseDiv.appendChild(ul);
    } else {
      responseDiv.textContent = text;
    }
  }

  // Handle button click
  getHelpBtn.addEventListener("click", async () => {
    const problemText = problemInput.value.trim();
    if (!problemText) {
      responseDiv.innerHTML = `<p style="color:red;">⚠️ Please enter or paste a problem statement first.</p>`;
      return;
    }

    showLoading();

    try {
      // Ask background.js to call the API
      const response = await chrome.runtime.sendMessage({
        action: "getMentorHelp",
        text: problemText
      });

      if (response && response.success) {
        renderResponse(response.data);
      } else {
        responseDiv.innerHTML = `<p style="color:red;">❌ ${response?.error || "Something went wrong."}</p>`;
      }
    } catch (err) {
      console.error(err);
      responseDiv.innerHTML = `<p style="color:red;">⚠️ Failed to reach background script.</p>`;
    }
  });
});
