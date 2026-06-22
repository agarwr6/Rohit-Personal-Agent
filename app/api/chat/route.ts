import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, stepCountIs, type UIMessage } from 'ai';
import { buildSystemPrompt } from '../../lib/system-prompt';
import { tools } from '../../lib/tools';
import { checkRateLimit } from '../../lib/ratelimit';

export const maxDuration = 30;

const MAX_MESSAGE_CHARS = 2000;
const MAX_MESSAGES = 40;

// Pull the latest user message's text, for relevance-based skill selection.
function latestUserText(messages: UIMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser) return '';
  return lastUser.parts
    .filter((p) => p.type === 'text')
    .map((p) => (p as { text: string }).text)
    .join(' ');
}

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0].trim() || 'anonymous';
}

export async function POST(req: Request) {
  // Guardrail 1: rate limit (runs before any model call, so abuse costs near zero).
  const allowed = await checkRateLimit(clientIp(req));
  if (!allowed) {
    return new Response('Too many requests. Please slow down.', { status: 429 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  // Guardrail 2: input validation.
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return new Response('Invalid request.', { status: 400 });
  }
  const text = latestUserText(messages);
  if (!text.trim() || text.length > MAX_MESSAGE_CHARS) {
    return new Response('Message is empty or too long.', { status: 400 });
  }

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: buildSystemPrompt(text),
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(3),
    // Guardrail: bound output cost; full STARL story fits comfortably.
    maxOutputTokens: 1500,
    // Observability: export traces (prompt, response, tools, tokens, latency) to Langfuse.
    experimental_telemetry: { isEnabled: true, functionId: 'recruiter-chat' },
  });

  return result.toUIMessageStreamResponse();
}
