require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const roadmapRoutes = require('./routes/roadmaps');

const app = express();
const PORT = process.env.PORT || 8000;

/* Middleware */
app.use(cors());
app.use(express.json());

/* MongoDB Connection */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

/* 🔥 CALL THE FUNCTION */
connectDB();

/* Routes */
app.use('/api/roadmaps', roadmapRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Career Roadmap JS Backend Ready (MongoDB)' });
});

/* Start Server */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
