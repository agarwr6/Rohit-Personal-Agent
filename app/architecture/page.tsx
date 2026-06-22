import Link from 'next/link';

type Decision = {
  title: string;
  chose: string;
  over: string;
  why: string;
};

const DECISIONS: Decision[] = [
  {
    title: 'Knowledge: full-context injection, not RAG',
    chose: 'Inject the whole knowledge base into the system prompt',
    over: 'A vector database with semantic retrieval (RAG)',
    why: 'The knowledge base is small. Injecting it fully means zero retrieval errors and lower latency. RAG adds embeddings, a vector store, and a class of silent retrieval failures, solving a scale problem this app does not have. If the knowledge grew to thousands of documents, RAG would become the right call.',
  },
  {
    title: 'Skills: code-gated, not an LLM router',
    chose: 'Always-on skills plus conditional skills selected by keyword in code',
    over: 'A dynamic LLM router that picks skills per request',
    why: 'At five small skills, a router costs more tokens and latency than simply including them. Code-level gating loads skills by relevance with no extra model call. A router only pays off when the skill library is large enough that injecting all of it hurts the prompt.',
  },
  {
    title: 'Harness: single-turn, not an agentic loop',
    chose: 'One model call per message, with conversation memory',
    over: 'A multi-step agentic loop or multi-agent orchestration',
    why: 'Recruiter question-and-answer is a single-turn task. An agentic loop, multi-agent system, or durable-execution framework would add cost, latency, and failure modes with no benefit here. Tools use a bounded loop (max three steps) only when an action is needed.',
  },
  {
    title: 'Model: Gemini via a provider-agnostic SDK',
    chose: 'Google Gemini through the Vercel AI SDK',
    over: 'Hard-coding a single provider',
    why: 'The Vercel AI SDK abstracts the provider, so swapping to Claude or another model is a one-line change. The stack stays TypeScript end to end and deploys cleanly on serverless.',
  },
  {
    title: 'Rate limiting: distributed, not in-memory',
    chose: 'Upstash Redis sliding-window limits (10/min, 50/day per IP)',
    over: 'An in-memory counter in the route',
    why: 'On serverless, requests fan out across stateless instances, so an in-memory counter never sees the true global count and resets on cold start. A shared Redis counter gives correct limits, and the check runs before the model call so abuse costs almost nothing.',
  },
  {
    title: 'Cost: bounded output, not unbounded',
    chose: 'Cap output tokens and lead with concise answers',
    over: 'Letting the model write as much as it wants',
    why: 'A token cap bounds the cost of any single request while still fitting a full project story. Concise-by-default formatting keeps answers readable and cheap, with depth available on request.',
  },
];

const FLOW = [
  { step: 'Recruiter message', note: 'sent from the chat UI' },
  { step: 'Rate limit + validation', note: 'Upstash Redis, before any model call' },
  { step: 'Build system prompt', note: 'relevant skills + injected knowledge' },
  { step: 'Gemini (Vercel AI SDK)', note: 'streams tokens, may call a tool' },
  { step: 'Tools', note: 'send resume, notify Rohit (bounded loop)' },
  { step: 'Stream answer back', note: 'rendered live as markdown' },
  { step: 'Trace to Langfuse', note: 'prompt, response, tokens, latency' },
];

const STACK = [
  ['Frontend / API', 'Next.js (App Router, TypeScript) on Vercel'],
  ['AI', 'Vercel AI SDK, Google Gemini'],
  ['Knowledge', 'Markdown files, full-context injection'],
  ['Guardrails', 'Upstash Redis rate limiting, input validation, injection hardening'],
  ['Observability', 'Langfuse tracing (OpenTelemetry)'],
  ['Evaluation', 'Golden dataset + LLM-as-judge, logged to Langfuse'],
];

const PHASES = [
  'Setup and a single model call',
  'Streaming chat agent',
  'Knowledge grounding',
  'Modular skills, gated by relevance',
  'Tools: resume and recruiter notification',
  'Guardrails: rate limit, validation, injection defense',
  'Observability with Langfuse',
  'Offline evaluation with a golden dataset',
];

export default function Architecture() {
  return (
    <main className="wrap">
      <header className="head">
        <Link href="/" className="back">
          ← Back to the assistant
        </Link>
        <h1>How this was built</h1>
        <p>
          This assistant was designed and built by Rohit Agarwal. This page shows the architecture and the
          reasoning behind each decision, the same tradeoffs he weighs as an engineer.
        </p>
      </header>

      <section className="arch-section">
        <h2>Request flow</h2>
        <div className="flow">
          {FLOW.map((f, i) => (
            <div className="flow-node" key={f.step}>
              <div className="flow-box">
                <span className="flow-step">{f.step}</span>
                <span className="flow-note">{f.note}</span>
              </div>
              {i < FLOW.length - 1 && <div className="flow-arrow">↓</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="arch-section">
        <h2>Decisions and tradeoffs</h2>
        <div className="decisions">
          {DECISIONS.map((d) => (
            <div className="decision" key={d.title}>
              <h3>{d.title}</h3>
              <p className="decision-line">
                <strong>Chose:</strong> {d.chose}
              </p>
              <p className="decision-line">
                <strong>Over:</strong> {d.over}
              </p>
              <p className="decision-why">{d.why}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="arch-section">
        <h2>Tech stack</h2>
        <table className="stack">
          <tbody>
            {STACK.map(([k, v]) => (
              <tr key={k}>
                <td className="stack-key">{k}</td>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="arch-section">
        <h2>Built in phases</h2>
        <p className="phase-intro">
          Each phase shipped a working agent before adding the next layer. Make it work, make it right, make
          it fast.
        </p>
        <ol className="phases">
          {PHASES.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      </section>

      <footer className="arch-footer">
        <Link href="/" className="action primary">
          Ask the assistant about any of this
        </Link>
      </footer>
    </main>
  );
}
