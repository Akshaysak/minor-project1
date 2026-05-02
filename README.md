# 🦥 Lazy Planner - Intelligent Scheduling

A sophisticated, low-pressure scheduling ecosystem designed for a balanced life. Move away from rigid to-do lists and embrace a paced, optimized daily flow.

## ✨ Core Features
- **Intelligent Insight Engine**: Receive daily behavioral insights and encouraging wisdom to maintain productivity without burnout.
- **Optimized Flow Generator**: An intelligent algorithm parses your tasks, wake/sleep patterns, and energy levels to suggest the perfect daily balance.
- **Calendar Visualization**: High-contrast "Duty Indicators" (R) provide instant visual context for your upcoming commitments.
- **Glassmorphism Interface**: A refined, immersive dark theme utilizing frosted glass components and fluid animations for a premium user experience.
- **Fully Local & Secure**: User data is persisted via client-side storage, ensuring privacy and speed.

## 🚀 Local Development Environment

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher).
- npm (Node Package Manager).

### 2. Installation & Configuration
1. **Repository Setup**:
   ```bash
   # Clone or extract the repository
   cd lazy-planner
   ```

2. **Dependency Installation**:
   ```bash
   npm install
   ```

3. **Engine Configuration**:
   The Intelligent Insight features require an engine key. 
   - Create a `.env` file in the root directory.
   - Obtain a key from the [Developer Console](https://aistudio.google.com/app/apikey).
   - Add the following entry:
     ```env
     VITE_GEMINI_API_KEY=your_key_here
     ```

### 3. Execution
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

## 🛠️ Technology Stack
- **Library**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Orchestration**: Intelligent Engine Integration (Gemini-Flash)
- **Animation**: Motion (Framer)
- **Iconography**: Lucide React
