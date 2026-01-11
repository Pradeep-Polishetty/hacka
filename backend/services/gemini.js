require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  throw new Error('❌ GEMINI_API_KEY is missing in .env');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

function safeParseJSON(text) {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');

  if (start === -1 || end === -1) {
    throw new Error('No JSON array found in Gemini output');
  }

  return JSON.parse(text.slice(start, end + 1));
}

async function generateRoadmap(rawUserData = {}) {
  // ✅ NORMALIZE + DEFAULTS (THIS FIXES YOUR ERROR)
  const userData = {
    year: rawUserData.year || new Date().getFullYear(),
    skills: Array.isArray(rawUserData.skills) ? rawUserData.skills : [],
    companies: Array.isArray(rawUserData.companies) ? rawUserData.companies : []
  };

  const prompt = `
You are a STRICT JSON generator.

Rules:
- Output ONLY valid JSON
- No markdown
- No explanations
- No backticks
- No comments

Schema:
[
  {
    "title": "string",
    "tasks": ["string"],
    "daily_goal": "string",
    "why_important": "string"
  }
]

Context:
- Year: ${userData.year}
- Skills: ${userData.skills.join(', ') || 'Beginner'}
- Target Companies: ${userData.companies.join(', ') || 'General'}

Create EXACTLY 4 objects (4 weeks roadmap).
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return safeParseJSON(text);
  } catch (err) {
    console.error('❌ GEMINI RAW OUTPUT:\n', text);
    throw new Error('Invalid JSON returned by Gemini');
  }
}

module.exports = { generateRoadmap };
