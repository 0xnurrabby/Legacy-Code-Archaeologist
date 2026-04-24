# 🏛️ Legacy Code Archaeologist

Understand any codebase in minutes, not days. Upload ZIP or paste GitHub link — AI explains everything.

## ✨ Features

- 📖 Code Purpose Explainer — Part-by-part breakdown
- 🎯 Prompt Reverse Engineer — Get Claude prompt to recreate code
- 🕸️ Dependency Graph — Visual file relationships
- 🤔 Why Was This Written — AI explains design decisions
- 💣 Hidden Landmines — Detect bugs, deprecated code
- 🗺️ Onboarding Map — Learning path for new devs
- 💬 Natural Language Query — Ask questions in English

## 🚀 Setup (5 minutes)

### 1. Install Node.js
Download from httpsnodejs.org (v18 or higher)

### 2. Get API Keys

Claude API Key (REQUIRED)
1. Go to httpsconsole.anthropic.com
2. Sign up  Login
3. Click API Keys → Create Key
4. Copy the key

GitHub Token (OPTIONAL but recommended)
1. Go to httpsgithub.comsettingstokens
2. Click Generate new token (classic)
3. Select `public_repo` scope
4. Copy the token

### 3. Install Project

```bash
cd backend
npm install
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file
```
CLAUDE_API_KEY=sk-ant-xxxxx
GITHUB_TOKEN=ghp_xxxxx
```

### 5. Run

```bash
npm start
```

Open browser httplocalhost3000

## 📝 Usage

1. Paste GitHub URL OR upload ZIP
2. Click Analyze Codebase
3. Wait 30-60 seconds
4. Explore all 7 tabs of results!

## 🔧 Tech Stack

- Frontend HTML, CSS, Vanilla JS (Neo-Brutalism UI)
- Backend Node.js, Express
- AI Claude API (Anthropic)
- Parsing AdmZip, GitHub API

## 📄 License

MIT
