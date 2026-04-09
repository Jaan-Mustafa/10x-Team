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

## Usage Examples

```
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
└── README.md
```

## Adding Custom Skills

Create a new folder under `skills/` with a `SKILL.md` file:

```
skills/my-role/SKILL.md
```

Then reload plugins with `/reload-plugins`.

## License

MIT
