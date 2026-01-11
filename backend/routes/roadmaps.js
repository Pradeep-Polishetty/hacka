const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Roadmap = require('../models/Roadmap');
const { generateRoadmap } = require('../services/gemini');

const router = express.Router();

/* Generate Roadmap */
router.post('/generate', async (req, res) => {
  try {
    const userData = {
      year: req.body.year,
      skills: req.body.skills,
      companies: req.body.companies
    };

    const roadmapData = await generateRoadmap(userData);
    const id = uuidv4();

    const roadmap = await Roadmap.create({
      roadmapId: id,
      userData,
      roadmap: roadmapData,
      progressLogs: []
    });

    console.log('✅ Generated Roadmap ID:', id);
    res.json({ id, roadmap: roadmap.roadmap });
  } catch (error) {
    console.error('❌ Roadmap generation failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/* Get Roadmap */
router.get('/:id', async (req, res) => {
  const roadmap = await Roadmap.findOne({ roadmapId: req.params.id });

  if (!roadmap) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(roadmap);
});

/* Update Progress */
router.post('/:id/update', async (req, res) => {
  const roadmap = await Roadmap.findOne({ roadmapId: req.params.id });

  if (!roadmap) {
    return res.status(404).json({ error: 'Not found' });
  }

  roadmap.progressLogs.push(req.body);

  if (req.body.completion_rate === 0.5) {
    roadmap.roadmap = await generateRoadmap({
      ...roadmap.userData,
      progressLogs: roadmap.progressLogs
    });
  }

  await roadmap.save();
  res.json(roadmap);
});

module.exports = router;
