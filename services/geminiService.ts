
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const analyzeLogs = async (logs: string) => {
  if (!API_KEY) return "AI Analysis requires an API Key.";
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these MDM system logs and provide a concise security and health summary. Highlight any anomalies or suggested maintenance actions: \n\n ${logs}`,
      config: {
        systemInstruction: "You are a senior MDM Security Operations Analyst. Be concise, technical, and professional.",
        temperature: 0.2,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to analyze logs via AI.";
  }
};

export const suggestCommands = async (issue: string) => {
  if (!API_KEY) return [];
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `A fleet administrator is facing this issue: "${issue}". Suggest 3 technical CLI commands or actions to resolve it in a professional management environment. Return as JSON array of objects with {command: string, description: string}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              command: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["command", "description"],
          }
        }
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};
