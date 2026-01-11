const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
  roadmapId: { type: String, required: true, unique: true },
  userData: {
    year: String,
    skills: [String],
    companies: [String],
    weeks: { type: Number, default: 4 }
  },
  roadmap: [mongoose.Schema.Types.Mixed],
  progressLogs: [{
    weekIndex: Number,
    progress: Number,
    timestamp: { type: Date, default: Date.now },
    note: String
  }]
}, { timestamps: true });

RoadmapSchema.index({ roadmapId: 1 });
module.exports = mongoose.model('Roadmap', RoadmapSchema);
