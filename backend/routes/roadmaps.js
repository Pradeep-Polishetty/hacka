const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Roadmap = require('../models/Roadmap');
const { generateRoadmap } = require('../services/gemini');
const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const roadmapData = await generateRoadmap(req.body);
    const id = uuidv4();

    const roadmap = await Roadmap.create({
      roadmapId: id,
      userData: req.body,
      roadmap: roadmapData,
      progressLogs: []
    });

    console.log("Generated Roadmap ID:", id);
    res.json({ id, roadmap: roadmap.roadmap });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/:id', async (req, res) => {
  const roadmap = await Roadmap.findOne({ roadmapId: req.params.id });

  if (!roadmap) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(roadmap);
});


router.post('/:id/update', async (req, res) => {
  const roadmap = await Roadmap.findOne({ roadmapId: req.params.id });

  if (!roadmap) {
    return res.status(404).json({ error: 'Not found' });
  }

  roadmap.progressLogs.push(req.body);
  if (req.body.completion_rate ==0.5) {
    roadmap.roadmap = await generateRoadmap({
      ...roadmap.userData,
      progressLogs: roadmap.progressLogs
    });
  }
  console.log('Updated Progress Logs update:', roadmap.roadmapId);

  await roadmap.save();
  res.json(roadmap);
});



module.exports = router;
