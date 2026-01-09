require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

async function generateRoadmap(userData) {
  const prompt = `
You are a JSON generator.

Return ONLY a valid JSON array.
Do NOT include any text outside JSON.
Do NOT use markdown, backticks, or comments.

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
- Skills: ${(userData.skills || []).join(', ')}
- Target Companies: ${(userData.companies || []).join(', ')}

Create exactly 4 objects (4 weeks).
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // console.log('GEMINI RAW OUTPUT:\n', text);

  try {
    return safeParseJSON(text);
  } catch (err) {
    console.error('JSON PARSE FAILED');
    throw new Error('Invalid JSON returned by Gemini');
  }
}

module.exports = { generateRoadmap };
