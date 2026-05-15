#!/usr/bin/env node

import { intro, outro, text, select, isCancel } from '@clack/prompts';
import { showLogo, ui, colors } from './ui.js';
import { stacks } from './stacks.js';
import { cloneTemplate } from './clone.js';

async function main() {
  const command = process.argv[2];
  
  if (command === 'create') {
    await createCommand();
  } else if (command === 'list') {
    await listCommand();
  } else {
    showHelp();
  }
}

async function createCommand() {
  console.clear();
  showLogo();
  intro(colors.primary('Create a new project'));
  
  // 1. Ask project name
  const projectName = await text({
    message: 'Project name?',
    placeholder: 'my-awesome-app',
    validate: (value) => {
      if (!value) return 'Project name is required';
      if (!/^[a-z0-9-]+$/.test(value)) {
        return 'Use lowercase letters, numbers, and hyphens only';
      }
    },
  });
  
  if (isCancel(projectName)) {
    ui.error('Operation cancelled.');
    process.exit(0);
  }
  
  // 2. Select template
  const stackId = await select({
    message: 'Choose a template:',
    options: stacks.map(s => ({
      value: s.id,
      label: `${s.name} — ${s.description}`,
      hint: s.tech.join(', '),
    })),
  });
  
  if (isCancel(stackId)) {
    ui.error('Operation cancelled.');
    process.exit(0);
  }
  
  // 3. Clone template
  try {
    const stack = stacks.find(st => st.id === stackId);
    if (!stack) throw new Error('Template not found');
    
    console.log('\n' + colors.primary('🚀 Starting project creation...\n'));
    
    await cloneTemplate(stack, projectName as string, process.cwd(), true);
    
    // 4. Show next steps
    outro(colors.success('\n✨ All done! 🎉'));
    console.log('\nNext steps:');
    console.log(colors.muted(`  cd ${projectName}`));
    console.log(colors.muted('  npm install'));
    console.log(colors.muted('  npm run dev'));
    console.log('\n' + colors.primary('Happy coding! ✨\n'));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log('\n');
    ui.error('Failed to create project');
    console.log(colors.muted(`\nReason: ${errorMessage}\n`));
    process.exit(1);
  }
}

async function listCommand() {
  console.clear();
  showLogo();
  console.log(colors.bold('\nAvailable templates:\n'));
  
  stacks.forEach(stack => {
    console.log(colors.primary(`  ${stack.name}`));
    console.log(`  ${stack.description}`);
    console.log(colors.muted(`  Tech: ${stack.tech.join(', ')}\n`));
  });
}

function showHelp() {
  console.clear();
  showLogo();
  console.log('\nUsage:');
  console.log(colors.primary('  sira create') + ' — Create a new project');
  console.log(colors.primary('  sira list') + '   — List available templates');
  console.log(colors.primary('  sira --help') + ' — Show this help message\n');
}

main().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  ui.error(errorMessage);
  process.exit(1);
});

// Made with Bob
