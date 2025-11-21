// lib/minikit-config.ts
const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  miniapp: {
    version: "1",
    name: "Macro Tracker",
    subtitle: "Fitness & Nutrition on Base",
    description: "Track macros, earn rewards, and join fitness challenges on Base",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#ffffff",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "health",
    tags: ["fitness", "macros", "nutrition", "health", "base", "miniapp"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Track macros, earn rewards, join challenges",
    ogTitle: "Macro Tracker - Base Fitness & Nutrition",
    ogDescription: "Track macros, earn rewards, and join fitness challenges on Base",
    ogImageUrl: `${ROOT_URL}/og-image.png`,
  },
} as const;

