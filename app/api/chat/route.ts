import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages, tankData } = await req.json();

  const temp = tankData?.temperature ?? 'unknown';
  const ph = tankData?.ph ?? 'unknown';
  const salinity = tankData?.salinity ?? 'unknown';
  const health = tankData?.healthScore ?? tankData?.health ?? 'unknown';

  const roundIfNumber = (v: any) => (typeof v === 'number' ? Math.round(v * 10) / 10 : v);

  const rTemp = roundIfNumber(tankData?.temperature ?? tankData?.temp ?? temp);
  const rPh = roundIfNumber(tankData?.ph ?? ph);
  const rSalinity = roundIfNumber(tankData?.salinity ?? salinity);
  const rHealth = roundIfNumber(tankData?.healthScore ?? tankData?.health ?? health);

  const systemInstruction = `You are Cory, a friendly AI reef assistant.\nYou are looking at a live dashboard. When the user asks for a metric, look at the CURRENT TANK METRICS provided and give them the rounded value.\nCURRENT TANK METRICS:\n- Temperature: ${rTemp}°F\n- pH: ${rPh}\n- Salinity: ${rSalinity}ppt\n- Health Score: ${rHealth}%`;

  const mappedMessages = messages.map((m: any) => ({
    role: m.role,
    content: m.text || m.content || (m.parts ? m.parts.map((p: any) => p.text).join('') : '') || ''
  }));

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemInstruction,
    messages: mappedMessages,
  });

  console.log('Final System Instruction sent to Gemini:', systemInstruction);

  return result.toUIMessageStreamResponse();
}
