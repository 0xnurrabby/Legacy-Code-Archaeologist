const LANGUAGE_INSTRUCTIONS = {
  english: "Write all explanations in clear, natural English.",
  bangla: "সব explanation বাংলায় লেখো। Natural conversational বাংলা ব্যবহার করো। তবে: code, file paths, function names, technical terms (যেমন: function, variable, API, database) English এ রাখো।",
  hindi: "सभी explanations हिंदी में लिखें। Natural conversational हिंदी का उपयोग करें। लेकिन: code, file paths, function names, technical terms (जैसे: function, variable, API, database) English में रखें।",
  japanese: "すべての説明を日本語で書いてください。自然な会話的な日本語を使用してください。ただし、コード、ファイルパス、関数名、専門用語（function、variable、API、databaseなど）は英語のままにしてください。",
  korean: "모든 설명을 한국어로 작성하세요. 자연스러운 대화체 한국어를 사용하세요. 단, 코드, 파일 경로, 함수 이름, 기술 용어(function, variable, API, database 등)는 영어로 유지하세요.",
  spanish: "Escribe todas las explicaciones en español natural y conversacional. Pero mantén el código, las rutas de archivos, los nombres de funciones y los términos técnicos (como function, variable, API, database) en inglés.",
  italian: "Scrivi tutte le spiegazioni in italiano naturale e conversazionale. Ma mantieni il codice, i percorsi dei file, i nomi delle funzioni e i termini tecnici (come function, variable, API, database) in inglese.",
  russian: "Пишите все объяснения на естественном разговорном русском языке. Но сохраняйте код, пути к файлам, имена функций и технические термины (такие как function, variable, API, database) на английском языке."
};

function fullAnalysisPrompt(codeContext, language = 'english') {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;
  
  return `You are an expert code teacher. Analyze this codebase deeply and explain it like teaching a beginner. Respond with ONLY valid JSON.

LANGUAGE INSTRUCTION: ${langInstruction}

IMPORTANT RULES FOR LANGUAGE:
- All EXPLANATIONS, DESCRIPTIONS, and REASONING should be in the target language
- Keep these in ENGLISH always: code snippets, file paths, function/variable names, technical keywords (function, variable, API, async, etc.), tech stack names
- JSON keys MUST stay in English

CODEBASE:
${codeContext}

Your job: Explain every part in DETAIL like a patient teacher. No shallow descriptions. Make someone truly understand.

Return this exact JSON (fill with detailed content):

{
  "purpose": {
    "what": "2-3 sentence clear description of what this project is",
    "overview": "4-5 sentence detailed overview - what it does, its main goal, what makes it unique",
    "problemSolved": "3-4 sentences explaining what real-world problem this solves and why it matters",
    "howItWorks": "4-5 sentences explaining the overall flow: user input -> processing -> output, in simple terms",
    "whoNeeds": [
      {"type": "User type name (can be in target language)", "description": "2-3 sentences on why they need it and what value they get"}
    ],
    "parts": [
      {
        "title": "Module/Component name (keep code name in English)",
        "location": "/path/to/folder-or-file",
        "description": "2-3 sentences on what this module does",
        "howItWorks": "3-4 sentences explaining step-by-step how this module operates internally",
        "keyFunctions": [
          {"name": "functionName()", "purpose": "What this function does in 1 sentence"}
        ],
        "codeSnippet": "brief representative code max 150 chars (KEEP IN ENGLISH)",
        "example": "2-3 sentence real-world example of this module in action"
      }
    ],
    "techStack": ["Tech1", "Tech2", "Tech3"]
  },
  "recreationPrompt": "ALWAYS IN ENGLISH - A DETAILED 400-word prompt that if pasted to Claude AI would recreate this exact codebase. Include: project purpose, exact file structure with paths, tech stack with versions, main functions and their signatures, API endpoints, data models, code style, error handling. Be SPECIFIC. This MUST stay in English since it's a coding prompt.",
  "whyWritten": [
    {
      "function": "functionName (keep in English)",
      "file": "path/file.ext",
      "reason": "2-3 sentences explaining WHY it was written this way (patterns, trade-offs, constraints)"
    }
  ],
  "landmines": [
    {
      "severity": "critical",
      "icon": "🚨",
      "title": "Clear issue name",
      "location": "file:line",
      "description": "2 sentences on what is wrong and potential impact"
    }
  ],
  "onboarding": [
    {
      "title": "START: filename.ext (keep filename in English)",
      "description": "2-3 sentences on why to read this file FIRST",
      "whatToLearn": "3-4 sentences on what concepts/patterns you will learn from this file",
      "keyConcepts": ["Concept 1", "Concept 2", "Concept 3"],
      "timeEstimate": "15-20 minutes (use target language format)",
      "tip": "A practical tip for the reader"
    }
  ]
}

Rules:
- Maximum 4 items in "parts", 3-5 in "whyWritten", 3-5 in "landmines", 4-6 in "onboarding"
- Write DETAILED explanations in the TARGET LANGUAGE
- NO newlines inside JSON string values (use spaces)
- NO double quotes inside strings - use single quotes
- Valid JSON only, no trailing commas, no markdown
- recreationPrompt MUST stay in English
- Be a TEACHER - make complex things clear`;
}

function translatePrompt(existingAnalysis, language) {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;
  
  return `Translate the explanations in this analysis to the target language. Return the SAME JSON structure with translated text.

${langInstruction}

RULES:
- Keep these in ENGLISH: code, file paths, function names, variable names, technical keywords, tech stack, recreationPrompt
- Translate: descriptions, overviews, explanations, reasoning, tips
- Keep JSON structure identical

EXISTING ANALYSIS:
${JSON.stringify(existingAnalysis, null, 2)}

Return the translated JSON only, no markdown.`;
}

module.exports = { fullAnalysisPrompt, translatePrompt };
