const API_URL = 'http://localhost:3000';
let currentAnalysis = null;
let isAnalyzing = false;
let analysisStartTime = null;
let timerInterval = null;
let currentController = null;
let currentLanguage = 'english';

// ===== 50+ FUNNY CODING QUOTES =====
const FUNNY_QUOTES = [
  // AI mishaps
  "Me to Claude: 'Write clean code' — Claude: 'Define clean' 🧼",
  "When you ask AI to fix a bug and it rewrites your entire app 💀",
  "AI: 'I added error handling' — The error: try { } catch(e) { } 🙃",
  "Claude has read more code than you'll write in 10 lifetimes. Respect. 📚",
  "Plot twist: Claude understands your code better than your coworkers 🤯",
  "Asking AI 'why doesn't this work?' and getting a 2000-word essay 📝",
  "Claude doesn't judge your variable names. Well, not out loud anyway 🤐",
  
  // Prompt fails
  "Me: 'Make it faster' — AI: *deletes entire feature* 'Done' ⚡",
  "Forgot to say 'don't delete anything' in the prompt. Again. 🤦",
  "The prompt you write vs. the prompt you should have written 📖",
  "'Just one more prompt' — developer's most common lie 💭",
  "Spent 3 hours prompting AI instead of writing the 30-line function 🕐",
  
  // Coding humor
  "99 little bugs in the code, 99 little bugs... fix one, compile it again, 127 little bugs in the code 🐛",
  "It's not a bug, it's an undocumented feature ™️",
  "My code doesn't work, I have no idea why. My code works, I have no idea why. 🤷",
  "Programming is 10% writing code and 90% wondering why it doesn't work 🔍",
  "There are 10 types of people: those who understand binary and those who don't 🤖",
  "'Works on my machine' — certified developer excuse since 1995 💻",
  "Deleted node_modules. Felt something spiritual. 🧘",
  "Stack Overflow is down. Productivity: -1000% 📉",
  "Semicolons: the difference between helping your uncle Jack off a horse and helping your uncle jack off a horse. 🐴",
  
  // Developer life
  "I don't always test my code, but when I do, I do it in production 🚀",
  "git commit -m 'minor changes' *changed 847 files* 🗃️",
  "Real programmers count from 0 🎯",
  "There's no place like 127.0.0.1 🏠",
  "I'm not lazy, I'm on energy-saving mode 😴",
  "My code works? Must be black magic. 🔮",
  
  // Forgot to tell AI
  "Me after 20 messages: 'Oh I forgot, it should also work on mobile' 📱",
  "'Make it responsive' — the prompt you forgot 50 lines ago 📏",
  "Asked AI to build a login page, forgot to mention a database. Classic. 🗄️",
  "'Also add dark mode' — sent after AI finished the entire UI 🌑",
  
  // Funny facts about Claude/AI
  "Claude reads 200K tokens faster than you read a text from your mom 📖",
  "Fun fact: Claude has probably seen more JavaScript than the entire ECMA committee combined 📊",
  "Claude doesn't sleep. Claude doesn't eat. Claude just reads code. All of it. 🤖",
  "If Claude were paid by the hour, it would be bankrupt. It works in milliseconds. ⏱️",
  "Claude's favorite programming language? Whatever you're stuck in. 🎯",
  
  // Relatable moments
  "That moment when you realize the bug was a typo you made 2 hours ago 👁️",
  "When someone touches your code without asking 😤",
  "Opened the codebase from 2019. Why did I write it like this? 🕰️",
  "Legacy code: written by a developer who thought they'd never touch it again 👻",
  "That one file in every project that nobody dares to refactor 📜",
  "Reading old code is like reading a crime scene report — YOU are the criminal 🔍",
  "The previous developer left. Now I am the legacy they feared. 😈",
  "Comments in legacy code: 'Do not remove. Do not ask why.' 🚫",
  
  // Meta humor
  "'This tool is free' — three of the most beautiful words to a developer 💝",
  "Developers love free tools almost as much as they love complaining about expensive ones 💰",
  "This analysis is powered by Claude. Your caffeine addiction is not. ☕",
  "You're reading these while Claude is reading your code. Teamwork! 🤝",
  "If you read all these tips, you're either very patient or very stuck 🧘",
  
  // Code wisdom (funny version)
  "Clean code is like clean underwear — you never realize how important until you don't have any 🧺",
  "Writing code is easy. Writing GOOD code is why we drink coffee. ☕",
  "The best code is the code that doesn't exist. Less code, less bugs. 🎯",
  "Your code: 'Hello World' — Claude: *writes a 500-line explanation* 📜",
  "Documentation is a love letter to your future self. And future self never replies. 💌"
];

// Track shown quotes (no repeats until all shown)
let availableQuotes = [];
let shownQuotes = new Set();

function getRandomQuote() {
  if (availableQuotes.length === 0) {
    // Reset when all shown
    availableQuotes = [...FUNNY_QUOTES];
    shownQuotes.clear();
  }
  // Random index
  const idx = Math.floor(Math.random() * availableQuotes.length);
  const quote = availableQuotes[idx];
  availableQuotes.splice(idx, 1);
  shownQuotes.add(quote);
  return quote;
}

const STATUS_MESSAGES = [
  "Connecting to Claude AI...",
  "Fetching repository files...",
  "Reading source code...",
  "Building dependency tree...",
  "Analyzing code patterns...",
  "Detecting design patterns...",
  "Identifying potential issues...",
  "Generating recreation prompt...",
  "Mapping architecture...",
  "Crafting detailed explanations...",
  "Finalizing insights..."
];

// ===== LANGUAGE SELECTOR =====
function toggleLangMenu() {
  const menu = document.getElementById('lang-menu');
  const btn = document.getElementById('lang-btn');
  menu.classList.toggle('show');
  btn.classList.toggle('open');
}

function selectLanguage(e, lang, icon, name) {
  currentLanguage = lang;
  document.getElementById('current-lang-icon').textContent = icon;
  document.getElementById('current-lang-name').textContent = name;
  
  // Update active state
  document.querySelectorAll('.lang-option').forEach(el => el.classList.remove('active'));
  e.target.closest('.lang-option').classList.add('active');
  
  // Close menu
  document.getElementById('lang-menu').classList.remove('show');
  document.getElementById('lang-btn').classList.remove('open');
  
  // Save preference
  localStorage.setItem('preferredLang', lang);
  localStorage.setItem('preferredLangIcon', icon);
  localStorage.setItem('preferredLangName', name);
  
  // If analysis exists, re-render with new language
  if (currentAnalysis) {
    showCustomAlert(`Switched to ${name}. Re-translating...`);
    retranslateResults();
  }
}

// Load saved language preference
window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('preferredLang');
  const savedIcon = localStorage.getItem('preferredLangIcon');
  const savedName = localStorage.getItem('preferredLangName');
  
  if (savedLang) {
    currentLanguage = savedLang;
    if (savedIcon) document.getElementById('current-lang-icon').textContent = savedIcon;
    if (savedName) document.getElementById('current-lang-name').textContent = savedName;
  }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.lang-selector')) {
    document.getElementById('lang-menu').classList.remove('show');
    document.getElementById('lang-btn').classList.remove('open');
  }
});

// ===== TAB SWITCHING =====
function switchInputTab(e, tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  document.getElementById('github-tab').style.display = tab === 'github' ? 'block' : 'none';
  document.getElementById('zip-tab').style.display = tab === 'zip' ? 'block' : 'none';
}

function switchResultTab(e, tab) {
  const targetBtn = e.target.closest('.result-tab');
  document.querySelectorAll('.result-tab').forEach(b => b.classList.remove('active'));
  targetBtn.classList.add('active');
  document.querySelectorAll('.result-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    document.getElementById('file-name').textContent = '✅ ' + file.name;
  }
}

function showToast(message) {
  const toast = document.getElementById('success-toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

function showCustomAlert(message) {
  const alertDiv = document.createElement('div');
  alertDiv.style.cssText = `
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    background: #FF6B6B; border: 4px solid #000; padding: 14px 24px;
    font-weight: 900; z-index: 10000;
    font-family: 'Courier New', monospace; text-transform: uppercase;
    font-size: 13px;
  `;
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 3500);
}

// ===== ANALYZE =====
async function analyzeCode() {
  if (isAnalyzing) return;

  const githubUrl = document.getElementById('github-url').value.trim();
  const zipFile = document.getElementById('zip-file').files[0];
  
  if (!githubUrl && !zipFile) {
    showCustomAlert('Please provide a GitHub URL or upload a ZIP file');
    return;
  }

  isAnalyzing = true;
  currentController = new AbortController();
  
  const btn = document.getElementById('analyze-btn');
  const stopBtn = document.getElementById('stop-btn');
  const btnText = document.getElementById('btn-text');
  const btnLoader = document.getElementById('btn-loader');
  const btnStatus = document.getElementById('btn-status');
  const btnTimer = document.getElementById('btn-timer');
  
  btn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline-block';
  stopBtn.style.display = 'inline-block';
  
  const loader = document.getElementById('loader');
  const results = document.getElementById('results');
  
  loader.classList.add('active');
  results.classList.remove('active');
  loader.scrollIntoView({ behavior: 'smooth', block: 'center' });

  analysisStartTime = Date.now();
  let elapsed = 0;
  const estimatedTime = 45;
  let statusIndex = 0;
  let lastTipChange = 0;
  let lastStatusChange = 0;
  
  // Initial
  document.getElementById('tip-text').textContent = getRandomQuote();
  document.getElementById('typing-text').textContent = STATUS_MESSAGES[0];
  
  timerInterval = setInterval(() => {
    elapsed = Math.floor((Date.now() - analysisStartTime) / 1000);
    btnTimer.textContent = `${elapsed}s / ~${estimatedTime}s`;
    
    const progress = Math.min((elapsed / estimatedTime) * 100, 95);
    document.getElementById('progress-fill').style.width = progress + '%';
    
    // Update status every 5s
    if (elapsed - lastStatusChange >= 5 && elapsed > 0) {
      lastStatusChange = elapsed;
      statusIndex = (statusIndex + 1) % STATUS_MESSAGES.length;
      const typingEl = document.getElementById('typing-text');
      typingEl.style.opacity = '0';
      setTimeout(() => {
        typingEl.textContent = STATUS_MESSAGES[statusIndex];
        typingEl.style.opacity = '1';
      }, 200);
    }
    
    // Update quote every 7s (enough time to read & laugh)
    if (elapsed - lastTipChange >= 7 && elapsed > 0) {
      lastTipChange = elapsed;
      const tipEl = document.getElementById('code-tip');
      tipEl.classList.add('fading');
      setTimeout(() => {
        document.getElementById('tip-text').textContent = getRandomQuote();
        tipEl.classList.remove('fading');
      }, 300);
    }
    
    if (elapsed < 10) {
      updateStep(1, 'active');
      btnStatus.textContent = 'FETCHING';
    } else if (elapsed < 20) {
      updateStep(1, 'done');
      updateStep(2, 'active');
      btnStatus.textContent = 'PARSING';
    } else if (elapsed < 40) {
      updateStep(2, 'done');
      updateStep(3, 'active');
      btnStatus.textContent = 'ANALYZING';
    } else {
      updateStep(3, 'done');
      updateStep(4, 'active');
      btnStatus.textContent = 'RENDERING';
    }
  }, 1000);

  try {
    let response;
    
    if (githubUrl) {
      response = await fetch(`${API_URL}/api/analyze/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: githubUrl, language: currentLanguage }),
        signal: currentController.signal
      });
    } else {
      const formData = new FormData();
      formData.append('zipFile', zipFile);
      formData.append('language', currentLanguage);
      response = await fetch(`${API_URL}/api/analyze/zip`, {
        method: 'POST',
        body: formData,
        signal: currentController.signal
      });
    }

    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error || 'Analysis failed');
    
    currentAnalysis = data;
    renderResults(data);
    
    document.getElementById('progress-fill').style.width = '100%';
    updateStep(4, 'done');
    
    setTimeout(() => {
      loader.classList.remove('active');
      results.classList.add('active');
      results.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast();
      launchConfetti();
    }, 500);
    
  } catch (err) {
    loader.classList.remove('active');
    if (err.name === 'AbortError') {
      showCustomAlert('Analysis stopped by user');
    } else {
      showCustomAlert('Error: ' + err.message);
    }
  } finally {
    clearInterval(timerInterval);
    isAnalyzing = false;
    currentController = null;
    btn.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
    stopBtn.style.display = 'none';
    
    document.querySelectorAll('.step').forEach(s => {
      s.classList.remove('active', 'done');
    });
    document.getElementById('progress-fill').style.width = '0%';
  }
}

async function retranslateResults() {
  if (!currentAnalysis || !currentAnalysis.id) return;
  
  const loader = document.getElementById('loader');
  loader.classList.add('active');
  document.getElementById('results').classList.remove('active');
  
  try {
    const response = await fetch(`${API_URL}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        analysisId: currentAnalysis.id,
        language: currentLanguage 
      })
    });
    const data = await response.json();
    if (response.ok) {
      currentAnalysis = { ...currentAnalysis, ...data };
      renderResults(currentAnalysis);
    }
  } catch (err) {
    showCustomAlert('Translation failed: ' + err.message);
  } finally {
    loader.classList.remove('active');
    document.getElementById('results').classList.add('active');
  }
}

function stopAnalysis() {
  if (currentController) {
    currentController.abort();
  }
}

function updateStep(num, state) {
  const step = document.getElementById('step-' + num);
  if (step) {
    step.classList.remove('active', 'done');
    step.classList.add(state);
  }
}

// ===== RENDER RESULTS =====
function renderResults(data) {
  const p = data.purpose || {};
  let purposeHTML = '';
  
  purposeHTML += `
    <div class="code-explanation-item">
      <h4>WHAT IS THIS PROJECT?</h4>
      <p style="font-size: 15px; line-height: 1.7;">${p.what || 'Project analysis'}</p>
      ${p.overview ? `
        <div class="detail-section">
          <h5>📋 Detailed Overview</h5>
          <p>${p.overview}</p>
        </div>
      ` : ''}
      ${p.problemSolved ? `
        <div class="detail-section">
          <h5>🎯 Problem It Solves</h5>
          <p>${p.problemSolved}</p>
        </div>
      ` : ''}
      ${p.howItWorks ? `
        <div class="detail-section">
          <h5>⚙️ How It Works</h5>
          <p>${p.howItWorks}</p>
        </div>
      ` : ''}
    </div>
  `;

  if (p.whoNeeds && p.whoNeeds.length) {
    purposeHTML += `
      <div class="code-explanation-item">
        <h4>WHO NEEDS THIS?</h4>
        ${p.whoNeeds.map(u => `
          <div class="detail-section">
            <h5>👤 ${u.type}</h5>
            <p>${u.description}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (p.parts && p.parts.length) {
    purposeHTML += (p.parts).map((part, i) => `
      <div class="code-explanation-item">
        <h4>PART ${i+1}: ${part.title}</h4>
        <p><strong>Location:</strong> <code>${part.location || 'N/A'}</code></p>
        <div class="detail-section">
          <h5>📝 What It Does</h5>
          <p>${part.description || ''}</p>
        </div>
        ${part.howItWorks ? `
          <div class="detail-section">
            <h5>🔧 How It Works (Step-by-Step)</h5>
            <p>${part.howItWorks}</p>
          </div>
        ` : ''}
        ${part.keyFunctions && part.keyFunctions.length ? `
          <div class="detail-section">
            <h5>🔑 Key Functions</h5>
            <ul class="detail-list">
              ${part.keyFunctions.map(f => `<li><strong>${f.name}:</strong> ${f.purpose}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${part.codeSnippet ? `
          <div class="detail-section">
            <h5>💻 Code Sample</h5>
            <div class="code-block">${escapeHtml(part.codeSnippet)}</div>
          </div>
        ` : ''}
        ${part.example ? `
          <div class="detail-section">
            <h5>🌍 Real-World Example</h5>
            <p>${part.example}</p>
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  if (p.techStack && p.techStack.length) {
    purposeHTML += `
      <div class="code-explanation-item">
        <h4>TECH STACK</h4>
        <div style="margin-top: 10px;">
          ${p.techStack.map(t => `<span class="badge">${t}</span>`).join('')}
        </div>
      </div>
    `;
  }

  document.getElementById('purpose-content').innerHTML = purposeHTML;

  document.getElementById('prompt-text').textContent = data.recreationPrompt || 'No prompt generated';

  renderDependencyGraph(data.dependencyGraph);

  document.getElementById('why-content').innerHTML = (data.whyWritten || []).map(w => `
    <div class="code-explanation-item">
      <h4>${w.function || 'Function'}</h4>
      <p><strong>File:</strong> <code>${w.file || ''}</code></p>
      <div class="detail-section">
        <h5>💭 The Reasoning</h5>
        <p>${w.reason || ''}</p>
      </div>
    </div>
  `).join('') || '<div class="empty-state">No analysis available</div>';

  document.getElementById('landmines-content').innerHTML = (data.landmines || []).map(l => `
    <div class="landmine-item ${l.severity || 'info'}">
      <strong>${l.icon || '⚠️'} ${l.title || ''}</strong>
      <p style="margin-top: 8px;"><code>${l.location || ''}</code></p>
      <p style="margin-top: 6px;">${l.description || ''}</p>
    </div>
  `).join('') || '<div class="empty-state">✅ No landmines detected!</div>';

  document.getElementById('onboarding-content').innerHTML = (data.onboarding || []).map((s, i) => `
    <div class="onboarding-step">
      <div class="onboarding-header">
        <div class="onboarding-number">${i+1}</div>
        <div class="onboarding-title">${s.title || ''}</div>
      </div>
      <div class="onboarding-body">
        <p><strong>Why start here:</strong> ${s.description || ''}</p>
        ${s.whatToLearn ? `
          <div class="detail-section">
            <h5>📚 What You'll Learn</h5>
            <p>${s.whatToLearn}</p>
          </div>
        ` : ''}
        ${s.keyConcepts && s.keyConcepts.length ? `
          <div class="detail-section">
            <h5>🎯 Key Concepts</h5>
            <ul class="detail-list">
              ${s.keyConcepts.map(k => `<li>${k}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${s.timeEstimate ? `
          <div class="onboarding-tip">
            <strong>TIME</strong>${s.timeEstimate}
          </div>
        ` : ''}
        ${s.tip ? `
          <div class="onboarding-tip">
            <strong>TIP</strong>${s.tip}
          </div>
        ` : ''}
      </div>
    </div>
  `).join('') || '<div class="empty-state">No onboarding data</div>';
}

function renderDependencyGraph(graphText) {
  const container = document.getElementById('graph-content');
  if (!graphText || typeof graphText !== 'string') {
    container.innerHTML = '<div class="empty-state">No dependency data available</div>';
    return;
  }
  const lines = graphText.split('\n').filter(l => l.trim());
  let currentFile = null;
  let currentDeps = [];
  const connections = [];
  lines.forEach(line => {
    if (line.startsWith('📄')) {
      if (currentFile) connections.push({ file: currentFile, deps: currentDeps });
      currentFile = line.replace('📄', '').trim();
      currentDeps = [];
    } else if (line.includes('→')) {
      const dep = line.replace(/.*→\s*/, '').trim();
      if (dep) currentDeps.push(dep);
    }
  });
  if (currentFile) connections.push({ file: currentFile, deps: currentDeps });
  if (connections.length === 0) {
    container.innerHTML = '<div class="empty-state">No external dependencies found</div>';
    return;
  }
  container.innerHTML = connections.map(c => `
    <div class="graph-connection">
      <div class="from">${c.file}</div><br>
      ${c.deps.length ? c.deps.map(d => `<span class="arrow">→</span><span class="to">${d}</span>`).join(' ') : '<em style="font-size: 13px;">No dependencies</em>'}
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function copyPrompt() {
  const text = document.getElementById('prompt-text').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    btn.textContent = 'COPIED!';
    btn.style.background = '#4ECDC4';
    btn.style.color = '#000';
    showCustomAlert('Prompt copied! Paste it in claude.ai');
    setTimeout(() => {
      btn.textContent = 'COPY PROMPT';
      btn.style.background = '#000';
      btn.style.color = '#fff';
    }, 2500);
  });
}

async function submitQuery() {
  const query = document.getElementById('query-input').value.trim();
  if (!query || !currentAnalysis) return;
  document.getElementById('query-results').innerHTML = '<div class="empty-state">🔍 Searching...</div>';
  try {
    const response = await fetch(`${API_URL}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query, 
        analysisId: currentAnalysis.id,
        language: currentLanguage
      })
    });
    const data = await response.json();
    document.getElementById('query-results').innerHTML = `
      <div class="code-explanation-item">
        <h4>QUERY: "${query}"</h4>
        <div class="detail-section">
          <h5>💡 Answer</h5>
          <p>${data.answer || ''}</p>
        </div>
        ${data.locations && data.locations.length ? `
          <div class="detail-section">
            <h5>📍 Found In</h5>
            <ul class="detail-list">${data.locations.map(l => `<li><code>${l}</code></li>`).join('')}</ul>
          </div>
        ` : ''}
      </div>
    `;
  } catch (err) {
    document.getElementById('query-results').innerHTML = `<div class="empty-state">Error: ${err.message}</div>`;
  }
}

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#FFE951'];
  const particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width, y: -20,
      vx: (Math.random() - 0.5) * 4, vy: Math.random() * 3 + 2,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8
    });
  }
  let frame = 0;
  const maxFrames = 200;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.rotation += p.rotSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
      ctx.strokeRect(-p.size/2, -p.size/2, p.size, p.size);
      ctx.restore();
    });
    frame++;
    if (frame < maxFrames) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  animate();
}
