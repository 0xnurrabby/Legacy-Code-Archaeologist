const Anthropic = require('@anthropic-ai/sdk');
const prompts = require('../utils/promptTemplates');

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

async function analyzeCodebase(files, language = 'english') {
  const codeContext = files
    .slice(0, 25)
    .map(f => `=== FILE: ${f.path} ===\n${f.content.slice(0, 2500)}`)
    .join('\n\n');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 20000,
    messages: [{
      role: 'user',
      content: prompts.fullAnalysisPrompt(codeContext, language)
    }]
  });

  return parseJsonResponse(response.content[0].text, files);
}

async function translateAnalysis(existingAnalysis, language) {
  // Remove files data to reduce tokens
  const toTranslate = { ...existingAnalysis };
  delete toTranslate.id;
  
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 20000,
    messages: [{
      role: 'user',
      content: prompts.translatePrompt(toTranslate, language)
    }]
  });

  return parseJsonResponse(response.content[0].text, []);
}

function parseJsonResponse(text, files) {
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('No JSON found in AI response');
  }
  
  let jsonStr = text.substring(jsonStart, jsonEnd + 1);
  jsonStr = jsonStr
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .replace(/,(\s*[}\]])/g, '$1');
  
  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('JSON parse error:', err.message);
    return createFallbackResponse(text, files);
  }
}

function createFallbackResponse(text, files) {
  return {
    purpose: {
      what: "Analysis partially completed.",
      overview: text.slice(0, 500),
      problemSolved: "See overview above.",
      howItWorks: "Please try analyzing again.",
      whoNeeds: [{ type: "Developers", description: "Anyone working with this codebase" }],
      parts: files.slice(0, 3).map(f => ({
        title: f.path.split('/').pop(),
        location: f.path,
        description: "Source code file",
        howItWorks: "File content available",
        keyFunctions: [],
        codeSnippet: f.content.slice(0, 150),
        example: "Part of the project"
      })),
      techStack: ["JavaScript"]
    },
    recreationPrompt: "Analysis incomplete. Please try again.",
    whyWritten: [],
    landmines: [],
    onboarding: []
  };
}

async function queryCodebase(files, query, language = 'english') {
  const langMap = {
    english: "Answer in English.",
    bangla: "Answer in Bangla (বাংলা). Keep code, file names, technical terms in English.",
    hindi: "Answer in Hindi (हिन्दी). Keep code, file names, technical terms in English.",
    japanese: "Answer in Japanese (日本語). Keep code, file names, technical terms in English.",
    korean: "Answer in Korean (한국어). Keep code, file names, technical terms in English.",
    spanish: "Answer in Spanish. Keep code, file names, technical terms in English.",
    italian: "Answer in Italian. Keep code, file names, technical terms in English.",
    russian: "Answer in Russian. Keep code, file names, technical terms in English."
  };

  const codeContext = files
    .slice(0, 20)
    .map(f => `=== ${f.path} ===\n${f.content.slice(0, 1800)}`)
    .join('\n\n');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `${langMap[language] || langMap.english}\n\nAnalyze this codebase and answer: "${query}"\n\nCODEBASE:\n${codeContext}\n\nRespond ONLY in JSON: {"answer": "detailed answer", "locations": ["file.js:line"]}`
    }]
  });

  const text = response.content[0].text;
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  
  if (jsonStart !== -1 && jsonEnd !== -1) {
    try {
      return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
    } catch (e) {
      return { answer: text, locations: [] };
    }
  }
  return { answer: text, locations: [] };
}

module.exports = { analyzeCodebase, queryCodebase, translateAnalysis };
