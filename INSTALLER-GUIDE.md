# Windows Installer Configuration Guide

## What Users Will See During Installation

With the current NSIS configuration, users installing World Clock on Windows will go through an **interactive installation wizard** that asks them to make choices.

## Installation Steps for End Users

### 1. **Language Selection** 
- Users will first choose their preferred language for the installer
- Supported languages depend on NSIS defaults (English, Spanish, French, German, etc.)

### 2. **License Agreement**
- Users will see the MIT License (from `LICENSE` file)
- They must accept to continue installation

### 3. **Installation Mode**
- Users can choose between:
  - **Install for all users** (requires admin rights)
  - **Install just for me** (no admin required)
- Default: Install just for me (`perMachine: false`)

### 4. **Installation Directory**
- Users can choose where to install the app
- Default locations:
  - Per-user: `C:\Users\<username>\AppData\Local\Programs\World Clock`
  - Per-machine: `C:\Program Files\World Clock`
- Users can click "Browse" to choose a custom location

### 5. **Desktop Shortcut**
- A desktop shortcut will be created by default
- Note: NSIS doesn't support asking users about shortcuts during installation
- Users can manually delete the shortcut after installation if they don't want it

### 6. **Start Menu Shortcut**
- A Start Menu shortcut is **always created** (no option to disable)
- Appears as "World Clock" in Windows Start Menu

### 7. **Installation Progress**
- Progress bar showing file extraction and installation

### 8. **Installation Complete**
- Success message
- Option: **"Run World Clock"** checkbox (checked by default)
- If checked, the app launches automatically when user clicks "Finish"

## Current Configuration Explained

```yaml
nsis:
  oneClick: false                              # ✅ Show full wizard (not one-click install)
  perMachine: false                            # ✅ Default to per-user install
  allowElevation: true                         # ✅ Allow users to choose per-machine
  allowToChangeInstallationDirectory: true     # ✅ Let users choose install path
  runAfterFinish: true                         # ✅ Checkbox to launch after install
  createDesktopShortcut: true                  # ✅ Create desktop shortcut (true/false/"always")
  createStartMenuShortcut: true                # ✅ Always create start menu entry
  deleteAppDataOnUninstall: true               # ✅ Clean up data when uninstalling
  displayLanguageSelector: true                # ✅ Let users choose installer language
```

## Customization Options

You can modify `electron-builder.yaml` to change the behavior:

### Always Create Desktop Shortcut (Current)
```yaml
createDesktopShortcut: true  # Creates desktop shortcut
```

### Never Create Desktop Shortcut
```yaml
createDesktopShortcut: false  # Don't create desktop shortcut
```

### Always Recreate Desktop Shortcut (Even on Reinstall)
```yaml
createDesktopShortcut: "always"  # Recreates even if user deleted it
```

**Note**: There is no "ask" option in NSIS. The installer cannot prompt users about desktop shortcuts.

### One-Click Installation (No Questions)
```yaml
oneClick: true  # Simple one-click install with no options
```

### Always Install for All Users
```yaml
perMachine: true  # Requires admin rights
allowElevation: false  # Don't show the choice
```

### Don't Launch After Install
```yaml
runAfterFinish: false  # No auto-launch option
```

### Hide Installation Directory Choice
```yaml
allowToChangeInstallationDirectory: false  # Use default location only
```

## Uninstallation Behavior

When users uninstall:
- App is removed from installation directory
- Shortcuts (desktop, start menu) are removed
- **App data is deleted** (`deleteAppDataOnUninstall: true`)
  - This includes settings, cache, and user data
  - Located in: `C:\Users\<username>\AppData\Roaming\World Clock`

If you want to **preserve user data** on uninstall:
```yaml
deleteAppDataOnUninstall: false
```

## Building the Installer

To create the Windows installer with these settings:

```bash
# Build Windows installer
npm run dist:win

# Output location
# out/World Clock-0.1.0-windows-x64.exe (NSIS installer)
# out/World Clock-0.1.0-windows-ia32.exe (32-bit installer)
# out/World Clock-0.1.0-windows-x64-portable.exe (Portable version)
```

## Testing the Installer

1. Run `npm run dist:win`
2. Navigate to `out/` directory
3. Run the `.exe` installer
4. Go through the installation steps as an end-user would
5. Test the uninstaller from Windows Settings > Apps

## Best Practices

✅ **Recommended Settings (Current)**:
- Interactive installer with options
- Ask about desktop shortcut
- Allow installation directory choice
- Launch app after install
- Clean up data on uninstall

⚠️ **Consider**:
- Keep `deleteAppDataOnUninstall: true` for clean uninstalls
- OR set to `false` if users might reinstall and want to keep settings

## Portable Version

Users who don't want to install can use:
- `World Clock-0.1.0-windows-x64-portable.exe`
- No installation required
- Runs directly
- No shortcuts created
- No registry entries
- Perfect for USB drives or temporary use

## Architecture Support

Current configuration builds for:
- **x64** (64-bit): Modern Windows systems
- **ia32** (32-bit): Older Windows systems

Most users will use the x64 version.

## Resources

- [Electron Builder NSIS Options](https://www.electron.build/configuration/nsis)
- [NSIS Documentation](https://nsis.sourceforge.io/Docs/)

