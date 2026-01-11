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
  const weeks = userData.weeks || 4;

  const prompt = `
You are a JSON generator.

Return ONLY a valid JSON array.
Do NOT include any text outside JSON.

Schema:
[
  {
    "title": "string",
    "tasks": ["string"],
    "daily_goal": "string",
    "why_important": "string",
    "resources": [
      {
        "platform": "string",
        "link": "string"
      }
    ]
  }
]

Context:
- Year: ${userData.year}
- Skills: ${(userData.skills || []).join(', ')}
- Target Companies: ${(userData.companies || []).join(', ')}

Rules:
- Create exactly ${weeks} objects (Week 1, Week 2, etc.)
- Include 2–4 resources per week
- Use ONLY these platforms with EXACT links:
  - LeetCode: "https://leetcode.com/problems/[relevant]/"
  - freeCodeCamp: "https://www.freecodecamp.org/learn/[relevant]/"
  - GeeksforGeeks: "https://www.geeksforgeeks.org/[relevant]/"
  - YouTube: "https://www.youtube.com/watch?v=[video-id]" or "https://youtu.be/[video-id]"
  - Coursera: "https://www.coursera.org/learn/[relevant]"
  - MDN: "https://developer.mozilla.org/en-US/docs/[relevant]"
  - React Docs: "https://react.dev/learn/[relevant]"
  - Python.org: "https://docs.python.org/3/tutorial/[relevant].html"

- Links must be realistic and relevant to week's tasks
- Titles: "Week 1: [Topic]", "Week 2: [Topic]", etc.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return safeParseJSON(text);
  } catch (err) {
    console.error('JSON PARSE FAILED:', text);
    throw new Error('Invalid JSON returned by Gemini');
  }
}


module.exports = { generateRoadmap };
