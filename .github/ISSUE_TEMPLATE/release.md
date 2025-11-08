---
name: 🚀 New Release
about: Track a new release of World Clock
title: 'Release v[VERSION]'
labels: release
assignees: ''
---

## 📦 Release Information

**Version:** v[VERSION]
**Release Type:** [ ] Patch [ ] Minor [ ] Major
**Target Date:** [DATE]

## ✅ Pre-Release Checklist

### Version & Documentation
- [ ] Updated version in `package.json`
- [ ] Updated buildVersion in `electron-builder.yaml`
- [ ] CHANGELOG.md updated with new features/fixes
- [ ] README.md updated (if needed)
- [ ] All version numbers are consistent

### Testing
- [ ] All unit tests pass (`npm test`)
- [ ] Application builds successfully (`npm run build`)
- [ ] Tested on Windows
- [ ] Tested on Linux (optional)
- [ ] No console errors in production build
- [ ] All features work as expected

### Code Quality
- [ ] No linting errors (`npm run lint`)
- [ ] TypeScript compilation successful
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Code review completed
- [ ] All TODOs/FIXMEs addressed or documented

### Assets
- [ ] Icons present in `build/` directory
- [ ] LICENSE file is current
- [ ] All documentation up to date

## 🔄 Release Process

### 1. Version Update
```bash
npm version [patch|minor|major] --no-git-tag-version
git add package.json
git commit -m "chore: bump version to v[VERSION]"
git push
```

### 2. Create Tag
```bash
git tag -a v[VERSION] -m "Release v[VERSION]"
git push origin v[VERSION]
```

### 3. Monitor Build
- [ ] GitHub Actions workflow triggered
- [ ] All platform builds successful
- [ ] Action summary reviewed
- [ ] No build errors or warnings

### 4. Verify Release
- [ ] Release created on GitHub
- [ ] All artifacts uploaded:
  - [ ] Windows installer (.exe)
  - [ ] Linux DEB (x64, arm64)
  - [ ] Linux RPM (x64, arm64)
  - [ ] Linux Snap
  - [ ] Linux tar.gz archives
- [ ] Release notes formatted correctly
- [ ] Downloaded and tested one artifact per platform

### 5. Publish
- [ ] Changed from draft to published (if applicable)
- [ ] Announced on relevant channels
- [ ] Updated project website (if applicable)
- [ ] Created discussion thread

## 📝 Release Notes

### ✨ New Features
- 

### 🐛 Bug Fixes
- 

### 🔧 Improvements
- 

### ⚠️ Breaking Changes
- 

### 📚 Documentation
- 

## 🔗 Links

- **Release URL:** [Will be filled after release]
- **Workflow Run:** [Link to Actions workflow]
- **Discussion:** [Link to GitHub Discussion]

## 📊 Metrics

- **Build Time:** [TIME]
- **Total Artifacts:** [COUNT]
- **Total Size:** [SIZE]

## 🐛 Known Issues

- 

## 📝 Notes

Add any additional notes or considerations here.

---

**Checklist last updated:** 2025-11-08

