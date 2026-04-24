const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const githubService = require('../services/githubService');
const zipService = require('../services/zipService');
const claudeService = require('../services/claudeService');
const dependencyAnalyzer = require('../services/dependencyAnalyzer');

const router = express.Router();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 100 * 1024 * 1024 }
});

global.analysisCache = global.analysisCache || {};

router.post('/github', async (req, res) => {
  try {
    const { url, language = 'english' } = req.body;
    if (!url) return res.status(400).json({ error: 'GitHub URL required' });

    console.log(`📥 Fetching GitHub repo: ${url}`);
    const files = await githubService.fetchRepo(url);
    
    console.log(`🤖 Analyzing ${files.length} files in ${language}...`);
    const analysis = await performFullAnalysis(files, language);
    
    const id = uuidv4();
    global.analysisCache[id] = { files, analysis, language };
    
    res.json({ id, ...analysis });
  } catch (err) {
    console.error('GitHub analysis error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/zip', upload.single('zipFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'ZIP file required' });
    const language = req.body.language || 'english';

    console.log(`📦 Extracting ZIP: ${req.file.originalname}`);
    const files = await zipService.extractZip(req.file.path);
    
    console.log(`🤖 Analyzing ${files.length} files in ${language}...`);
    const analysis = await performFullAnalysis(files, language);
    
    const id = uuidv4();
    global.analysisCache[id] = { files, analysis, language };
    
    res.json({ id, ...analysis });
  } catch (err) {
    console.error('ZIP analysis error:', err);
    res.status(500).json({ error: err.message });
  }
});

async function performFullAnalysis(files, language) {
  const depGraph = dependencyAnalyzer.buildGraph(files);
  const claudeAnalysis = await claudeService.analyzeCodebase(files, language);
  
  return {
    purpose: claudeAnalysis.purpose,
    recreationPrompt: claudeAnalysis.recreationPrompt,
    whyWritten: claudeAnalysis.whyWritten,
    landmines: claudeAnalysis.landmines,
    onboarding: claudeAnalysis.onboarding,
    dependencyGraph: depGraph
  };
}

module.exports = router;
