
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateEmergencySummary = async (userData: any) => {
  const ai = getAI();
  const prompt = `
    Based on the following emergency contact information, provide a concise, high-priority emergency summary that medical responders or police would need. 
    Focus on life-saving details and quick actions.
    
    Data:
    Name: ${userData.fullName}
    Age: ${userData.age}
    Blood Group: ${userData.bloodGroup}
    Medical Conditions: ${userData.medicalConditions || 'None reported'}
    Allergies: ${userData.allergies || 'None reported'}
    Emergency Contacts: ${userData.emergencyContact1Name} (${userData.emergencyContact1Phone})
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate emergency summary at this time.";
  }
};
