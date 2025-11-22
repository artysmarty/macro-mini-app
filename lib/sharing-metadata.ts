// lib/sharing-metadata.ts
import type { Metadata } from "next";

const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || "https://macro-tracker.vercel.app";

interface MiniAppMetadataOptions {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  buttonTitle?: string;
}

/**
 * Generate metadata with fc:miniapp embed tag for shareable pages
 */
export function generateShareableMetadata({
  title,
  description,
  imageUrl = `${ROOT_URL}/hero.png`,
  url,
  buttonTitle = "Open Macro Tracker",
}: MiniAppMetadataOptions): Metadata {
  const shareUrl = url || ROOT_URL;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: {
      "fc:miniapp": JSON.stringify({
        version: "next",
        imageUrl,
        button: {
          title: buttonTitle,
          action: {
            type: "launch_frame",
            url: shareUrl,
          },
        },
      }),
    },
  };
}

/**
 * Get shareable metadata for different content types
 */
export function getMetadataForSharedContent(
  type: "day" | "meal" | "food" | "recipe" | "achievement" | "award",
  id: string,
  data?: {
    name?: string;
    description?: string;
    imageUrl?: string;
    date?: string;
    mealType?: string;
  }
): Metadata {
  const baseUrl = `${ROOT_URL}/shared/${type}/${id}`;
  
  const defaultData = {
    name: "Macro Tracker",
    description: "Track macros, earn rewards, and join fitness challenges on Base",
    imageUrl: `${ROOT_URL}/hero.png`,
  };

  const merged = { ...defaultData, ...data };

  switch (type) {
    case "day": {
      const dateStr = data?.date || "today";
      return generateShareableMetadata({
        title: `My Progress for ${dateStr} - Macro Tracker`,
        description: `Check out my macro progress for ${dateStr}`,
        imageUrl: merged.imageUrl,
        url: baseUrl,
        buttonTitle: "View Progress",
      });
    }

    case "meal": {
      const mealType = data?.mealType || "meal";
      return generateShareableMetadata({
        title: `My ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} - Macro Tracker`,
        description: `Check out my ${mealType} meal`,
        imageUrl: merged.imageUrl,
        url: baseUrl,
        buttonTitle: "View Meal",
      });
    }

    case "food": {
      return generateShareableMetadata({
        title: `${merged.name} - Macro Tracker`,
        description: merged.description || `Check out this food item: ${merged.name}`,
        imageUrl: merged.imageUrl,
        url: baseUrl,
        buttonTitle: "View Food",
      });
    }

    case "recipe": {
      return generateShareableMetadata({
        title: `${merged.name} Recipe - Macro Tracker`,
        description: merged.description || `Check out this recipe: ${merged.name}`,
        imageUrl: merged.imageUrl,
        url: baseUrl,
        buttonTitle: "View Recipe",
      });
    }

    case "achievement": {
      return generateShareableMetadata({
        title: `Achievement Unlocked: ${merged.name} - Macro Tracker`,
        description: merged.description || `Just unlocked this achievement: ${merged.name}`,
        imageUrl: merged.imageUrl || `${ROOT_URL}/achievement.png`,
        url: baseUrl,
        buttonTitle: "View Achievement",
      });
    }

    case "award": {
      return generateShareableMetadata({
        title: `NFT Earned: ${merged.name} - Macro Tracker`,
        description: merged.description || `Just earned this NFT: ${merged.name}`,
        imageUrl: merged.imageUrl || `${ROOT_URL}/nft-placeholder.png`,
        url: baseUrl,
        buttonTitle: "View NFT",
      });
    }

    default:
      return generateShareableMetadata({
        title: "Macro Tracker - Base Fitness & Nutrition",
        description: "Track macros, earn rewards, and join fitness challenges on Base",
        url: baseUrl,
      });
  }
}

