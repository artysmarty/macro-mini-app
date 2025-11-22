// app/shared/[type]/[id]/page.tsx
import { Metadata } from "next";
import { getMetadataForSharedContent } from "@/lib/sharing-metadata";
import { SharedItemPageClient } from "./client";

type SharedType = "day" | "meal" | "food" | "recipe" | "achievement" | "award";

interface PageProps {
  params: Promise<{
    type: SharedType;
    id: string;
  }>;
}

/**
 * Generate metadata for shareable pages
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type, id } = await params;
  
  // Extract additional data from ID or query params if needed
  // For now, use defaults - in production, fetch from API
  const metadataData: Record<string, any> = {};
  
  if (type === "day" && id.startsWith("day-")) {
    const dateStr = id.replace("day-", "");
    metadataData.date = dateStr;
  }
  
  if (type === "meal" && id.includes("-")) {
    const [mealType, date] = id.split("-");
    metadataData.mealType = mealType;
    metadataData.date = date;
  }
  
  return getMetadataForSharedContent(type, id, metadataData);
}

export default async function SharedItemPage({ params }: PageProps) {
  const { type, id } = await params;
  
  return <SharedItemPageClient type={type} id={id} />;
}
