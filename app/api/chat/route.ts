import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages, tankData } = await req.json();
  const data = tankData?.data || tankData;
  const temp = data?.temperature ? Math.round(data.temperature * 10) / 10 : '78.5';
  const ph = data?.ph ? Math.round(data.ph * 10) / 10 : '8.2';

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: `You are Cory. The LIVE temperature is ${temp}°F and pH is ${ph}. Use these numbers.`,
    messages: messages,
  });

  console.log('Final System Instruction sent to Gemini:', `You are Cory. The LIVE temperature is ${temp}°F and pH is ${ph}. Use these numbers.`);

  return result.toUIMessageStreamResponse();
}
