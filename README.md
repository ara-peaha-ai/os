# wisdom

**One key. Your money, your knowledge, your AI.**

*Ára Pe'aha Aĩ* is Guaraní for "your time, your key, your AI". wisdom is the public face of that idea: it publishes what a company knows, straight from the one place where the company keeps all of it.

## Where we're going

We build self-custodial payment and AI tools for businesses in **emerging markets**, starting from **Paraguay**, where we operate and validate every rail, then the rest of Mercosur and LatAm.

- **PAY:** Bitcoin and stablecoins, plus the fiat rails around them, so a sale can come from a crypto-native or a traditional client and settle in the currency that is needed. Payments from 5 to 500,000 dollars: self-hosted from our MIT repos (mainly Bitcoin) with no fee, for AI agents and small informal freelancers; or proprietary rails up to 500,000 dollars (Paraguay and Argentina today, the rest of Latin America next), in our cloud with a decreasing per-payment fee or on a managed VPS by monthly subscription.
- **AI:** Git-based memory (self-hosted or GitHub), Markdown and AI-driven, indexed with graphify, with granular sharing; commercial and self-hosted models orchestrated through MCP and APIs, without handing the company's know-how to the model vendors.
- **COMPLIANCE:** internationalization through US LLCs, from 99 dollars up to enterprise compliance management on dedicated servers, with localized domains (for example Suriname and Paraguay).

We only pick verticals with real use cases and revenue in sight:

| Vertical | Status |
|---|---|
| Real estate: payments for builders and agencies selling to international buyers | live in Paraguay, first paying clients; talks in Brazil and Chile |
| E-commerce of goods and services: a personal trainer, a pizza delivery, an underwear shop | alpha (personal trainer), in development (pizza delivery), defining (underwear shop) |
| Agriculture (Mennonite communities) | exploring |

**The goal: a tokenized Paraguayan investment fund** on real estate and land, built on the real estate vertical (shared property sales first, then the fund, roadmap Q1 2028).

## The problem

A company's know-how is scattered across Notion, Drive, Slack, email and the heads of people who eventually leave. AI tools add one more silo: every chat starts from zero, the lessons stay in a vendor's memory, and what you teach a commercial model can end up training someone else's product.

## The model

**1. One source of truth.** Everything the company knows lives in a single git repo, the *sovereign* repo: strategy, operations, dev docs, sales copy, web pages. It is plain Markdown and YAML, with no database and no SaaS lock-in. Private (`*.pri.md`) and public content sit side by side, and the split is made by file name, not by tool.

**2. History is the audit log.** Every change is a commit that records who changed what, when and why. Decisions can be traced, compared and reverted. Nothing is overwritten silently.

**3. Tasks live inside the knowledge.** Humans and AI agents give each other work in the text itself, right where the context is, with no separate ticketing tool:

- A `##todo` marker on a line, a table cell or in frontmatter is an instruction addressed to one or more handles: a person (`@name`) or an agent (`@ai`).
- `#pri` sets the priority, `!<when>` the deadline, and `##event` schedules something in time.
- `#master` marks the canonical copy of a name or a text; every other copy is realigned to it.
- An `@ai` todo is carried out by an agent and replaced in place with its outcome. A todo that mixes a human and `@ai` is worked on together, when the human decides to start. A human-only todo is never touched by an agent.
- When an agent cannot finish a todo, it leaves the marker in place, rewritten as a precise blocking question. It never makes up an answer.
- Open todos are rolled up into one list per person.

**Orchestration: a CPU router between your memory and any AI.** Two repos, two roles: *wisdom* (this one) is the engine, public and MIT; *sovereign* is the memory, private. The sovereign repo gets its own knowledge graph (built with [graphify](https://github.com/Graphify-Labs/graphify)) whose nodes map everything the company knows. A small router model runs on a plain CPU, on a home machine or a low-cost VPS. For each task it picks the prompt, pulls only the nodes and files that task needs from the graph, and routes the bundle to the AI that does the heavy work: a commercial model (Claude, GPT, Grok) through its API, or an open-source model on a GPU switched on only when there is work. The result comes back to the router, and the commercial model's session memory is wiped after every call. No vendor ever sees more than one isolated task, so no vendor can link calls together and build a profile of the company: this is anti-surveillance by design, against the data harvesting of big-tech AI. The markers and the skills do not depend on which model does the job.

The router runs on the [Vercel AI SDK](https://ai-sdk.dev) today. Routing decisions are moving to [Laya](https://github.com/NandhaKishorM/laya), an open-source (Apache-2.0) replacement for TypeSafe AI's Jev that runs self-hosted on a CPU. Laya doesn't write text: it answers typed questions (yes/no, one of N, a score) with a confidence value, much cheaper and faster than an LLM.

**4. Skills that improve themselves.** A skill is a versioned Markdown procedure: the instructions, the workflow, the mistakes to avoid. When a task teaches something new (a fix, a correction, a better path), the orchestrator writes that finding back into the skill and commits it. The next run, whether by an agent or a human, starts from what was learned last time, never from zero. Every update is a commit, so the skill's history can be traced and reverted like any other knowledge. The next company that adopts the framework gets those skills too.

**5. Write once, in any language.** Authors write in `original`, in whatever mix of languages comes naturally. A translator that runs on a plain CPU regenerates every published locale on each push. `original` itself is never published.

**6. One key.** In payments, self-custody means that whoever holds the seed holds the funds and no intermediary can freeze them. The same principle extends to knowledge and AI: one seed as the root of identity for the wallets, the knowledge repo and the agents working on it. Nothing is handed over to a platform, and nothing is fed to a model vendor.

**7. Dogfooded.** The company building this runs on it every day. This repo, its docs and its task lists are managed with the model described above.

| Piece | Status |
|---|---|
| Knowledge as Markdown in git, private/public split by file name | live |
| `##todo` / `##event` / `#pri` / `!<when>` / `#master` markers, AI resolution in place | live (Claude Code) |
| Knowledge graph of the sovereign repo (graphify) | testing |
| Router with per-call memory wipe on commercial models (Vercel AI SDK today, routing decisions on Laya, open-source replacement for TypeSafe AI's Jev) | planned |
| Versioned agent skills | live |
| Skills updated automatically with each task's findings | defining |
| Per-person todo roll-up | early |
| Public site rendered from the sovereign repo | homepage live (translated by hand into `content/<locale>/` until the CI fetch exists), full site dev preview only |
| CPU-based automatic translation on push | not built yet |
| `/sync-data` skill: one command propagates each sovereign change to every locale, homepage list, navbar and README, with no line-by-line manual review | planned |
| Self-hosted git host (Gitea or GitLab, not chosen) instead of GitHub | planned |
| One seed for payments, knowledge and AI | design goal |

---

## wisdom: the engine

Nuxt 4 rendering engine for multilingual content sites. It is moving from a site with its own bundled `content/` to an engine that renders content pulled from a separate **sovereign** repo (one sovereign repo per deployment).

Stack: Nuxt 4, Nuxt Content v3 (Cloudflare D1), Nuxt UI v4, `@nuxtjs/i18n`, Cloudflare Pages.

## Target model

```
sovereign repo (private)                       wisdom (this repo, public)
  content/original/**   mixed languages ──┐
                        never published   │ AI translation (CPU-capable model),
                                          │ runs on every push that touches original
  content/<locale>/web/** ◄───────────────┘
  i18n/<locale>.json
  web-specs.yaml   (locales, navbar, footer) ──►  build: fetch, filter, render
  *.pri.md         private, never fetched
```

- Authors write only in `content/original`, in any mix of languages.
- On push to the git host (GitHub today, self-hosted Gitea or GitLab on our VPS later), the translations under `content/<locale>/` are regenerated.
- wisdom fetches only the public translated trees, never `original` and never `*.pri.md`, and renders them.

## Status

### Done

- Site renders from the local `content/` in three locales (`int`, `lat`, `br`), one domain per locale.
- Settlement simulator: providers, rails and per-country config in `server/utils/`.
- Content components for sovereign pages: `::content-boxes`, `::country-badges`, page timeline, country picker, fee simulator (`app/components/content/`).
- Cloudflare Pages deploy on push to `main`, a preview deploy per PR, and cleanup of previews.
- **Dev-only** sovereign preview: `npm run dev:content` reads `content/original/web/**` straight from a sibling sovereign checkout on disk and serves it at `/` (see `content.config.js`).
- `socials.pub.yaml` from sovereign is read at build time when the checkout is present.

### Not done

- [ ] **Fetch in CI:** check out the (private) sovereign repo in the deploy workflow, authenticated through the GitHub App (key already provisioned, unused).
- [ ] **Production source:** point `content.config.js` at `content/<locale>/web/**/*.md`, excluding `**/*.pri.md` and `content/original/**`.
- [ ] **Remote settings:** read locales, default locale, domains, navbar and footer from sovereign's `web-specs.yaml` instead of hardcoding them in `nuxt.config.js`.
- [ ] **Remote UI strings:** use sovereign's `i18n/<locale>.json` instead of `i18n/locales/`.
- [ ] **Generic pages:** replace the hand-written Vue pages (`app/pages/services/**`, `coin-2-property.vue`, …) with templates driven by the sovereign folder structure.
- [ ] **Media:** decide the public/private convention for sovereign's `public/` before syncing any of it.
- [ ] **Translation pipeline (not built yet):** on push, a CPU-capable AI translator regenerates each locale from the changed `original` files. Model not chosen yet. It lives with the sovereign repo, not here.
- [ ] **Self-hosted git:** pick Gitea or GitLab, then move the fetch and the translation trigger from GitHub to our VPS. Keep GitHub-specific code isolated until then.
- [ ] Remove the local `content/`, `i18n/locales/` and the site-specific `public/` assets once the remote path is live.

## Development

```bash
npm install
npm run dev            # local content/, needs *.peaha.local in /etc/hosts
npm run dev:content    # dev preview of ../../<project>/sovereign (default project: peaha_ai)
content=fantasia_lat npm run dev:content
```

Adding a country to the settlement simulator: [`docs/ADDING_A_COUNTRY.md`](docs/ADDING_A_COUNTRY.md).

| Variable | Purpose |
|---|---|
| `NUXT_ENABLE_SOVEREIGN_PREVIEW` | `true` enables the dev-only sovereign preview |
| `NUXT_SOVEREIGN_CONTENT_DIR` | path to the sovereign checkout (default `../sovereign`) |
| `NUXT_PUBLIC_IS_PREVIEW` | `true` on PR previews: path prefixes instead of per-locale domains |

## Deploy

GitHub Actions deploys with `wrangler` (`.github/workflows/`). The workflows need, in the `github-cloudflare` environment:

- `CLOUDFLARE_API_TOKEN` (secret): Pages Edit and D1 Edit
- `CLOUDFLARE_ACCOUNT_ID` (variable)
