// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { OnboardingGuard } from "@/components/onboarding/onboarding-guard";
import { SDKReady } from "@/components/sdk-ready";

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Call SDK ready() as early as possible
              (function() {
                if (typeof window !== 'undefined') {
                  window.addEventListener('DOMContentLoaded', function() {
                    setTimeout(function() {
                      try {
                        // Try to call ready() if SDK is available
                        if (window.farcaster && window.farcaster.miniapp) {
                          window.farcaster.miniapp.actions.ready().then(function() {
                            console.log('[Inline Script] ✅ SDK ready() called successfully');
                          }).catch(function(e) {
                            console.error('[Inline Script] ❌ SDK ready() error:', e);
                          });
                        }
                      } catch (e) {
                        console.error('[Inline Script] Error accessing SDK:', e);
                      }
                    }, 100);
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <SDKReady />
        <Providers>
          <OnboardingGuard>{children}</OnboardingGuard>
        </Providers>
      </body>
    </html>
  );
}

