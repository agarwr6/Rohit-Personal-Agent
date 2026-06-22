import { PERSONA } from './persona';
import { GROUNDING } from './grounding';
import { FORMATTING } from './formatting';
import { STORYTELLING } from './storytelling';
import { FIT } from './fit';

// Always injected: apply to every response.
const ALWAYS_ON = [PERSONA, GROUNDING, FORMATTING];

// Conditional skills: each has a matcher. Loaded only when the user's
// message looks relevant. No extra LLM call, just cheap keyword/intent gating.
const CONDITIONAL: { skill: string; matches: (text: string) => boolean }[] = [
  {
    skill: STORYTELLING,
    matches: (t) =>
      /\b(project|projects|experience|built|build|challeng|tell me about|walk me through|story|example|did at|work at|accomplish|impact)\b/.test(
        t
      ),
  },
  {
    skill: FIT,
    matches: (t) =>
      /\b(fit|role|roles|hir|why|strength|strengths|good (for|at)|suit|candidate|looking for|career|next)\b/.test(
        t
      ),
  },
];

// Build the skill section for a given user message.
export function selectSkills(userText: string): string {
  const t = userText.toLowerCase();
  const active = [...ALWAYS_ON, ...CONDITIONAL.filter((c) => c.matches(t)).map((c) => c.skill)];
  return active.join('\n\n');
}
