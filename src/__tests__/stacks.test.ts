/**
 * Tests for stacks module
 * Run with: npm test
 */

import { stacks } from '../stacks.js';
import type { Stack } from '../stacks.js';

describe('Stacks Module', () => {
  describe('stacks array', () => {
    it('should contain at least one stack', () => {
      expect(stacks.length).toBeGreaterThan(0);
    });

    it('should have valid stack structure', () => {
      stacks.forEach((stack: Stack) => {
        expect(stack).toHaveProperty('id');
        expect(stack).toHaveProperty('name');
        expect(stack).toHaveProperty('description');
        expect(stack).toHaveProperty('tech');
        expect(stack).toHaveProperty('repo');
        expect(stack).toHaveProperty('aiFiles');
      });
    });

    it('should have unique stack IDs', () => {
      const ids = stacks.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have non-empty tech arrays', () => {
      stacks.forEach((stack: Stack) => {
        expect(Array.isArray(stack.tech)).toBe(true);
        expect(stack.tech.length).toBeGreaterThan(0);
      });
    });

    it('should have valid AI files structure', () => {
      stacks.forEach((stack: Stack) => {
        expect(stack.aiFiles).toHaveProperty('claude');
        expect(stack.aiFiles).toHaveProperty('agents');
        expect(stack.aiFiles).toHaveProperty('cursorrules');
        
        expect(typeof stack.aiFiles.claude).toBe('string');
        expect(typeof stack.aiFiles.agents).toBe('string');
        expect(typeof stack.aiFiles.cursorrules).toBe('string');
      });
    });
  });

  describe('react-hermes stack', () => {
    const hermesStack = stacks.find(s => s.id === 'react-hermes');

    it('should exist', () => {
      expect(hermesStack).toBeDefined();
    });

    it('should have correct name', () => {
      expect(hermesStack?.name).toBe('HERMÈS');
    });

    it('should include React in tech stack', () => {
      expect(hermesStack?.tech).toContain('React');
    });

    it('should have non-empty AI files', () => {
      expect(hermesStack?.aiFiles.claude.length).toBeGreaterThan(0);
      expect(hermesStack?.aiFiles.agents.length).toBeGreaterThan(0);
      expect(hermesStack?.aiFiles.cursorrules.length).toBeGreaterThan(0);
    });
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
    toBeDefined() {
      if (actual === undefined) {
        throw new Error('Expected value to be defined');
      }
    },
    toHaveProperty(prop: string) {
      if (!(prop in actual)) {
        throw new Error(`Expected object to have property ${prop}`);
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

// Made with Bob
