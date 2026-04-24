const express = require('express');
const claudeService = require('../services/claudeService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { analysisId, language } = req.body;
    const cached = global.analysisCache[analysisId];
    
    if (!cached) return res.status(404).json({ error: 'Analysis not found' });
    
    console.log(`🌐 Translating to ${language}...`);
    const translated = await claudeService.translateAnalysis(cached.analysis, language);
    
    // Update cache
    global.analysisCache[analysisId].analysis = translated;
    global.analysisCache[analysisId].language = language;
    
    res.json({
      purpose: translated.purpose,
      recreationPrompt: translated.recreationPrompt,
      whyWritten: translated.whyWritten,
      landmines: translated.landmines,
      onboarding: translated.onboarding,
      dependencyGraph: cached.analysis.dependencyGraph
    });
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
