# 🦥 Lazy Planner - AI Scheduling Ecosystem

Lazy Planner is a relaxed, behavioral-driven scheduling application designed for a balanced life. Unlike rigid to-do lists, Lazy Planner utilizes intelligent algorithms to optimize your daily flow, balancing tasks with intentional recovery intervals.

## ✨ Core Architecture
- **Inertial Insight Engine**: Delivers sophisticated, context-aware mindfulness insights designed to maintain long-term cognitive endurance.
- **Smart Flow Optimization**: An algorithmic generator that parses objectives, chronotypes, and energy peaks to construct an optimal daily timeline.
- **Visual Commitments (Calendar)**: High-visibility "Duty Indicators" (R) allow for instant situational awareness of scheduled priorities.
- **Premium Interface Design**: A high-contrast, immersive glassmorphic UI engineered with React 19 and Framer Motion for a fluid, professional experience.

## 🚀 Deployment & Local Execution

### 1. Requirements
- **Runtime**: Node.js v18.0+
- **Package Manager**: npm

### 2. Physical Setup
```bash
# Extract the project files
cd pace-planner

# Install production dependencies
npm install
```

### 3. Engine Configuration (Services)
The intelligent features require connectivity to the Pace Insights Engine (powered by Gemini).
1. Create a `.env` file in the root directory.
2. In the `.env` file, add your developer key:
   ```env
   VITE_GEMINI_API_KEY=your_authentication_key_here
   ```

### 4. Development Execution
```bash
# Launch the platform locally
npm run dev
```
The application will be accessible at `http://localhost:3000`.

## 🛠️ Architecture Stack
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS (Utility-first architecture)
- **Animations**: Framer Motion
- **Iconography**: Lucide React
- **Persistence**: Browser-based LocalStorage API
