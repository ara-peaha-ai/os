---
title: "AI"
description: 
entityLink: "entities/eas"
entity: "Verein/EAS"
badge: ["R&D", "MIT/Prop"]
---

- Git-based memory, self-hosted or on GitHub: Markdown, AI-driven and indexed with graphify, with granular sharing.
- We orchestrate commercial and self-hosted models through MCP and APIs.

<!--more-->

**Memory.** The company's knowledge lives in a Git repository, self-hosted or on GitHub, in Markdown. Every change is a commit: who changed what, when and why.

**Index.** graphify builds the graph of the repository's knowledge nodes, so every task starts only from the information it needs.

**Granular sharing.** Public and private are split by file name, by market and by audience: you share only what you decide to share.

**Orchestration.** A lightweight router picks the prompt, takes from the graph only the information and files it needs and sends the bundle to the model that does the work, commercial or self-hosted, through MCP or APIs. The result comes back to the router.

**Minimal exposure.** After every call the commercial model's session memory is wiped and each call carries one isolated task: no conversation holds the full picture of the company. Calls still go through one API account and may be logged; spreading the work across several vendors and local models limits how much any one of them sees.

**Router decisions.** Today on the Vercel AI SDK, moving to Laya, an open-source, self-hosted replacement for TypeSafe AI's Jev: it answers typed questions with structured, repeatable answers instead of writing text.
