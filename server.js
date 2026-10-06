const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function generateWithFallback(prompt){
  const models = ['gemini-2.0-flash','gemini-1.5-flash','gemini-1.5-flash-8b'];
  for(let m of models){
    try{
      let r = await ai.models.generateContent({ model: m, contents: prompt });
      return r.text;
    }catch(e){
      console.log(`Model ${m} failed: ${e.message}`);
    }
  }
  throw new Error("All models failed");
}

app.post('/api/chat', async (req, res) => {
  try {
    const text = await generateWithFallback(req.body.prompt);
    res.json({ success: true, text });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const text = await generateWithFallback(`Create detailed 4k prompt for: ${req.body.prompt}`);
    res.json({ success: true, prompt: text, text });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/', (req, res) => res.send('🔥 AI POWERFUL DANGER SERVER LIVE - FINAL FIXED 🔥'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running'));
