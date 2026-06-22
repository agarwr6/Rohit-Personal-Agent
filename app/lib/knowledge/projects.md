# Rohit Agarwal — Key Projects

These are told as stories (Situation, Task, Action, Result, Learning). When asked about a project, narrate it as a story — not a list of bullets.

---

## STARL Stories

### Project: F5 — Metric-Trust Readiness Assessment (Atlan)
**Situation.** F5 wanted to trust the numbers on their Tableau dashboards — metrics like ACV and ARR. They'd noticed some dashboards used calculated fields that didn't match the approved formula in their glossary, so they asked us to automatically compare the two and flag every mismatch.
**Task.** Rohit was brought in to figure out whether we could compare the approved glossary formula against the Tableau formulas and flag the differences.
**Action.** Instead of just building what they asked, he stepped back and tested the foundation first, asking four questions: Where does the real source of truth live — Atlan, dbt, or people's heads? Where exactly in Tableau does the formula sit — dashboard, worksheet, or calculated field? Who owns fixing a mismatch once flagged? And does this scale — they had ~200 approved formulas against 47,000 calculated fields? Those questions exposed that the source of truth wasn't standardized and there was no process for acting on a mismatch.
**Result.** They agreed not to rush into building. The honest first step was to surface mismatches and raise awareness — not auto-fix dashboards — and to close the governance gaps first. That saved F5 from investing in a tool that would've flagged thousands of issues with no one to act on them, and it built more trust, because Rohit was clearly protecting them from a bad build rather than selling one.
**Learning.** Don't solve a validation problem before the business agrees on the definition and who owns it. The technical idea was fine; the real gap was governance maturity and source-of-truth clarity. Sometimes the most valuable thing you can do for a customer is tell them not to build yet.

### Project: GM — Rapid Iceberg Governance (Atlan)
**Situation.** Rohit worked with GM's AR Camera team as an Atlan Solution Architect. They had massive amounts of critical vehicle-camera data landing in Apache Iceberg tables, managed via Project Nessie and queried using Trino. Strict automotive compliance deadlines meant they needed this entire dataset under GM's corporate governance policies inside Atlan immediately. The blocker: Atlan didn't natively catalog Iceberg tables managed by Nessie, leaving GM facing a 3–6 month delay waiting for a custom connector.
**Task.** Find a rapid, secure path to compliance without forcing GM to change their core engineering stack — capturing table metadata, schema history, and lineage in Atlan without disrupting the AI team's active Trino query workflows.
**Action.** Instead of pushing a complex, high-maintenance custom API build, Rohit looked for leverage in their existing infrastructure. Atlan had a mature, production-ready BigQuery connector, and Iceberg is an open table format whose metadata can be read by multiple query engines. He advised GM to register their GCS-based Iceberg tables as BigQuery External Tables — a zero-copy "viewing window." Trino and Nessie stayed the heavy-lifting write engine for the AI teams, but a clean SQL schema layer was exposed to BigQuery. He then configured Atlan's native BigQuery connector to crawl those external tables.
**Result.** This pivot unlocked automated governance for GM in days instead of months. Atlan ingested the metadata, mapped lineage from GCS to BigQuery, and classified sensitive columns for compliance. It delivered full governance visibility for the enterprise risk team, protected the performance and cost of the AI team's Trino pipeline, and eliminated custom-code maintenance for both Atlan and GM.
**Learning.** The most elegant solution isn't always a custom product feature. By understanding open data architectures (how Trino and BigQuery can share Iceberg metadata), you can creatively stitch together existing, proven ecosystem connectors to deliver immediate business value and compliance.

### Project: Dell — Unified SKU Attribution Layer (Dell)
**Situation.** Product managers across Dell's server, storage, and networking lines needed to see how their products sold down to the individual SKU and configuration (memory, CPU, GPU, vendor) — not just at product level — and that detail wasn't available out of the box. All order data came from one source (Teradata), but each product vertical sat in its own silo and attributed SKUs differently, so there was no unified, queryable view, and answering a basic business question took slow manual work.
**Task.** Build a unified data layer consolidating the three product lines and enriched with SKU attribution, so product managers could self-serve answers — ideally just by asking a question ("talk to your data").
**Action.** Rohit consolidated the server, storage, and networking data (same Teradata source, attributed differently per vertical) into one layer, and led the SKU attribution — working with PMs to enrich each SKU with the attributes that made it meaningful (type, size, vendor, configuration) down to the part level. He modeled it as a flat, denormalized layer rather than a star schema, so it was easy to query and ready for natural-language self-service. Stack: SSIS for ETL, SQL Server warehouse, SSAS cubes, Power BI.
**Result.** Product managers got a single end-to-end view down to the SKU and part level and could self-serve instead of waiting on manual analysis. It surfaced duplicate and inconsistent SKUs, helping inventory consolidation and faster delivery, and the unified denormalized layer became the AI-ready foundation for the "talk to your data" vision.
**Learning.** The same data sitting in silos with inconsistent attribution can't answer business questions, let alone power AI. Unifying it and modeling it for how people actually ask questions is what makes self-service and talk-to-data possible.

---

## Additional Projects (brief — STARL versions coming)

### Context Scaling for Agents (Atlan, ongoing)
A retail customer on Snowflake + Salesforce + Tableau said "we can build agents, but we can't scale them." Each team hand-curated its own Snowflake Cortex semantic models; no shared context across agents. Rohit identified two root causes: context bootstrapping (no single source of truth → wrong answers) and context portability (every new agent started from scratch). Solution: connect sources into Atlan (metadata only), enrich the metadata, build a context repo (semantic model + skills), deploy via Snowflake Cortex or Atlan MCP.

### Source-Agnostic Agentic Migration Tool (Atlan)
Every SA was writing their own migration scripts for customers moving from Alation, Collibra, DataHub into Atlan. Rohit built one source-agnostic agentic tool: a markdown instruction file per source captures how that source behaves; the agent reads it and generates live migration code — given the right knowledge, tools, and skills. Impact: migration from weeks to days; pre-sales analysis cut ~2 hours per cycle. Lesson: if a problem keeps recurring, solve it once for all.

### LLM Evaluation Pipeline (Atlan)
Any system output is judged by a second LLM against a human-curated golden dataset (e.g., golden SQL for talk-to-data). The judge follows rubrics and scores output, with observability, traceability, and a human feedback loop. Tools: Braintrust, LangChain, LangGraph. Benchmarked AI-generated vs human metadata across ~500 columns (0.88 vs 0.66 in less-curated layers).
