'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Home() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: 24, fontFamily: 'system-ui' }}>
      <h1>Ask about Rohit</h1>
      <p style={{ color: '#666' }}>AI agent that answers recruiter questions about Rohit Agarwal.</p>

      <div style={{ minHeight: 240, margin: '16px 0' }}>
        {messages.map((m) => (
          <div key={m.id} style={{ margin: '12px 0' }}>
            <strong>{m.role === 'user' ? 'You' : 'Agent'}:</strong>{' '}
            {m.parts.map((part, i) =>
              part.type === 'text' ? <span key={i}>{part.text}</span> : null
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput('');
        }}
        style={{ display: 'flex', gap: 8 }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. What's Rohit's tech stack?"
          style={{ flex: 1, padding: 8 }}
          disabled={status !== 'ready'}
        />
        <button type="submit" disabled={status !== 'ready'} style={{ padding: '8px 16px' }}>
          Send
        </button>
      </form>
    </main>
  );
}
