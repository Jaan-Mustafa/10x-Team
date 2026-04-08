# 10x-Team

A Claude Code plugin for the 10x-Team project.

## Structure

```
10x-Team/
├── .claude-plugin/
│   └── plugin.json         # Claude Code plugin manifest
├── hooks/
│   ├── hooks.json          # Hook event definitions
│   ├── run-hook.cmd        # Cross-platform hook runner
│   └── session-start       # Injects skills on startup
├── skills/
│   ├── using-10x-team/
│   │   └── SKILL.md        # Entry point — lists all skills
│   └── my-skill/
│       └── SKILL.md        # Starter skill template
└── README.md
```

## Getting Started

1. Install this plugin in Claude Code
2. Skills are automatically loaded on session start via the `session-start` hook
3. Add new skills by creating folders under `skills/` with a `SKILL.md` file
