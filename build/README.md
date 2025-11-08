# Build Resources Directory

This directory contains resources needed for building and packaging the World Clock application for different platforms.

## Required Files for Production

### Icons (Required)

You need to create application icons for each platform:

#### Windows (`icon.ico`)
- **Format:** ICO (multi-resolution)
- **Sizes:** 16x16, 24x24, 32x32, 48x48, 64x64, 128x128, 256x256
- **Tool:** Use [png2icons](https://www.npmjs.com/package/png2icons) or [electron-icon-maker](https://www.npmjs.com/package/electron-icon-maker)
- **Command:** `npx electron-icon-maker --input=./icon-source.png --output=./build/`

#### macOS (`icon.icns`)
- **Format:** ICNS (Apple icon format)
- **Base size:** 512x512 or 1024x1024
- **Tool:** Use [png2icons](https://www.npmjs.com/package/png2icons) or macOS Xcode
- **Command:** `npx electron-icon-maker --input=./icon-source.png --output=./build/`

#### Linux (`icon.png`)
- **Format:** PNG
- **Size:** 512x512 pixels
- **Transparency:** Supported
- **Simple:** Just a high-quality PNG file

### Quick Icon Generation

```bash
# Install icon maker (optional)
npm install --save-dev electron-icon-maker

# Create icons from a single 1024x1024 PNG source image
npx electron-icon-maker --input=icon-source.png --output=build/

# This will generate:
# - icons/icon.ico (Windows)
# - icons/icon.icns (macOS)
# - icons/icon.png (Linux - 512x512)
```

**Source Image Requirements:**
- Square image (1:1 ratio)
- Minimum 512x512, recommended 1024x1024
- PNG format with transparency
- Simple, recognizable design that works at small sizes

## Optional Enhancement Files

### Windows Installer Assets (Optional but Recommended)

#### `installerHeader.bmp`
- **Size:** 150 x 57 pixels
- **Format:** 24-bit BMP
- **Description:** Header image shown at the top of installer wizard

#### `installerSidebar.bmp`
- **Size:** 164 x 314 pixels
- **Format:** 24-bit BMP
- **Description:** Sidebar image shown on the left of installer wizard

#### `uninstallerSidebar.bmp`
- **Size:** 164 x 314 pixels
- **Format:** 24-bit BMP
- **Description:** Sidebar image shown during uninstallation

#### `installer.nsh`
- Custom NSIS script for advanced installer customization
- Add registry keys, file associations, etc.
- See [NSIS Documentation](https://nsis.sourceforge.io/Docs/)

### macOS DMG Background (Optional)

#### `dmg-background.png`
- **Size:** 540 x 380 pixels
- **Format:** PNG with transparency (recommended) or solid background
- **Description:** Background image for DMG installer window
- **Design:** Show icon placement areas, "drag to Applications" visual

### Linux Post-Install Scripts (Optional)

#### `deb-postinstall.sh` / `deb-postremove.sh`
- Bash scripts for Debian/Ubuntu packages
- Run after installation or removal
- Must have executable permissions (`chmod +x`)

#### `rpm-postinstall.sh` / `rpm-postremove.sh`
- Bash scripts for RedHat/Fedora/SUSE packages
- Run after installation or removal
- Must have executable permissions (`chmod +x`)

## File Structure

```
build/
├── README.md (this file)
├── entitlements.mac.plist (✓ included)
├── icon.ico (❌ create this)
├── icon.icns (❌ create this)
├── icon.png (❌ create this)
├── installerHeader.bmp (optional)
├── installerSidebar.bmp (optional)
├── uninstallerSidebar.bmp (optional)
├── dmg-background.png (optional)
├── installer.nsh (optional)
├── deb-postinstall.sh (optional)
├── deb-postremove.sh (optional)
├── rpm-postinstall.sh (optional)
└── rpm-postremove.sh (optional)
```

## Icon Design Tips

1. **Simplicity:** Keep the design simple and recognizable at small sizes (16x16)
2. **Contrast:** Ensure good contrast for both light and dark backgrounds
3. **Brand Identity:** Use your brand colors and style
4. **Recognition:** Make it instantly recognizable in a taskbar/dock
5. **Platform Guidelines:**
   - Windows: Follow [Windows icon guidelines](https://learn.microsoft.com/en-us/windows/apps/design/style/iconography/app-icon-design)
   - macOS: Follow [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/app-icons)
   - Linux: Follow [freedesktop.org icon theme spec](https://specifications.freedesktop.org/icon-theme-spec/icon-theme-spec-latest.html)

## Next Steps

1. **Create or obtain a high-quality icon** (1024x1024 PNG)
2. **Generate platform-specific icons** using the commands above
3. **Test the icons** by building the application:
   ```bash
   npm run dist:win   # Windows
   npm run dist:mac   # macOS
   npm run dist:linux # Linux
   ```
4. **Verify icons appear correctly** in installers and installed application
5. **(Optional) Create custom installer graphics** for a more branded experience

## Resources

- [Electron Icon Maker](https://www.npmjs.com/package/electron-icon-maker)
- [png2icons](https://www.npmjs.com/package/png2icons)
- [Icon Generator Online](https://icon.kitchen/) - Web-based icon generator
- [NSIS Documentation](https://nsis.sourceforge.io/Docs/)
- [Electron Builder Icons](https://www.electron.build/icons)

## Support

For questions about build resources, see:
- `electron-builder.yaml` - Main build configuration
- [Electron Builder Documentation](https://www.electron.build/)
