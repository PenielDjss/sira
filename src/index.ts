#!/usr/bin/env node

import { intro, outro, text, select, isCancel, confirm, spinner } from '@clack/prompts';
import { showLogo, showCompactLogo, ui, colors, streamText, showBanner } from './ui.js';
import { stacks } from './stacks.js';
import { cloneTemplate } from './clone.js';
import { analyzeProjectDescription } from './agent.js';
import { installDependencies } from './installer.js';
import 'dotenv/config';

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
  intro(colors.bold(colors.primary('✨ Create a new project')));
  
  ui.hint('Manual template selection mode');
  
  // 1. Ask project name
  ui.step(1, 3, 'Project Configuration');
  const projectName = await text({
    message: 'What should we call your project?',
    placeholder: 'my-awesome-app',
    validate: (value) => {
      if (!value) return 'Project name is required';
      if (!/^[a-z0-9-]+$/.test(value)) {
        return 'Use lowercase letters, numbers, and hyphens only';
      }
    },
  });
  
  if (isCancel(projectName)) {
    ui.error('Operation cancelled');
    process.exit(0);
  }
  
  // 2. Select template
  ui.step(2, 3, 'Template Selection');
  const stackId = await select({
    message: 'Choose your stack:',
    options: stacks.map(s => ({
      value: s.id,
      label: `${s.name}`,
      hint: s.description,
    })),
  });
  
  if (isCancel(stackId)) {
    ui.error('Operation cancelled');
    process.exit(0);
  }
  
  // 3. Clone template
  try {
    const stack = stacks.find(st => st.id === stackId);
    if (!stack) throw new Error('Template not found');
    
    ui.step(3, 3, 'Project Creation');
    showBanner('🚀 Creating your project', 'info');
    
    await cloneTemplate(stack, projectName as string, process.cwd(), true);
    
    // 4. Show next steps
    outro(colors.success('✨ Project created successfully!'));
    
    ui.nextSteps([
      `cd ${projectName}`,
      'npm install',
      'npm run dev'
    ]);
    
    ui.hint('Your project is ready to go! Happy coding! 🎉');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    ui.error(`Failed to create project: ${errorMessage}`);
    process.exit(1);
  }
}

async function agentCommand() {
  console.clear();
  showLogo();
  intro(colors.bold(colors.primary('🤖 AI-Powered Project Creation')));
  
  ui.hint('Let AI analyze your project and recommend the best stack');
  
  // 1. Ask project name
  ui.step(1, 5, 'Project Configuration');
  const projectName = await text({
    message: 'What should we call your project?',
    placeholder: 'my-awesome-app',
    validate: (value) => {
      if (!value) return 'Project name is required';
      if (!/^[a-z0-9-]+$/.test(value)) {
        return 'Use lowercase letters, numbers, and hyphens only';
      }
    },
  });
  
  if (isCancel(projectName)) {
    ui.error('Operation cancelled');
    process.exit(0);
  }
  
  // 2. Ask for project description
  ui.step(2, 5, 'Project Description');
  const description = await text({
    message: 'Describe what you want to build:',
    placeholder: 'A dashboard for managing users with authentication',
    validate: (value) => {
      if (!value || value.length < 10) {
        return 'Please provide a description (at least 10 characters)';
      }
    },
  });
  
  if (isCancel(description)) {
    ui.error('Operation cancelled');
    process.exit(0);
  }
  
  // 3. Analyze description with AI agent
  ui.step(3, 5, 'AI Analysis');
  const s = spinner();
  s.start(colors.primary('🧠 Analyzing your project with watsonx.ai'));
  
  const analysis = await analyzeProjectDescription(description as string);
  
  s.stop(colors.success('✓ Analysis complete'));
  
  // 4. Show recommendation with streaming effect
  console.log('');
  console.log(colors.dim('  ────────────────────────────────────────'));
  console.log('  ' + colors.bold('  ✦ AI Recommendation'));
  console.log(colors.dim('  ────────────────────────────────────────'));
  console.log('');
  console.log('  ' + colors.primary('Stack      ') +
              colors.bold(analysis.recommendedStack.name));
  console.log('  ' + colors.primary('Tech       ') +
              colors.dim(analysis.recommendedStack.tech.join(' · ')));
  console.log('  ' + colors.primary('Confidence ') +
              colors.primary('█'.repeat(Math.round(analysis.confidence/10))) +
              colors.dim('░'.repeat(10 - Math.round(analysis.confidence/10))) +
              ' ' + analysis.confidence + '%');
  console.log('');
  console.log(colors.dim('  ────────────────────────────────────────'));
  console.log('');
  
  console.log(colors.bold('💭 Reasoning:'));
  process.stdout.write('   ');
  await streamText(analysis.reasoning, 12);
  console.log('\n');
  
  // Show alternatives if any
  if (analysis.alternatives.length > 0) {
    ui.section('Alternative Options');
    analysis.alternatives.forEach(alt => {
      ui.feature('•', `${colors.secondary(alt.stack.name)} - ${colors.dim(alt.reason)}`);
    });
    console.log('');
  }
  
  // 5. Confirm or choose different template
  ui.step(4, 5, 'Template Selection');
  const useRecommended = await confirm({
    message: `Use ${colors.bold(analysis.recommendedStack.name)} template?`,
    initialValue: true,
  });
  
  if (isCancel(useRecommended)) {
    ui.error('Operation cancelled');
    process.exit(0);
  }
  
  let selectedStack = analysis.recommendedStack;
  
  if (!useRecommended) {
    const stackId = await select({
      message: 'Choose a different template:',
      options: stacks.map(s => ({
        value: s.id,
        label: `${s.name}`,
        hint: s.description,
      })),
    });
    
    if (isCancel(stackId)) {
      ui.error('Operation cancelled');
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
    ui.error('Operation cancelled');
    process.exit(0);
  }
  
  // 7. Clone template
  try {
    ui.step(5, 5, 'Project Creation');
    showBanner('🚀 Building your project', 'info');
    
    const projectPath = await cloneTemplate(
      selectedStack,
      projectName as string,
      process.cwd(),
      true,
      description as string
    );
    
    // 8. Install dependencies if requested
    if (shouldInstall) {
      await installDependencies(projectPath, selectedStack, true);
    }
    
    // 9. Show next steps
    outro(colors.success('✨ Project created successfully!'));
    
    const steps = [
      `cd ${projectName}`,
      ...(shouldInstall ? [] : ['npm install']),
      'npm run dev'
    ];
    
    ui.nextSteps(steps);
    ui.hint('📝 Check PROJECT.md for AI-generated context and guidance');
    ui.hint('🎉 Happy coding!');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    ui.error(`Failed to create project: ${errorMessage}`);
    process.exit(1);
  }
}

async function listCommand() {
  console.clear();
  showCompactLogo();
  
  ui.section('Available Templates');
  console.log('');
  
  stacks.forEach((stack, index) => {
    console.log(colors.bold(colors.primary(`  ${index + 1}. ${stack.name}`)));
    console.log(`     ${colors.dim(stack.description)}`);
    console.log(`     ${colors.secondary('Tech:')} ${colors.dim(stack.tech.join(' • '))}`);
    if (index < stacks.length - 1) {
      console.log('');
    }
  });
  
  console.log('\n');
  ui.hint('Use "sira create" to start a new project');
  ui.hint('Use "sira agent" for AI-powered template selection');
  console.log('');
}

function showHelp() {
  console.clear();
  showLogo();
  
  ui.section('Usage');
  console.log('');
  
  const commands = [
    { cmd: 'sira create', desc: 'Create a new project (manual template selection)' },
    { cmd: 'sira agent', desc: 'Create with AI-powered template recommendation' },
    { cmd: 'sira list', desc: 'List all available templates' },
    { cmd: 'sira --help', desc: 'Show this help message' },
  ];
  
  commands.forEach(({ cmd, desc }) => {
    console.log(`  ${colors.bold(colors.primary(cmd.padEnd(15)))} ${colors.dim('→')} ${desc}`);
  });
  
  console.log('');
  ui.divider();
  
  ui.section('Examples');
  console.log('');
  ui.code('sira create');
  console.log(colors.dim('     Interactive project creation with manual template selection\n'));
  
  ui.code('sira agent');
  console.log(colors.dim('     Let AI analyze your project and recommend the best stack\n'));
  
  ui.code('sira list');
  console.log(colors.dim('     Browse all available templates and their technologies\n'));
  
  console.log('');
  ui.hint('💡 Tip: Use "sira agent" for intelligent template recommendations');
  console.log('');
}

main().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  ui.error(errorMessage);
  process.exit(1);
});

// Made with Bob

