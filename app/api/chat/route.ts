import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const body = await req.json();
  console.log('DEBUG: Full Request Body:', JSON.stringify(body, null, 2));

  // Look for the data in every possible nesting level
  const data = body.tankData || body.data || body;
  const temperature = data.temperature || data.temp || (body.messages && body.tankData?.temperature);

  console.log('DEBUG: Found Temperature:', temperature);

  const messages = body.messages;
  const temp = temperature ? Math.round(temperature * 10) / 10 : '78.5';
  const ph = data?.ph ? Math.round(data.ph * 10) / 10 : '8.2';
  const salinity = data?.salinity ? Math.round(data.salinity * 10) / 10 : 'unknown';
  const health = data?.healthScore || data?.health || 'unknown';
  const redox = data?.redox ? Math.round(data.redox) : 'unknown';

  const normalizedMessages = (Array.isArray(messages) ? messages : [])
    .map((m: any) => {
      const role = m?.role === 'model'
        ? 'assistant'
        : m?.role === 'assistant'
          ? 'assistant'
          : m?.role === 'user'
            ? 'user'
            : null;

      const content = typeof m?.content === 'string'
        ? m.content
        : typeof m?.text === 'string'
          ? m.text
          : Array.isArray(m?.parts)
            ? m.parts
                .filter((p: any) => p?.type === 'text' && typeof p?.text === 'string')
                .map((p: any) => p.text)
                .join('')
            : '';

      if (!role || !content.trim()) {
        return null;
      }

      return { role, content };
    })
    .filter(Boolean) as Array<{ role: 'user' | 'assistant'; content: string }>;

  if (normalizedMessages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'No valid chat messages were provided.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const systemInstruction =
    `You are Cory, a helpful reef tank assistant. You have LIVE readings for this tank—use them whenever relevant and speak naturally (do not sound like you're reading a datasheet):\n` +
    `- Temperature: ${temp}°F\n` +
    `- pH: ${ph}\n` +
    `- Salinity (ppt): ${salinity}\n` +
    `- Health score: ${health}\n` +
    `- Redox (ORP, mV): ${redox}\n` +
    `If a value is shown as "unknown", say you don't have a current reading for that metric instead of guessing. Otherwise treat these numbers as authoritative for this session.`;

  const result = await streamText({
    model: google('gemini-2.5-flash'),
    system: systemInstruction,
    messages: normalizedMessages,
  });

  console.log('Final System Instruction sent to Gemini:', systemInstruction);

  return result.toUIMessageStreamResponse();
}
