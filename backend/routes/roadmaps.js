const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Roadmap = require('../models/Roadmap');
const { generateRoadmap } = require('../services/gemini');
const router = express.Router();

// Generate new roadmap
router.post('/generate', async (req, res) => {
  try {
    const userData = req.body;
    const roadmapData = await generateRoadmap(userData);
    const id = uuidv4();

    // Save to database
    const roadmap = await Roadmap.create({
      roadmapId: id,
      userData,
      roadmap: roadmapData
    });

    console.log("✅ Generated Roadmap ID:", id);
    console.log("📚 User Data:", roadmap.userData);
    
    res.json({ 
      id, 
      roadmap: roadmap.roadmap,
      year: roadmap.userData.year,
      skills: roadmap.userData.skills,
      companies: roadmap.userData.companies
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ roadmapId: req.params.id });
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/update', async (req, res) => {
  try {
    // ✅ MATCH YOUR FRONTEND FIELDS
    const { stage: weekIndex, completion_rate: progress, date: note } = req.body;
    
    const roadmap = await Roadmap.findOne({ roadmapId: req.params.id });
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });

    // Log progress (matches Mongoose schema)
    roadmap.progressLogs.push({ 
      weekIndex, 
      progress, 
      note: note || '', 
      timestamp: new Date() 
    });
    roadmap.markModified('progressLogs');

    // ✅ Now progress === 0.5 works!
    console.log('Progress logged:', { weekIndex, progress, note });
    
    if (progress === 0.5) {
      const updatedRoadmap = await generateRoadmap({
        ...roadmap.userData,
        weeks: roadmap.userData.weeks,
        progressLogs: roadmap.progressLogs
      });
      roadmap.roadmap = updatedRoadmap;
      roadmap.markModified('roadmap');
      console.log('Regenerated roadmap for off-track week');
    }

    await roadmap.save();
    console.log('Updated:', roadmap.roadmapId);
    res.json(roadmap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
