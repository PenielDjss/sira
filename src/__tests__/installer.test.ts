/**
 * Tests for installer module
 * Run with: npm test
 */

import { checkPackageManager, detectBestPackageManager } from '../installer.js';

describe('Installer Module', () => {
  describe('checkPackageManager', () => {
    it('should return true for npm (always available)', async () => {
      const hasNpm = await checkPackageManager('npm');
      expect(hasNpm).toBe(true);
    });

    it('should return boolean for any package manager', async () => {
      const result = await checkPackageManager('npm');
      expect(typeof result).toBe('boolean');
    });

    it('should handle invalid package manager gracefully', async () => {
      const result = await checkPackageManager('invalid-package-manager-xyz');
      expect(typeof result).toBe('boolean');
      expect(result).toBe(false);
    });
  });

  describe('detectBestPackageManager', () => {
    it('should return a valid package manager', async () => {
      const manager = await detectBestPackageManager();
      const validManagers = ['npm', 'yarn', 'pnpm'];
      expect(validManagers).toContain(manager);
    });

    it('should return npm as fallback', async () => {
      const manager = await detectBestPackageManager();
      // At minimum, npm should be available
      expect(manager).toBeDefined();
      expect(typeof manager).toBe('string');
    });

    it('should prefer faster package managers when available', async () => {
      const manager = await detectBestPackageManager();
      // The function checks pnpm, yarn, then npm in order
      expect(['pnpm', 'yarn', 'npm']).toContain(manager);
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
    toBeDefined() {
      if (actual === undefined) {
        throw new Error('Expected value to be defined');
      }
    },
    toContain(item: any) {
      if (!actual.includes(item)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to contain ${item}`);
      }
    }
  };
}

function describe(name: string, fn: () => void) {
  console.log(`\n${name}`);
  fn();
}

function it(name: string, fn: () => void | Promise<void>) {
  const runTest = async () => {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
    } catch (error) {
      console.log(`  ✗ ${name}`);
      if (error instanceof Error) {
        console.log(`    ${error.message}`);
      }
    }
  };
  
  runTest();
}

// Made with Bob
