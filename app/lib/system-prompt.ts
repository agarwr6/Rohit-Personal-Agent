import { KNOWLEDGE } from './knowledge';
import { selectSkills } from './skills';

// Build the system prompt for a given user message.
// Skills are selected by relevance (always-on + conditional); knowledge is always injected.
export function buildSystemPrompt(userText: string): string {
  return `${selectSkills(userText)}

=== KNOWLEDGE BASE ABOUT ROHIT ===
${KNOWLEDGE}
=== END KNOWLEDGE BASE ===`;
}
