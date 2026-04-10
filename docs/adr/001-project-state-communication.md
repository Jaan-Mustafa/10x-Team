# ADR-001: File-Based Project State for Skill Communication

**Status:** Proposed  
**Date:** 2026-04-10  
**Author:** Md Rizabul

## Context

The 10x-Team plugin has 12 specialized skills (CTO, PM, Architect, etc.) and 1 orchestrator. Each skill runs in an isolated conversation — there is no shared memory between them.

**The problem:** When `/cto` decides "Use Razorpay", and later `/sde` starts coding, the SDE has no idea what the CTO decided. Every role starts blind.

**What we need:**
1. Roles must know what other roles decided
2. Roles must know the current project phase and progress
3. Roles must pass context to the next role in the workflow

## Decision

Use a **file-based project state system** with 3 structured files stored in the user's project directory. Every skill reads before acting and writes after deciding.

### State Files

```
.10x/
├── decisions.md        # What was decided, by whom, and why
├── status.md           # Current phase, task progress, blockers
└── handoff.md          # Context passed from one role to the next
```

## How Each Role Communicates

### Communication Flow Map

```
                    ┌──────────┐
                    │   CTO    │
                    │ Strategy │
                    └────┬─────┘
                         │ writes: build/buy decision, tech direction
                         v
                  ┌──────────────┐
                  │Product Manager│
                  │  Requirements │
                  └──────┬───────┘
                         │ writes: user stories, scope, success criteria
                         v
              ┌─────────────────────┐
              │ Principal Architect  │
              │   System Design     │
              └─────────┬───────────┘
                        │ writes: architecture, components, data flow
                        v
               ┌────────────────┐
               │ Staff Engineer  │
               │  Standards     │
               └───────┬────────┘
                       │ writes: patterns, quality standards, cross-cutting concerns
                       v
            ┌──────────────────┐
            │Engineering Manager│
            │   Planning       │
            └────────┬─────────┘
                     │ writes: task breakdown, estimates, sequencing
                     v
        ┌────────────────────────────┐
        │  Implementation Layer      │
        │                            │
        │  Senior Engineer ←→ SDE    │
        │       ↕            ↕       │
        │      DBA    Security Eng   │
        └────────────┬───────────────┘
                     │ writes: code decisions, schema, security findings
                     v
            ┌────────────────┐
            │   QA Engineer   │
            │   Verification  │
            └───────┬────────┘
                    │ writes: test results, quality gates, coverage
                    v
        ┌───────────────────────┐
        │   Delivery Layer      │
        │                       │
        │  DevOps Eng ←→ SRE   │
        └───────────────────────┘
              writes: deploy config, monitoring, runbooks
```

## What Each Role Reads and Writes

### 1. CTO

| | Details |
|---|---------|
| **Reads** | Nothing (first in chain) or previous CTO decisions for consistency |
| **Writes to decisions.md** | Strategic direction, build vs buy verdict, tech stack choices, risk assessment |
| **Writes to handoff.md** | Business context, constraints, budget, timeline for PM and Architect |
| **Example decision** | `"Use Razorpay over Stripe — lower fees for India, better UPI. Trade-off: weaker international."` |

### 2. Product Manager

| | Details |
|---|---------|
| **Reads** | CTO decisions (strategy, constraints, what's approved) |
| **Writes to decisions.md** | Feature scope, user stories, MVP definition, success criteria, what's NOT in scope |
| **Writes to handoff.md** | Requirements, acceptance criteria, priority order for Architect |
| **Example decision** | `"MVP: payment checkout + webhook handler. Out of scope: subscription billing, refund UI."` |

### 3. Principal Architect

| | Details |
|---|---------|
| **Reads** | CTO decisions (tech direction), PM decisions (requirements, scope) |
| **Writes to decisions.md** | System architecture, component boundaries, API contracts, data flow, failure modes |
| **Writes to handoff.md** | Architecture diagram, component list, integration points for Staff Engineer and EM |
| **Example decision** | `"Event-driven architecture. Payment service → webhook queue → processor. Idempotency keys required."` |

### 4. Staff Engineer

| | Details |
|---|---------|
| **Reads** | Architect decisions (system design), existing codebase patterns |
| **Writes to decisions.md** | Coding standards for this project, patterns to follow, cross-cutting concerns (logging, error handling) |
| **Writes to handoff.md** | Pattern guide, example code references, tech debt notes for Senior Engineer and SDE |
| **Example decision** | `"Follow existing repository pattern. Use zod for validation. Error handling: Result type, not exceptions."` |

### 5. Engineering Manager

| | Details |
|---|---------|
| **Reads** | PM decisions (scope), Architect decisions (complexity), Staff decisions (standards) |
| **Writes to decisions.md** | Task breakdown, estimates, sequencing, dependency order, risk flags |
| **Writes to status.md** | Initial task list with phases, sets project to "Planning Complete" |
| **Writes to handoff.md** | Ordered task list with approach notes for Senior Engineer and SDE |
| **Example decision** | `"5 tasks, 3 days. Start: DB schema → API routes → webhook handler → tests → deploy config."` |

### 6. Senior Engineer

| | Details |
|---|---------|
| **Reads** | Architect decisions (design), Staff decisions (patterns), EM decisions (task list) |
| **Writes to decisions.md** | Implementation approach per task, code review findings, refactoring decisions |
| **Writes to handoff.md** | Specific file paths, function signatures, gotchas for SDE |
| **Example decision** | `"Webhook handler: use existing express middleware pattern in src/middleware/. Add signature verification first."` |

### 7. SDE

| | Details |
|---|---------|
| **Reads** | ALL prior decisions (needs full context to code correctly) |
| **Writes to decisions.md** | Implementation details — what was actually built, deviations from plan, tech debt created |
| **Writes to status.md** | Updates task progress (in progress → done) |
| **Writes to handoff.md** | What was built, what to test, what to review for QA and Security |
| **Example decision** | `"Built webhook handler at src/services/payment/webhook.ts. Deviation: added retry queue (wasn't in plan, but needed for reliability)."` |

### 8. DBA

| | Details |
|---|---------|
| **Reads** | Architect decisions (data flow), PM decisions (data requirements), SDE progress (what queries are being written) |
| **Writes to decisions.md** | Schema design, indexing strategy, migration plan, query optimization notes |
| **Writes to handoff.md** | Schema file paths, migration commands, performance notes for SDE and SRE |
| **Example decision** | `"payments table: composite index on (merchant_id, created_at). Migration: add column with default, backfill async."` |

### 9. Security Engineer

| | Details |
|---|---------|
| **Reads** | Architect decisions (attack surface), SDE progress (what's been built), DBA decisions (data handling) |
| **Writes to decisions.md** | Threat model findings, auth/authz design, vulnerabilities found, compliance requirements |
| **Writes to handoff.md** | Security fixes needed, hardening checklist for SDE, infra hardening for DevOps |
| **Example decision** | `"CRITICAL: Webhook signature not verified. Add HMAC-SHA256 check before processing. Rate limit: 100 req/s per merchant."` |

### 10. QA Engineer

| | Details |
|---|---------|
| **Reads** | PM decisions (acceptance criteria), SDE progress (what was built), Security findings (what to stress-test) |
| **Writes to decisions.md** | Test strategy, coverage assessment, quality gate results, bugs found |
| **Writes to status.md** | Test results, pass/fail status, blocking bugs |
| **Writes to handoff.md** | Test report, remaining risks, release readiness for DevOps |
| **Example decision** | `"Integration tests pass. Edge case: duplicate webhook with same idempotency key — verified handled. Coverage: 87%."` |

### 11. DevOps Engineer

| | Details |
|---|---------|
| **Reads** | Architect decisions (infrastructure needs), QA results (release readiness), Security findings (infra hardening) |
| **Writes to decisions.md** | CI/CD pipeline design, deployment strategy, environment config, rollback plan |
| **Writes to handoff.md** | Deploy commands, environment URLs, rollback procedure for SRE |
| **Example decision** | `"Blue-green deploy via GitHub Actions. Health check: /api/health. Rollback: revert to previous tag."` |

### 12. SRE

| | Details |
|---|---------|
| **Reads** | ALL decisions (needs full system understanding), DevOps config (infrastructure), Security findings (incident detection) |
| **Writes to decisions.md** | SLO definitions, monitoring strategy, alert rules, runbook references |
| **Writes to status.md** | Production readiness assessment, final sign-off |
| **Writes to handoff.md** | Runbook location, dashboard URLs, escalation path |
| **Example decision** | `"SLO: 99.9% webhook processing within 5s. Alert: >1% failure rate over 5min. Runbook: docs/runbooks/payment-webhook.md."` |

## File Structures

### decisions.md

```markdown
# Project Decisions

## Project: [Name]
Started: [Date]

---

### [Date] — [Role]: [Decision Title]
- **Decision:** What was decided
- **Why:** Business/technical justification
- **Alternatives considered:** What else was evaluated
- **Trade-offs accepted:** What we're giving up
- **Impacts:** Which roles/components this affects
- **Status:** Active | Superseded by [link]
```

### status.md

```markdown
# Project Status

## Project: [Name]
**Current Phase:** [Brainstorming | Strategy | Design | Planning | Implementation | Verification | Delivery]
**Last Updated:** [Date] by [Role]
**Health:** [On Track | At Risk | Blocked]

## Progress

### Done
- [x] CTO: Technology strategy decided
- [x] PM: Requirements defined, MVP scoped

### In Progress
- [ ] Architect: System design (70%)
- [ ] DBA: Schema design started

### Pending
- [ ] EM: Task breakdown
- [ ] SDE: Implementation
- [ ] QA: Test plan

### Blocked
- [ ] DevOps: Waiting on AWS credentials (blocker: need admin approval)

## Risks
- [Risk description] — Owner: [Role] — Mitigation: [Plan]
```

### handoff.md

```markdown
# Current Handoff

## From: [Role] → To: [Next Role(s)]
**Date:** [Date]
**Phase:** [Current Phase] → [Next Phase]

### Context
What was just completed and why.

### Key Decisions Made
- Decision 1
- Decision 2

### What You Need to Know
Critical context the next role must have.

### Files Changed / Created
- path/to/file — what it does

### Open Questions
Things the next role should resolve.

### Watch Out For
Known risks, gotchas, or constraints.

---

## Handoff History
### [Date] — [Role] → [Role]: [Summary]
### [Date] — [Role] → [Role]: [Summary]
```

## Skill Protocol

Every skill will have these instructions added:

```markdown
## Project State Protocol

### Before You Start (EVERY time)
1. Check if `.10x/` directory exists — if not, tell user to run `/init-project`
2. Read `.10x/decisions.md` — understand what's been decided
3. Read `.10x/status.md` — understand current phase and progress
4. Read `.10x/handoff.md` — understand what the previous role passed to you

### Before You Finish (EVERY time)
1. Write your decisions to `.10x/decisions.md` — append, never overwrite others
2. Update `.10x/status.md` — mark your tasks done, update phase if transitioning
3. Write handoff in `.10x/handoff.md` — context for the next role
4. Commit state files with message: "state([role]): [what changed]"
```

## Role Dependency Matrix

Who needs information from whom:

```
                CTO  PM  Arch Staff  EM  Senior SDE  DBA  Sec  QA  DevOps SRE
CTO              -    .    .    .    .     .     .    .    .    .     .     .
PM               R    -    .    .    .     .     .    .    .    .     .     .
Architect        R    R    -    .    .     .     .    .    .    .     .     .
Staff Eng        .    .    R    -    .     .     .    .    .    .     .     .
Eng Manager      .    R    R    R    -     .     .    .    .    .     .     .
Senior Eng       .    .    R    R    R     -     .    .    .    .     .     .
SDE              R    R    R    R    R     R     -    R    R    .     .     .
DBA              .    R    R    .    .     .     R    -    .    .     .     .
Security Eng     .    .    R    .    .     .     R    R    -    .     .     .
QA               .    R    .    .    .     .     R    .    R    -     .     .
DevOps           .    .    R    .    .     .     .    .    R    R     -     .
SRE              R    .    R    .    .     .     .    R    R    .     R     -

R = Reads decisions from that role
. = No direct dependency
```

**Key insight:** SDE reads from almost everyone — it's the convergence point where all decisions become code.

## Information Storage Summary

| Role | Stores in decisions.md | Stores in status.md | Stores in handoff.md |
|------|----------------------|--------------------|--------------------|
| **CTO** | Strategy, build/buy, tech stack, risk | Phase: Strategy | Business context → PM, Architect |
| **PM** | Scope, user stories, MVP, success criteria | Phase: Strategy | Requirements → Architect |
| **Architect** | Architecture, components, APIs, data flow | Phase: Design | System design → Staff, EM |
| **Staff Eng** | Patterns, standards, cross-cutting concerns | — | Pattern guide → Senior, SDE |
| **EM** | Task breakdown, estimates, sequence | Phase: Planning, task list | Task list → Senior, SDE |
| **Senior Eng** | Implementation approach, code review | Task progress | File paths, gotchas → SDE |
| **SDE** | What was built, deviations, tech debt | Task progress (done/in-progress) | What to test → QA, Security |
| **DBA** | Schema, indexes, migrations, query notes | Task progress | Schema paths → SDE, SRE |
| **Security** | Threat model, vulns, auth design, compliance | Blocking bugs if critical | Fixes needed → SDE, DevOps |
| **QA** | Test strategy, coverage, bugs, quality gates | Test results, release readiness | Test report → DevOps |
| **DevOps** | CI/CD, deploy strategy, infra, rollback plan | Deploy status | Deploy commands → SRE |
| **SRE** | SLOs, monitoring, alerts, runbooks | Production readiness sign-off | Runbook, dashboards → team |

## Consequences

**Positive:**
- Every role has full context from prior decisions
- Project state survives across conversations
- State is version-controlled (committed to git)
- Human-readable — user can review and edit state directly
- No infrastructure needed — just markdown files

**Negative:**
- Skills must follow the protocol — if they skip reading/writing, state breaks
- State files can get long for complex projects
- No automatic enforcement — relies on skill instructions being followed
- Merge conflicts possible if multiple conversations touch state simultaneously

**Mitigations:**
- Append-only pattern for decisions.md reduces conflicts
- Each role has clear ownership of what it writes
- State files are committed per-role, making history traceable

## Alternatives Considered

| Approach | Why Not |
|----------|---------|
| CLAUDE.md | Gets cluttered, no structure, not portable |
| Memory system | Only works for one user's Claude, not portable |
| MCP server | Over-engineered for this use case, requires infrastructure |
| Hooks | Too limited for structured state management |

## Next Steps

1. Create `/init-project` command that scaffolds `.10x/` directory
2. Add Project State Protocol to all 13 skills
3. Update orchestrator to manage state transitions across phases
4. Update README with documentation
