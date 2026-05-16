# Changelog

All notable changes to the Sira project will be documented in this file.

## [0.2.0] - 2026-05-16

### 🎉 Major Features Added

#### Sira Agent Mode
- **AI-Powered Template Selection**: New `sira agent` command that intelligently analyzes project descriptions
- **Natural Language Processing**: Analyzes user descriptions to recommend the best template
- **Confidence Scoring**: Provides confidence levels (0-100%) for recommendations
- **Smart Reasoning**: Explains why a particular template was recommended
- **Alternative Suggestions**: Shows other viable options with explanations

#### Automatic Dependency Installation
- **Smart Package Manager Detection**: Automatically detects npm, yarn, pnpm, or pip
- **One-Command Setup**: Optional automatic installation of all project dependencies
- **Cross-Platform Support**: Works with Node.js (npm/yarn/pnpm) and Python (pip) projects
- **Error Handling**: Graceful fallback if installation fails

### 📦 New Modules

#### `src/agent.ts`
- `analyzeProjectDescription()` - Analyzes project descriptions and recommends templates
- `detectPackageManager()` - Detects appropriate package manager for a stack
- `generateInstallCommands()` - Generates installation commands per stack
- Keyword-based scoring algorithm with confidence calculation

#### `src/installer.ts`
- `installDependencies()` - Installs project dependencies automatically
- `checkPackageManager()` - Checks if a package manager is available
- `detectBestPackageManager()` - Finds the best available package manager
- Support for npm, yarn, pnpm, and pip

### 🧪 Testing

- **12 Unit Tests**: Comprehensive test coverage for new features
- **Custom Test Runner**: Lightweight test runner without external dependencies
- **Test Suites**:
  - Agent Module (6 tests)
  - Stacks Module (3 tests)
  - Installer Module (3 tests)
- **npm test**: Run all tests with a single command

### 📝 Documentation

- **PROJECT.md Updated**: Complete documentation of new features
- **Architecture Overview**: Detailed module descriptions
- **Usage Examples**: Clear examples of agent mode usage
- **Test Documentation**: How to run and write tests

### 🔧 Improvements

- Enhanced CLI help message with agent command
- Better error handling in clone pipeline
- Improved user experience with confirmation prompts
- More informative console output during project creation

### 🎯 Commands

```bash
# New command
sira agent    # AI-powered project creation with smart template selection

# Existing commands (unchanged)
sira create   # Manual template selection
sira list     # List available templates
```

### 📊 Statistics

- **Lines of Code Added**: ~500+
- **New Files**: 5 (agent.ts, installer.ts, 3 test files, run-tests.ts)
- **Test Coverage**: 12 passing tests
- **Success Rate**: 100% (12/12 tests passing)

---

## [0.1.0] - 2026-05-15

### Initial Release (MVP)

- Basic CLI scaffolding tool
- `sira create` command for manual template selection
- `sira list` command to view available templates
- Template cloning via tiged
- AI context file generation (CLAUDE.md, AGENTS.md, .cursorrules)
- Single template: HERMÈS (React + Vite + TypeScript)
- MIT License
- Complete documentation (PROJECT.md, README.md)

---

## Legend

- 🎉 Major Features
- 📦 New Modules
- 🧪 Testing
- 📝 Documentation
- 🔧 Improvements
- 🐛 Bug Fixes
- 🎯 Commands
- 📊 Statistics