# Template HERMÈS - Fichiers de Référence

> Copie ces fichiers dans `sira-templates/hermes/` sur GitHub

---

## 📁 Structure du Template

```
hermes/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .gitignore
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── vite-env.d.ts
├── public/
│   └── vite.svg
├── CLAUDE.md
├── AGENTS.md
└── .cursorrules
```

---

## 📄 package.json

```json
{
  "name": "hermes-app",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.13.1",
    "@typescript-eslint/parser": "^7.13.1",
    "@vitejs/plugin-react": "^4.3.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "typescript": "^5.5.3",
    "vite": "^5.3.1"
  }
}
```

---

## 📄 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 📄 tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

---

## 📄 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

---

## 📄 index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hermès App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 📄 .gitignore

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

---

## 📄 src/main.tsx

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## 📄 src/App.tsx

```tsx
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚡ Hermès</h1>
        <p>React + TypeScript + Vite</p>
      </header>

      <main className="app-main">
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>

        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </main>
    </div>
  )
}

export default App
```

---

## 📄 src/App.css

```css
.app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.app-header h1 {
  font-size: 3.2em;
  line-height: 1.1;
  margin-bottom: 0.5rem;
}

.app-header p {
  color: #888;
  font-size: 1.2em;
}

.app-main {
  margin-top: 3rem;
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
  margin-top: 2rem;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
```

---

## 📄 src/index.css

```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
```

---

## 📄 src/vite-env.d.ts

```typescript
/// <reference types="vite/client" />
```

---

## 📄 public/vite.svg

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>
```

---

## 📄 CLAUDE.md

```markdown
# Hermès — AI Context for Claude

> This file provides context for Claude AI to assist with this React + TypeScript + Vite project.

---

## Project Overview

**Hermès** is a minimal React application scaffolded with Vite and TypeScript. It serves as a clean starting point for building modern web applications with fast HMR (Hot Module Replacement) and type safety.

---

## Tech Stack

- **React 18.3+** — UI library
- **TypeScript 5.5+** — Type-safe JavaScript
- **Vite 5.3+** — Build tool and dev server
- **ESLint** — Code linting
- **CSS** — Styling (no framework)

---

## Project Structure

```
hermes/
├── src/
│   ├── main.tsx          # Application entry point
│   ├── App.tsx           # Root component
│   ├── App.css           # Component styles
│   ├── index.css         # Global styles
│   └── vite-env.d.ts     # Vite type definitions
├── public/               # Static assets
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript config (app)
├── tsconfig.node.json    # TypeScript config (build tools)
└── package.json          # Dependencies and scripts
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Code Conventions

### TypeScript
- Use `.tsx` for React components
- Use `.ts` for utilities and non-React code
- Enable strict mode (already configured)
- Prefer type inference over explicit types when obvious

### React
- Use functional components with hooks
- Use `React.FC` sparingly (prefer explicit return types)
- Keep components small and focused
- Extract reusable logic into custom hooks

### Styling
- Use CSS modules for component-specific styles
- Keep global styles minimal (in `index.css`)
- Use semantic class names
- Prefer CSS variables for theming

### File Organization
- One component per file
- Co-locate related files (component + styles + tests)
- Use `index.ts` for clean exports
- Keep `src/` flat until complexity requires folders

---

## AI Assistance Guidelines

When helping with this project:

1. **Respect the Stack**: Don't suggest adding routing, state management, or UI libraries unless explicitly requested
2. **Keep It Simple**: This is a minimal template — avoid over-engineering
3. **Type Safety**: Always provide proper TypeScript types
4. **Modern React**: Use hooks, not class components
5. **Vite-First**: Leverage Vite features (HMR, env variables, etc.)
6. **ESM Only**: Use ES modules syntax (`import`/`export`)

---

## Common Tasks

### Adding a New Component
```tsx
// src/components/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Using Environment Variables
```typescript
// Access Vite env variables
const apiUrl = import.meta.env.VITE_API_URL;
```

### Adding a Dependency
```bash
npm install <package-name>
npm install -D <dev-package-name>
```

---

## Troubleshooting

### Port Already in Use
```bash
# Vite will auto-increment port (5174, 5175, etc.)
# Or specify a port:
npm run dev -- --port 3000
```

### TypeScript Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### HMR Not Working
- Check browser console for errors
- Restart dev server
- Clear browser cache

---

**Ready to build!** 🚀
```

---

## 📄 AGENTS.md

```markdown
# Hermès — AI Context for All Agents

> Universal context file for AI assistants (Claude, Cursor, GitHub Copilot, etc.)

---

## What is This Project?

**Hermès** is a React + TypeScript + Vite starter template. It's a minimal, production-ready foundation for building modern web applications with:

- ⚡ Lightning-fast HMR with Vite
- 🔒 Type safety with TypeScript
- ⚛️ Modern React 18 with hooks
- 🎨 Clean, semantic CSS
- 📦 Zero dependencies (except React)

---

## Key Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3+ | UI library |
| TypeScript | 5.5+ | Type safety |
| Vite | 5.3+ | Build tool |
| ESLint | 8.57+ | Code quality |

---

## File Structure

```
src/
├── main.tsx       # App entry point (ReactDOM.render)
├── App.tsx        # Root component
├── App.css        # Component styles
├── index.css      # Global styles
└── vite-env.d.ts  # Vite types
```

---

## How to Help

### When Writing Code
- Use TypeScript with strict mode
- Prefer functional components with hooks
- Keep components small and focused
- Use semantic HTML and CSS

### When Suggesting Changes
- Respect the minimal nature of this template
- Don't add unnecessary dependencies
- Keep the bundle size small
- Maintain Vite's fast HMR

### When Debugging
- Check browser console first
- Verify TypeScript compilation (`npm run build`)
- Test in dev mode (`npm run dev`)
- Check ESLint output (`npm run lint`)

---

## Common Tasks

**Add a component:**
```tsx
export function MyComponent() {
  return <div>Hello</div>;
}
```

**Add state:**
```tsx
const [count, setCount] = useState(0);
```

**Add an effect:**
```tsx
useEffect(() => {
  // Side effect here
}, [dependencies]);
```

**Style a component:**
```css
/* App.css */
.my-component {
  color: blue;
}
```

---

## Development Workflow

1. Start dev server: `npm run dev`
2. Edit files in `src/`
3. See changes instantly (HMR)
4. Build for production: `npm run build`
5. Preview build: `npm run preview`

---

## Important Notes

- This is a **minimal** template — no routing, no state management
- Uses **ESM only** — no CommonJS
- **Vite** handles all bundling — no webpack
- **TypeScript** is configured for strict mode
- **React 18** with concurrent features enabled

---

**Let's build something great!** ✨
```

---

## 📄 .cursorrules

```
# Hermès — Cursor AI Rules

## Language & Framework
- Language: TypeScript (strict mode)
- Framework: React 18 (functional components only)
- Build Tool: Vite 5

## Code Style
- Use ESM imports/exports (no CommonJS)
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Use template literals for strings
- Use optional chaining (`?.`) and nullish coalescing (`??`)

## TypeScript Rules
- Enable strict mode (already configured)
- Prefer type inference over explicit types
- Use interfaces for object shapes
- Use type aliases for unions/intersections
- Avoid `any` — use `unknown` if needed

## React Patterns
- Use functional components with hooks
- Prefer `useState` and `useEffect` over class lifecycle
- Extract complex logic into custom hooks
- Keep components under 200 lines
- One component per file

## File Organization
- Components: `src/components/ComponentName.tsx`
- Hooks: `src/hooks/useHookName.ts`
- Utils: `src/utils/utilName.ts`
- Types: `src/types/typeName.ts`
- Styles: Co-locate with components (`ComponentName.css`)

## Naming Conventions
- Components: PascalCase (`Button.tsx`)
- Hooks: camelCase with `use` prefix (`useCounter.ts`)
- Utils: camelCase (`formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (`API_URL`)
- CSS classes: kebab-case (`button-primary`)

## Import Order
1. React imports
2. Third-party imports
3. Local imports (components, hooks, utils)
4. Type imports
5. CSS imports

## CSS Guidelines
- Use CSS modules for component styles
- Keep global styles minimal
- Use CSS variables for theming
- Prefer flexbox/grid over floats
- Mobile-first responsive design

## Performance
- Lazy load routes and heavy components
- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback`
- Use `React.memo` for pure components
- Avoid inline object/array creation in JSX

## Testing (when added)
- Test user interactions, not implementation
- Use React Testing Library
- Prefer integration tests over unit tests
- Mock external dependencies

## Git Commit Messages
- Use conventional commits format
- Examples: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`

## Don't Do
- Don't add routing unless requested
- Don't add state management unless requested
- Don't add UI libraries unless requested
- Don't use class components
- Don't use CommonJS (`require`/`module.exports`)
```

---

## 📄 README.md (pour le repo templates)

```markdown
# Sira Templates

> Official template repository for [Sira CLI](https://github.com/sira-cli/sira)

This repository contains production-ready project templates that can be scaffolded using the Sira CLI. Each template includes pre-configured AI context files (CLAUDE.md, AGENTS.md, .cursorrules) to accelerate development with AI assistants.

---

## Available Templates

### ⚡ Hermès (React + Vite + TypeScript)

Minimal React starter with Vite and TypeScript. Perfect for building modern web applications with fast HMR and type safety.

**Stack:**
- React 18.3+
- TypeScript 5.5+
- Vite 5.3+
- ESLint

**Use Case:** Single-page applications, prototypes, MVPs

**Clone with Sira:**
```bash
sira create my-app
# Select "Hermès" from the list
```

**Manual Clone:**
```bash
npx tiged PenielDjss/sira-templates/hermes my-app
cd my-app
npm install
npm run dev
```

---

## Template Structure

Each template includes:

- **CLAUDE.md** — Context for Claude AI
- **AGENTS.md** — Universal context for all AI assistants
- **.cursorrules** — Cursor-specific rules and conventions
- **package.json** — Dependencies and scripts
- **tsconfig.json** — TypeScript configuration
- **README.md** — Template-specific documentation

---

## Contributing

Want to add a new template? See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## License

MIT © Sira CLI
```

---

## ✅ Instructions de Copie

1. **Créer la structure dans `sira-templates/hermes/`:**
   ```bash
   mkdir -p hermes/src hermes/public
   ```

2. **Copier chaque fichier** dans le bon emplacement

3. **Tester localement:**
   ```bash
   cd hermes
   npm install
   npm run dev
   ```

4. **Pousser sur GitHub:**
   ```bash
   git add .
   git commit -m "feat: add Hermès template with AI context files"
   git push origin main
   ```

---

**Tous les fichiers sont prêts à être copiés ! 🚀**