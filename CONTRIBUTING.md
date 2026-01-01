# Contributing to Clarify Site

Thank you for your interest in contributing to the Clarify Site project! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)

---

## 📜 Code of Conduct

This project follows the principles of respect, collaboration, and inclusivity. Please be kind and professional in all interactions.

---

## 🤝 How Can I Contribute?

### Reporting Bugs

- Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Check if the bug has already been reported
- Include detailed steps to reproduce
- Provide screenshots if applicable

### Suggesting Features

- Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
- Clearly describe the problem you're trying to solve
- Explain how the feature would benefit users
- Consider providing mockups or examples

### Contributing Code

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following our code style guidelines
4. **Test thoroughly** (see [Testing](#testing))
5. **Commit your changes** using conventional commits
6. **Push to your fork** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

---

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 20+ LTS
- **npm** 9+
- **MongoDB** 7+ (or MongoDB Atlas account)
- **Git**

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Frontend runs on: http://localhost:5173

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run dev
```

Backend runs on: http://localhost:5000

### Full Stack

Run both frontend and backend in separate terminals.

---

## 🎨 Code Style Guidelines

This project follows **Simplicity Protocol 3** and strict code quality standards.

### TypeScript

- Use **TypeScript strict mode**
- Avoid `any` types
- Use type inference where obvious
- Document complex types with JSDoc

### React

- Use **functional components** with hooks
- Avoid inline styles (use TailwindCSS classes)
- Keep components under **500 LOC**
- Extract reusable logic into custom hooks

### Naming Conventions

- **Components**: `PascalCase` (e.g., `FeatureCard.tsx`)
- **Files**: `kebab-case` for pages (e.g., `home-page.tsx`)
- **Variables**: `camelCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase` with `I` prefix for interfaces (optional)

### File Organization

```
src/
├── components/    # Reusable UI components
├── pages/         # Route pages
├── services/      # API calls
├── hooks/         # Custom React hooks
├── contexts/      # React contexts
├── types/         # TypeScript types
├── utils/         # Helper functions
└── assets/        # Images, fonts
```

### Comments

- Explain **why**, not **what**
- Use JSDoc for public APIs
- Keep comments concise and up-to-date

---

## 📝 Commit Message Guidelines

We use **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling

### Examples

```bash
feat(homepage): add hero section with animated stats

- Added HeroSection component
- Implemented animated counter for stats
- Integrated with TailwindCSS

Closes #9
```

```bash
fix(auth): resolve token expiration issue

- Fixed JWT token refresh logic
- Added error handling for expired tokens

Fixes #42
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Update the README** if needed
2. **Run all tests**: `npm test`
3. **Run linter**: `npm run lint`
4. **Build successfully**: `npm run build`
5. **Update docs/TASKS.md** if completing a task

### PR Title Format

Use the same format as commit messages:

```
feat(homepage): add hero section with animated stats
```

### PR Description Template

```markdown
## 📋 Description

Brief description of what this PR does.

## 🎯 Related Issue

Closes #<issue_number>

## 🧪 Testing

- [ ] All tests pass
- [ ] Manual testing done
- [ ] No console errors

## 📸 Screenshots (if applicable)

Add screenshots of UI changes.

## ✅ Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added where necessary
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainer
3. **Approval** required before merge
4. **Squash and merge** into `main`

---

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm run test        # Run tests
npm run test:watch  # Watch mode
```

### Backend Tests

```bash
cd backend
npm run test        # Run tests
npm run test:watch  # Watch mode
```

### Coverage Requirements

- **Frontend**: >80% coverage
- **Backend**: >85% coverage

---

## 📚 Additional Resources

- [README.md](README.md) - Project overview
- [docs/TASKS.md](docs/TASKS.md) - Current tasks and sprints
- [docs/SIMPLICITY_PROTOCOL_3.md](docs/SIMPLICITY_PROTOCOL_3.md) - Development protocol
- [docs/OWASP_CHECKLIST.md](docs/OWASP_CHECKLIST.md) - Security guidelines

---

## 📞 Questions?

- **Email**: josueamaral15@gmail.com
- **GitHub Issues**: Open an issue for discussion
- **Clarify App Issues**: https://github.com/JosueAmaral15/clarify/issues

---

## 🙏 Thank You!

Your contributions make this project better! Thank you for taking the time to contribute. ❤️

---

**Last Updated**: January 01, 2026  
**Version**: 1.0.0
