#!/usr/bin/env node

import { intro, outro, text, select, isCancel, confirm } from '@clack/prompts';
import { showLogo, ui, colors } from './ui.js';
import { stacks } from './stacks.js';
import { cloneTemplate } from './clone.js';
import { analyzeProjectDescription } from './agent.js';
import { installDependencies } from './installer.js';

async function main() {
  const command = process.argv[2];
  
  if (command === 'create') {
    await createCommand();
  } else if (command === 'agent') {
    await agentCommand();
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

async function agentCommand() {
  console.clear();
  showLogo();
  intro(colors.primary('🤖 Sira Agent - AI-Powered Project Creation'));
  
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
  
  // 2. Ask for project description
  const description = await text({
    message: 'Describe your project (what will you build?)',
    placeholder: 'A dashboard for managing users with authentication',
    validate: (value) => {
      if (!value || value.length < 10) {
        return 'Please provide a description (at least 10 characters)';
      }
    },
  });
  
  if (isCancel(description)) {
    ui.error('Operation cancelled.');
    process.exit(0);
  }
  
  // 3. Analyze description with AI agent
  console.log('\n' + colors.primary('🧠 Analyzing your project description...\n'));
  
  const analysis = analyzeProjectDescription(description as string);
  
  // 4. Show recommendation
  console.log(colors.success(`✨ Recommendation: ${analysis.recommendedStack.name}`));
  console.log(colors.muted(`   ${analysis.recommendedStack.description}`));
  console.log(colors.muted(`   Confidence: ${analysis.confidence}%`));
  console.log(colors.muted(`   Reasoning: ${analysis.reasoning}\n`));
  
  // Show alternatives if any
  if (analysis.alternatives.length > 0) {
    console.log(colors.muted('Alternative options:'));
    analysis.alternatives.forEach(alt => {
      console.log(colors.muted(`   • ${alt.stack.name} - ${alt.reason}`));
    });
    console.log('');
  }
  
  // 5. Confirm or choose different template
  const useRecommended = await confirm({
    message: `Use ${analysis.recommendedStack.name} template?`,
    initialValue: true,
  });
  
  if (isCancel(useRecommended)) {
    ui.error('Operation cancelled.');
    process.exit(0);
  }
  
  let selectedStack = analysis.recommendedStack;
  
  if (!useRecommended) {
    const stackId = await select({
      message: 'Choose a different template:',
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
    
    selectedStack = stacks.find(st => st.id === stackId)!;
  }
  
  // 6. Ask if user wants to install dependencies
  const shouldInstall = await confirm({
    message: 'Install dependencies automatically?',
    initialValue: true,
  });
  
  if (isCancel(shouldInstall)) {
    ui.error('Operation cancelled.');
    process.exit(0);
  }
  
  // 7. Clone template
  try {
    console.log('\n' + colors.primary('🚀 Creating your project...\n'));
    
    const projectPath = await cloneTemplate(selectedStack, projectName as string, process.cwd(), true);
    
    // 8. Install dependencies if requested
    if (shouldInstall) {
      await installDependencies(projectPath, selectedStack, true);
    }
    
    // 9. Show next steps
    outro(colors.success('\n✨ All done! 🎉'));
    console.log('\nNext steps:');
    console.log(colors.muted(`  cd ${projectName}`));
    
    if (!shouldInstall) {
      console.log(colors.muted('  npm install'));
    }
    
    console.log(colors.muted('  npm run dev'));
    console.log('\n' + colors.primary('📝 Check PROJECT.md for AI context'));
    console.log(colors.primary('Happy coding! ✨\n'));
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
  console.log(colors.primary('  sira create') + ' — Create a new project (manual selection)');
  console.log(colors.primary('  sira agent') + '  — Create with AI-powered template selection');
  console.log(colors.primary('  sira list') + '   — List available templates');
  console.log(colors.primary('  sira --help') + ' — Show this help message\n');
}

main().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  ui.error(errorMessage);
  process.exit(1);
});

// Made with Bob
