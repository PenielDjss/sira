#!/usr/bin/env node
/**
 * Simple test runner for Sira
 * Run with: npm test or tsx src/__tests__/run-tests.ts
 */

import { analyzeProjectDescription, detectPackageManager, generateInstallCommands } from '../agent.js';
import { stacks } from '../stacks.js';
import { checkPackageManager, detectBestPackageManager } from '../installer.js';

// Test utilities
let passedTests = 0;
let failedTests = 0;

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
        throw new Error(`Expected ${JSON.stringify(actual)} to contain ${item}`);
      }
    },
    toHaveProperty(prop: string) {
      if (!(prop in actual)) {
        throw new Error(`Expected object to have property ${prop}`);
      }
    }
  };
}

function describe(name: string, fn: () => void | Promise<void>) {
  console.log(`\n${name}`);
  return fn();
}

function it(name: string, fn: () => void | Promise<void>) {
  const runTest = async () => {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passedTests++;
    } catch (error) {
      console.log(`  ✗ ${name}`);
      if (error instanceof Error) {
        console.log(`    ${error.message}`);
      }
      failedTests++;
    }
  };
  
  return runTest();
}

// Test Suite 1: Agent Module
async function testAgentModule() {
  await describe('Agent Module', async () => {
    await describe('analyzeProjectDescription', async () => {
      await it('should recommend React template for frontend keywords', () => {
        const description = 'I want to build a dashboard with React and interactive UI components';
        const analysis = analyzeProjectDescription(description);
        
        expect(analysis.recommendedStack.id).toBe('react-hermes');
        expect(analysis.confidence).toBeGreaterThan(0);
      });

      await it('should provide alternatives when multiple templates match', () => {
        const description = 'Build a web application with database and API';
        const analysis = analyzeProjectDescription(description);
        
        expect(analysis.recommendedStack).toBeDefined();
        expect(analysis.alternatives).toBeDefined();
        expect(Array.isArray(analysis.alternatives)).toBe(true);
      });

      await it('should handle generic descriptions', () => {
        const description = 'I want to build something cool';
        const analysis = analyzeProjectDescription(description);
        
        expect(analysis.recommendedStack).toBeDefined();
        expect(analysis.confidence).toBeGreaterThanOrEqual(0);
      });
    });

    await describe('detectPackageManager', async () => {
      await it('should return npm for React stack', () => {
        const reactStack = stacks[0];
        const manager = detectPackageManager(reactStack);
        
        expect(manager).toBe('npm');
      });

      await it('should return pip for Python stacks', () => {
        const pythonStack = {
          id: 'django-athena',
          name: 'ATHÉNA',
          description: 'Django + Python',
          tech: ['Django', 'Python'],
          repo: 'test/repo',
          aiFiles: { claude: '', agents: '', cursorrules: '' }
        };
        
        const manager = detectPackageManager(pythonStack);
        expect(manager).toBe('pip');
      });
    });

    await describe('generateInstallCommands', async () => {
      await it('should generate npm install for React stack', () => {
        const reactStack = stacks[0];
        const commands = generateInstallCommands(reactStack);
        
        expect(commands).toContain('npm install');
        expect(Array.isArray(commands)).toBe(true);
      });
    });
  });
}

// Test Suite 2: Stacks Module
async function testStacksModule() {
  await describe('Stacks Module', async () => {
    await it('should contain at least one stack', () => {
      expect(stacks.length).toBeGreaterThan(0);
    });

    await it('should have valid stack structure', () => {
      stacks.forEach((stack) => {
        expect(stack).toHaveProperty('id');
        expect(stack).toHaveProperty('name');
        expect(stack).toHaveProperty('description');
        expect(stack).toHaveProperty('tech');
        expect(stack).toHaveProperty('repo');
        expect(stack).toHaveProperty('aiFiles');
      });
    });

    await it('should have unique stack IDs', () => {
      const ids = stacks.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
}

// Test Suite 3: Installer Module
async function testInstallerModule() {
  await describe('Installer Module', async () => {
    await it('should check if npm is available', async () => {
      const hasNpm = await checkPackageManager('npm');
      expect(hasNpm).toBe(true);
    });

    await it('should detect best package manager', async () => {
      const manager = await detectBestPackageManager();
      const validManagers = ['npm', 'yarn', 'pnpm'];
      expect(validManagers).toContain(manager);
    });

    await it('should handle invalid package manager gracefully', async () => {
      const result = await checkPackageManager('invalid-package-manager-xyz');
      expect(typeof result).toBe('boolean');
      expect(result).toBe(false);
    });
  });
}

// Run all tests
async function runAllTests() {
  console.log('\n🧪 Running Sira Tests\n');
  console.log('='.repeat(50));
  
  await testAgentModule();
  await testStacksModule();
  await testInstallerModule();
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📊 Total: ${passedTests + failedTests}\n`);
  
  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});

// Made with Bob
