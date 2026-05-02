# 🦥 Lazy Planner - AI Powered

A relaxed scheduling app for a laid-back life. Stop stressing about your to-do lists and start planning for a paced, guilt-free day with the help of AI agents.

## ✨ New AI Features
- **Sloth Wisdom**: Get witty, lazy-friendly advice powered by Gemini.
- **AI Magic Scheduler**: Let the AI analyze your tasks and wake/sleep times to generate the perfectly balanced, low-stress schedule for you.
- **Calendar 'R' Indicator**: A clear "R" mark on the calendar dates that have reminders or duties set.
- **Glassmorphism UI**: Immersive dark theme with frosted glass elements for better focus.

## 🚀 How to Run Locally

Follow these steps to show this on your local device:

### 1. Prerequisites
- Install [Node.js](https://nodejs.org/) (v18 or higher recommended).

### 2. Setup
1. **Download the code**: Use the **"Settings" -> "Export to GitHub"** or the Share options in AI Studio to get your files.
2. **Open Terminal**: Navigate to the project folder.
3. **Install Dependencies**:
   ```bash
   npm install
   ```

### 3. Configure API Key (Required for AI features)
1. Create a file named `.env` in the root directory of the project.
2. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create a free API Key.
3. Add it to your `.env` file like this:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

### 4. Start the Application
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

## 🛠️ Built With
- **Frontend**: React + Vite
- **Styling**: Tailwind CSS (Glassmorphism)
- **AI Integration**: Google Gemini SDK
- **Animation**: Framer Motion
- **Icons**: Lucide React
