import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages, tankData } = await req.json();

  const temp = tankData?.temperature ?? 'unknown';
  const ph = tankData?.ph ?? 'unknown';
  const salinity = tankData?.salinity ?? 'unknown';
  const health = tankData?.healthScore ?? tankData?.health ?? 'unknown';

  const systemInstruction = `You are Cory, a friendly AI reef assistant. \nCURRENT TANK METRICS:\n- Temperature: ${temp}°F\n- pH: ${ph}\n- Salinity: ${salinity}ppt\n- Health Score: ${health}%\n\nUse these specific numbers to answer the user's questions. If the values are 'unknown', politely ask the user to wait a moment for the sensors to sync.`;

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
