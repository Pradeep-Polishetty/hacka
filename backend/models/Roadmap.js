const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema(
  {
    roadmapId: { type: String, required: true, unique: true },
    userData: {
      year: Number,
      skills: [String],
      companies: [String]
    },
    roadmap: { type: Array, required: true },
    progressLogs: { type: Array, default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', RoadmapSchema);
