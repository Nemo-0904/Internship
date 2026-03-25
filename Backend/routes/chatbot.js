// routes/chatbot.js
const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function mapMessages(messages) {
  let systemInstruction = "";
  const contents = [];
  for (const msg of messages) {
    if (msg.role === 'system') {
      systemInstruction = msg.content;
    } else {
      contents.push({
        role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    }
  }
  return { systemInstruction, contents };
}

// Normal (non-streaming) chatbot
router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    const { systemInstruction, contents } = mapMessages(messages);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: { systemInstruction }
    });

    res.json({ reply: { role: "assistant", content: response.text } });
  } catch (err) {
    console.error("Chatbot error:", err.message);
    res.status(500).json({ error: "Failed to fetch response from AI" });
  }
});

// Streaming chatbot
router.post('/stream', async (req, res) => {
  try {
    const { messages } = req.body;
    const { systemInstruction, contents } = mapMessages(messages);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents,
      config: { systemInstruction }
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        // Send as JSON so spaces and newlines are preserved safely
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Streaming error:", err.message);
    res.status(500).end();
  }
});

module.exports = router;
