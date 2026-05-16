/**
 * Tests for agent module
 * Run with: npm test
 */

import { analyzeProjectDescription, detectPackageManager, generateInstallCommands } from '../agent.js';
import { stacks } from '../stacks.js';

describe('Agent Module', () => {
  describe('analyzeProjectDescription', () => {
    it('should recommend React template for frontend keywords', () => {
      const description = 'I want to build a dashboard with React and interactive UI components';
      const analysis = analyzeProjectDescription(description);
      
      expect(analysis.recommendedStack.id).toBe('react-hermes');
      expect(analysis.confidence).toBeGreaterThan(0);
      expect(analysis.reasoning).toContain('react');
    });

    it('should provide alternatives when multiple templates match', () => {
      const description = 'Build a web application with database and API';
      const analysis = analyzeProjectDescription(description);
      
      expect(analysis.recommendedStack).toBeDefined();
      expect(analysis.alternatives).toBeDefined();
      expect(Array.isArray(analysis.alternatives)).toBe(true);
    });

    it('should handle generic descriptions with default recommendation', () => {
      const description = 'I want to build something cool';
      const analysis = analyzeProjectDescription(description);
      
      expect(analysis.recommendedStack).toBeDefined();
      expect(analysis.confidence).toBeGreaterThanOrEqual(0);
      expect(analysis.reasoning).toBeDefined();
    });

    it('should calculate confidence based on keyword matches', () => {
      const strongMatch = 'React frontend SPA with Vite and TypeScript components';
      const weakMatch = 'Build an application';
      
      const strongAnalysis = analyzeProjectDescription(strongMatch);
      const weakAnalysis = analyzeProjectDescription(weakMatch);
      
      expect(strongAnalysis.confidence).toBeGreaterThan(weakAnalysis.confidence);
    });

    it('should include reasoning in the analysis', () => {
      const description = 'Create a React dashboard with interactive UI';
      const analysis = analyzeProjectDescription(description);
      
      expect(analysis.reasoning).toBeDefined();
      expect(typeof analysis.reasoning).toBe('string');
      expect(analysis.reasoning.length).toBeGreaterThan(0);
    });
  });

  describe('detectPackageManager', () => {
    it('should return pip for Python/Django stacks', () => {
      const djangoStack = {
        id: 'django-athena',
        name: 'ATHÉNA',
        description: 'Django + Python',
        tech: ['Django', 'Python'],
        repo: 'test/repo',
        aiFiles: { claude: '', agents: '', cursorrules: '' }
      };
      
      const manager = detectPackageManager(djangoStack);
      expect(manager).toBe('pip');
    });

    it('should return npm for Node.js/React stacks by default', () => {
      const reactStack = stacks[0]; // react-hermes
      const manager = detectPackageManager(reactStack);
      
      expect(manager).toBe('npm');
    });

    it('should handle stacks with Python in tech array', () => {
      const pythonStack = {
        id: 'python-test',
        name: 'TEST',
        description: 'Test Python stack',
        tech: ['Python', 'Flask'],
        repo: 'test/repo',
        aiFiles: { claude: '', agents: '', cursorrules: '' }
      };
      
      const manager = detectPackageManager(pythonStack);
      expect(manager).toBe('pip');
    });
  });
  
  // Simple test runner for Node.js (no Jest required)
  function expect(actual: any) {
    return {
      toBe(expected: any) {
        if (actual !== expected) {
          throw new Error(`Expected ${actual} to be ${expected}`);
        }
      },
      toBeGreaterThan(expected: number) {
        if (actual <= expected) {
          throw new Error(`Expected ${actual} to be greater than ${expected}`);
        }
      },
      toBeGreaterThanOrEqual(expected: number) {
        if (actual < expected) {
          throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
        }
      },
      toBeDefined() {
        if (actual === undefined) {
          throw new Error('Expected value to be defined');
        }
      },
      toContain(item: any) {
        if (!actual.includes(item)) {
          throw new Error(`Expected ${actual} to contain ${item}`);
        }
      }
    };
  }
  
  function describe(name: string, fn: () => void) {
    console.log(`\n${name}`);
    fn();
  }
  
  function it(name: string, fn: () => void) {
    try {
      fn();
      console.log(`  ✓ ${name}`);
    } catch (error) {
      console.log(`  ✗ ${name}`);
      if (error instanceof Error) {
        console.log(`    ${error.message}`);
      }
    }
  }

  describe('generateInstallCommands', () => {
    it('should generate npm install for React stack', () => {
      const reactStack = stacks[0];
      const commands = generateInstallCommands(reactStack);
      
      expect(commands).toContain('npm install');
      expect(Array.isArray(commands)).toBe(true);
    });

    it('should generate pip commands for Python stack', () => {
      const pythonStack = {
        id: 'django-athena',
        name: 'ATHÉNA',
        description: 'Django + Python',
        tech: ['Django', 'Python'],
        repo: 'test/repo',
        aiFiles: { claude: '', agents: '', cursorrules: '' }
      };
      
      const commands = generateInstallCommands(pythonStack);
      
      expect(commands.length).toBeGreaterThan(0);
      expect(commands.some(cmd => cmd.includes('pip'))).toBe(true);
      expect(commands.some(cmd => cmd.includes('venv'))).toBe(true);
    });

    it('should return array of commands', () => {
      const stack = stacks[0];
      const commands = generateInstallCommands(stack);
      
      expect(Array.isArray(commands)).toBe(true);
      expect(commands.length).toBeGreaterThan(0);
      commands.forEach(cmd => {
        expect(typeof cmd).toBe('string');
      });
    });
  });
});

// Made with Bob
