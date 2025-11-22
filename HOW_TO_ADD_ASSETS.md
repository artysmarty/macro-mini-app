# How to Add Image Assets to /public Directory

## Quick Steps

### Method 1: Using File Manager (Easiest)

1. **Open your file manager** (Files/Nautilus on Linux, Finder on Mac, File Explorer on Windows)

2. **Navigate to your project folder:**
   ```
   /home/wilbur/Macro Tracker/public
   ```

3. **Copy your image files** (icon.png, splash.png, hero.png, etc.) into this folder
   - You can drag and drop them
   - Or copy (Ctrl+C) and paste (Ctrl+V)

### Method 2: Using Terminal Commands

If your images are in a specific folder, use these commands:

```bash
# Navigate to your project
cd "/home/wilbur/Macro Tracker"

# Copy a single file (replace /path/to/your/image.png with actual path)
cp /path/to/your/icon.png public/icon.png

# Copy multiple files at once
cp /path/to/your/*.png public/

# Or move files (removes from original location)
mv /path/to/your/icon.png public/icon.png
```

### Method 3: Using VS Code / Cursor

1. **Open the project in VS Code/Cursor**
2. **In the file explorer sidebar**, right-click on the `public` folder
3. **Select "Reveal in File Explorer"** (or similar option)
4. **Copy your image files** into the opened folder

Or:

1. **Drag and drop** image files directly from your file manager into the `public` folder in VS Code/Cursor's file explorer

## Required Files

Make sure you have these files in `/public`:

- ✅ `icon.png` (1024×1024px)
- ✅ `splash.png` (200×200px)
- ✅ `hero.png` (1200×630px)
- ✅ `og-image.png` (1200×630px)
- ✅ `screenshot-1.png` (1284×2778px)
- ✅ `screenshot-2.png` (1284×2778px)
- ✅ `screenshot-3.png` (1284×2778px)

## Verify Files Are Added

After adding files, verify they're in the right place:

```bash
# List all files in public directory
ls -la public/

# Or use the verification script
node scripts/verify-assets.js
```

## Current Public Directory Location

Your public directory is at:
```
/home/wilbur/Macro Tracker/public
```

## Example: If Your Images Are on Desktop

```bash
# If images are on your Desktop
cp ~/Desktop/icon.png "/home/wilbur/Macro Tracker/public/icon.png"
cp ~/Desktop/splash.png "/home/wilbur/Macro Tracker/public/splash.png"
cp ~/Desktop/hero.png "/home/wilbur/Macro Tracker/public/hero.png"
# ... etc
```

## Example: If Your Images Are in Downloads

```bash
# If images are in Downloads folder
cp ~/Downloads/icon.png "/home/wilbur/Macro Tracker/public/icon.png"
# ... etc
```

## Need Help?

If you tell me where your image files are located, I can provide the exact commands to copy them!

