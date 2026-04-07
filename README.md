<div align="center">

# ⚡ CodeFlow

### Learn to Code **Visually.**

*A gamified, browser-based Python learning platform with step-by-step animated code execution.*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-EF4444?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## ✨ What is CodeFlow?

CodeFlow is a **gamified coding learning platform** that teaches Python through animated, visual execution. Instead of just reading that a `for` loop repeats, you **watch it happen** — line by line, variable by variable, with cinematic animations.

> 🚫 Most platforms: *"A for loop repeats a block of code."*
>
> ✅ CodeFlow: *Shows a ball moving through a loop track, a counter ticking up, and the highlighted line moving in real time.*

---

## 🎮 Features

### 🎬 Visual Execution Engine
- **Cinematic mode** — Click ▶ Run and watch your code animate automatically, step by step
- **Line highlighting** — The current executing line is highlighted in the Monaco editor in real time
- **Step controls** — After playback, use `‹ ›` buttons to step through manually
- **Speed control** — Slow 🐢 / Normal ▶ / Fast ⚡ / Turbo 🚀

### 📊 5 Visualization Types
| Level | Concept | Visualization |
|-------|---------|---------------|
| 1 — Print Statements | `print()` | Terminal-style console output |
| 2 — Variables | Assignment & mutation | Animated labeled boxes |
| 3 — If / Else | Conditionals | Fork path — green ✅ true / red ❌ false |
| 4 — For Loops | Iteration | Bubble track + live counter |
| 5 — Nested Logic | Combined concepts | Smart multi-panel display |

### 🏆 Gamification
- **XP system** — Earn XP by completing challenges
- **Level progression** — Complete a challenge to unlock the next level
- **Badges** — Earn achievement badges (First Run, Loop Master, Logic Wizard, etc.)
- **Learn + Challenge** — Each level has a free-play **Learn** tab and a graded **Challenge** tab

### 💻 Editor
- **Monaco Editor** — The same engine that powers VS Code
- **Python syntax highlighting**
- **Custom dark theme** matching the CodeFlow aesthetic

---

## 🖼️ Screenshots

| Home | Level Select | Playground |
|------|-------------|------------|
| Dark hero with gradient text | 5-level progression map | Split-screen editor + animation |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/codeflow.git
cd codeflow

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏗️ Project Structure

```
codeflow/
├── src/
│   ├── engine/
│   │   └── tracer.js              # Custom Python pseudocode interpreter
│   ├── store/
│   │   └── gameStore.js           # Zustand state (XP, levels, badges)
│   ├── components/
│   │   ├── CodeEditor.jsx         # Monaco Editor wrapper
│   │   ├── ui/
│   │   │   ├── XPBar.jsx          # XP progress bar
│   │   │   └── BadgeModal.jsx     # Badge unlock notification
│   │   └── visualizations/
│   │       ├── PrintViz.jsx       # Terminal console visualization
│   │       ├── VariableViz.jsx    # Variable box animation
│   │       ├── IfElseViz.jsx      # Fork path animation
│   │       ├── LoopViz.jsx        # Loop bubble track
│   │       └── NestedViz.jsx      # Combined visualization
│   ├── pages/
│   │   ├── Home.jsx               # Landing page
│   │   ├── LevelSelect.jsx        # Level map
│   │   └── Playground.jsx         # Main learning screen
│   ├── App.jsx                    # Router setup
│   └── index.css                  # Global design system & CSS variables
├── public/
├── vite.config.js
└── package.json
```

---

## 🧠 How the Execution Engine Works

CodeFlow ships with a **custom in-browser Python tracer** (`src/engine/tracer.js`) — no backend required.

```
User types Python code
        ↓
tracer.js parses it line-by-line
        ↓
Returns an array of "steps"
  { line, variables, output, description, type }
        ↓
Playground.jsx plays steps with setInterval()
        ↓
VizPanel renders the correct visualization component
        ↓
Monaco highlights the active line
```

**Supported Python syntax:**
- `print()` — strings, numbers, variables
- Variable assignment and reassignment
- `if`, `elif`, `else` conditionals
- `for` loops with `range()`
- `while` loops
- Nested logic combinations

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| [React 18](https://reactjs.org/) | UI framework |
| [Vite 5](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Zustand](https://zustand-demo.pmnd.rs/) | Global state management |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | Code editor |
| [Lucide React](https://lucide.dev/) | Icons |

---

## 🎯 How to Play

1. **Start** → Click "Start for Free" on the home page
2. **Learn** → In the 📖 Learn tab, study the starter code and click ▶ Run to watch it animate
3. **Challenge** → Switch to 🏆 Challenge tab, write your solution, and click ▶ Run
4. **Unlock** → Pass the challenge to earn XP, collect a badge, and unlock the next level
5. **Progress** → Complete all 5 levels to finish the course!

---

## 🗺️ Roadmap

- [ ] More levels (Functions, Lists, Dictionaries)
- [ ] User authentication & cloud progress saving
- [ ] Multiplayer challenge mode
- [ ] More visualization types (recursion tree, call stack)
- [ ] Export your code to a real Python file
- [ ] Mobile app version

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ for hackathons and learners everywhere.

**[⚡ Try CodeFlow Live](http://localhost:5173)** · [Report a Bug](../../issues) · [Request a Feature](../../issues)

</div>
