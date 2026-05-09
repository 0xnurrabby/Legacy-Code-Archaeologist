<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,17,24&height=180&section=header&text=Legacy+Code+Archaeologist&fontSize=32&fontColor=000000&fontAlignY=38&desc=Understand+any+codebase+in+minutes+%E2%80%94+powered+by+Claude+AI&descAlignY=58&descSize=14&animation=fadeIn" width="100%"/>

<div align="center">

[![License](https://img.shields.io/badge/MIT-bbf7d0?style=for-the-badge&logoColor=000)](LICENSE)
[![Platform](https://img.shields.io/badge/Browser-bfdbfe?style=for-the-badge&logoColor=000)]()
[![Tech](https://img.shields.io/badge/Claude%20AI%20%2B%20JavaScript-fde68a?style=for-the-badge&logoColor=000)]()

</div>

<div align="center">
<i>Paste a GitHub link or drop a ZIP file and Claude breaks down what the code does, maps dependencies, finds hidden problems, and generates a prompt to recreate the project.</i>
</div>

---

## ✦ Features

<div align="center">

| | Feature | What it does |
|:---:|---|---|
| 📖 | Code explainer | Breaks down every module and explains what it does like a patient teacher |
| 🎯 | Prompt reverse engineer | Generates a Claude prompt that, when used, recreates the exact same project |
| 🕸️ | Dependency graph | Visual map of which file imports which |
| 🤔 | Design reasoning | Explains why code was written the way it was |
| 💣 | Hidden landmines | Finds deprecated patterns, circular deps, memory leaks |
| 🗺️ | Onboarding roadmap | Step-by-step learning path for new devs joining the project |
| 💬 | Natural language query | Ask "where is the payment logic?" and get exact file names back |
| 🌐 | Multi-language explanations | Available in 8 languages including Bengali |

</div>

---

## ✦ Download & Run

**Step 1** .... Clone the repo

```bash
git clone https://github.com/0xnurrabby/Legacy-Code-Archaeologist
cd Legacy-Code-Archaeologist
```

**Step 2** .... Install backend dependencies

```bash
cd backend
npm install
```

**Step 3** .... Configure and run

```bash
# Set your Claude API key
cp .env.example .env
# Edit .env and add ANTHROPIC_API_KEY=your_key

node server.js
# Open http://localhost:3000 (or the port shown)
```

---

## ✦ Setup

```
1. Clone the repo
2. cd backend/ and run npm install
3. Create a .env file with:
   ANTHROPIC_API_KEY=your_claude_api_key
4. Run node server.js
5. Open the frontend (frontend/index.html) in your browser
   or visit http://localhost:3000 if served by the backend
6. Paste a GitHub URL or upload a ZIP file
7. Choose an analysis type and click Run
```

---

## ✦ Project Structure

```
Legacy-Code-Archaeologist/
  backend/
    server.js    ->  Express server, Claude API calls, analysis routing
    package.json
  frontend/
    index.html   ->  main UI
    script.js    ->  form handling, analysis request, result rendering
    style.css    ->  styles
  README.md
```

---

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,17,24&height=100&section=footer&animation=fadeIn" width="100%"/>

<div align="center">MIT License .... built by <a href="https://github.com/0xnurrabby">0xnurrabby</a></div>
