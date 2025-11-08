# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the World Clock application.

## 📋 Available Workflows

### 1. 🚀 Build and Release (`release.yml`)

**Triggers:**
- Push to `main`/`master` branch
- Push tags matching `v*.*.*` (e.g., `v1.0.0`)
- Pull requests to `main`/`master`
- Manual dispatch (with customizable options)

**What it does:**
- ✅ Validates build conditions and extracts version information
- 🪟 Builds Windows installer (x64 NSIS)
- 🐧 Builds Linux packages (DEB, RPM, Snap, tar.gz for x64 and ARM64)
- 📊 Generates comprehensive build summaries
- 🚀 Creates GitHub releases (when triggered by tags or manual dispatch)

**Manual Dispatch Options:**
- **Release Type**: `draft`, `prerelease`, or `release`
- **Platforms**: Comma-separated list (e.g., `windows,linux`)

**Usage:**
```bash
# Create a new release by pushing a tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Or use GitHub UI: Actions → Build and Release → Run workflow
```

### 2. 🔍 PR Check (`pr-check.yml`)

**Triggers:**
- Pull request opened, synchronized, or reopened

**What it does:**
- 🔍 Runs ESLint and TypeScript type checking
- 🧪 Runs test suite with coverage
- 🔨 Validates builds on Ubuntu and Windows
- 📊 Generates PR summary with all check results

**Usage:**
- Automatically runs on all pull requests
- Check results appear in the PR checks section

## 🎯 Setting Up

### Prerequisites

1. **Repository Secrets** (optional for advanced features):
   - `GITHUB_TOKEN` - Automatically provided by GitHub Actions
   - `GH_TOKEN` - Optional: Personal Access Token for enhanced release features

2. **Required Files**:
   - `package.json` - Must contain valid version field
   - `electron-builder.yaml` - Electron Builder configuration
   - Build resources in `build/` directory (icons, etc.)

### Code Signing (Optional)

#### Windows
To enable Windows code signing, add these secrets:
- `WIN_CSC_LINK` - Base64-encoded certificate (.pfx)
- `WIN_CSC_KEY_PASSWORD` - Certificate password

Then uncomment the code signing section in `electron-builder.yaml`.

#### macOS (if you enable Mac builds)
Add these secrets:
- `APPLE_ID` - Apple ID email
- `APPLE_APP_SPECIFIC_PASSWORD` - App-specific password
- `APPLE_TEAM_ID` - Team ID
- `CSC_LINK` - Base64-encoded certificate
- `CSC_KEY_PASSWORD` - Certificate password

## 📊 Action Summaries

All workflows generate detailed summaries visible in the GitHub Actions UI:

### Build Summary Includes:
- 📦 Package version and build information
- 🔍 Build conditions (event, branch/tag, platforms)
- 📦 Generated artifacts with file sizes
- ✅ Build status for each platform
- 🚀 Release information and download links

### PR Check Summary Includes:
- ✅ Lint, test, and build check results
- 📊 Test coverage statistics
- 🔍 Status of all validation checks
- ⚠️ Warnings and recommendations

## 🛠️ Customization

### Building for Specific Platforms

Edit the `platforms` input in manual workflow dispatch or modify the `build-info` job:

```yaml
# In release.yml - build-info job
PLATFORMS="windows"  # Only Windows
PLATFORMS="linux"    # Only Linux
PLATFORMS="windows,linux"  # Both (default)
```

### Changing Release Behavior

Modify the `create-release` job conditions:

```yaml
# Only create releases on tags
if: startsWith(github.ref, 'refs/tags/v')

# Always create releases
if: always()

# Never create releases (build only)
if: false
```

### Adding More Checks

Add additional jobs in `pr-check.yml`:

```yaml
security-scan:
  name: 🔒 Security Scan
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Run security audit
      run: npm audit --audit-level=high
```

## 🐛 Troubleshooting

### Build Failures

1. **Windows build fails with signing error**
   - Disable code signing in `electron-builder.yaml`:
     ```yaml
     signAndEditExecutable: false
     verifyUpdateCodeSignature: false
     ```

2. **Linux build fails on ARM64**
   - Ensure cross-compilation tools are installed
   - Check the `build-linux` job's architecture setup

3. **Out of memory errors**
   - Increase Node.js memory: `NODE_OPTIONS: --max_old_space_size=4096`

### Workflow Permissions

If release creation fails:
1. Go to Settings → Actions → General
2. Under "Workflow permissions", select "Read and write permissions"
3. Enable "Allow GitHub Actions to create and approve pull requests"

### Artifact Upload Issues

If artifacts aren't uploaded:
- Check that `dist-release/` directory contains expected files
- Verify file patterns in `upload-artifact` step match actual filenames
- Ensure `electron-builder` completed successfully

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Electron Builder Documentation](https://www.electron.build/)
- [Electron Documentation](https://www.electronjs.org/docs)
- [GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github)

## 🔄 Workflow Updates

To update workflows:

1. Edit the workflow files in `.github/workflows/`
2. Test changes in a separate branch
3. Create a PR to review changes
4. Merge to main after approval

## 📧 Support

For issues with workflows:
1. Check the Actions tab for detailed logs
2. Review this README for common solutions
3. Check [GitHub Actions status](https://www.githubstatus.com/)
4. Open an issue in the repository

---

**Last Updated**: 2025-11-08
**Version**: 1.0.0

