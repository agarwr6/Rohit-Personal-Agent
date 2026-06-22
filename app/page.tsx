'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import Markdown from 'react-markdown';

const SUGGESTIONS = [
  "What is Rohit's background?",
  'Tell me about his most challenging project',
  'Is he a good fit for a Forward Deployed Engineer role?',
  'How does he handle RAG hallucination?',
];

export default function Home() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');
  const busy = status !== 'ready';

  const send = (text: string) => {
    if (!text.trim()) return;
    sendMessage({ text });
    setInput('');
  };

  return (
    <main className="wrap">
      <header className="head">
        <h1>Ask about Rohit</h1>
        <p>An AI agent that answers recruiter questions about Rohit Agarwal.</p>
      </header>

      <div className="chat">
        {messages.length === 0 && (
          <div className="suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chip" onClick={() => send(s)} disabled={busy}>
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m) => {
          const text = m.parts
            .filter((p) => p.type === 'text')
            .map((p) => (p as { text: string }).text)
            .join('');
          return (
            <div key={m.id} className={`row ${m.role}`}>
              <div className={`bubble ${m.role}`}>
                {m.role === 'assistant' ? <Markdown>{text}</Markdown> : text}
              </div>
            </div>
          );
        })}

        {busy && <div className="typing">Agent is typing…</div>}
      </div>

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about Rohit…"
          disabled={busy}
        />
        <button type="submit" disabled={busy}>
          Send
        </button>
      </form>
    </main>
  );
}
