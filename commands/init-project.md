# /init-project — Initialize Project State for 10x-Team

Set up the shared project state files that enable communication between all 10x-Team skills.

## Steps

1. **Check if state already exists** — Look for a `.10x/` directory in the project root. If it exists, tell the user and ask if they want to reset it.

2. **Create the `.10x/` directory** and three state files:

### `.10x/decisions.md`

```markdown
# Project Decisions

> This file is the shared brain of the 10x-Team. Every role reads it before acting and writes to it after deciding. Append only — never delete or overwrite another role's decisions.

## Project: [Ask user for project name]
Started: [Today's date]

---

<!-- Decisions are appended below by each role. Format:
### [Date] — [Role]: [Decision Title]
- **Decision:** What was decided
- **Why:** Business/technical justification
- **Alternatives considered:** What else was evaluated
- **Trade-offs accepted:** What we're giving up
- **Impacts:** Which roles/components this affects
-->
```

### `.10x/status.md`

```markdown
# Project Status

## Project: [Same project name]
**Current Phase:** Brainstorming
**Last Updated:** [Today's date] by init-project
**Health:** On Track

## Progress

### Done
(none yet)

### In Progress
(none yet)

### Pending
- [ ] CTO: Strategic direction and tech decisions
- [ ] PM: Requirements and scope definition
- [ ] Architect: System design
- [ ] Staff Engineer: Coding standards and patterns
- [ ] EM: Task breakdown and estimation
- [ ] Senior Engineer: Implementation planning
- [ ] SDE: Code implementation
- [ ] DBA: Schema and data modeling
- [ ] Security: Threat model and security review
- [ ] QA: Test strategy and verification
- [ ] DevOps: CI/CD and deployment
- [ ] SRE: Monitoring and reliability

### Blocked
(none)

## Risks
(none identified yet)
```

### `.10x/handoff.md`

```markdown
# Current Handoff

> This file tracks the context passed from one role to the next. Each role overwrites the "Current Handoff" section when passing work forward. Previous handoffs are preserved in the History section below.

## From: init-project → To: First active role
**Date:** [Today's date]
**Phase:** Setup → Brainstorming

### Context
Project state initialized. Ready for the first role to begin work.

### Open Questions
- What are we building?
- What problem does this solve?
- Who is the target user?

---

## Handoff History
(none yet)
```

3. **Add `.10x/` to `.gitignore` check** — Ask the user: "Should I add `.10x/` to `.gitignore` (private state) or leave it tracked (shared with team)?" Default to tracked.

4. **Commit the state files** — Stage and commit with message: `chore(10x): initialize project state`

5. **Confirm** — Tell the user: "Project state initialized. All 10x-Team skills will now read and write to `.10x/` to share decisions, track progress, and pass context between roles."
