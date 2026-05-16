import pc from 'picocolors';

// Enhanced color palette inspired by Claude Code
export const colors = {
  primary: pc.cyan,
  secondary: pc.blue,
  success: pc.green,
  error: pc.red,
  warning: pc.yellow,
  muted: pc.gray,
  dim: (text: string) => pc.gray(pc.dim(text)),
  bold: pc.bold,
  accent: pc.magenta,
  highlight: (text: string) => pc.bgCyan(pc.black(` ${text} `)),
};

// Modern gradient-style logo
export function showLogo() {
  const logo = `
  ╭─────────────────────────────────────╮
  │                                     │
  │     ${colors.primary('███████╗██╗██████╗  █████╗')}      │
  │     ${colors.primary('██╔════╝██║██╔══██╗██╔══██╗')}     │
  │     ${colors.secondary('███████╗██║██████╔╝███████║')}     │
  │     ${colors.secondary('╚════██║██║██╔══██╗██╔══██║')}     │
  │     ${colors.accent('███████║██║██║  ██║██║  ██║')}     │
  │     ${colors.accent('╚══════╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝')}     │
  │                                     │
  │   ${colors.dim('AI-Powered Project Generator')}      │
  │                                     │
  ╰─────────────────────────────────────╯
  `;
  console.log(logo);
}

// Compact logo for smaller displays
export function showCompactLogo() {
  console.log(`
  ${colors.primary('╔═══════════════════════════╗')}
  ${colors.primary('║')}   ${colors.bold(colors.primary('SIRA'))} ${colors.dim('• AI Generator')}   ${colors.primary('║')}
  ${colors.primary('╚═══════════════════════════╝')}
  `);
}

// Enhanced UI utilities with better formatting
export const ui = {
  // Section headers
  section: (text: string) => {
    console.log(`\n${colors.bold(colors.primary('▸'))} ${colors.bold(text)}`);
  },

  // Step indicators with progress
  step: (num: number, total: number, text: string) => {
    const progress = colors.dim(`[${num}/${total}]`);
    console.log(`\n${progress} ${colors.primary('●')} ${text}`);
  },

  // Success messages with icon
  success: (text: string) => {
    console.log(`${colors.success('✓')} ${text}`);
  },

  // Error messages with better formatting
  error: (text: string) => {
    console.log(`\n${colors.error('✗')} ${colors.bold(text)}`);
  },

  // Info messages
  info: (text: string) => {
    console.log(`${colors.primary('ℹ')} ${text}`);
  },

  // Warning messages
  warning: (text: string) => {
    console.log(`${colors.warning('⚠')} ${text}`);
  },

  // Subtle hints
  hint: (text: string) => {
    console.log(`  ${colors.dim(`💡 ${text}`)}`);
  },

  // Code/command display
  code: (text: string) => {
    console.log(`  ${colors.dim('$')} ${colors.secondary(text)}`);
  },

  // Divider
  divider: () => {
    console.log(colors.dim('  ─'.repeat(40)));
  },

  // Box for important messages
  box: (title: string, lines: string[]) => {
    const width = 50;
    console.log(`\n  ${colors.primary('╭' + '─'.repeat(width - 2) + '╮')}`);
    console.log(`  ${colors.primary('│')} ${colors.bold(title.padEnd(width - 4))} ${colors.primary('│')}`);
    console.log(`  ${colors.primary('├' + '─'.repeat(width - 2) + '┤')}`);
    lines.forEach(line => {
      console.log(`  ${colors.primary('│')} ${line.padEnd(width - 4)} ${colors.primary('│')}`);
    });
    console.log(`  ${colors.primary('╰' + '─'.repeat(width - 2) + '╯')}\n`);
  },

  // Feature list
  feature: (icon: string, text: string) => {
    console.log(`  ${icon}  ${text}`);
  },

  // Next steps display
  nextSteps: (steps: string[]) => {
    console.log(`\n${colors.bold(colors.primary('Next steps:'))}`);
    steps.forEach((step, i) => {
      console.log(`  ${colors.dim(`${i + 1}.`)} ${colors.secondary(step)}`);
    });
    console.log('');
  },

  // Animated thinking indicator
  thinking: (text: string = 'Thinking') => {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    return setInterval(() => {
      process.stdout.write(`\r${colors.primary(frames[i])} ${text}...`);
      i = (i + 1) % frames.length;
    }, 80);
  },

  // Clear thinking indicator
  clearThinking: (interval: NodeJS.Timeout) => {
    clearInterval(interval);
    process.stdout.write('\r' + ' '.repeat(50) + '\r');
  },
};

// Streaming text effect
export async function streamText(text: string, delay: number = 15): Promise<void> {
  for (const char of text) {
    process.stdout.write(char);
    await new Promise(r => setTimeout(r, delay));
  }
}

// Progress bar
export function progressBar(current: number, total: number, width: number = 30): string {
  const percentage = Math.round((current / total) * 100);
  const filled = Math.round((current / total) * width);
  const empty = width - filled;
  
  const bar = colors.primary('█'.repeat(filled)) + colors.dim('░'.repeat(empty));
  return `${bar} ${colors.bold(`${percentage}%`)}`;
}

// Banner for special announcements
export function showBanner(text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  const colorMap = {
    info: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  };
  const color = colorMap[type];
  
  console.log(`\n  ${color('╔' + '═'.repeat(text.length + 2) + '╗')}`);
  console.log(`  ${color('║')} ${colors.bold(text)} ${color('║')}`);
  console.log(`  ${color('╚' + '═'.repeat(text.length + 2) + '╝')}\n`);
}

// Made with Bob
