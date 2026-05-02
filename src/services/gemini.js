import { GoogleGenAI, Type } from "@google/genai";

// Initialization with the official SDK and environment variable
// Support both AI Studio (process.env) and local Vite (import.meta.env)
const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export async function getDailyInsight() {
  try {
    const prompt = "Give me a single, short, sophisticated piece of advice about the importance of rest and paced productivity. Keep it under 15 words. Be inspiring and professional.";
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });
    
    return response.text.replace(/"/g, '').trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Intentional rest is the foundation of high-performance work.";
  }
}

export async function suggestPacedSchedule(tasks, wakeTime, sleepTime) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `
        I have the following tasks for today: ${JSON.stringify(tasks)}.
        I wake up at ${wakeTime} and sleep at ${sleepTime}.
        Suggest a balanced, high-efficiency schedule that incorporates intentional rest intervals to prevent burnout.
        Identify which tasks require higher cognitive load and suggest doing them when energy is highest (usually mid-morning).
        Make sure to include a 'Mindful Rest' interval every 1-2 tasks.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: "Must be 'task' or 'break'" },
              task: { type: Type.STRING, description: "Description of the task or break name" },
              time: { type: Type.STRING, description: "Time range as 'HH:MM - HH:MM'" }
            },
            required: ["type", "task", "time"]
          }
        }
      }
    });
    
    const text = response.text.trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}
