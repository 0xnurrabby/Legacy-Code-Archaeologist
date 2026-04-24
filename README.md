# 🏛 Legacy Code Archaeologist

> Understand any codebase in minutes, not days. Powered by Claude AI.

Ever joined a new team and been handed a 5-year-old codebase with no documentation, no original developer around, and a deadline looming? Yeah, me too. That pain is why this tool exists.

Paste a GitHub link or drop a ZIP file. Claude does the rest — explains what the code does part by part, flags hidden problems, maps out file dependencies, and even generates a prompt you can paste back into Claude to recreate the entire project.


---

## ✨ What It Actually Does

### 📖 Code Purpose Explainer
Breaks down the entire project part by part like a patient teacher would. Tells you what each module does, who the project is built for, how it works step-by-step, and shows real-world examples. No more guessing.

### 🎯 Prompt Reverse Engineer
This one's wild. Point it at any codebase and it generates a detailed prompt that, when pasted into Claude AI, recreates the exact same project. Great for learning, great for cloning patterns, great for showing your teammate "this is how it should be built."

### 🕸 Dependency Graph
Visual map showing which file imports which. No more Ctrl+F-ing through 200 files to figure out where something is used.

### 🤔 Why Was This Written?
Claude analyzes design decisions and explains the probable reasoning behind them — patterns, trade-offs, and constraints the original dev faced.

### 💣 Hidden Landmines Detector
Finds deprecated patterns, circular dependencies, potential memory leaks, and code smells before they become 3 AM production incidents.

### 🗺 Onboarding Roadmap
"Start with this file, then read that one, then look here." A step-by-step learning path for new devs joining the project.

### 💬 Natural Language Query
Ask questions like "where is the payment logic?" and get exact file names and line numbers back.

### 🌐 Multi-Language Explanations
Explanations available in 8 languages — English, বাংলা (Bangla), हिन्दी (Hindi), 日本語 (Japanese), 한국어 (Korean), Español, Italiano, Русский. Code stays in English, but the explanations translate to your language.

---

## 🎨 Design

Neo-Brutalism — bold borders, flat colors, zero shadows. Wanted it to feel different from the usual polished SaaS look. Also added 50+ funny coding quotes that rotate during loading because staring at a spinner is boring.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed ([download here](https://nodejs.org))
- A Claude API key ([get one here](https://console.anthropic.com))
- A GitHub personal access token (optional but recommended for higher rate limits)

### Installation

```bash
# Clone the repo
git clone https://github.com/0xnurrabby/legacy-code-archaeologist.git
cd legacy-code-archaeologist

# Install dependencies
npm install

# Copy the example env file
cp .env.example .env.local
