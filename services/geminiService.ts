import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const streamGeminiResponse = async (
  prompt: string, 
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are a retro computer terminal assistant from the late 80s/early 90s running on BaudRate-OS. Be concise, technical, and slightly robotic but helpful. Avoid markdown formatting like bold or headers if possible, use simple indentation or dashes. If asked about your identity, claim to be the BaudRate Kernel.",
      },
    });

    const result = await chat.sendMessageStream({ message: prompt });

    for await (const chunk of result) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
    onComplete();
  } catch (error: any) {
    console.error("Gemini Error:", error);
    onError(error.message || "Communication link severed. Signal lost.");
    onComplete();
  }
};