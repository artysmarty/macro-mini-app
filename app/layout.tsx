// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Macro Tracker - Base Fitness & Nutrition",
  description: "Track macros, earn rewards, and join fitness challenges on Base",
  other: {
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://macro-tracker.vercel.app"}/hero.png`,
      button: {
        title: "Open Macro Tracker",
        action: {
          type: "launch_frame",
          url: `${process.env.NEXT_PUBLIC_APP_URL || "https://macro-tracker.vercel.app"}`,
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

