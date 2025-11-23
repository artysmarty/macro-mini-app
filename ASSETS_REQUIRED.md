# Required Image Assets

Your manifest references these image files, which need to be created and placed in the `/public` directory.

## Required Assets

### 1. **icon.png** (Required)
- **Size**: 1024×1024px
- **Format**: PNG
- **Background**: Transparent background discouraged
- **Purpose**: App icon displayed in Base app
- **Location**: `/public/icon.png`

### 2. **splash.png** (Required)
- **Size**: 200×200px (recommended)
- **Format**: PNG
- **Purpose**: Loading screen image shown while app initializes
- **Location**: `/public/splash.png`

### 3. **hero.png** (Required)
- **Size**: 1200×630px (1.91:1 aspect ratio)
- **Format**: PNG or JPG
- **Purpose**: Hero image for discovery and app profile
- **Location**: `/public/hero.png`

### 4. **og-image.png** (Optional but Recommended)
- **Size**: 1200×630px (1.91:1 aspect ratio)
- **Format**: PNG or JPG
- **Purpose**: Open Graph image for social sharing
- **Location**: `/public/og-image.png`

### 5. **Screenshot Images** (Required - 3 screenshots)
- **screenshot-1.png**
- **screenshot-2.png**
- **screenshot-3.png**
- **Size**: Portrait 1284×2778px (recommended)
- **Format**: PNG or JPG
- **Purpose**: App preview screenshots shown in discovery
- **Location**: `/public/screenshot-1.png`, `/public/screenshot-2.png`, `/public/screenshot-3.png`

## Creating Assets

### Option 1: Use Mini App Assets Generator (Recommended)
1. Go to [Mini App Assets Generator](https://www.miniappassets.com/)
2. Upload your app design or use templates
3. Generate all required assets at once
4. Download and place in `/public` directory

### Option 2: Design Your Own
Use design tools like:
- **Figma** - Free, browser-based
- **Canva** - Easy templates
- **Photoshop/GIMP** - Advanced editing

### Design Tips

#### Icon (icon.png)
- Should be recognizable at small sizes
- Use bold colors and simple shapes
- Include app name or logo
- Ensure it works on both light and dark backgrounds

#### Splash Screen (splash.png)
- Usually the same as your icon
- Can be simplified version of icon
- Should load quickly

#### Hero Image (hero.png)
- Showcase your app's main feature
- Include app name and tagline
- Use high-quality imagery
- Should be visually appealing and represent your brand

#### Screenshots
- Show the most important features
- Use actual app screenshots or mockups
- Ensure text is readable
- Show progression of features across 3 screenshots

## Quick Checklist

- [ ] Create `icon.png` (1024×1024px)
- [ ] Create `splash.png` (200×200px)
- [ ] Create `hero.png` (1200×630px)
- [ ] Create `og-image.png` (1200×630px)
- [ ] Create `screenshot-1.png` (1284×2778px)
- [ ] Create `screenshot-2.png` (1284×2778px)
- [ ] Create `screenshot-3.png` (1284×2778px)
- [ ] Place all files in `/public` directory
- [ ] Verify URLs in manifest point to correct files
- [ ] Test that images are accessible via URLs

## Testing

After adding images, verify they're accessible:

```bash
# Local testing
curl http://localhost:3000/icon.png
curl http://localhost:3000/hero.png

# Production (after deployment)
curl https://your-domain.com/icon.png
curl https://your-domain.com/hero.png
```

## Current Status

❌ **All image assets are missing** - You need to create them before deployment.

The manifest file references these images, but the actual files don't exist yet in your `/public` directory.


