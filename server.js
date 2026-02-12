// File: server.js

import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- CONFIGURATION ---
const API_KEY = "AIzaSyCYAu0des4EU3oChAidnI-W3dWsJkwrUEA"; // Paste your new, secret API key here
const PORT = 3000;

// --- INITIALIZE THE MODEL ---
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
You are a helpful assistant. Answer questions and provide information based on the user's input. Keep responses concise and relevant. If you don't know the answer, say "I don't know."
Avoid unnecessary details and focus on the user's request.
`,
});

// --- SETUP THE SERVER ---
const app = express();
app.use(cors()); // Use CORS middleware
app.use(express.json()); // Middleware to parse JSON bodies

// --- DEFINE THE CHAT ENDPOINT ---
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body.message;
    if (!userInput) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const chat = model.startChat();
    const result = await chat.sendMessage(userInput);
    const response = result.response;

    res.json({ reply: response.text() });

  } catch (error) {
    console.error('Error during chat processing:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// --- START THE SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});