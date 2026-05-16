import type { Stack } from './stacks.js';
import { stacks } from './stacks.js';

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
 * Mots-clés associés à chaque type de stack
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
  ]
};

/**
 * Analyse la description du projet et recommande un stack
 */
export function analyzeProjectDescription(description: string): ProjectAnalysis {
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
 * Détecte le gestionnaire de paquets à utiliser
 */
export function detectPackageManager(stack: Stack): 'npm' | 'pip' | 'yarn' | 'pnpm' {
  // Pour Python/Django
  if (stack.id.includes('django') || stack.tech.includes('Python')) {
    return 'pip';
  }
  
  // Pour Node.js, vérifier si yarn ou pnpm est disponible
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

// Made with Bob