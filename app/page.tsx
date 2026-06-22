'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import Markdown from 'react-markdown';

const SUGGESTIONS = [
  "What is Rohit's background?",
  'Tell me about his most challenging project',
  'What roles is he looking for?',
  'Why should we hire him?',
];

const CAPABILITIES = [
  'Summarize his background and experience',
  'Walk through his projects and the impact they created',
  'Explain why he fits a specific role you are hiring for',
  'Answer questions about his skills and work style',
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
        <h1>Rohit&apos;s Personal Assistant</h1>
        <p>Hi, I am Rohit Agarwal&apos;s AI assistant. Ask me anything to get to know him.</p>
      </header>

      <div className="chat">
        {messages.length === 0 && (
          <div className="welcome">
            <p className="welcome-title">Here are some things I can do:</p>
            <ul className="caps">
              {CAPABILITIES.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
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

        {busy && <div className="typing">Assistant is typing…</div>}
      </div>

      <div className="dock">
        <div className="suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="chip" onClick={() => send(s)} disabled={busy}>
              {s}
            </button>
          ))}
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
      </div>
    </main>
  );
}
