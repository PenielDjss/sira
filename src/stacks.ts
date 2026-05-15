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

function generateClaudeContent(projectName: string): string {
  return `# Claude Context — ${projectName}

## Project Overview
This is a React application built with Vite and TypeScript, scaffolded by Sira.

## Tech Stack
- **React** 18.2+ — UI library
- **Vite** 5.0+ — Build tool and dev server
- **TypeScript** 5.2+ — Type safety

## Project Structure
\`\`\`
src/
├── main.tsx      # Entry point
├── App.tsx       # Main component
└── App.css       # Styles
\`\`\`

## Development Commands
- \`npm run dev\` — Start dev server (http://localhost:5173)
- \`npm run build\` — Build for production
- \`npm run preview\` — Preview production build

## Conventions
- Use functional components with hooks
- TypeScript strict mode enabled
- ESM imports only
- CSS modules for styling (optional)

## AI Assistance Guidelines
When helping with this project:
1. Maintain TypeScript types for all components
2. Follow React best practices (hooks, composition)
3. Keep components small and focused
4. Use Vite's fast refresh for development
`;
}

function generateAgentsContent(projectName: string): string {
  return `# AI Agents Context — ${projectName}

> This file helps any AI coding assistant understand your project

## What is this project?
A React application built with modern tooling (Vite + TypeScript).

## Key Technologies
- React 18 (functional components + hooks)
- Vite (fast dev server + HMR)
- TypeScript (type safety)

## File Structure
- \`src/main.tsx\` — Application entry point
- \`src/App.tsx\` — Main component
- \`vite.config.ts\` — Vite configuration
- \`tsconfig.json\` — TypeScript configuration

## How to Help
When assisting with code:
- Always use TypeScript
- Prefer functional components
- Use React hooks (useState, useEffect, etc.)
- Keep code simple and readable

## Common Tasks
- Adding new components → Create in \`src/components/\`
- Adding styles → Use CSS modules or inline styles
- Adding dependencies → Use \`npm install <package>\`
`;
}

function generateCursorRules(projectName: string): string {
  return `# Cursor Rules for ${projectName}

## Language & Framework
- TypeScript only (no JavaScript)
- React 18+ with functional components
- Use hooks (useState, useEffect, etc.)

## Code Style
- Use arrow functions for components
- Destructure props
- Use const for all declarations
- Prefer template literals

## File Organization
- One component per file
- Co-locate styles with components
- Use named exports

## TypeScript
- Enable strict mode
- Define prop types with interfaces
- Avoid 'any' type

## React Patterns
- Functional components only
- Use hooks for state and effects
- Keep components small (<200 lines)
- Extract reusable logic into custom hooks
`;
}

export const stacks: Stack[] = [
  {
    id: 'react-hermes',
    name: 'HERMÈS',
    description: 'React + Vite + TypeScript — Fast frontend development',
    tech: ['React', 'Vite', 'TypeScript'],
    repo: 'PenielDjss/sira-templates/hermes',
    aiFiles: {
      claude: generateClaudeContent('[Project Name]'),
      agents: generateAgentsContent('[Project Name]'),
      cursorrules: generateCursorRules('[Project Name]'),
    },
  },
];

// Made with Bob
