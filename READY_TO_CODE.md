# ✅ Ready to Code — Sprint Checklist

> All planning is complete. Ready to switch to Code mode for implementation.

---

## 📚 Documentation Created

- ✅ [`PROJECT.md`](PROJECT.md) — Project context and architecture
- ✅ [`SPRINT_PLAN.md`](SPRINT_PLAN.md) — Detailed sprint plan (717 lines)
- ✅ [`IMPLEMENTATION_GUIDE.md`](IMPLEMENTATION_GUIDE.md) — Step-by-step implementation guide (545 lines)
- ✅ `bob_sessions/` — Directory for Bob task exports (for hackathon judging)

---

## 🎯 MVP Scope Confirmed

### What We're Building
- **CLI Tool:** `sira` command with `create` and `list` subcommands
- **One Template:** HERMÈS (React + Vite + TypeScript)
- **AI Files:** CLAUDE.md, AGENTS.md, .cursorrules auto-generated
- **Repository Structure:** Separate repos for CLI and templates

### What We're NOT Building (Post-MVP)
- ❌ Multiple templates (ARÈS, ATHÉNA) — later
- ❌ CLI options (`--template`, `--name`) — later
- ❌ Tests — later
- ❌ npm publication — optional

---

## 🔧 Technical Decisions Locked

| Decision | Choice | Reason |
|----------|--------|--------|
| **Template Cloner** | tiged | degit incompatible with Node 24 |
| **Module System** | Pure ESM | Modern, Node 24 native |
| **TypeScript Config** | NodeNext | Correct for Node.js CLI |
| **Prompts Library** | @clack/prompts | High-level API, sufficient |
| **Colors Library** | picocolors | Lightweight, fast |
| **Template Approach** | GitHub repo | Production-ready from start |

---

## 📋 Implementation Order

1. ✅ **package.json** — Dependencies and scripts defined
2. ✅ **tsconfig.json** — NodeNext resolution configured
3. ⏳ **src/ui.ts** — Design system (colors, logo, messages)
4. ⏳ **src/stacks.ts** — Template registry with HERMÈS
5. ⏳ **src/clone.ts** — tiged pipeline + AI file generation
6. ⏳ **src/index.ts** — CLI entry point (create, list, help)
7. ⏳ **README.md** — Usage documentation

---

## 🚨 Critical Implementation Rules

### 1. ESM Imports — Always .js Extension
```typescript
// ✅ Correct
import { ui } from './ui.js';
import { stacks } from './stacks.js';

// ❌ Wrong
import { ui } from './ui';
```

### 2. Use tiged, NOT degit
```typescript
// ✅ Correct
import tiged from 'tiged';

// ❌ Wrong
import degit from 'degit';
```

### 3. Always Handle Ctrl+C
```typescript
const answer = await text({ message: 'Question?' });

if (isCancel(answer)) {
  ui.error('Operation cancelled.');
  process.exit(0);
}
```

### 4. Use @clack/prompts (not @clack/core)
```typescript
// ✅ Correct
import { intro, outro, text, select, spinner, isCancel } from '@clack/prompts';

// ❌ Wrong
import { intro } from '@clack/core';
```

---

## 📦 Dependencies to Install

```json
{
  "dependencies": {
    "@clack/prompts": "^0.7.0",
    "picocolors": "^1.0.0",
    "tiged": "^2.12.7"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

---

## 🎨 UI Design System

### Colors
- **Primary:** Cyan (brand color)
- **Success:** Green (✓ messages)
- **Error:** Red (✗ messages)
- **Warning:** Yellow (⚠ messages)
- **Muted:** Gray (secondary info)

### Logo
```
   _____ _           
  / ____(_)          
 | (___  _ _ __ __ _ 
  \___ \| | '__/ _` |
  ____) | | | | (_| |
 |_____/|_|_|  \__,_|
```

---

## 📝 AI Files Content Structure

### CLAUDE.md
- Project overview
- Tech stack
- Project structure
- Development commands
- Conventions
- AI assistance guidelines

### AGENTS.md
- What is this project
- Key technologies
- File structure
- How to help
- Common tasks

### .cursorrules
- Language & framework
- Code style
- File organization
- TypeScript rules
- React patterns

---

## ✅ Success Criteria

Before marking implementation complete:

- [ ] `npm run build` — compiles with zero errors
- [ ] `npm link` — CLI is globally available
- [ ] `sira create` — interactive flow works end-to-end
- [ ] Generated project includes CLAUDE.md, AGENTS.md, .cursorrules
- [ ] `cd <project> && npm install && npm run dev` — project runs
- [ ] `sira list` — displays available templates
- [ ] `sira --help` — shows help message
- [ ] Ctrl+C cancellation — exits gracefully

---

## 🚀 Next Action

**Switch to Code mode** and start implementing in this order:

1. Create `package.json`
2. Create `tsconfig.json`
3. Create `src/ui.ts`
4. Create `src/stacks.ts`
5. Create `src/clone.ts`
6. Create `src/index.ts`
7. Create `README.md`
8. Test end-to-end

---

## 📊 Current Status

```
Planning Phase:  ✅ COMPLETE
Implementation:  ⏳ READY TO START
Testing:         ⏳ PENDING
Documentation:   ⏳ PENDING
```

---

**All planning complete. Ready to code! 🎉**

Switch to Code mode to begin implementation.