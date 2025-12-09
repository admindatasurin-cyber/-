import { GoogleGenAI } from "@google/genai";
import { Refugee } from "../types";

const initGenAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateSituationReport = async (data: Refugee[]) => {
  const ai = initGenAI();
  if (!ai) {
    console.warn("API Key not found for Gemini.");
    return "ไม่พบ API Key ไม่สามารถสร้างรายงานได้";
  }

  // Summarize data for the prompt to save tokens
  const total = data.length;
  const needs = data.filter(r => r.medicalNeeds !== 'ไม่มี' && r.medicalNeeds !== 'None').map(r => r.medicalNeeds).join(', ');
  
  // Calculate unique shelters and counts for context
  const shelterCounts: Record<string, number> = {};
  data.forEach(r => {
    const s = r.shelterName || 'ไม่ระบุ';
    shelterCounts[s] = (shelterCounts[s] || 0) + 1;
  });
  const shelterSummary = Object.entries(shelterCounts).map(([name, count]) => `${name} (${count} คน)`).join(', ');
  
  const prompt = `
    วิเคราะห์ข้อมูลสรุปของผู้อพยพต่อไปนี้ และจัดทำรายงานสถานการณ์ด้านมนุษยธรรมแบบมืออาชีพโดยย่อ (ไม่เกิน 150 คำ)
    
    จำนวนผู้อพยพทั้งหมด: ${total}
    สถิติตามศูนย์พักพิง: ${shelterSummary}
    ความต้องการทางการแพทย์ที่รายงาน: ${needs}
    
    โดยเน้นที่ความหนาแน่นของประชากรในแต่ละศูนย์พักพิง ความต้องการเร่งด่วน และข้อเสนอแนะในการจัดสรรทรัพยากรไปยังศูนย์ต่างๆ
    ตอบกลับเป็นภาษาไทย ในรูปแบบ Markdown
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "ไม่สามารถสร้างรายงานได้เนื่องจากข้อผิดพลาดของบริการ AI";
  }
};