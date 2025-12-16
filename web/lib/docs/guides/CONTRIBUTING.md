# Contributing to TEE:UP

Thank you for contributing to TEE:UP! This guide will help you get started.

---

## 🎯 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow our coding standards

---

## 🚀 Getting Started

### 1. Fork & Clone
```bash
git clone https://github.com/your-username/tee_up.git
cd tee_up
```

### 2. Install Dependencies
```bash
# Frontend
cd web
npm install

# Backend
cd ../api
npm install
```

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

---

## 📝 Coding Standards

### TypeScript
- **Strict Mode:** Always enabled
- **No `any`:** Use proper types
- **Functional Components:** Prefer hooks over class components
- **File Naming:** `PascalCase.tsx` for components, `camelCase.ts` for utilities

### React/Next.js
```typescript
// ✅ Good
"use client"
import { useState } from 'react'

export default function MyComponent() {
  const [state, setState] = useState('')
  return <div>{state}</div>
}

// ❌ Bad
import React from 'react' // Don't need React import in Next.js 14
class MyComponent extends React.Component {} // Use functional components
```

### CSS/Tailwind
```tsx
// ✅ Good - Use design system classes
<button className="btn-primary">Click</button>
<div className="card">Content</div>

// ❌ Bad - Avoid custom CSS unless necessary
<button style={{ background: '#3B82F6' }}>Click</button>
```

### File Structure
```
web/src/app/
├── components/          # Shared components
│   ├── Button.tsx
│   └── Card.tsx
├── [feature]/           # Feature-specific pages
│   ├── page.tsx
│   └── [dynamic]/
└── global.css           # Design system
```

---

## 🎨 Design System

### Use Predefined Classes
```tsx
// Buttons
<button className="btn-primary">Primary Action</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-ghost">Tertiary</button>

// Cards
<div className="card">
  <div className="card-content">...</div>
</div>

// Inputs
<input className="input" placeholder="Enter text" />
<select className="select">...</select>
```

### Color Variables
```css
/* Use CSS variables, not hardcoded colors */
color: var(--calm-obsidian);     /* ✅ Good */
color: #1A1A17;                  /* ❌ Bad */

background: var(--calm-accent);  /* ✅ Good */
background: #3B82F6;             /* ❌ Bad */
```

---

## ✅ Commit Guidelines

### Conventional Commits
```bash
# Format: <type>(<scope>): <subject>

# Examples:
git commit -m "feat(auth): add login page"
git commit -m "fix(dashboard): correct metric calculation"
git commit -m "docs(readme): update installation steps"
git commit -m "style(card): improve hover animation"
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

---

## 🧪 Testing

### Before Submitting PR
1. **Run Lint:** `npm run lint`
2. **Build Check:** `npm run build`
3. **Manual Test:** Verify in browser
4. **Accessibility:** Test keyboard navigation

### Writing Tests (Future)
```typescript
// tests/Button.test.tsx
import { render, screen } from '@testing-library/react'
import Button from '@/components/Button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

---

## 📋 Pull Request Process

### 1. Pre-Submit Checklist
- [ ] Code follows style guide
- [ ] No console.log() statements
- [ ] No TypeScript errors
- [ ] Build succeeds (`npm run build`)
- [ ] Tested in Chrome, Safari, Firefox
- [ ] Mobile responsive (test on small screen)
- [ ] Accessibility checked (keyboard, screen reader)

### 2. PR Template
```markdown
## What does this PR do?
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactoring

## Testing
How did you test this?

## Screenshots
(if UI changes)

## Checklist
- [ ] Code follows style guide
- [ ] Tested locally
- [ ] No breaking changes
```

### 3. Review Process
1. Submit PR
2. Wait for CI checks (lint, build)
3. Address reviewer comments
4. Get approval from 1+ reviewer
5. Merge (squash & merge preferred)

---

## 🐛 Reporting Bugs

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable.

**Environment**
- OS: [e.g., macOS 14]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]
```

---

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
Describe the problem.

**Describe the solution you'd like**
Clear description of what you want.

**Describe alternatives you've considered**
Any alternative solutions?

**Additional context**
Mockups, examples, etc.
```

---

## 📖 Documentation

### When to Update Docs
- Adding new feature → Update PRD.md
- Changing design → Update DESIGN_SYSTEM.md
- API changes → Update API_SPEC.md
- Process changes → Update this file

### Documentation Style
- **Clear Headers:** Use `##` for sections
- **Code Examples:** Use fenced code blocks
- **Links:** Use relative paths `[README](../README.md)`
- **Images:** Store in `/docs/images/`

---

## 🚢 Release Process (Future)

### Versioning (Semantic Versioning)
- **MAJOR.MINOR.PATCH** (e.g., 1.2.3)
- **MAJOR:** Breaking changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes

### Release Steps
1. Create release branch (`release/v1.2.0`)
2. Update CHANGELOG.md
3. Bump version in package.json
4. Create PR to `main`
5. Merge & tag (`git tag v1.2.0`)
6. Deploy to production

---

## 🔒 Security

### Reporting Security Issues
**DO NOT** open public issues for security vulnerabilities.

Email: security@teeup.kr

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

---

## 📞 Getting Help

### Channels
- **Slack:** #teeup-dev (internal team)
- **GitHub Issues:** Public questions
- **Email:** dev@teeup.kr

### Response Times
- Critical bugs: < 24 hours
- Feature requests: 1-2 weeks
- General questions: 2-3 business days

---

## 🙏 Recognition

Contributors will be recognized in:
- CHANGELOG.md
- GitHub contributors page
- Annual team acknowledgments

---

**Thank you for making TEE:UP better!** 🏌️‍♀️✨
