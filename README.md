# BaudRate Terminal 📟

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![Gemini](https://img.shields.io/badge/AI-Gemini%20Flash-8e75b2.svg)
![Style](https://img.shields.io/badge/Style-Cyberpunk%20%2F%20Retro-ff00ff.svg)

**BaudRate Terminal** is a highly aesthetic, retro-futuristic terminal emulator built with React and Tailwind CSS. It features a fully functional CLI powered by Google's Gemini AI, wrapped in a stunning CRT monitor simulation with holographic 3D projection effects.

## ✨ Features

*   **Authentic CRT Simulation**: Scanlines, screen curvature, bloom, flickering, and turn-on sequences.
*   **AI Integration**: Chat with the "BaudRate Kernel" (powered by **Google Gemini 1.5 Flash**) directly from the command line.
*   **Holographic UI**: The terminal container exists in 3D space. You can rotate and tilt the screen using the configuration panel.
*   **Dynamic Themes**: Switch between Amber, Green, Cyan, and White phosphor aesthetics instantly.
*   **Visual Dashboard**: A "screen saver" style dashboard featuring a hacker globe, signal waveforms, and dummy process visualizations.
*   **immersive Sound & Feel**: Typing delays and strict visual styling to match late 80s/early 90s cyber-industrial interfaces.

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   A Google Cloud Project with the **Gemini API** enabled.
*   An API Key from [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/baudrate-terminal.git
    cd baudrate-terminal
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory and add your API key:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```
    *Note: The application expects `process.env.API_KEY` to be available.*

4.  **Run the application**
    ```bash
    npm start
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## ⌨️ Command Reference

Once the terminal is initialized, you can use the following commands:

| Command | Description |
| :--- | :--- |
| `help` | Lists available commands. |
| `ask <query>` | Sends a prompt to the Neural Net (Gemini AI). Example: `ask explain quantum physics` |
| `theme <color>` | Changes the phosphor color. Options: `amber`, `green`, `cyan`, `white`. |
| `clear` | Clears the current screen buffer. |
| `whoami` | Displays current user session. |
| `date` | Shows system date and time. |
| `about` | System information and credits. |

## 🎨 Themes

You can toggle themes via the **Config** button in the bottom right or using the `theme` command.

*   **AMBER** (Default): Classic warm industrial feel. <img width="1919" height="905" alt="image" src="https://github.com/user-attachments/assets/69993032-fdf0-4042-b584-b4408eb977bc" />

*   **GREEN**: The quintessential matrix hacker vibe. <img width="1897" height="867" alt="image" src="https://github.com/user-attachments/assets/6c200425-aebf-40e2-bc3a-9d29fd9aa6c1" />

*   **CYAN**: High-tech, cold futuristic look. <img width="1917" height="904" alt="image" src="https://github.com/user-attachments/assets/7786df8c-da32-4895-b72c-5aebee1a4932" />

*   **WHITE**: Stark, high-contrast monochrome. <img width="1917" height="907" alt="image" src="https://github.com/user-attachments/assets/1a2701e6-960a-43b5-9b55-fb392ad66ebd" />


## 🛠️ Built With

*   **React 19**: UI Component library.
*   **Tailwind CSS**: Utility-first styling for the CRT effects and layout.
*   **@google/genai**: Official SDK for interacting with Gemini models.
*   **Canvas API**: Used for the dashboard visualizations (Globe, Waveforms).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

> *"The sky above the port was the color of television, tuned to a dead channel."*
