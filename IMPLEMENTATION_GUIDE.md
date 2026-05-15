# Sira CLI — Implementation Guide for IBM Bob

> **Read [`PROJECT.md`](PROJECT.md) and [`SPRINT_PLAN.md`](SPRINT_PLAN.md) carefully before starting.**

---

## Context

We are building **Sira**, an open source CLI scaffolding tool that generates AI-ready project
structures. Every project created by Sira includes CLAUDE.md, AGENTS.md, and .cursorrules
files pre-configured with real, useful content.

This is built during the IBM Bob Hackathon (May 15–17, 2026).
Theme: "Turn idea into impact faster"

---

## Important Technical Decisions

### 1. tiged — NOT degit
We use **tiged** (not degit) for template cloning. degit is incompatible with Node 24.
tiged is a maintained fork with the same API.

```typescript
// ✅ Correct
import tiged from 'tiged';
const emitter = tiged('sira-cli/templates/react-hermes', { cache: false, force: true });
await emitter.clone('./my-project');

// ❌ Never use degit
import degit from 'degit';
```

### 2. Pure ESM — No CommonJS
```typescript
// ✅ Correct — always .js extension on local imports
import { ui } from './ui.js';
import { stacks } from './stacks.js';
import { cloneTemplate } from './clone.js';

// ❌ Never
const ui = require('./ui');
module.exports = { ... };
```

### 3. TypeScript Configuration — NodeNext (not bundler)
For a Node.js CLI, use NodeNext resolution (not bundler which is for Vite/webpack):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Use @clack/prompts only (not @clack/core)
Use **@clack/prompts** — it is the high-level API and sufficient for Sira.
Do not add @clack/core as a separate dependency.

```typescript
import { intro, outro, text, select, spinner, isCancel } from '@clack/prompts';
```

### 5. Always handle Ctrl+C cancellation
Every prompt must check for cancel:

```typescript
const projectName = await text({ message: 'Project name?' });

if (isCancel(projectName)) {
  ui.error('Operation cancelled.');
  process.exit(0);
}
```

---

## package.json to create

```json
{
  "name": "sira",
  "version": "0.1.0",
  "description": "CLI scaffolding tool that generates AI-ready project structures",
  "type": "module",
  "bin": {
    "sira": "./dist/index.js"
  },
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@clack/prompts": "^0.7.0",
    "picocolors": "^1.0.0",
    "tiged": "^2.12.7"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  },
  "keywords": ["cli", "scaffolding", "ai", "template", "vite", "react"],
  "license": "MIT"
}
```

---

## Implementation Order

Please implement in this exact order:

1. **package.json** — as defined above
2. **tsconfig.json** — with NodeNext resolution
3. **src/ui.ts** — design system (colors, logo, messages)
4. **src/stacks.ts** — typed template registry with HERMÈS template
5. **src/clone.ts** — tiged-based clone pipeline + AI file generation
6. **src/index.ts** — CLI entry point with `create` and `list` commands
7. **README.md** — usage documentation with examples

---

## src/ui.ts — Design System

Implement a consistent CLI design system:

- Logo: ASCII art for "Sira" in cyan
- Colors: cyan (primary), green (success), red (error), yellow (warning), gray (muted)
- Functions: `showLogo()`, `step(num, text)`, `success(text)`, `error(text)`, `info(text)`
- Export as named exports (no default export)

Example structure:

```typescript
import pc from 'picocolors';

export const colors = {
  primary: pc.cyan,
  success: pc.green,
  error: pc.red,
  warning: pc.yellow,
  muted: pc.gray,
  bold: pc.bold,
};

export function showLogo() {
  console.log(colors.primary(`
   _____ _           
  / ____(_)          
 | (___  _ _ __ __ _ 
  \\___ \\| | '__/ _\` |
  ____) | | | | (_| |
 |_____/|_|_|  \\__,_|
  `));
}

export const ui = {
  step: (num: number, text: string) => 
    console.log(`${colors.primary(`[${num}]`)} ${text}`),
  success: (text: string) => 
    console.log(`${colors.success('✓')} ${text}`),
  error: (text: string) => 
    console.log(`${colors.error('✗')} ${text}`),
  info: (text: string) => 
    console.log(`${colors.muted('ℹ')} ${text}`),
};
```

---

## src/stacks.ts — Template Registry

Define the Stack interface and export a stacks array with one entry: HERMÈS.

```typescript
export interface Stack {
  id: string;
  name: string;
  description: string;
  tech: string[];
  repo: string;
  aiFiles: {
    claude: string;
    agents: string;
    cursorrules: string;
  };
}
```

The HERMÈS template:
- id: 'react-hermes'
- name: 'HERMÈS'
- description: 'React + Vite + TypeScript — Fast frontend development'
- tech: ['React', 'Vite', 'TypeScript']
- repo: 'sira-cli/templates/react-hermes'
- aiFiles: generate meaningful, real content for CLAUDE.md, AGENTS.md, .cursorrules

### AI Files Content Guidelines

#### CLAUDE.md Template
Should include:
- Project overview
- Tech stack details
- Project structure
- Development commands
- Conventions and best practices
- AI assistance guidelines

#### AGENTS.md Template
Should include:
- What is this project
- Key technologies
- File structure
- How to help (coding guidelines)
- Common tasks

#### .cursorrules Template
Should include:
- Language & framework rules
- Code style preferences
- File organization
- TypeScript guidelines
- React patterns

---

## src/clone.ts — Clone Pipeline

Implement using tiged:

1. Clone template from GitHub using tiged
2. Generate AI context files (CLAUDE.md, AGENTS.md, .cursorrules)
3. Update package.json name field with project name
4. Handle errors gracefully with user-friendly messages

Example structure:

```typescript
import tiged from 'tiged';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import type { Stack } from './stacks.js';

export async function cloneTemplate(
  stack: Stack,
  projectName: string,
  targetDir: string = process.cwd()
): Promise<string> {
  const projectPath = join(targetDir, projectName);
  
  try {
    // 1. Clone template via tiged
    const emitter = tiged(stack.repo, { 
      cache: false, 
      force: true 
    });
    
    await emitter.clone(projectPath);
    
    // 2. Generate AI context files
    await generateAIFiles(projectPath, stack, projectName);
    
    // 3. Update package.json with project name
    await updatePackageJson(projectPath, projectName);
    
    return projectPath;
  } catch (error) {
    throw new Error(`Failed to clone template: ${error.message}`);
  }
}

async function generateAIFiles(
  projectPath: string, 
  stack: Stack,
  projectName: string
) {
  const files = [
    { 
      name: 'CLAUDE.md', 
      content: stack.aiFiles.claude.replace(/\[Project Name\]/g, projectName)
    },
    { 
      name: 'AGENTS.md', 
      content: stack.aiFiles.agents.replace(/\[Project Name\]/g, projectName)
    },
    { 
      name: '.cursorrules', 
      content: stack.aiFiles.cursorrules.replace(/\[Project Name\]/g, projectName)
    },
  ];
  
  for (const file of files) {
    await writeFile(
      join(projectPath, file.name),
      file.content,
      'utf-8'
    );
  }
}

async function updatePackageJson(projectPath: string, projectName: string) {
  const pkgPath = join(projectPath, 'package.json');
  const pkgContent = await readFile(pkgPath, 'utf-8');
  const pkg = JSON.parse(pkgContent);
  
  pkg.name = projectName;
  
  await writeFile(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
}
```

---

## src/index.ts — CLI Entry Point

Two commands:
- `sira create` — interactive project creation flow
- `sira list` — display available templates

The create flow:
1. Show logo
2. Ask project name (validate: lowercase, numbers, hyphens only)
3. Ask template selection
4. Clone with spinner
5. Show success + next steps

Always handle `isCancel()` after every prompt.

Example structure:

```typescript
#!/usr/bin/env node

import { intro, outro, text, select, spinner, isCancel } from '@clack/prompts';
import { showLogo, ui, colors } from './ui.js';
import { stacks } from './stacks.js';
import { cloneTemplate } from './clone.js';

async function main() {
  const command = process.argv[2];
  
  if (command === 'create') {
    await createCommand();
  } else if (command === 'list') {
    await listCommand();
  } else {
    showHelp();
  }
}

async function createCommand() {
  console.clear();
  showLogo();
  intro(colors.primary('Create a new project'));
  
  // 1. Ask project name
  const projectName = await text({
    message: 'Project name?',
    placeholder: 'my-awesome-app',
    validate: (value) => {
      if (!value) return 'Project name is required';
      if (!/^[a-z0-9-]+$/.test(value)) {
        return 'Use lowercase letters, numbers, and hyphens only';
      }
    },
  });
  
  if (isCancel(projectName)) {
    ui.error('Operation cancelled.');
    process.exit(0);
  }
  
  // 2. Select template
  const stackId = await select({
    message: 'Choose a template:',
    options: stacks.map(s => ({
      value: s.id,
      label: `${s.name} — ${s.description}`,
      hint: s.tech.join(', '),
    })),
  });
  
  if (isCancel(stackId)) {
    ui.error('Operation cancelled.');
    process.exit(0);
  }
  
  // 3. Clone template
  const s = spinner();
  s.start('Creating project...');
  
  try {
    const stack = stacks.find(st => st.id === stackId);
    if (!stack) throw new Error('Template not found');
    
    await cloneTemplate(stack, projectName as string);
    
    s.stop('Project created!');
    
    // 4. Show next steps
    outro(colors.success('All done! 🎉'));
    console.log('\nNext steps:');
    console.log(colors.muted(`  cd ${projectName}`));
    console.log(colors.muted('  npm install'));
    console.log(colors.muted('  npm run dev'));
    console.log('\n' + colors.primary('Happy coding! ✨'));
  } catch (error) {
    s.stop('Failed to create project');
    ui.error(error.message);
    process.exit(1);
  }
}

async function listCommand() {
  console.clear();
  showLogo();
  console.log(colors.bold('\nAvailable templates:\n'));
  
  stacks.forEach(stack => {
    console.log(colors.primary(`  ${stack.name}`));
    console.log(`  ${stack.description}`);
    console.log(colors.muted(`  Tech: ${stack.tech.join(', ')}\n`));
  });
}

function showHelp() {
  console.clear();
  showLogo();
  console.log('\nUsage:');
  console.log(colors.primary('  sira create') + ' — Create a new project');
  console.log(colors.primary('  sira list') + '   — List available templates');
  console.log(colors.primary('  sira --help') + ' — Show this help message\n');
}

main().catch((error) => {
  ui.error(error.message);
  process.exit(1);
});
```

---

## README.md — Documentation

Create clear documentation with:

1. **Project description** — What is Sira and why it exists
2. **Installation** — How to install (npm link for dev, npm install -g for production)
3. **Usage** — Commands with examples
4. **Templates** — List of available templates
5. **Development** — How to contribute
6. **License** — MIT

Example structure:

```markdown
# Sira

> CLI scaffolding tool that generates AI-ready project structures

Sira creates projects with CLAUDE.md, AGENTS.md, and .cursorrules files pre-configured,
so you can start coding with AI assistance immediately.

## Installation

### For Development
\`\`\`bash
git clone https://github.com/sira-cli/sira.git
cd sira
npm install
npm run build
npm link
\`\`\`

### For Production (coming soon)
\`\`\`bash
npm install -g sira
\`\`\`

## Usage

### Create a new project
\`\`\`bash
sira create
\`\`\`

Follow the interactive prompts to:
1. Enter your project name
2. Choose a template
3. Wait for the project to be created

### List available templates
\`\`\`bash
sira list
\`\`\`

## Available Templates

### HERMÈS — React + Vite + TypeScript
Fast frontend development with modern tooling.

**Tech stack:**
- React 18
- Vite 5
- TypeScript 5

**Includes:**
- CLAUDE.md — Context for Claude Code
- AGENTS.md — Context for all AI agents
- .cursorrules — Cursor-specific rules

## Development

\`\`\`bash
# Run in dev mode
npm run dev create

# Build
npm run build

# Test locally
npm link
sira create
\`\`\`

## License

MIT © Sira CLI
\`\`\`

---

## Success Criteria

- ✅ `sira create` works end-to-end
- ✅ `sira list` displays available templates
- ✅ Generated project includes CLAUDE.md, AGENTS.md, .cursorrules
- ✅ TypeScript compiles with zero errors
- ✅ `npm link` + `sira create` works locally
- ✅ README is clear with installation and usage instructions

---

## Testing Checklist

Before considering the implementation complete:

1. [ ] Run `npm run build` — no TypeScript errors
2. [ ] Run `npm link` — CLI is globally available
3. [ ] Run `sira create` — interactive flow works
4. [ ] Check generated project has all AI files
5. [ ] Run `cd <project> && npm install && npm run dev` — project works
6. [ ] Run `sira list` — templates are displayed
7. [ ] Run `sira --help` — help message is shown
8. [ ] Test Ctrl+C cancellation — exits gracefully

---

## Common Issues & Solutions

### Issue: "Cannot find module './ui.js'"
**Solution:** Make sure all local imports have `.js` extension, even for TypeScript files.

### Issue: "tiged: command not found"
**Solution:** tiged is a dependency, not a global command. Import it in code.

### Issue: "Module not found: @clack/core"
**Solution:** Use `@clack/prompts` instead. It includes everything needed.

### Issue: TypeScript errors about module resolution
**Solution:** Use `"moduleResolution": "NodeNext"` in tsconfig.json, not "bundler".

---

**Ready to implement? Start with package.json and work through the list in order.** 🚀