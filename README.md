# 10x-Team

A Claude Code plugin that gives you an entire engineering team as AI skills. 12 specialized roles — CTO, Architect, SRE, Security Engineer, and more — that share context, track decisions, and hand off work to each other.

One developer. A full team's coverage.

## Install

From within Claude Code:

```
/plugin marketplace add Jaan-Mustafa/10x-Team
/plugin install 10x-Team@10x-Team-dev
/reload-plugins
```

## Available Skills

### Full Team

| Skill | Use When |
|-------|----------|
| `/10x-team` | **Building projects end-to-end** — brainstorms first, then moves through strategy, design, planning, implementation, testing, and deployment with hard gates at every phase |

### Individual Roles

| Skill | Role | Use When |
|-------|------|----------|
| `/cto` | Chief Technology Officer | Build vs buy, business case, technical strategy |
| `/product-manager` | Product Manager | Feature prioritization, user stories, roadmap |
| `/principal-architect` | Principal Architect | System design, architecture decisions |
| `/staff-engineer` | Staff Engineer | Cross-team technical decisions, code quality |
| `/senior-engineer` | Senior Engineer | Implementation guidance, code review |
| `/sde` | Software Development Engineer | Hands-on coding, debugging |
| `/devops-engineer` | DevOps Engineer | CI/CD, infrastructure, deployment |
| `/sre` | Site Reliability Engineer | Reliability, monitoring, incident response |
| `/security-engineer` | Security Engineer | Security review, threat modeling |
| `/dba` | Database Administrator | Schema design, query optimization |
| `/qa-engineer` | QA Engineer | Testing strategy, test plans |
| `/engineering-manager` | Engineering Manager | Team processes, sprint planning, delivery |

## How Roles Communicate

Skills share context across conversations through file-based project state in `.10x/`.

### Setup

```
/init-project
```

### State Structure

```
.10x/
├── status.md              # Current phase, task progress, blockers
├── handoff.md             # Context passed from one role to the next
├── decisions/             # One file per role
│   ├── cto.md             # Strategy, build/buy, tech stack
│   ├── product-manager.md # Requirements, scope, user stories
│   ├── architect.md       # System design, components, boundaries
│   ├── staff-engineer.md  # Patterns, standards, cross-cutting
│   ├── engineering-manager.md # Task breakdown, estimates
│   ├── senior-engineer.md # Implementation approach
│   ├── sde.md             # What was built, deviations, tech debt
│   ├── dba.md             # Schema, migrations, indexing
│   ├── security.md        # Threat model, vulnerabilities
│   ├── qa.md              # Test results, bugs, coverage
│   ├── devops.md          # CI/CD, deploy strategy, rollback
│   └── sre.md             # SLOs, monitoring, runbooks
├── specs/                 # Design docs from brainstorming
└── reviews/               # QA reports + security audits
```

### How It Works

```
/cto decides "Use Razorpay"
  → writes decision to .10x/decisions/cto.md
  → writes handoff context for PM and Architect

/principal-architect designs the payment service
  → reads CTO decision from .10x/decisions/cto.md
  → designs with full context
  → writes architecture to .10x/decisions/architect.md

/sde implements the payment webhook
  → reads ALL decision files
  → codes with full team context
  → writes what was built to .10x/decisions/sde.md
```

Every role reads its dependencies before acting and writes its decisions after completing work. The orchestrator (`/10x-team`) enforces this with hard gates at every phase transition.

## Usage Examples

```
> /10x-team Build me a URL shortener with analytics

> /cto Should we build our own payment system or use Razorpay?

> /principal-architect Design a notification service that handles 10M events/day

> /sre Our API latency spiked 3x after the last deploy — help me investigate

> /security-engineer Review this auth flow for vulnerabilities

> /dba We have a 50M row table and this query is slow — optimize it
```

## Project Structure

```
10x-Team/
├── .claude-plugin/
│   ├── plugin.json              # Plugin manifest
│   └── marketplace.json         # Marketplace registry
├── skills/
│   ├── 10x-team/SKILL.md       # Orchestrator — all 12 roles
│   ├── cto/SKILL.md
│   ├── product-manager/SKILL.md
│   ├── principal-architect/SKILL.md
│   ├── staff-engineer/SKILL.md
│   ├── senior-engineer/SKILL.md
│   ├── sde/SKILL.md
│   ├── devops-engineer/SKILL.md
│   ├── sre/SKILL.md
│   ├── security-engineer/SKILL.md
│   ├── dba/SKILL.md
│   ├── qa-engineer/SKILL.md
│   └── engineering-manager/SKILL.md
├── commands/
│   └── init-project.md          # Initialize .10x/ project state
├── tests/
│   └── validate-skills.test.js  # Skill structure validation
└── docs/
    └── adr/                     # Architecture decision records
```

## Contributing

Contributions are welcome! Whether it's improving an existing skill, adding a new role, fixing bugs, or improving documentation.

### Adding a New Skill

1. Create a folder under `skills/` with a `SKILL.md` file:

```
skills/my-role/SKILL.md
```

2. Follow this structure:

```markdown
---
name: my-role
description: "When this skill should be triggered and what it does."
---

# Role Title

One-line summary of what this skill helps with.

<HARD-GATE>
What must happen BEFORE giving recommendations.
</HARD-GATE>

## Anti-Pattern: "Common Mistake Title"
Why skipping the process causes problems.

## Checklist
Ordered steps the skill must follow.

## Process Flow
Visual flow of the decision process.

## The Process
Detailed guidance for each phase.

## Project State Protocol
### Before You Start (EVERY time)
Read relevant .10x/decisions/ files.
### Before You Finish (EVERY time)
Write your decisions to .10x/decisions/<role>.md.

## Key Principles
Core rules that guide the skill's behavior.

## Anti-Patterns to Flag
Common mistakes to call out.

## Tone
How the skill should communicate.
```

3. Run tests:

```bash
node tests/validate-skills.test.js
```

4. Reload plugins:

```
/reload-plugins
```

### Updating an Existing Skill

1. Edit the `SKILL.md` in `skills/<role>/`
2. Keep the same structure — frontmatter, hard gate, checklist, process, state protocol, principles
3. Run tests and reload

### Reporting Issues

Found a bug or have an idea? [Open an issue](https://github.com/Jaan-Mustafa/10x-Team/issues).

## License

MIT
