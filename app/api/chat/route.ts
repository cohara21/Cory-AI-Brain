import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const body = await req.json();
  console.log('DEBUG: Full Request Body:', JSON.stringify(body, null, 2));

  // Look for the data in every possible nesting level
  const tank = body.tankData || body.data || body;
  const temperature = tank.temperature || tank.temp || (body.messages && body.tankData?.temperature);

  console.log('DEBUG: Found Temperature:', temperature);

  const messages = body.messages;
  const temp = temperature ? Math.round(temperature * 10) / 10 : '78.5';
  const ph = tank?.ph ? Math.round(tank.ph * 10) / 10 : '8.2';

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

  const result = await streamText({
    model: google('gemini-2.5-flash'),
    system: `You are Cory. The LIVE temperature is ${temp}°F and pH is ${ph}. Always use these numbers.`,
    messages: normalizedMessages,
  });

  console.log('Final System Instruction sent to Gemini:', `You are Cory. The LIVE temperature is ${temp}°F and pH is ${ph}. Use these numbers.`);

  return result.toUIMessageStreamResponse();
}
