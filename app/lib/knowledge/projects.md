# Rohit Agarwal — Key Projects (told in his own words)

## 1. Context Scaling for Agents (Atlan — retail customer, ongoing)
**Problem:** A retail customer on Snowflake + Salesforce + Tableau said "we can build agents, but we can't scale them." Each team hand-curated its own Snowflake Cortex semantic models; metrics were scattered across Tableau, Salesforce, and handwritten YAML, with no shared context across agents.
**Two root causes Rohit identified:**
- **Context bootstrapping** — no single source of truth, so agents gave wrong answers.
- **Context portability** — every new Cortex agent started from scratch.
**Solution:** Connect all sources into Atlan (metadata only, no raw data), enrich metadata (descriptions, owners, certifications), build a context repo (semantic model + skills), deploy via Snowflake Cortex or Atlan MCP.

## 2. Source-Agnostic Agentic Migration Tool (Atlan)
**Problem:** Every SA wrote their own migration scripts for customers moving from Alation, Collibra, DataHub, etc. into Atlan.
**Solution:** A single source-agnostic agentic tool. A markdown instruction file per source captures how that source behaves; the agent reads the instructions and generates live migration code. The agent was given the right knowledge (how Atlan behaves), the right tools, and the right skills.
**Impact:** Migration time from weeks to days; pre-sales analysis cut ~2 hours per cycle.
**Lesson:** If a problem keeps recurring, solve it once for all.

## 3. LLM Evaluation Pipeline (Atlan)
Any system output is judged by a second LLM against a human-curated golden dataset (e.g., golden SQL for talk-to-data). The judge follows rubrics and scores the output. Adds observability, traceability, and a human feedback loop so the system improves over time. Tools: Braintrust, LangChain, LangGraph. Benchmarked AI-generated vs human metadata across ~500 columns (0.88 vs 0.66 in less-curated layers).

## 4. AI-Ready Data Foundation (Dell)
Built the unified Snowflake data lake that became Dell's AI-ready foundation. Standardized integrations for four engineering teams. Re-engineered Python ETL from ~1 hour to ~10 minutes (90% faster). Built a validation/reconciliation framework improving reliability 30%.

## 5. SKU Attribution & Unified Data Layer (Dell)
Source of truth in Teradata (fed from Salesforce), covering opportunity → quote → order. SKU-to-mod mapping in Domino; mod-to-part in Agile (Oracle). Attribution (with PMs) defined what made each SKU unique (size, vendor, region, config). Use cases: duplicate SKU detection, inventory consolidation, faster delivery, buyer/region analysis. ETL: SSIS → SQL Server → Analysis Services cubes → Tableau (later Power BI). Explored Snowflake for a denormalized, AI-ready layer for ThoughtSpot NLQ (halted by security concerns). For that POC used PySpark to extract from SSIS, chunk, load into Snowflake, then build semantic views for Cortex/NLQ.
