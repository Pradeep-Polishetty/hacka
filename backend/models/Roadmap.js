const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema(
  {
    roadmapId: { type: String, required: true, unique: true },
    userData: {
      year: { type: String, required: true },       
      skills: { type: [String], required: true },   
      companies: { type: [String], required: true },  
      interests: { type: [String], default: [] }    
    },
    roadmap: { 
      type: Array, 
      required: true,
      // Each roadmap stage structure:
      // {
      //   title: String,
      //   tasks: [String],
      //   daily_goal: String,
      //   why_important: String
      // }
    },
    progressLogs: { 
      type: Array, 
      default: [],
      // Each progress log structure:
      // {
      //   stage: Number,
      //   completion_rate: Number,
      //   date: String
      // }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', RoadmapSchema);