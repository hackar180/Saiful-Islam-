
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Safely retrieves the API Key from the environment.
 * Prevents ReferenceError in browser-only environments.
 */
const getApiKey = (): string => {
  try {
    // Check if process exists and has env
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
    // Check global window object as fallback
    if (typeof window !== 'undefined' && (window as any).process?.env?.API_KEY) {
      return (window as any).process.env.API_KEY;
    }
  } catch (e) {
    console.warn("API Key could not be retrieved from environment.");
  }
  return "";
};

export const analyzeLogs = async (logs: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return "AI Analysis requires an API Key set in environment variables.";
  
  const ai = new GoogleGenAI({ apiKey });
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
  const apiKey = getApiKey();
  if (!apiKey) return [];
  
  const ai = new GoogleGenAI({ apiKey });
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