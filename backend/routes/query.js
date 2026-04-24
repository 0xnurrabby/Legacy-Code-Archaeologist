const express = require('express');
const claudeService = require('../services/claudeService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { query, analysisId, language = 'english' } = req.body;
    const cached = global.analysisCache[analysisId];
    
    if (!cached) return res.status(404).json({ error: 'Analysis not found' });

    const result = await claudeService.queryCodebase(cached.files, query, language);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
