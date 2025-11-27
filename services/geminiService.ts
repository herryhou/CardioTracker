import { GoogleGenAI } from "@google/genai";
import { BPRecord } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTrends = async (records: BPRecord[]): Promise<string> => {
  if (records.length === 0) return "No data available to analyze.";

  // Take the last 20 records for analysis to keep prompt size reasonable
  const recentRecords = records.slice(0, 20).map(r => 
    `Date: ${new Date(r.timestamp).toLocaleDateString()}, BP: ${r.systolic}/${r.diastolic}, Pulse: ${r.pulse}`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        You are a supportive cardiovascular health assistant. 
        Analyze the following blood pressure and heart rate readings.
        Identify any trends (rising, falling, stable).
        Check if the values are generally within normal, elevated, or hypertensive ranges (based on standard guidelines).
        Provide a concise, encouraging summary (max 3 sentences) and 1 specific actionable health tip.
        
        Data:
        ${recentRecords}
      `,
      config: {
        systemInstruction: "You are a professional medical assistant. Be concise, friendly, and cautious. Do not provide medical diagnosis, only observations.",
      }
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Unable to analyze trends at this moment. Please check your internet connection.";
  }
};
