import { IamAuthenticator } from '@ibm-cloud/watsonx-ai/authentication';
import type { Stack } from './stacks.js';
import { stacks } from './stacks.js';
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';

/**
 * Agent intelligent qui analyse la description du projet
 * et recommande le meilleur template à utiliser
 */

export interface ProjectAnalysis {
  recommendedStack: Stack;
  confidence: number;
  reasoning: string;
  alternatives: Array<{
    stack: Stack;
    score: number;
    reason: string;
  }>;
}

/**
 * Mots-clés associés à chaque type de stack (pour fallback)
 */
const stackKeywords: Record<string, string[]> = {
  'react-hermes': [
    'react', 'frontend', 'ui', 'interface', 'spa', 'single page',
    'vite', 'component', 'web app', 'dashboard', 'admin panel',
    'interactive', 'client-side', 'browser', 'responsive'
  ],
  'node-ares': [
    'api', 'backend', 'server', 'rest', 'endpoint', 'microservice',
    'node', 'express', 'database', 'authentication', 'auth',
    'service', 'middleware', 'route', 'controller'
  ],
  'django-athena': [
    'django', 'python', 'fullstack', 'orm', 'admin', 'cms',
    'web framework', 'mvc', 'template', 'form', 'model',
    'postgresql', 'mysql', 'database-driven'
  ],
  'flask-hera': [
    'flask', 'python', 'lightweight', 'api', 'backend', 'simple',
    'microservice', 'rest', 'minimal', 'micro', 'endpoint'
  ],
  'next-apollon': [
    'next', 'nextjs', 'fullstack', 'ssr', 'seo', 'blog',
    'landing', 'app router', 'server components', 'react',
    'tailwind', 'modern', 'website'
  ]
};

/**
 * Crée une instance du client WatsonX AI
 */
function createWatsonxClient(apiKey: string, url: string): WatsonXAI {
  const client = WatsonXAI.newInstance({
    version: '2024-05-31',
    serviceUrl: url,
    authenticator: new IamAuthenticator({ apikey: apiKey })
  });
  client.setServiceUrl(url);
  return client;
}

/**
 * Analyse la description du projet avec watsonx.ai
 */
export async function analyzeProjectDescription(description: string): Promise<ProjectAnalysis> {
  // Charger les variables d'environnement
  const apiKey = process.env.WATSONX_APIKEY;
  const projectId = process.env.WATSONX_PROJECT_ID;
  const url = process.env.WATSONX_URL;

  // Si les credentials ne sont pas disponibles, utiliser l'analyse par mots-clés
  if (!apiKey || !projectId || !url) {
    console.warn('⚠️  Watsonx.ai credentials not found, using keyword-based analysis');
    return analyzeWithKeywords(description);
  }

  try {
    // Initialiser le client watsonx.ai
    const watsonxAI = createWatsonxClient(apiKey, url);

    // Préparer les informations sur les stacks disponibles
    const stacksInfo = stacks.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      tech: s.tech
    }));

    // Détecter la langue de la description
    const isFrench = /[àâäéèêëïîôùûüÿçœæ]/i.test(description) ||
                     /\b(je|tu|il|elle|nous|vous|ils|elles|un|une|le|la|les|des|pour|avec|dans)\b/i.test(description);
    
    // Créer le prompt structuré (version courte pour réduire les tokens)
    const prompt = `You are a JSON API. Respond with ONLY valid JSON.
Available stacks: ${JSON.stringify(stacksInfo)}
Project: "${description}"
Language for reasoning: ${isFrench ? 'French' : 'English'}

IMPORTANT: recommendedStackId must be exactly one of these values: ${stacks.map(s => `"${s.id}"`).join(', ')}

Respond with ONLY this JSON, no other text:
{"recommendedStackId":"react-hermes","confidence":85,"reasoning":"your reasoning here","alternatives":[]}`;

    // Appeler l'API watsonx.ai
    const response = await watsonxAI.generateText({
      input: prompt,
      modelId: 'meta-llama/llama-3-3-70b-instruct',
      projectId: projectId,
      parameters: {
        max_new_tokens: 250,  // Réduit pour économiser les tokens
        temperature: 0.1,
        top_p: 0.9,
        top_k: 50,
      }
    });

    // Extraire et parser la réponse
    const generatedText = response.result.results[0].generated_text.trim();
    
    // Nettoyer la réponse (enlever les markdown code blocks si présents)
    let cleanedText = generatedText;
    if (cleanedText.includes('```json')) {
      cleanedText = cleanedText.split('```json')[1].split('```')[0].trim();
    } else if (cleanedText.includes('```')) {
      cleanedText = cleanedText.split('```')[1].split('```')[0].trim();
    }

    // Extraire le JSON de la réponse - trouver le premier objet JSON complet
    let jsonText = '';
    let braceCount = 0;
    let startIndex = -1;
    
    for (let i = 0; i < cleanedText.length; i++) {
      if (cleanedText[i] === '{') {
        if (braceCount === 0) startIndex = i;
        braceCount++;
      } else if (cleanedText[i] === '}') {
        braceCount--;
        if (braceCount === 0 && startIndex !== -1) {
          jsonText = cleanedText.substring(startIndex, i + 1);
          break;
        }
      }
    }
    
    if (!jsonText) {
      console.error('❌ No valid JSON object found in AI response');
      throw new Error('No valid JSON found in response');
    }
    
    const aiResponse = JSON.parse(jsonText);

    // Valider et construire la réponse
    let recommendedStack = stacks.find(s => s.id === aiResponse.recommendedStackId);

    // Si le stack recommandé n'est pas trouvé, utiliser le premier stack disponible (silent fallback)
    if (!recommendedStack) {
      recommendedStack = stacks[0]; // Fallback au premier stack
    }

    const alternatives = (aiResponse.alternatives || [])
      .map((alt: any) => {
        const stack = stacks.find(s => s.id === alt.stackId);
        if (!stack) return null;
        return {
          stack,
          score: alt.score || 0,
          reason: alt.reason || 'Alternative option'
        };
      })
      .filter((alt: any) => alt !== null);

    return {
      recommendedStack,
      confidence: Math.min(100, Math.max(0, aiResponse.confidence || 50)),
      reasoning: aiResponse.reasoning || 'Recommended based on project requirements',
      alternatives
    };

  } catch (error) {
    console.warn('⚠️  Watsonx.ai API error, falling back to keyword analysis:', error instanceof Error ? error.message : 'Unknown error');
    return analyzeWithKeywords(description);
  }
}

/**
 * Analyse par mots-clés (fallback)
 */
function analyzeWithKeywords(description: string): ProjectAnalysis {
  const normalizedDesc = description.toLowerCase();
  const scores: Map<string, number> = new Map();

  // Initialiser les scores
  stacks.forEach(stack => {
    scores.set(stack.id, 0);
  });

  // Calculer les scores basés sur les mots-clés
  stacks.forEach(stack => {
    const keywords = stackKeywords[stack.id] || [];
    let score = 0;

    keywords.forEach(keyword => {
      if (normalizedDesc.includes(keyword)) {
        // Bonus pour les mots-clés exacts
        score += 10;

        // Bonus supplémentaire si le mot-clé apparaît plusieurs fois
        const occurrences = (normalizedDesc.match(new RegExp(keyword, 'g')) || []).length;
        score += (occurrences - 1) * 5;
      }
    });

    scores.set(stack.id, score);
  });

  // Trouver le meilleur score
  const sortedStacks = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1]);

  const [bestStackId, bestScore] = sortedStacks[0];
  const recommendedStack = stacks.find(s => s.id === bestStackId)!;

  // Calculer la confiance (0-100%)
  const totalScore = Array.from(scores.values()).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? Math.min(100, (bestScore / totalScore) * 100) : 0;

  // Générer le raisonnement
  const reasoning = generateReasoning(normalizedDesc, recommendedStack, bestScore);

  // Préparer les alternatives
  const alternatives = sortedStacks
    .slice(1)
    .filter(([_, score]) => score > 0)
    .map(([stackId, score]) => ({
      stack: stacks.find(s => s.id === stackId)!,
      score,
      reason: generateAlternativeReason(normalizedDesc, stacks.find(s => s.id === stackId)!)
    }));

  return {
    recommendedStack,
    confidence: Math.round(confidence),
    reasoning,
    alternatives
  };
}

/**
 * Génère un raisonnement pour la recommandation
 */
function generateReasoning(description: string, stack: Stack, score: number): string {
  const keywords = stackKeywords[stack.id] || [];
  const foundKeywords = keywords.filter(kw => description.includes(kw));

  if (foundKeywords.length === 0) {
    return `${stack.name} est recommandé par défaut pour ce type de projet.`;
  }

  const keywordList = foundKeywords.slice(0, 3).join(', ');
  return `${stack.name} est recommandé car votre description mentionne: ${keywordList}. ` +
    `Ce stack est optimal pour ${stack.description.toLowerCase()}.`;
}

/**
 * Génère une raison pour une alternative
 */
function generateAlternativeReason(description: string, stack: Stack): string {
  const keywords = stackKeywords[stack.id] || [];
  const foundKeywords = keywords.filter(kw => description.includes(kw));

  if (foundKeywords.length > 0) {
    return `Correspond à: ${foundKeywords.slice(0, 2).join(', ')}`;
  }

  return `Alternative possible pour ${stack.description.toLowerCase()}`;
}

/**
 * Interface pour la réponse AI de génération de PROJECT.md
 */
interface ProjectMdAIResponse {
  dependencies: Array<{ name: string; reason: string }>;
  devDependencies: Array<{ name: string; reason: string }>;
  architecture: Array<{ path: string; description: string }>;
  firstSteps: string[];
  conventions: string[];
}

/**
 * Génère un fichier PROJECT.md personnalisé basé sur la description du projet
 */
export async function generateProjectMd(
  projectName: string,
  description: string,
  stack: Stack
): Promise<string> {
  const techStack = stack.tech.join(', ');
  const currentDate = new Date().toISOString().split('T')[0];

  // Try to get AI-generated content
  let aiContent: ProjectMdAIResponse | null = null;
  try {
    aiContent = await generateProjectContent(description, stack);
  } catch (error) {
    // No put console.error in production
    // console.error('PROJECT.md AI error:', error instanceof Error ? error.message : error);
    // fallback to static
  }

  // Build the PROJECT.md with AI-generated sections or fallback
  const aiSections = aiContent ? buildAISections(projectName, aiContent, stack) : buildFallbackSections(stack);

  return `# ${projectName}

> Generated by Sira on ${currentDate}

## 📋 Project Overview

${description}

## 🎯 Project Goals

This project aims to:
- Deliver a high-quality ${stack.description.toLowerCase()}
- Leverage modern technologies (${techStack})
- Maintain clean, maintainable code
- Follow best practices and industry standards

## 🛠️ Tech Stack

${stack.tech.map(tech => `- **${tech}**`).join('\n')}

**Template:** ${stack.name} (${stack.id})

${aiSections}

## 📁 Project Structure

\`\`\`
${projectName}/
├── src/              # Source code
├── public/           # Static assets (if applicable)
├── tests/            # Test files
├── .cursorrules      # Cursor AI rules
├── AGENTS.md         # AI agents context
├── CLAUDE.md         # Claude AI context
└── PROJECT.md        # This file
\`\`\`

## 🤖 AI Assistance Guidelines

This project is optimized for AI-assisted development. When working with AI coding assistants:

### Context Files
- **CLAUDE.md** — Specific context for Claude AI
- **AGENTS.md** — General AI agent guidelines
- **.cursorrules** — Cursor IDE specific rules

### Best Practices
1. **Understand the Stack**: Familiarize yourself with ${techStack}
2. **Follow Conventions**: Maintain consistency with existing code patterns
3. **Type Safety**: Use TypeScript types throughout (if applicable)
4. **Testing**: Write tests for new features
5. **Documentation**: Keep docs updated as the project evolves

### Common AI Tasks
- **Feature Development**: "Add a new [feature] that does [X]"
- **Bug Fixes**: "Fix the issue where [Y] happens"
- **Refactoring**: "Refactor [component/module] to improve [Z]"
- **Testing**: "Write tests for [functionality]"
- **Documentation**: "Document the [feature/API/component]"

## 🚀 Getting Started

### Installation
\`\`\`bash
${stack.tech.includes('Python') ? 'python -m venv venv\nsource venv/bin/activate\npip install -r requirements.txt' : 'npm install'}
\`\`\`

### Development
\`\`\`bash
${stack.tech.includes('Python') ? 'python manage.py runserver' : 'npm run dev'}
\`\`\`

### Build
\`\`\`bash
${stack.tech.includes('Python') ? 'python manage.py collectstatic' : 'npm run build'}
\`\`\`

## 📝 Development Notes

### Key Features to Implement
- [ ] Core functionality based on project description
- [ ] User interface (if applicable)
- [ ] API endpoints (if applicable)
- [ ] Testing suite
- [ ] Documentation

### Architecture Decisions
- **Stack Choice**: ${stack.name} was selected because it aligns with the project requirements for ${description.toLowerCase()}
- **Structure**: Following ${stack.name} conventions for optimal development experience
- **Tooling**: Leveraging modern development tools for productivity

## 🤝 Contributing

When contributing to this project:
1. Follow the existing code style
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation as needed
5. Use AI assistants to maintain code quality

## 📚 Resources

- [${stack.name} Documentation](${stack.repo})
${stack.tech.map(tech => `- [${tech} Documentation](https://www.google.com/search?q=${encodeURIComponent(tech + ' documentation')})`).join('\n')}

---

**Built with ❤️ using Sira CLI**
`;
}

/**
 * Détecte le gestionnaire de paquets à utiliser
 */
export function detectPackageManager(stack: Stack): 'npm' | 'pip' | 'yarn' | 'pnpm' {
  // Pour Python (Django et Flask)
  if (stack.id === 'django-athena' || stack.id === 'flask-hera' || stack.tech.includes('Python')) {
    return 'pip';
  }

  // Pour Node.js et Next.js (node-ares, next-apollon, react-hermes)
  if (stack.id === 'node-ares' || stack.id === 'next-apollon' || stack.id === 'react-hermes') {
    return 'npm';
  }

  // Par défaut, utiliser npm
  return 'npm';
}

/**
 * Génère les commandes d'installation pour un stack
 */
export function generateInstallCommands(stack: Stack): string[] {
  const packageManager = detectPackageManager(stack);

  switch (packageManager) {
    case 'pip':
      return [
        'python -m venv venv',
        'source venv/bin/activate',  // Linux/Mac
        'pip install -r requirements.txt'
      ];
    case 'npm':
      return ['npm install'];
    case 'yarn':
      return ['yarn install'];
    case 'pnpm':
      return ['pnpm install'];
    default:
      return ['npm install'];
  }
}

/**
 * Génère le contenu du projet avec watsonx.ai
 */
async function generateProjectContent(
  description: string,
  stack: Stack
): Promise<ProjectMdAIResponse> {
  const apiKey = process.env.WATSONX_APIKEY;
  const projectId = process.env.WATSONX_PROJECT_ID;
  const url = process.env.WATSONX_URL;

  if (!apiKey || !projectId || !url) {
    throw new Error('Watsonx.ai credentials not available');
  }

  // Initialiser le client watsonx.ai
  const watsonxAI = createWatsonxClient(apiKey, url);

  const prompt = `{"dependencies":[{"name":"react-router-dom","reason":"Client-side routing"},{"name":"axios","reason":"HTTP requests"},{"name":"zustand","reason":"State management"}],"devDependencies":[{"name":"@types/react","reason":"TypeScript types for React"},{"name":"vitest","reason":"Unit testing"}],"architecture":[{"path":"src/components/","description":"Reusable UI components"},{"path":"src/pages/","description":"Page-level components"},{"path":"src/hooks/","description":"Custom React hooks"},{"path":"src/utils/","description":"Helper functions"},{"path":"src/api/","description":"API client and endpoints"}],"firstSteps":["Create the main App component with routing structure","Set up the state management store","Build the core UI components (Header, Footer, Layout)","Implement the first feature page","Add API integration and error handling"],"conventions":["Use functional components with hooks","Follow the single responsibility principle","Keep components under 200 lines","Use TypeScript for all files","Write unit tests for utilities and hooks"]}

Now generate the same JSON structure for this project:
Project: "${description}"
Stack: ${stack.tech.join(', ')}

RESPOND WITH ONLY THE JSON OBJECT. NO TEXT BEFORE OR AFTER.`;

  const response = await watsonxAI.generateText({
    input: prompt,
    modelId: 'meta-llama/llama-3-3-70b-instruct',
    projectId: projectId,
    parameters: {
      max_new_tokens: 500,
      temperature: 0.0,
      top_p: 0.9,
      top_k: 50,
    }
  });

  const generatedText = response.result.results[0].generated_text.trim();

  // Nettoyer la réponse (enlever les markdown code blocks si présents)
  let cleanedText = generatedText;
  if (cleanedText.includes('```json')) {
    cleanedText = cleanedText.split('```json')[1].split('```')[0].trim();
  } else if (cleanedText.includes('```')) {
    cleanedText = cleanedText.split('```')[1].split('```')[0].trim();
  }

  // Extraire le JSON de la réponse
  let jsonText = '';
  let braceCount = 0;
  let startIndex = -1;

  for (let i = 0; i < cleanedText.length; i++) {
    if (cleanedText[i] === '{') {
      if (braceCount === 0) startIndex = i;
      braceCount++;
    } else if (cleanedText[i] === '}') {
      braceCount--;
      if (braceCount === 0 && startIndex !== -1) {
        jsonText = cleanedText.substring(startIndex, i + 1);
        break;
      }
    }
  }

  if (!jsonText) {
    throw new Error('No valid JSON found in AI response');
  }

  const aiResponse = JSON.parse(jsonText);

  // Valider et retourner la réponse
  return {
    dependencies: (aiResponse.dependencies || []).slice(0, 6),
    devDependencies: (aiResponse.devDependencies || []).slice(0, 3),
    architecture: (aiResponse.architecture || []).slice(0, 6),
    firstSteps: (aiResponse.firstSteps || []).slice(0, 5),
    conventions: (aiResponse.conventions || []).slice(0, 4)
  };
}

/**
 * Construit les sections AI-générées du PROJECT.md
 */
function buildAISections(projectName: string, aiContent: ProjectMdAIResponse, stack: Stack): string {
  const sections: string[] = [];

  // Section Dependencies
  if (aiContent.dependencies.length > 0 || aiContent.devDependencies.length > 0) {
    sections.push('## 📦 Recommended Dependencies\n');
    
    if (aiContent.dependencies.length > 0) {
      sections.push('| Package | Purpose |');
      sections.push('|---------|---------|');
      aiContent.dependencies.forEach(dep => {
        sections.push(`| ${dep.name} | ${dep.reason} |`);
      });
      sections.push('');
    }

    // Install command
    const allDeps = aiContent.dependencies.map(d => d.name);
    if (allDeps.length > 0) {
      sections.push('## ⚡ Install Dependencies\n');
      sections.push('```bash');
      // Use pip for Python stacks, npm for others
      const isPythonStack = stack.tech.includes('Python') || stack.tech.includes('Django') || stack.tech.includes('Flask');
      const installCmd = isPythonStack ? `pip install ${allDeps.join(' ')}` : `npm install ${allDeps.join(' ')}`;
      sections.push(installCmd);
      sections.push('```\n');
    }
  }

  // Section Architecture
  if (aiContent.architecture.length > 0) {
    sections.push('## 🏗️ Suggested Architecture\n');
    sections.push('```');
    sections.push(`${projectName}/`);
    aiContent.architecture.forEach(arch => {
      sections.push(`  ${arch.path.padEnd(20)} # ${arch.description}`);
    });
    sections.push('```\n');
  }

  // Section First Steps
  if (aiContent.firstSteps.length > 0) {
    sections.push('## 🎯 First Steps for Your AI Assistant\n');
    aiContent.firstSteps.forEach((step, index) => {
      sections.push(`${index + 1}. ${step}`);
    });
    sections.push('');
  }

  // Section Conventions
  if (aiContent.conventions.length > 0) {
    sections.push('## 📐 Project Conventions\n');
    aiContent.conventions.forEach(convention => {
      sections.push(`- ${convention}`);
    });
    sections.push('');
  }

  return sections.join('\n');
}

/**
 * Construit les sections de fallback basées sur le stack
 */
function buildFallbackSections(stack: Stack): string {
  const sections: string[] = [];

  // Basic dependencies based on stack
  const basicDeps: Record<string, string[]> = {
    'react-hermes': ['react', 'react-dom', 'vite'],
    'node-ares': ['express', 'dotenv', 'cors'],
    'django-athena': [],  // Python uses requirements.txt
    'flask-hera': ['flask', 'flask-cors', 'python-dotenv'],
    'next-apollon': ['next', 'react', 'react-dom']
  };

  const deps = basicDeps[stack.id] || [];
  
  if (deps.length > 0) {
    sections.push('## 📦 Recommended Dependencies\n');
    sections.push('| Package | Purpose |');
    sections.push('|---------|---------|');
    deps.forEach(dep => {
      sections.push(`| ${dep} | Core dependency for ${stack.name} |`);
    });
    sections.push('');

    sections.push('## ⚡ Install Dependencies\n');
    sections.push('```bash');
    // Use pip for Python stacks, npm for others
    const isPythonStack = stack.tech.includes('Python') || stack.tech.includes('Django') || stack.tech.includes('Flask');
    const installCmd = isPythonStack ? `pip install ${deps.join(' ')}` : `npm install ${deps.join(' ')}`;
    sections.push(installCmd);
    sections.push('```\n');
  }

  return sections.join('\n');
}

// Made with Bob