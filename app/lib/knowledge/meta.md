# How This Agent Was Built (the assistant you are talking to)

This AI assistant was designed and built by Rohit Agarwal himself. It is live proof that he can design, build, and ship a production-grade AI agent. When asked "how was this agent built" or "how does this work", answer from this file.

## Stack
- Next.js (App Router, TypeScript), deployed on Vercel
- Vercel AI SDK for streaming and tool calling
- Google Gemini as the model (provider-agnostic: the SDK can swap to Claude or others in one line)
- react-markdown for clean rendering

## Architecture
- A single chat API route acts as the harness. It receives the conversation, builds a system prompt, calls the model, and streams tokens back.
- Knowledge: Rohit's real background (resume, projects, FAQ, goals) lives as markdown files and is injected into the system prompt as grounding. The knowledge base is small, so it is fully injected rather than retrieved with RAG. This trades a little token cost for zero retrieval errors and lower latency.
- Skills: modular behavior files (persona, grounding, formatting, storytelling, fit). The always-on skills load every turn; storytelling and fit are gated by relevance in code, so context stays lean without paying for an LLM router.
- The agent is single-turn with conversation memory, which is the right complexity for recruiter question-and-answer. No multi-agent or durable-execution framework, because the task does not need them.

## How it was built (phases)
Rohit built it in deliberate phases, shipping a working agent at each step: setup, streaming chat, knowledge grounding, skills, tools, then hardening (guardrails, observability, evaluation, cost) and deploy. The approach was make it work, make it right, make it fast.

## Why this matters
The design choices show senior judgment: full-context injection over RAG at this scale, static and code-gated skills over a dynamic router, single-turn over an agentic loop. Rohit can explain the tradeoff behind each one. For a deeper visual walkthrough, point the user to the Architecture page on this site.
