# Sira

> CLI scaffolding tool that generates AI-ready project structures

Sira creates projects with CLAUDE.md, AGENTS.md, and .cursorrules files pre-configured, so you can start coding with AI assistance immediately.

## ✨ Features

- 🚀 **Fast scaffolding** — Create production-ready projects in seconds
- 🤖 **AI-ready by default** — Every project includes AI context files
- 🧠 **AI-powered template selection** — Intelligent agent analyzes your project description
- 📦 **Automatic dependency installation** — One-command setup with smart package manager detection
- 📦 **Modern templates** — React + Vite + TypeScript (more coming soon)
- 🎨 **Beautiful CLI** — Interactive prompts with a clean design
- 🔧 **Zero config** — Works out of the box

## 📦 Installation

### For Development

```bash
git clone https://github.com/sira-cli/sira.git
cd sira
npm install
npm run build
npm link
```

### For Production (coming soon)

```bash
npm install -g sira
```

## 🚀 Usage

### 🤖 Agent Mode (Recommended)

Let Sira's AI agent analyze your project description and recommend the best template:

```bash
sira agent
```

**Example:**
```
? Project name: my-dashboard
? Describe your project: I want to build an interactive dashboard with React

🧠 Analyzing your project description...

✨ Recommendation: HERMÈS
   React + Vite + TypeScript — Fast frontend development
   Confidence: 85%
   Reasoning: HERMÈS is recommended because your description mentions: react, dashboard, interactive

? Use HERMÈS template? Yes
? Install dependencies automatically? Yes

🚀 Creating your project...
✨ All done! 🎉
```

### 📋 Manual Mode

Choose a template manually:

```bash
sira create
```

Follow the interactive prompts to:
1. Enter your project name
2. Choose a template
3. Wait for the project to be created

### 📚 List Templates

```bash
sira list
```

### 🆘 Show Help

```bash
sira --help
```

## 📚 Available Templates

### HERMÈS — React + Vite + TypeScript

Fast frontend development with modern tooling.

**Tech stack:**
- React 18
- Vite 5
- TypeScript 5

**Includes:**
- ✅ CLAUDE.md — Context for Claude Code
- ✅ AGENTS.md — Context for all AI agents
- ✅ .cursorrules — Cursor-specific rules

## 🤖 AI Context Files

Every project created by Sira includes three AI context files:

### CLAUDE.md
Provides Claude Code with:
- Project overview and tech stack
- Project structure
- Development commands
- Coding conventions
- AI assistance guidelines

### AGENTS.md
Helps any AI agent understand:
- What the project is about
- Key technologies used
- File structure
- How to help effectively
- Common tasks

### .cursorrules
Cursor-specific rules for:
- Language & framework preferences
- Code style guidelines
- File organization
- TypeScript rules
- Framework patterns

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

**Test Coverage:**
- ✅ 12 unit tests (100% passing)
- ✅ Agent module (template recommendation)
- ✅ Installer module (dependency installation)
- ✅ Stacks module (template registry)

## 🛠️ Development

```bash
# Run in dev mode
npm run dev create

# Run agent mode in dev
npm run dev agent

# Build
npm run build

# Run tests
npm test

# Test locally
npm link
sira create
```

## 📖 Example

```bash
$ sira create

   _____ _           
  / ____(_)          
 | (___  _ _ __ __ _ 
  \___ \| | '__/ _` |
  ____) | | | | (_| |
 |_____/|_|_|  \__,_|

◇  Create a new project
│
◆  Project name?
│  my-awesome-app
│
◆  Choose a template:
│  ● HERMÈS — React + Vite + TypeScript — Fast frontend development
│
◇  Project created!
│
└  All done! 🎉

Next steps:
  cd my-awesome-app
  npm install
  npm run dev

Happy coding! ✨
```

## 🎯 Why Sira?

Most scaffolding tools generate code and stop there. Sira goes further by making every project **AI-ready from day one**:

- ✅ **AI-Powered Selection** — Intelligent agent recommends the best template for your needs
- ✅ **Automatic Setup** — Dependencies installed automatically with smart package manager detection
- ✅ **No Manual Context** — AI context files generated automatically
- ✅ **Consistent Documentation** — Every project follows the same structure
- ✅ **Instant Productivity** — Start coding with AI assistance immediately
- ✅ **Time Savings** — Save hours of setup and configuration time

## 🏗️ Architecture

Sira uses a two-repository structure:

- **CLI Repository** (`sira-cli/sira`) — The CLI tool you're using
- **Templates Repository** (`sira-cli/templates`) — Project templates

Templates are cloned from GitHub using [tiged](https://github.com/tiged/tiged), ensuring you always get the latest version.

### Core Modules

```
src/
├── index.ts       # CLI entry point and command routing
├── ui.ts          # Design system (colors, prompts)
├── stacks.ts      # Template registry
├── clone.ts       # Template cloning pipeline
├── agent.ts       # 🆕 AI-powered template recommendation
├── installer.ts   # 🆕 Automatic dependency installation
└── __tests__/     # Test suite
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT © Sira CLI

## 🔗 Links

- [GitHub Repository](https://github.com/sira-cli/sira)
- [Templates Repository](https://github.com/sira-cli/templates)
- [IBM Bob Hackathon](https://lablab.ai)

---

Built with ❤️ during the IBM Bob Hackathon (May 2026)