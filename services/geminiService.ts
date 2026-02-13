
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Analyzes system logs using Gemini AI.
 */
export const analyzeLogs = async (logs: string) => {
  // Always use process.env.API_KEY exclusively and directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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

/**
 * Suggests technical CLI commands using Gemini AI.
 */
export const suggestCommands = async (issue: string) => {
  // Create a new GoogleGenAI instance right before making an API call.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
              command: {
                type: Type.STRING,
                description: 'The CLI command string.',
              },
              description: {
                type: Type.STRING,
                description: 'Brief explanation of what the command does.',
              },
            },
            required: ["command", "description"],
            propertyOrdering: ["command", "description"],
          },
        },
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};
