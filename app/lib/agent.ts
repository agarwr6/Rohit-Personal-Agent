import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { buildSystemPrompt } from './system-prompt';

// Non-streaming agent call for evaluation. Tools are intentionally omitted so
// eval has no side effects (no real emails). Eval scores answer quality only.
export async function runAgent(userText: string): Promise<string> {
  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    system: buildSystemPrompt(userText),
    messages: [{ role: 'user', content: userText }],
    maxOutputTokens: 1500,
  });
  return text;
}
