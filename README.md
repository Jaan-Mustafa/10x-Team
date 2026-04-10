# 10x-Team

A Claude Code plugin that gives you an entire engineering team as skills. Ask questions and get responses from the perspective of a CTO, Principal Architect, Staff Engineer, SRE, and more.

## Install

### Option A: Claude Code Plugin (recommended)

From within Claude Code, first add the marketplace:

```
/plugin marketplace add Jaan-Mustafa/10x-Team
```

Then install the plugin:

```
/plugin install 10x-Team@10x-Team-dev
```

This installs the entire team as a Claude Code plugin, making all skills available across all your projects.


## Available Skills

### Orchestrator

| Skill | Role | Use When |
|-------|------|----------|
| `/10x-team` | **Full Team Orchestrator** | **Building projects end-to-end — automatically switches between all 12 roles** |

Use `/10x-team` when you want the full team working together. It moves through strategy, design, planning, implementation, testing, and deployment — thinking as the right specialist at each phase.

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

## Project State — How Roles Communicate

Skills share context across conversations through a file-based state system in `.10x/`.

### Setup

```
> /init-project
```

This creates three state files:

| File | Purpose | Who Writes |
|------|---------|------------|
| `.10x/decisions.md` | Decision log — what was decided, by whom, why | Every role appends after deciding |
| `.10x/status.md` | Progress tracker — current phase, tasks, blockers | Every role updates after acting |
| `.10x/handoff.md` | Role-to-role context — what the next role needs to know | Every role writes before finishing |

### How It Works

```
/cto decides "Use Razorpay"
  → writes decision to .10x/decisions.md
  → writes handoff context for PM and Architect

/principal-architect designs the payment service
  → reads CTO decision from .10x/decisions.md ✓
  → reads handoff context from .10x/handoff.md ✓
  → designs with full context
  → writes architecture decisions + handoff for SDE

/sde implements the payment webhook
  → reads ALL prior decisions ✓
  → knows: Razorpay, event-driven architecture, schema design
  → codes with full team context
```

Every role reads state before acting and writes state after deciding. See [ADR-001](docs/adr/001-project-state-communication.md) for the full design.

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
│   ├── plugin.json            # Plugin manifest
│   └── marketplace.json       # Marketplace registry
├── skills/
│   ├── 10x-team/SKILL.md         # Orchestrator — uses all roles
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
├── agents/
├── commands/
│   └── init-project.md         # Initialize .10x/ project state
└── README.md
```

## Contributing — Add or Update Skills

### Adding a New Skill

1. Create a folder under `skills/` with a `SKILL.md` file:

```
skills/my-role/SKILL.md
```

2. Follow this structure in your `SKILL.md`:

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

## Key Principles
Core rules that guide the skill's behavior.

## Anti-Patterns to Flag
Common mistakes to call out.

## Tone
How the skill should communicate.
```

3. Reload plugins:

```
/reload-plugins
```

### Updating an Existing Skill

1. Edit the `SKILL.md` file in the relevant `skills/<role>/` folder
2. Keep the same structure — frontmatter, hard gate, checklist, process, principles
3. Reload plugins with `/reload-plugins`

## License

MIT
