# AGENTS.md — Sira Project Context

> This file provides full context for any AI development partner (IBM Bob, Claude, Cursor, etc.)
> working on the Sira project. Read this before doing anything else.

---

## What is Sira?

**Sira** is an open source CLI scaffolding tool designed to be **AI-friendly by design**.

Most project scaffolding tools generate code and stop there. Sira goes further: every project it
creates is immediately ready to work with AI coding tools like IBM Bob, Claude Code, Cursor, and
GitHub Copilot — with context files, documentation stubs, and structured conventions built in
from day one.

The core idea: **the best moment to set up AI context is at project creation, not as an
afterthought.**

> Built during the IBM Bob Hackathon (May 2026) — Theme: "Turn idea into impact faster"

---

## The Problem Sira Solves

When a developer starts a new project today, they typically:
1. Run a scaffolding command (Vite, create-react-app, Express generator...)
2. Get a bare-bones file structure
3. Spend hours configuring tooling, writing docs, setting up conventions
4. Realize their AI coding tool has no project context and keeps giving generic answers

Sira collapses steps 2, 3, and 4 into the scaffolding step itself.

---

## Core Philosophy

- **AI-friendly by default** — every generated project includes CLAUDE.md, AGENTS.md, and
  .cursorrules with real, useful content (not empty stubs)
- **Named templates** — templates follow a mythological naming system (Greek gods) to make
  them memorable and distinct
- **Minimal and focused** — Sira does one thing well: scaffold projects that are ready to build
- **Open source** — designed for contributors, with clear architecture and typed interfaces

---

## Repository Structure

This project uses **two GitHub repositories**:

```
github.com/sira-cli/sira          ← The CLI tool (this repo)
github.com/sira-cli/templates     ← The project templates
```

### CLI Repo Structure (`sira-cli/sira`)

```
sira/
├── src/
│   ├── index.ts          # Entry point — CLI commands registration
│   ├── ui.ts             # Design system — colors, spinners, prompts
│   ├── stacks.ts         # Template registry — typed list of available templates
│   └── clone.ts          # Clone pipeline — pulls templates via tiged
├── package.json
├── tsconfig.json
├── AGENTS.md             # This file
├── CLAUDE.md             # Claude-specific context
├── .cursorrules          # Cursor-specific context
└── LICENSE               # MIT
```

### Templates Repo Structure (`sira-cli/templates`)

```
templates/
├── react-hermes/         # React + Vite + TypeScript
├── node-ares/            # Node.js + Express + TypeScript
└── django-athena/        # Django + Python
```

---

## Tech Stack (CLI)

| Tool | Version | Role |
|------|---------|------|
| Node.js | v24+ | Runtime |
| TypeScript | Latest | Language |
| ESM | Native | Module system (no CommonJS) |
| @clack/core | Latest | Interactive CLI prompts |
| picocolors | Latest | Terminal colors |
| tiged | Latest | Template cloning (degit alternative, Node 24 compatible) |
| tsx | Latest | TypeScript execution during dev |

**Important:** This project uses **pure ESM**. No CommonJS. All imports use `.js` extensions
even for TypeScript files (ESM resolution requirement).

---

## Template Naming System (Mythological)

Templates are named after Greek gods, each reflecting the nature of the stack:

| Code Name | Stack | God Symbolism |
|-----------|-------|---------------|
| **HERMÈS** | React + Vite + TypeScript | Speed, messenger — fast frontend |
| **ARÈS** | Node.js + Express + TypeScript | Power, force — robust backend |
| **ATHÉNA** | Django + Python | Wisdom, strategy — structured fullstack |

More templates planned post-hackathon:
- **APHRODITE** — Next.js + Tailwind (beautiful, full-featured)
- **HADÈS** — CLI tool template (underground, powerful tooling)

---

## Template Interface (TypeScript)

Every template in `stacks.ts` follows this typed interface:

```typescript
interface Stack {
  id: string;           // e.g. "react-hermes"
  name: string;         // e.g. "HERMÈS"
  description: string;  // Short description shown in CLI
  tech: string[];       // e.g. ["React", "Vite", "TypeScript"]
  repo: string;         // GitHub path: "sira-cli/templates/react-hermes"
  aiFiles: {            // AI context files to generate
    claude: string;     // Content for CLAUDE.md
    agents: string;     // Content for AGENTS.md
    cursorrules: string;// Content for .cursorrules
  };
}
```

---

## CLI Commands

### `sira create`
The main command. Walks the user through an interactive prompt to:
1. Enter project name
2. Choose a template (HERMÈS, ARÈS, ATHÉNA)
3. Clone the template into a new folder
4. Generate AI context files (CLAUDE.md, AGENTS.md, .cursorrules)
5. Run `npm install` (or `pip install` for Python)
6. Show success message with next steps

### `sira list`
Lists all available templates with their tech stack and description.

---

## UI Design System (`ui.ts`)

The CLI uses a consistent visual design:

```
Colors:
  Primary   → cyan (brand color)
  Success   → green
  Error     → red
  Warning   → yellow
  Muted     → gray (secondary info)

Structure:
  intro()   → Shows Sira logo + version on start
  step()    → Shows a numbered step with cyan label
  success() → Green checkmark + message
  error()   → Red X + message
  spinner() → Animated spinner during async ops
```

---

## Clone Pipeline (`clone.ts`)

Uses **tiged** (not degit — degit is incompatible with Node 24) to pull templates:

```typescript
// Conceptual flow
async function cloneTemplate(stack: Stack, projectName: string) {
  const emitter = tiged(`${stack.repo}`, { cache: false, force: true });
  await emitter.clone(`./${projectName}`);
  await generateAIFiles(projectName, stack);
  await installDependencies(projectName, stack);
}
```

---

## AI Context Files Generated Per Project

When Sira creates a project, it generates these files automatically:

### `CLAUDE.md`
Tells Claude Code about the project: stack, conventions, commands to run, architecture overview.

### `AGENTS.md`
Tells any AI agent about the project structure, goals, and how to contribute effectively.

### `.cursorrules`
Cursor-specific rules for code style, conventions, and preferred patterns.

---

## Hackathon Context

- **Event:** IBM Bob Hackathon — lablab.ai (May 15–17, 2026)
- **Theme:** "Turn idea into impact faster"
- **Team:** Lumis (solo — Péniel)
- **IBM Bob Role:** Bob is used as the primary development partner throughout the build.
  All Bob task sessions are exported and stored in `/bob_sessions/` for judging.

### Why Sira fits the hackathon theme perfectly:
- Reduces setup time from hours to minutes ✓
- Helps builders at any skill level start with confidence ✓
- AI-native by design — built for the age of AI coding tools ✓
- Uses IBM Bob to build a tool that helps other developers use AI better ✓

---

## What IBM Bob Should Help With

When working on this project with Bob, the primary tasks are:

1. **Implement `ui.ts`** — the CLI design system with @clack/core and picocolors
2. **Implement `stacks.ts`** — the typed template registry with 3 initial templates
3. **Implement `clone.ts`** — the tiged-based clone pipeline
4. **Implement `index.ts`** — the main CLI entry point wiring everything together
5. **Create template structures** — the actual template folders in the templates repo
6. **Generate AI context file content** — meaningful CLAUDE.md/AGENTS.md per template
7. **Write tests** — basic unit tests for core functions
8. **Generate documentation** — README with usage examples

---

## Conventions & Rules for Bob

- **Always use TypeScript** — no plain JavaScript files in `src/`
- **Always use ESM** — `import/export`, never `require()`
- **Import extensions** — always add `.js` to local imports (e.g. `import { ui } from './ui.js'`)
- **Async/await** — no raw Promises or callbacks
- **Error handling** — wrap all async operations in try/catch, show user-friendly errors via `ui.error()`
- **No default exports** — use named exports everywhere
- **Consistent naming** — camelCase for variables/functions, PascalCase for types/interfaces

---

## Current Status

> As of hackathon start (May 15, 2026):

- [x] Repository created on GitHub (`sira-cli/sira`)
- [x] MIT License added
- [x] AGENTS.md written (this file)
- [ ] `package.json` configured
- [ ] `tsconfig.json` configured
- [ ] `src/ui.ts` implemented
- [ ] `src/stacks.ts` implemented
- [ ] `src/clone.ts` implemented
- [ ] `src/index.ts` implemented
- [ ] Templates repo created
- [ ] `react-hermes` template created
- [ ] `node-ares` template created
- [ ] `django-athena` template created
- [ ] README written
- [ ] Tests written

---

## Links

- CLI Repo: https://github.com/sira-cli/sira
- Templates Repo: https://github.com/sira-cli/templates
- Hackathon: https://lablab.ai (IBM Bob Hackathon, May 2026)
- IBM Bob Guide: https://watsonx-hackathons-2026.s3.us.cloud-object-storage.appdomain.cloud/Lablab-IBM-Bob-hackathon-guide-May-2026.pdf