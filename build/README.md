# Build Resources

This directory contains resources used by Electron Builder for creating installers and packages.

## Required Files for Windows NSIS Installer

### Icons (Optional but Recommended)

1. **icon.ico** - Main application icon
   - Used for installer, uninstaller, and app executable
   - Recommended sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
   - Format: ICO file

### Installer Branding Images (Optional)

2. **installerHeader.bmp** - Header image shown at top of installer
   - Dimensions: **150 x 57 pixels**
   - Format: BMP (24-bit)
   - Background: Light colors recommended

3. **installerSidebar.bmp** - Sidebar image shown on left side of installer
   - Dimensions: **164 x 314 pixels**
   - Format: BMP (24-bit)
   - This is the large branding image users see during installation

## How to Create These Files

### For Icons (.ico)

You can use online tools like:
- https://www.icoconverter.com/
- https://convertio.co/png-ico/

Or use tools like:
- GIMP (Free)
- Adobe Photoshop
- Inkscape (Free)

### For BMP Images

Use any image editor:
1. Create/design your image at the exact dimensions
2. Export as 24-bit BMP format
3. Place in this `build/` directory

## Fallback Behavior

If these files are not provided:
- The installer will use default Windows icons
- The installer will have no custom branding
- The app will work perfectly fine!

These files are **optional** and only affect visual appearance of the installer.

## Example Structure

```
build/
├── icon.ico                    # App icon (256x256 recommended)
├── installerHeader.bmp         # 150x57px header
├── installerSidebar.bmp        # 164x314px sidebar
└── README.md                   # This file
```

## Testing

After adding your files, test the installer appearance with:

```bash
npm run dist:win
```

The installer will be created in the `out/` directory.

