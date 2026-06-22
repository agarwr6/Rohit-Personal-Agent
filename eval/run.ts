import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { LangfuseClient } from '@langfuse/client';
import type { Evaluation } from '@langfuse/client';
import { runAgent } from '../app/lib/agent';
import { GOLDEN } from './golden';

// Register OpenTelemetry so experiment traces are sent to Langfuse.
const provider = new NodeTracerProvider({ spanProcessors: [new LangfuseSpanProcessor()] });
provider.register();

const langfuse = new LangfuseClient();

// Deterministic evaluator: required keywords present.
function keywordEval(output: string, mustInclude?: string[]): Evaluation {
  if (!mustInclude || mustInclude.length === 0) {
    return { name: 'keyword_match', value: 1, comment: 'no keywords required' };
  }
  const lower = output.toLowerCase();
  const missing = mustInclude.filter((k) => !lower.includes(k.toLowerCase()));
  return {
    name: 'keyword_match',
    value: missing.length === 0 ? 1 : 0,
    comment: missing.length === 0 ? 'all present' : `missing: ${missing.join(', ')}`,
  };
}

// Deterministic evaluator: forbidden substrings absent.
function forbiddenEval(output: string, mustNotInclude?: string[]): Evaluation {
  if (!mustNotInclude || mustNotInclude.length === 0) {
    return { name: 'no_forbidden', value: 1, comment: 'none configured' };
  }
  const lower = output.toLowerCase();
  const hit = mustNotInclude.filter((k) => lower.includes(k.toLowerCase()));
  return {
    name: 'no_forbidden',
    value: hit.length === 0 ? 1 : 0,
    comment: hit.length === 0 ? 'clean' : `contains: ${hit.join(', ')}`,
  };
}

// Deterministic evaluator: no em-dash (formatting rule).
function emDashEval(output: string): Evaluation {
  const ok = !output.includes('—');
  return { name: 'no_em_dash', value: ok ? 1 : 0, comment: ok ? 'clean' : 'has em-dash' };
}

// LLM-as-judge: grade the answer against the reference (0 to 1) with a reason.
// Uses structured output so the result is always parseable.
async function judgeEval(input: string, output: string, expected: string): Promise<Evaluation> {
  const { object } = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: z.object({
      score: z.number().min(0).max(1),
      reason: z.string(),
    }),
    prompt: `You are grading an AI assistant's answer about a job candidate named Rohit.

Question: ${input}

Reference (what a good answer should cover): ${expected}

Actual answer: ${output}

Grade how well the actual answer meets the reference on correctness, relevance, and faithfulness. Use the full range and give partial credit: 1.0 = fully meets, 0.7 = mostly meets with minor gaps, 0.4 = partially meets, 0.0 = wrong, hallucinated, or off-topic.`,
  });
  return {
    name: 'llm_judge',
    value: Math.max(0, Math.min(1, object.score)),
    comment: object.reason,
  };
}

async function main() {
  const data = GOLDEN.map((c) => ({
    input: c.input,
    expectedOutput: c.expectedOutput,
    metadata: { id: c.id, type: c.type, mustInclude: c.mustInclude, mustNotInclude: c.mustNotInclude },
  }));

  const result = await langfuse.experiment.run({
    name: 'recruiter-agent-eval',
    description: 'Offline regression eval of the recruiter agent against the golden dataset',
    data,
    task: async (item) => runAgent(item.input as string),
    evaluators: [
      async ({ output, metadata }) => keywordEval(output as string, metadata?.mustInclude),
      async ({ output, metadata }) => forbiddenEval(output as string, metadata?.mustNotInclude),
      async ({ output }) => emDashEval(output as string),
      async ({ input, output, expectedOutput }) =>
        judgeEval(input as string, output as string, expectedOutput as string),
    ],
  });

  // Terminal summary.
  let pass = 0;
  for (const r of result.itemResults) {
    const judge = r.evaluations.find((e) => e.name === 'llm_judge');
    const keyword = r.evaluations.find((e) => e.name === 'keyword_match');
    const forbidden = r.evaluations.find((e) => e.name === 'no_forbidden');
    const emdash = r.evaluations.find((e) => e.name === 'no_em_dash');
    const judgeOk = (Number(judge?.value) ?? 0) >= 0.6;
    const ok = judgeOk && keyword?.value === 1 && forbidden?.value === 1 && emdash?.value === 1;
    if (ok) pass++;
    const id = (r.item.metadata as { id?: string })?.id ?? '?';
    console.log(
      `${ok ? 'PASS' : 'FAIL'}  ${id.padEnd(10)} judge=${judge?.value} kw=${keyword?.value} forb=${forbidden?.value} emdash=${emdash?.value}` +
        (ok ? '' : `  <- ${judge?.comment ?? ''} ${keyword?.comment ?? ''} ${forbidden?.comment ?? ''}`)
    );
  }
  console.log(`\nPASS RATE: ${pass}/${result.itemResults.length}`);
  if (result.datasetRunUrl) console.log(`Langfuse: ${result.datasetRunUrl}`);

  await langfuse.flush();
  await provider.forceFlush();
  await provider.shutdown();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
