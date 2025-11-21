// components/navigation/bottom-nav.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Utensils, Plus, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuickActionMenu } from "@/components/common/quick-action-menu";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/diary", icon: Utensils, label: "Diary" },
  { href: "/library", icon: Plus, label: "Library", isCenter: true },
  { href: "/challenges", icon: Trophy, label: "Challenges" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLibraryPage = pathname === "/library";

  const handleMouseDown = (e: React.MouseEvent, href: string) => {
    if (href === "/library") {
      pressTimerRef.current = setTimeout(() => {
        setMenuOpen(true);
        // Haptic feedback
        if (typeof window !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(10);
        }
      }, 600); // 600ms hold time
    }
  };

  const handleMouseUp = (e: React.MouseEvent, href: string) => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (href === "/library" && !menuOpen) {
      router.push(href);
    }
  };

  const handleTouchStart = (e: React.TouchEvent, href: string) => {
    if (href === "/library") {
      pressTimerRef.current = setTimeout(() => {
        setMenuOpen(true);
        // Haptic feedback
        if (typeof window !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(10);
        }
      }, 600); // 600ms hold time
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, href: string) => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (href === "/library" && !menuOpen) {
      router.push(href);
    }
  };

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };
  }, []);

  // Close menu when navigating away
  useEffect(() => {
    if (!isLibraryPage) {
      setMenuOpen(false);
    }
  }, [isLibraryPage]);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            
            if (item.isCenter) {
              return (
                <div key={item.href} className="relative">
                  <button
                    onMouseDown={(e) => handleMouseDown(e, item.href)}
                    onMouseUp={(e) => handleMouseUp(e, item.href)}
                    onTouchStart={(e) => handleTouchStart(e, item.href)}
                    onTouchEnd={(e) => handleTouchEnd(e, item.href)}
                    onMouseLeave={() => {
                      if (pressTimerRef.current) {
                        clearTimeout(pressTimerRef.current);
                        pressTimerRef.current = null;
                      }
                    }}
                    onClick={() => {
                      if (!menuOpen) {
                        router.push(item.href);
                      }
                    }}
                    className={cn(
                      "-mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-xl transition-all hover:bg-primary-hover",
                      menuOpen && "bg-primary-hover scale-110"
                    )}
                  >
                    <Icon className="h-8 w-8" />
                  </button>
                </div>
              );
            }
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors",
                  "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-dark-text"
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Quick Action Menu - available from any page */}
      <QuickActionMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
