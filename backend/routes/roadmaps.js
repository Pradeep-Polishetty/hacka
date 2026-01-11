const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Roadmap = require('../models/Roadmap');
const { generateRoadmap } = require('../services/gemini');
const router = express.Router();

// Generate new roadmap
router.post('/generate', async (req, res) => {
  try {
    const { year, skills, companies, interests } = req.body;

    // Validate required fields
    if (!year || !skills || !companies) {
      return res.status(400).json({ 
        error: 'Missing required fields: year, skills, and companies are required' 
      });
    }

    // Generate roadmap using AI
    const roadmapData = await generateRoadmap(req.body);
    const id = uuidv4();

    // Save to database
    const roadmap = await Roadmap.create({
      roadmapId: id,
      userData: {
        year,
        skills,
        companies,
        interests: interests || []
      },
      roadmap: roadmapData,
      progressLogs: []
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
    console.error("❌ Error generating roadmap:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get roadmap by ID
router.get('/:id', async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ roadmapId: req.params.id });

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    console.log("📖 Retrieved Roadmap:", req.params.id);
    res.json(roadmap);
  } catch (error) {
    console.error("❌ Error retrieving roadmap:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update progress and regenerate if needed
router.post('/:id/update', async (req, res) => {
  try {
    const { stage, completion_rate, date } = req.body;
    
    const roadmap = await Roadmap.findOne({ roadmapId: req.params.id });

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    // Add progress log
    const progressLog = {
      stage,
      completion_rate,
      date: date || new Date().toISOString().split('T')[0]
    };
    roadmap.progressLogs.push(progressLog);

    console.log("📊 Progress Updated:", {
      roadmapId: roadmap.roadmapId,
      stage,
      completion_rate
    });

    // Regenerate roadmap if user is off-track (stage = -1) or struggling (completion_rate < 0.5)
    if (stage === -1 || completion_rate < 0.5) {
      console.log("🔄 Regenerating roadmap - User needs adjustment");
      
      roadmap.roadmap = await generateRoadmap({
        ...roadmap.userData,
        progressLogs: roadmap.progressLogs,
        needsAdjustment: true // Flag for AI to know user is struggling
      });
      
      console.log("✅ Roadmap regenerated successfully");
    }

    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    console.error("❌ Error updating progress:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all roadmaps (optional - for user dashboard)
router.get('/', async (req, res) => {
  try {
    const roadmaps = await Roadmap.find().sort({ createdAt: -1 }).limit(10);
    res.json(roadmaps);
  } catch (error) {
    console.error("❌ Error fetching roadmaps:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete roadmap (optional - for cleanup)
router.delete('/:id', async (req, res) => {
  try {
    const roadmap = await Roadmap.findOneAndDelete({ roadmapId: req.params.id });
    
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    console.log("🗑️ Deleted Roadmap:", req.params.id);
    res.json({ message: 'Roadmap deleted successfully' });
  } catch (error) {
    console.error("❌ Error deleting roadmap:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;