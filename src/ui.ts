import pc from 'picocolors';

export const colors = {
  primary: pc.cyan,
  success: pc.green,
  error: pc.red,
  warning: pc.yellow,
  muted: pc.gray,
  bold: pc.bold,
};

export function showLogo() {
  console.log(colors.primary(`
   _____ _           
  / ____(_)          
 | (___  _ _ __ __ _ 
  \\___ \\| | '__/ _\` |
  ____) | | | | (_| |
 |_____/|_|_|  \\__,_|
  `));
}

export const ui = {
  step: (num: number, text: string) => 
    console.log(`${colors.primary(`[${num}]`)} ${text}`),
  success: (text: string) => 
    console.log(`${colors.success('✓')} ${text}`),
  error: (text: string) => 
    console.log(`${colors.error('✗')} ${text}`),
  info: (text: string) => 
    console.log(`${colors.muted('ℹ')} ${text}`),
  warning: (text: string) => 
    console.log(`${colors.warning('⚠')} ${text}`),
};

// Made with Bob
