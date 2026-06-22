import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, stepCountIs, type UIMessage } from 'ai';
import { buildSystemPrompt } from '../../lib/system-prompt';
import { tools } from '../../lib/tools';

export const maxDuration = 30;

// Pull the latest user message's text, for relevance-based skill selection.
function latestUserText(messages: UIMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser) return '';
  return lastUser.parts
    .filter((p) => p.type === 'text')
    .map((p) => (p as { text: string }).text)
    .join(' ');
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: buildSystemPrompt(latestUserText(messages)),
    messages: await convertToModelMessages(messages),
    tools,
    // Allow the model to call a tool, then write its final reply.
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
}
