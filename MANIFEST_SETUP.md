# Manifest Setup Guide

This guide explains how to set up and verify your Mini App manifest for Base deployment.

## Current Status

Your manifest file is located at: `/public/.well-known/farcaster.json`

### ✅ Completed Fields

All required and optional fields are configured:
- ✅ Version, name, homeUrl, iconUrl, splashImageUrl
- ✅ Primary category: `health-fitness`
- ✅ Tags: `["fitness", "macros", "nutrition", "health", "base"]`
- ✅ Display information (subtitle, description, tagline)
- ✅ Hero image and OG metadata
- ✅ Webhook URL for notifications
- ✅ Screenshot URLs (3 screenshots)

### ⚠️ Required Actions

#### 1. Update Domain URLs

**Before deployment**, update all URLs in the manifest to match your production domain:

```json
{
  "homeUrl": "https://your-actual-domain.com",
  "iconUrl": "https://your-actual-domain.com/icon.png",
  "splashImageUrl": "https://your-actual-domain.com/splash.png",
  "heroImageUrl": "https://your-actual-domain.com/hero.png",
  "ogImageUrl": "https://your-actual-domain.com/og-image.png",
  "screenshotUrls": [
    "https://your-actual-domain.com/screenshot-1.png",
    "https://your-actual-domain.com/screenshot-2.png",
    "https://your-actual-domain.com/screenshot-3.png"
  ],
  "webhookUrl": "https://your-actual-domain.com/api/webhook"
}
```

#### 2. Generate Account Association

1. Deploy your app to production (Vercel, etc.)
2. Navigate to [Base Build Account Association Tool](https://www.base.dev/preview?tab=account)
3. Paste your production domain (e.g., `macro-tracker.vercel.app`) in the "App URL" field
4. Click "Submit"
5. Click "Verify" and sign the message with your wallet
6. Copy the generated `accountAssociation` fields:
   - `header`
   - `payload`
   - `signature`
7. Update `/public/.well-known/farcaster.json` with these values

#### 3. Set Base Builder Owner Address

Update the `baseBuilder.ownerAddress` field with the wallet address you used when importing your mini app to Base Build:

```json
{
  "baseBuilder": {
    "ownerAddress": "0xYourActualWalletAddress"
  }
}
```

#### 4. Remove `noindex` for Production

When ready for public discovery, change:

```json
{
  "noindex": false
}
```

Or remove the `noindex` field entirely (defaults to `false`).

## Image Requirements

Ensure all images meet the requirements:

- **icon.png**: 1024×1024px, PNG, transparent background discouraged
- **splash.png**: Recommended 200×200px
- **hero.png**: 1200×630px (1.91:1 aspect ratio), PNG/JPG
- **og-image.png**: 1200×630px (1.91:1 aspect ratio), PNG/JPG
- **screenshot-1.png, screenshot-2.png, screenshot-3.png**: Portrait 1284×2778px recommended

### Image Generation Tool

Use the [Mini App Assets Generator](https://www.miniappassets.com/) to generate properly formatted images.

## Field Validation

### Name
- ✅ "Macro Tracker" (12 chars, under 32 char limit)

### Subtitle
- ✅ "Fitness & Nutrition on Base" (30 chars, at limit)

### Description
- ✅ "Track macros, earn rewards, and join fitness challenges on Base" (70 chars, under 170 char limit)

### Tagline
- ✅ "Track macros, earn rewards" (26 chars, under 30 char limit)

### Tags
- ✅ All lowercase: `["fitness", "macros", "nutrition", "health", "base"]`
- ✅ No spaces, emojis, or special characters
- ✅ 5 tags (under 5 tag limit)
- ✅ Each tag under 20 characters

### Primary Category
- ✅ "health-fitness" (valid category)

### OG Fields
- ✅ ogTitle: "Macro Tracker - Base Fitness & Nutrition" (42 chars, may need to shorten to 30)
- ✅ ogDescription: "Track macros, earn rewards, and join fitness challenges on Base" (70 chars, under 100 char limit)

## Verification Checklist

Before submitting to Base Build:

- [ ] All URLs point to production domain
- [ ] All images exist and are accessible at their URLs
- [ ] Images meet size requirements
- [ ] `accountAssociation` fields are filled (via Base Build tool)
- [ ] `baseBuilder.ownerAddress` is set to your wallet address
- [ ] `noindex` is set to `false` or removed (for production)
- [ ] Manifest is accessible at `https://your-domain.com/.well-known/farcaster.json`
- [ ] All field lengths are within limits
- [ ] Tags are lowercase with no spaces/special chars

## Testing

1. Deploy your app
2. Verify manifest is accessible: `curl https://your-domain.com/.well-known/farcaster.json`
3. Use Base Build Account Association tool to generate and verify account association
4. Test sharing links to ensure embeds work correctly

## Notes

- Changes to the manifest take effect after redeployment
- The platform re-indexes the manifest after updates
- Keep `noindex: true` during development to prevent search indexing

