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

function generateClaudeContent(projectName: string, stackType: string = 'react'): string {
  const configs: Record<string, any> = {
    react: {
      overview: 'This is a React application built with Vite and TypeScript, scaffolded by Sira.',
      techStack: '- **React** 18.2+ — UI library\n- **Vite** 5.0+ — Build tool and dev server\n- **TypeScript** 5.2+ — Type safety',
      structure: 'src/\n├── main.tsx      # Entry point\n├── App.tsx       # Main component\n└── App.css       # Styles',
      commands: '- `npm run dev` — Start dev server (http://localhost:5173)\n- `npm run build` — Build for production\n- `npm run preview` — Preview production build',
      conventions: '- Use functional components with hooks\n- TypeScript strict mode enabled\n- ESM imports only\n- CSS modules for styling (optional)',
      guidelines: '1. Maintain TypeScript types for all components\n2. Follow React best practices (hooks, composition)\n3. Keep components small and focused\n4. Use Vite\'s fast refresh for development'
    },
    node: {
      overview: 'This is a Node.js backend API built with Express and TypeScript, scaffolded by Sira.',
      techStack: '- **Node.js** 18+ — JavaScript runtime\n- **Express** 4.18+ — Web framework\n- **TypeScript** 5.2+ — Type safety',
      structure: 'src/\n├── index.ts      # Entry point\n├── routes/       # API routes\n└── middleware/   # Express middleware',
      commands: '- `npm run dev` — Start dev server with hot reload\n- `npm run build` — Compile TypeScript\n- `npm start` — Run production build',
      conventions: '- Use async/await for asynchronous operations\n- TypeScript strict mode enabled\n- RESTful API design\n- Environment variables for configuration',
      guidelines: '1. Maintain TypeScript types for all endpoints\n2. Follow Express best practices\n3. Use middleware for cross-cutting concerns\n4. Implement proper error handling'
    },
    django: {
      overview: 'This is a Django fullstack application built with Python, scaffolded by Sira.',
      techStack: '- **Django** 4.2+ — Web framework\n- **Python** 3.10+ — Programming language\n- **PostgreSQL** — Database (recommended)',
      structure: 'project/\n├── manage.py     # Django CLI\n├── app/          # Main application\n├── templates/    # HTML templates\n└── static/       # Static files',
      commands: '- `python manage.py runserver` — Start dev server\n- `python manage.py migrate` — Run migrations\n- `python manage.py createsuperuser` — Create admin user',
      conventions: '- Follow Django\'s MVT pattern\n- Use Django ORM for database operations\n- Keep views simple, logic in models\n- Use Django\'s built-in admin',
      guidelines: '1. Follow Django best practices\n2. Use class-based views when appropriate\n3. Leverage Django\'s built-in features\n4. Keep settings secure with environment variables'
    },
    flask: {
      overview: 'This is a Flask backend API built with Python, scaffolded by Sira.',
      techStack: '- **Flask** 3.0+ — Micro web framework\n- **Python** 3.10+ — Programming language\n- **SQLAlchemy** — ORM (optional)',
      structure: 'src/\n├── app.py        # Entry point\n├── routes/       # API routes\n└── models/       # Data models',
      commands: '- `flask run` — Start dev server\n- `python app.py` — Run application\n- `flask shell` — Interactive shell',
      conventions: '- Keep routes modular with blueprints\n- Use Flask extensions for common tasks\n- Environment variables for configuration\n- RESTful API design',
      guidelines: '1. Keep the application lightweight\n2. Use blueprints for organization\n3. Implement proper error handling\n4. Follow Flask best practices'
    },
    nextjs: {
      overview: 'This is a Next.js fullstack application built with TypeScript and Tailwind CSS, scaffolded by Sira.',
      techStack: '- **Next.js** 14+ — React framework\n- **TypeScript** 5.2+ — Type safety\n- **Tailwind CSS** 3.4+ — Utility-first CSS',
      structure: 'app/\n├── layout.tsx    # Root layout\n├── page.tsx      # Home page\n├── api/          # API routes\n└── components/   # React components',
      commands: '- `npm run dev` — Start dev server (http://localhost:3000)\n- `npm run build` — Build for production\n- `npm start` — Run production build',
      conventions: '- Use App Router (not Pages Router)\n- Server Components by default\n- Client Components when needed\n- Tailwind for all styling',
      guidelines: '1. Leverage Server Components for performance\n2. Use Next.js built-in optimizations\n3. Follow React and Next.js best practices\n4. Implement proper SEO with metadata'
    }
  };

  const config = configs[stackType] || configs.react;

  return `# Claude Context — ${projectName}

## Project Overview
${config.overview}

## Tech Stack
${config.techStack}

## Project Structure
\`\`\`
${config.structure}
\`\`\`

## Development Commands
${config.commands}

## Conventions
${config.conventions}

## AI Assistance Guidelines
When helping with this project:
${config.guidelines}
`;
}

function generateAgentsContent(projectName: string, stackType: string = 'react'): string {
  const configs: Record<string, any> = {
    react: {
      description: 'A React application built with modern tooling (Vite + TypeScript).',
      technologies: '- React 18 (functional components + hooks)\n- Vite (fast dev server + HMR)\n- TypeScript (type safety)',
      structure: '- `src/main.tsx` — Application entry point\n- `src/App.tsx` — Main component\n- `vite.config.ts` — Vite configuration\n- `tsconfig.json` — TypeScript configuration',
      help: '- Always use TypeScript\n- Prefer functional components\n- Use React hooks (useState, useEffect, etc.)\n- Keep code simple and readable',
      tasks: '- Adding new components → Create in `src/components/`\n- Adding styles → Use CSS modules or inline styles\n- Adding dependencies → Use `npm install <package>`'
    },
    node: {
      description: 'A Node.js backend API built with Express and TypeScript.',
      technologies: '- Node.js 18+ (JavaScript runtime)\n- Express 4.18+ (web framework)\n- TypeScript (type safety)',
      structure: '- `src/index.ts` — Application entry point\n- `src/routes/` — API route handlers\n- `src/middleware/` — Express middleware\n- `tsconfig.json` — TypeScript configuration',
      help: '- Always use TypeScript\n- Use async/await for async operations\n- Follow RESTful API conventions\n- Implement proper error handling',
      tasks: '- Adding new routes → Create in `src/routes/`\n- Adding middleware → Create in `src/middleware/`\n- Adding dependencies → Use `npm install <package>`'
    },
    django: {
      description: 'A Django fullstack application built with Python.',
      technologies: '- Django 4.2+ (web framework)\n- Python 3.10+ (programming language)\n- PostgreSQL (database)',
      structure: '- `manage.py` — Django management CLI\n- `app/` — Main application directory\n- `templates/` — HTML templates\n- `static/` — Static files (CSS, JS, images)',
      help: '- Follow Django MVT pattern\n- Use Django ORM for database operations\n- Keep views simple, logic in models\n- Leverage Django\'s built-in features',
      tasks: '- Adding new views → Create in `app/views.py`\n- Adding models → Define in `app/models.py`\n- Adding templates → Create in `templates/`'
    },
    flask: {
      description: 'A Flask backend API built with Python.',
      technologies: '- Flask 3.0+ (micro web framework)\n- Python 3.10+ (programming language)\n- SQLAlchemy (ORM, optional)',
      structure: '- `app.py` — Application entry point\n- `routes/` — API route handlers\n- `models/` — Data models\n- `requirements.txt` — Python dependencies',
      help: '- Keep the application lightweight\n- Use blueprints for modular routes\n- Follow RESTful API conventions\n- Implement proper error handling',
      tasks: '- Adding new routes → Create in `routes/`\n- Adding models → Define in `models/`\n- Adding dependencies → Add to `requirements.txt`'
    },
    nextjs: {
      description: 'A Next.js fullstack application built with TypeScript and Tailwind CSS.',
      technologies: '- Next.js 14+ (React framework)\n- TypeScript (type safety)\n- Tailwind CSS (utility-first CSS)',
      structure: '- `app/layout.tsx` — Root layout\n- `app/page.tsx` — Home page\n- `app/api/` — API routes\n- `app/components/` — React components',
      help: '- Use App Router (not Pages Router)\n- Server Components by default\n- Client Components when needed (`use client`)\n- Use Tailwind for all styling',
      tasks: '- Adding new pages → Create in `app/`\n- Adding components → Create in `app/components/`\n- Adding API routes → Create in `app/api/`'
    }
  };

  const config = configs[stackType] || configs.react;

  return `# AI Agents Context — ${projectName}

> This file helps any AI coding assistant understand your project

## What is this project?
${config.description}

## Key Technologies
${config.technologies}

## File Structure
${config.structure}

## How to Help
When assisting with code:
${config.help}

## Common Tasks
${config.tasks}
`;
}

function generateCursorRules(projectName: string, stackType: string = 'react'): string {
  const configs: Record<string, any> = {
    react: {
      language: '- TypeScript only (no JavaScript)\n- React 18+ with functional components\n- Use hooks (useState, useEffect, etc.)',
      style: '- Use arrow functions for components\n- Destructure props\n- Use const for all declarations\n- Prefer template literals',
      organization: '- One component per file\n- Co-locate styles with components\n- Use named exports',
      typescript: '- Enable strict mode\n- Define prop types with interfaces\n- Avoid \'any\' type',
      patterns: '- Functional components only\n- Use hooks for state and effects\n- Keep components small (<200 lines)\n- Extract reusable logic into custom hooks'
    },
    node: {
      language: '- TypeScript only (no JavaScript)\n- Node.js 18+ with Express\n- Use async/await for async operations',
      style: '- Use arrow functions\n- Use const for all declarations\n- Prefer template literals\n- Use destructuring',
      organization: '- One route handler per file\n- Separate concerns (routes, controllers, services)\n- Use named exports',
      typescript: '- Enable strict mode\n- Define types for request/response\n- Avoid \'any\' type',
      patterns: '- RESTful API design\n- Use middleware for cross-cutting concerns\n- Implement proper error handling\n- Keep route handlers thin'
    },
    django: {
      language: '- Python 3.10+\n- Django 4.2+\n- Follow PEP 8 style guide',
      style: '- Use snake_case for variables and functions\n- Use PascalCase for classes\n- Use docstrings for documentation\n- Keep lines under 100 characters',
      organization: '- Follow Django app structure\n- One model per file (when complex)\n- Separate concerns (views, models, forms)',
      patterns: '- Follow Django MVT pattern\n- Use class-based views when appropriate\n- Keep views simple, logic in models\n- Use Django ORM for database operations'
    },
    flask: {
      language: '- Python 3.10+\n- Flask 3.0+\n- Follow PEP 8 style guide',
      style: '- Use snake_case for variables and functions\n- Use PascalCase for classes\n- Use docstrings for documentation\n- Keep lines under 100 characters',
      organization: '- Use blueprints for modular routes\n- Separate concerns (routes, models, services)\n- Keep application factory pattern',
      patterns: '- RESTful API design\n- Keep routes simple\n- Use Flask extensions appropriately\n- Implement proper error handling'
    },
    nextjs: {
      language: '- TypeScript only (no JavaScript)\n- Next.js 14+ with App Router\n- React Server Components by default',
      style: '- Use arrow functions for components\n- Destructure props\n- Use const for all declarations\n- Prefer template literals',
      organization: '- Follow App Router structure\n- Co-locate components with pages\n- Use named exports\n- Separate client and server components',
      typescript: '- Enable strict mode\n- Define prop types with interfaces\n- Avoid \'any\' type',
      patterns: '- Server Components by default\n- Use \'use client\' only when needed\n- Leverage Next.js built-in optimizations\n- Use Tailwind for all styling'
    }
  };

  const config = configs[stackType] || configs.react;

  return `# Cursor Rules for ${projectName}

## Language & Framework
${config.language}

## Code Style
${config.style}

## File Organization
${config.organization}

${stackType === 'react' || stackType === 'node' || stackType === 'nextjs' ? `## TypeScript
${config.typescript}

` : ''}## Patterns
${config.patterns}
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
      claude: generateClaudeContent('[Project Name]', 'react'),
      agents: generateAgentsContent('[Project Name]', 'react'),
      cursorrules: generateCursorRules('[Project Name]', 'react'),
    },
  },
  {
    id: 'node-ares',
    name: 'ARÈS',
    description: 'Node.js + Express + TypeScript — Robust backend API',
    tech: ['Node.js', 'Express', 'TypeScript'],
    repo: 'PenielDjss/sira-templates/ares',
    aiFiles: {
      claude: generateClaudeContent('[Project Name]', 'node'),
      agents: generateAgentsContent('[Project Name]', 'node'),
      cursorrules: generateCursorRules('[Project Name]', 'node'),
    },
  },
  {
    id: 'django-athena',
    name: 'ATHÉNA',
    description: 'Django + Python — Structured fullstack framework',
    tech: ['Django', 'Python'],
    repo: 'PenielDjss/sira-templates/athena',
    aiFiles: {
      claude: generateClaudeContent('[Project Name]', 'django'),
      agents: generateAgentsContent('[Project Name]', 'django'),
      cursorrules: generateCursorRules('[Project Name]', 'django'),
    },
  },
  {
    id: 'flask-hera',
    name: 'HÉRA',
    description: 'Flask + Python — Lightweight backend API',
    tech: ['Flask', 'Python'],
    repo: 'PenielDjss/sira-templates/hera',
    aiFiles: {
      claude: generateClaudeContent('[Project Name]', 'flask'),
      agents: generateAgentsContent('[Project Name]', 'flask'),
      cursorrules: generateCursorRules('[Project Name]', 'flask'),
    },
  },
  {
    id: 'next-apollon',
    name: 'APOLLON',
    description: 'Next.js + TypeScript + Tailwind — Modern fullstack React',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    repo: 'PenielDjss/sira-templates/apollon',
    aiFiles: {
      claude: generateClaudeContent('[Project Name]', 'nextjs'),
      agents: generateAgentsContent('[Project Name]', 'nextjs'),
      cursorrules: generateCursorRules('[Project Name]', 'nextjs'),
    },
  },
];

// Made with Bob
