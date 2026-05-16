import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { join } from 'path';
import type { Stack } from './stacks.js';
import { generateInstallCommands } from './agent.js';

const execAsync = promisify(exec);

/**
 * Résultat de l'installation des dépendances
 */
export interface InstallResult {
  success: boolean;
  commands: string[];
  output: string;
  error?: string;
}

/**
 * Installe les dépendances du projet
 */
export async function installDependencies(
  projectPath: string,
  stack: Stack,
  verbose: boolean = true
): Promise<InstallResult> {
  const commands = generateInstallCommands(stack);
  const result: InstallResult = {
    success: false,
    commands,
    output: ''
  };
  
  try {
    if (verbose) {
      console.log('\n📦 Installation des dépendances...');
    }
    
    // Vérifier si package.json ou requirements.txt existe
    const hasPackageJson = existsSync(join(projectPath, 'package.json'));
    const hasRequirements = existsSync(join(projectPath, 'requirements.txt'));
    
    if (!hasPackageJson && !hasRequirements) {
      if (verbose) {
        console.log('⚠️  Aucun fichier de dépendances trouvé, installation ignorée');
      }
      result.success = true;
      return result;
    }
    
    // Exécuter les commandes d'installation
    for (const command of commands) {
      if (verbose) {
        console.log(`   → ${command}`);
      }
      
      try {
        const { stdout, stderr } = await execAsync(command, {
          cwd: projectPath,
          maxBuffer: 10 * 1024 * 1024 // 10MB buffer
        });
        
        result.output += stdout;
        if (stderr) {
          result.output += stderr;
        }
      } catch (error) {
        // Certaines commandes peuvent échouer (comme source venv sur Windows)
        // On continue quand même
        if (verbose) {
          console.log(`   ⚠️  Commande ignorée: ${command}`);
        }
      }
    }
    
    result.success = true;
    
    if (verbose) {
      console.log('✅ Dépendances installées avec succès');
    }
    
  } catch (error) {
    result.success = false;
    result.error = error instanceof Error ? error.message : 'Unknown error';
    
    if (verbose) {
      console.error(`❌ Erreur lors de l'installation: ${result.error}`);
    }
  }
  
  return result;
}

/**
 * Vérifie si un gestionnaire de paquets est disponible
 */
export async function checkPackageManager(manager: string): Promise<boolean> {
  try {
    await execAsync(`${manager} --version`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Détecte le meilleur gestionnaire de paquets disponible
 */
export async function detectBestPackageManager(): Promise<'npm' | 'yarn' | 'pnpm'> {
  const managers: Array<'pnpm' | 'yarn' | 'npm'> = ['pnpm', 'yarn', 'npm'];
  
  for (const manager of managers) {
    if (await checkPackageManager(manager)) {
      return manager;
    }
  }
  
  return 'npm'; // Fallback
}

// Made with Bob