const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    res.json({ success: true, text: response.text });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Create a highly detailed, 4k, photorealistic image prompt for: ${prompt}. Only give the final prompt.`,
    });
    res.json({ success: true, prompt: response.text });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/', (req, res) => res.send('🔥 AI POWERFUL DANGER SERVER IS LIVE 🔥'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running'));
