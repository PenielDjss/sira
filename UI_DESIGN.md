# 🎨 Sira CLI - UI Design

## Overview

The Sira CLI has been redesigned with a modern, polished interface inspired by Claude Code's design aesthetics. The new UI features enhanced visual hierarchy, better color schemes, and improved user experience.

## Design Principles

### 1. **Visual Hierarchy**
- Clear section headers with icons
- Step-by-step progress indicators
- Organized information boxes
- Consistent spacing and alignment

### 2. **Color Palette**
- **Primary (Cyan)**: Main actions and highlights
- **Secondary (Blue)**: Supporting information
- **Success (Green)**: Completed actions
- **Error (Red)**: Error messages
- **Warning (Yellow)**: Warnings
- **Muted (Gray)**: Secondary text and hints
- **Accent (Magenta)**: Special highlights

### 3. **Typography**
- Bold text for emphasis
- Dimmed text for less important information
- Monospace for code and commands
- Clear visual separation between sections

## UI Components

### Logo
Two variants for different contexts:

**Full Logo** (for main screens):
```
  ╭─────────────────────────────────────╮
  │                                     │
  │     ███████╗██╗██████╗  █████╗     │
  │     ██╔════╝██║██╔══██╗██╔══██╗    │
  │     ███████╗██║██████╔╝███████║    │
  │     ╚════██║██║██╔══██╗██╔══██║    │
  │     ███████║██║██║  ██║██║  ██║    │
  │     ╚══════╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝    │
  │                                     │
  │   AI-Powered Project Generator    │
  │                                     │
  ╰─────────────────────────────────────╯
```

**Compact Logo** (for list/help screens):
```
  ╔═══════════════════════════╗
  ║   SIRA • AI Generator   ║
  ╚═══════════════════════════╝
```

### Progress Steps
Shows current step in multi-step processes:
```
[1/5] ● Project Configuration
```

### Information Box
Displays structured information:
```
  ╭──────────────────────────────────────────────────╮
  │ AI Recommendation                                │
  ├──────────────────────────────────────────────────┤
  │ Stack: HERMÈS                                    │
  │ Description: React + Vite + TypeScript           │
  │ Confidence: 95%                                  │
  ╰──────────────────────────────────────────────────╯
```

### Banner
For important announcements:
```
  ╔════════════════════════════╗
  ║ 🚀 Creating your project ║
  ╚════════════════════════════╝
```

### Next Steps
Clear action items after completion:
```
Next steps:
  1. cd my-project
  2. npm install
  3. npm run dev
```

### Hints
Subtle tips and suggestions:
```
💡 Check PROJECT.md for AI-generated context
```

### Code Display
Commands with proper formatting:
```
  $ sira create
     Interactive project creation
```

## Features

### 1. **Streaming Text**
AI reasoning is displayed with a typewriter effect for better engagement.

### 2. **Progress Indicators**
- Spinner animations for loading states
- Step counters for multi-step processes
- Progress bars for long operations

### 3. **Status Icons**
- ✓ Success
- ✗ Error
- ℹ Info
- ⚠ Warning
- ● Step indicator
- 💡 Hint/tip

### 4. **Dividers**
Visual separation between sections:
```
─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─
```

## Commands UI

### `sira --help`
- Full logo display
- Organized command list with descriptions
- Example usage section
- Helpful tips

### `sira list`
- Compact logo
- Numbered template list
- Technology stack display
- Quick action hints

### `sira create`
- Full logo with intro
- Step-by-step progress (1/3, 2/3, 3/3)
- Clear prompts and validation
- Success banner
- Next steps guide

### `sira agent`
- Full logo with AI branding
- 5-step process with clear indicators
- AI analysis with streaming text
- Recommendation box with confidence score
- Alternative options display
- Success confirmation with next steps

## Technical Implementation

### Color System
```typescript
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
```

### UI Utilities
- `ui.section()` - Section headers
- `ui.step()` - Progress steps
- `ui.success()` - Success messages
- `ui.error()` - Error messages
- `ui.info()` - Info messages
- `ui.warning()` - Warnings
- `ui.hint()` - Subtle hints
- `ui.code()` - Code display
- `ui.divider()` - Visual separator
- `ui.box()` - Information boxes
- `ui.feature()` - Feature lists
- `ui.nextSteps()` - Action items

### Animations
- `streamText()` - Typewriter effect
- `ui.thinking()` - Animated spinner
- `progressBar()` - Progress visualization

## Best Practices

1. **Consistency**: Use the same UI components throughout
2. **Clarity**: Clear labels and descriptions
3. **Feedback**: Always show progress and results
4. **Accessibility**: Use icons with text labels
5. **Spacing**: Proper whitespace for readability
6. **Colors**: Meaningful color usage (green=success, red=error)

## Future Enhancements

- [ ] Animated progress bars
- [ ] More color themes
- [ ] Interactive template preview
- [ ] Rich terminal graphics
- [ ] Customizable UI preferences

---

**Made with ❤️ by Bob**