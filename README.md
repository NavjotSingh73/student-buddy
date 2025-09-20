📘 Student Buddy – Chrome Extension

Student Buddy is a mentor-like Chrome extension that helps students tackle DSA (Data Structures & Algorithms) problems.
It provides conceptual hints and step-by-step guidance without directly giving away solutions (unless explicitly requested).

🚀 Features

🔑 Save your OpenAI API key securely in extension options

💡 Get conceptual hints before full solutions

🛑 Prevents accidental solution reveals with a clicks-before-solution safety mechanism

🎨 Simple popup interface for quick access while solving problems

🛠 Built with HTML, CSS, JavaScript, Chrome Extensions Manifest V3

📂 Project Structure
student-buddy/
├─ manifest.json        # Extension manifest (v3)
├─ service-worker.js    # Background service worker for API requests
├─ content.js           # (optional) Injected into pages if needed
├─ popup.html           # Popup UI
├─ popup.js             # Popup logic
├─ popup.css            # Styling for popup & options
├─ options.html         # Options page (API key, preferences)
├─ options.js           # Options logic
├─ README.md            # Project documentation
└─ LICENSE              # Open-source license

⚙️ Setup
1. Clone the Repository
git clone https://github.com/NavjotSingh73/student-buddy.git
cd student-buddy

2. Load Extension in Chrome

Open Chrome and go to chrome://extensions/

Enable Developer Mode (top right)

Click Load Unpacked

Select the student-buddy folder

3. Configure Options

Right-click the extension → Options

Enter your OpenAI API Key

Choose hint level and solution safety settings

### Screenshots

#### Popup UI

![Popup UI Screenshot 1](screenshots/Screenshot%202025-09-16%20215633.png)

![Popup UI Screenshot 2](screenshots/Screenshot%202025-09-16%20215722.png)

#### Options Page

![Options Page Screenshot](screenshots/Screenshot%202025-09-16%20215743.png)

🖼️ Usage

Open a DSA problem page

Click the Student Buddy extension icon

Select Get Hint for conceptual help

If needed, confirm to Show Solution (after required clicks)

🔐 API Key Security

Your API key is stored locally in chrome.storage.local

The extension makes requests directly to OpenAI’s API

For more security, you may run requests via your own backend proxy

📜 License

This project is licensed under the MIT License.
