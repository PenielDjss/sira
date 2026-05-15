# Sira

> CLI scaffolding tool that generates AI-ready project structures

Sira creates projects with CLAUDE.md, AGENTS.md, and .cursorrules files pre-configured, so you can start coding with AI assistance immediately.

## ✨ Features

- 🚀 **Fast scaffolding** — Create production-ready projects in seconds
- 🤖 **AI-ready by default** — Every project includes AI context files
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

### Create a new project

```bash
sira create
```

Follow the interactive prompts to:
1. Enter your project name
2. Choose a template
3. Wait for the project to be created

### List available templates

```bash
sira list
```

### Show help

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

## 🛠️ Development

```bash
# Run in dev mode
npm run dev create

# Build
npm run build

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

- ✅ No need to write AI context files manually
- ✅ Consistent documentation across all projects
- ✅ Start coding with AI assistance immediately
- ✅ Save hours of setup time

## 🏗️ Architecture

Sira uses a two-repository structure:

- **CLI Repository** (`sira-cli/sira`) — The CLI tool you're using
- **Templates Repository** (`sira-cli/templates`) — Project templates

Templates are cloned from GitHub using [tiged](https://github.com/tiged/tiged), ensuring you always get the latest version.

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