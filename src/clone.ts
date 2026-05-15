import tiged from 'tiged';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import type { Stack } from './stacks.js';

export async function cloneTemplate(
  stack: Stack,
  projectName: string,
  targetDir: string = process.cwd(),
  verbose: boolean = true
): Promise<string> {
  const projectPath = join(targetDir, projectName);
  
  try {
    // 1. Clone template via tiged
    if (verbose) {
      console.log(`\n📦 Cloning template from: ${stack.repo}`);
      console.log(`📁 Target directory: ${projectPath}`);
    }
    
    const emitter = tiged(stack.repo, {
      cache: false,
      force: true,
      verbose: verbose
    });
    
    // Add event listeners for detailed logging
    if (verbose) {
      emitter.on('info', (info: any) => {
        console.log(`ℹ️  ${info.message}`);
      });
      
      emitter.on('warn', (warn: any) => {
        console.log(`⚠️  ${warn.message}`);
      });
    }
    
    await emitter.clone(projectPath);
    
    if (verbose) {
      console.log(`✅ Template cloned successfully`);
    }
    
    // 2. Generate AI context files
    if (verbose) {
      console.log(`\n📝 Generating AI context files...`);
    }
    await generateAIFiles(projectPath, stack, projectName, verbose);
    
    // 3. Update package.json with project name
    if (verbose) {
      console.log(`\n📦 Updating package.json...`);
    }
    await updatePackageJson(projectPath, projectName, verbose);
    
    if (verbose) {
      console.log(`\n✨ Project setup complete!`);
    }
    
    return projectPath;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error(`\n❌ Error during project creation:`);
    console.error(`   Message: ${errorMessage}`);
    
    if (verbose && errorStack) {
      console.error(`\n📋 Stack trace:`);
      const stackLines = errorStack.split('\n').slice(0, 6);
      stackLines.forEach(line => console.error(`   ${line}`));
    }
    
    throw new Error(`Failed to clone template: ${errorMessage}`);
  }
}

async function generateAIFiles(
  projectPath: string,
  stack: Stack,
  projectName: string,
  verbose: boolean = false
): Promise<void> {
  const files = [
    {
      name: 'CLAUDE.md',
      content: stack.aiFiles.claude.replace(/\[Project Name\]/g, projectName)
    },
    {
      name: 'AGENTS.md',
      content: stack.aiFiles.agents.replace(/\[Project Name\]/g, projectName)
    },
    {
      name: '.cursorrules',
      content: stack.aiFiles.cursorrules.replace(/\[Project Name\]/g, projectName)
    },
  ];
  
  for (const file of files) {
    if (verbose) {
      console.log(`   ✓ Creating ${file.name}`);
    }
    await writeFile(
      join(projectPath, file.name),
      file.content,
      'utf-8'
    );
  }
}

async function updatePackageJson(
  projectPath: string,
  projectName: string,
  verbose: boolean = false
): Promise<void> {
  const pkgPath = join(projectPath, 'package.json');
  
  try {
    const pkgContent = await readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(pkgContent);
    
    pkg.name = projectName;
    
    await writeFile(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
    
    if (verbose) {
      console.log(`   ✓ Updated package.json with name: ${projectName}`);
    }
  } catch (error) {
    // If package.json doesn't exist or can't be updated, continue anyway
    if (verbose) {
      console.warn('   ⚠️  Warning: Could not update package.json');
    }
  }
}

// Made with Bob
