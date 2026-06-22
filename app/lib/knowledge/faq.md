# FAQ — Common Recruiter & Hiring Manager Questions (with Rohit's real answers)

**Q: Why are you leaving Atlan?**
In the SA role he builds a solution and hands it off, then moves to the next engagement — never owning anything in production or seeing the long-term impact. He wants ownership: run a system in production and improve it over time. He also wants to broaden beyond the single metadata/governance lens and be more hands-on across the full AI space.

**Q: What are you looking for in your next role?**
The intersection of data readiness and AI enablement, closer to the data layer, with production ownership. Roughly 70% AI/data enablement, 30% client-facing solutioning.

**Q: How do you rate yourself on Python and SQL?**
8/10. Strong fundamentals from Dell (SQL and Python were bread and butter); has shifted to agentic coding (Claude Code) like much of the industry, but can still debug, write functions, and do code review. Fundamentals matter because you must be able to evaluate what an agent generates.

**Q: How do you design a RAG pipeline?**
Two parts. **Ingestion:** load docs (e.g., LangChain loaders) into a metadata+content structure, chunk them (fixed-size, semantic, structural, sliding-window, or recursive/hybrid), embed, store in a vector DB (ChromaDB, Qdrant, Elasticsearch, pgvector). **Retrieval:** embed the user query, run cosine similarity to find closest chunks, pass them as context to the LLM, generate the answer.

**Q: Your RAG pipeline hallucinates / retrieves wrong chunks. How do you fix it?**
Check how much context is retrieved and whether similarity returns relevant chunks. Fixes: hybrid search (vector + keyword/BM25) with Reciprocal Rank Fusion to rank and pass only top chunks; guardrails to bound the output; and an evaluation pipeline against a golden dataset. If retrieval is off, the ingestion/embedding strategy is often the root cause.

**Q: How do you evaluate LLM / RAG output?**
Build a small high-quality golden dataset. Evaluate retrieval ("did we fetch the right context?") and generation on faithfulness/groundedness, relevance, correctness, and completeness — scored by an LLM-as-judge following rubrics. Prefer a different model as judge to avoid self-bias.

**Q: What agentic tools have you used?**
Snowflake Cortex, Databricks Genie, LangChain, LangGraph. Primary harness is LangChain. Has not used CrewAI or Pydantic AI hands-on.

**Q: What does an agent need to perform well?**
Knowledge (bounded, governed context), Tools (MCPs to data sources), and Skills (orchestration/behavior).

**Q: What trends are you seeing with customers around AI and data?**
Three pain points: context bootstrapping (an agent is easy to build but useless without business context), production readiness (no rigid accuracy threshold — improved by human-in-the-loop, eval pipelines, observability), and portability (sharing one semantic layer across many domain agents).

**Q: How do you handle an ambiguous customer ask?**
Don't jump to a solution. Ask clarifying questions to validate the problem and scope first (e.g., what's the source of truth? who fixes flagged issues? does solving this drive business value?). Pushing back is often what helps the customer realize what they actually need.

**Q: Areas Rohit is actively deepening.**
Retrieval optimization beyond cosine similarity (hybrid search + RRF), automated prompt optimization (DSPy/OPRO-style), and traditional ML (XGBoost/Random Forest) beyond his data-engineering core.

**Q: Work authorization / visa.**
Best discussed with Rohit directly.
