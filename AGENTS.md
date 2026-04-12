# AGENTS.md

Guidance for AI coding agents (Claude Code, Cursor, Copilot, Codex, etc.) contributing to **10x-Team**, a Claude Code plugin that ships 12 role-based skills (CTO, Architect, SRE, Security, etc.) plus an orchestrator.

## What this repo is

A plugin, not an application. There is no runtime, no server, no build step. The "code" is Markdown: each skill is a `SKILL.md` file with frontmatter plus a prescribed section layout that the Claude Code harness loads on demand.

Treat `SKILL.md` files as the product. Prose quality, structure, and adherence to the skill template matter more than cleverness.

## Repository layout

```
skills/<role>/SKILL.md    # the 12 role skills + the /10x-team orchestrator
commands/                 # slash-command definitions (e.g. init-project.md)
agents/                   # agent definitions
tests/validate-skills.test.js   # structural validator — run before committing skill changes
docs/adr/                 # architecture decision records
personalDocs/             # author notes; do not modify unless asked
.claude-plugin/           # plugin + marketplace manifest (only touch when releasing)
```

State written at runtime by the skills themselves lives under `.10x/` in the *consuming* project, not in this repo. Do not create `.10x/` here.

## Required SKILL.md structure

Every skill file must contain, in order:

1. YAML frontmatter with `name` and `description`
2. `# Role Title` + one-line summary
3. `<HARD-GATE>` block stating what must happen before recommendations
4. `## Anti-Pattern: "..."` section
5. `## Checklist`
6. `## Process Flow`
7. `## The Process`
8. `## Project State Protocol` with **Before You Start** and **Before You Finish** subsections that read/write `.10x/decisions/<role>.md`
9. `## Key Principles`
10. `## Anti-Patterns to Flag`
11. `## Tone`

The validator in `tests/validate-skills.test.js` enforces this. Run it after any skill edit:

```bash
node tests/validate-skills.test.js
```

## Conventions for agents

- **Edit existing files over creating new ones.** New skills need explicit user approval — this plugin's value comes from a curated set of roles, not quantity.
- **Preserve the file-based handoff model.** Every role reads its upstream decisions from `.10x/decisions/` before acting and writes its own decisions after. Do not introduce in-memory state, globals, or cross-skill imports.
- **No code beyond what's here.** This repo is Markdown + one Node validator. Don't add package managers, build tooling, TypeScript configs, or frameworks without being asked.
- **Match the existing voice of each role.** The CTO skill speaks strategically; the SDE skill speaks tactically. Read the surrounding file before editing.
- **Frontmatter `description` is load-bearing** — it's how the harness decides when to trigger the skill. Keep it specific and trigger-oriented ("Use this when...").
- **Don't weaken hard gates.** They exist so roles refuse to answer without required context. If a gate feels wrong, raise it in discussion rather than silently removing it.

## Before committing

1. Run `node tests/validate-skills.test.js` if any `skills/**/SKILL.md` changed.
2. Keep commits focused — one skill or one concern per commit.
3. Commit messages: short, imperative, lowercase verb ("fix sre hard gate", "add dba anti-pattern"). Match recent `git log` style.
4. Do not add a `Co-Authored-By` trailer.

## Out of scope without explicit request

- Adding new roles / skills
- Restructuring `.claude-plugin/` manifests or bumping versions
- Touching `LICENSE`, `PRIVACY.md`, `CODE_OF_CONDUCT.md`
- Editing `personalDocs/`
- Introducing any runtime dependency

## When in doubt

Read `README.md` for the product model, read a neighboring `SKILL.md` for the house style, then make the smallest change that satisfies the request.
