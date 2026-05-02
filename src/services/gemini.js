import { GoogleGenAI, Type } from "@google/genai";

// Initialization with the official SDK and environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getSlothWisdom() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Give me a single, short, witty piece of 'sloth wisdom' about why rest is productive or why being lazy is a superpower. Keep it under 15 words. Be funny and encouraging.",
    });
    
    return response.text.replace(/"/g, '').trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Even a slow sloth knows when to rest.";
  }
}

export async function suggestPacedSchedule(tasks, wakeTime, sleepTime) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        I have the following tasks for today: ${JSON.stringify(tasks)}.
        I wake up at ${wakeTime} and sleep at ${sleepTime}.
        Suggest a "lazy-friendly" schedule that balances these tasks with plenty of breaks.
        Identify which tasks are hardest and suggest doing them when energy is highest (usually mid-morning).
        Make sure to include a 'Sloth Break' every 1-2 tasks.
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
