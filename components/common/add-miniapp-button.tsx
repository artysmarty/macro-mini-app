// components/common/add-miniapp-button.tsx
"use client";

import { useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Plus, Check } from "lucide-react";

interface AddMiniAppButtonProps {
  variant?: "button" | "icon";
  className?: string;
}

export function AddMiniAppButton({
  variant = "button",
  className = "",
}: AddMiniAppButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddMiniApp = useCallback(async () => {
    try {
      setIsLoading(true);
      setSuccess(false);

      // Check if we're in a mini app context
      const isInMiniApp = await sdk.isInMiniApp();
      if (!isInMiniApp) {
        alert("This feature is only available in the Base app or Farcaster app.");
        return;
      }

      // Prompt user to add the mini app
      const response = await sdk.actions.addMiniApp();

      if (response.notificationDetails) {
        setSuccess(true);
        // Success - mini app added with notifications enabled
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setSuccess(true);
        // Success - mini app added without notifications
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error: any) {
      console.error("Error adding mini app:", error);
      
      // Handle specific error cases
      if (error?.message?.includes("rejected") || error?.type === "rejected_by_user") {
        // User cancelled - don't show error
        return;
      }
      
      alert(`Failed to add mini app: ${error?.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (variant === "icon") {
    return (
      <button
        onClick={handleAddMiniApp}
        disabled={isLoading || success}
        className={`flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-dark-border dark:hover:bg-dark-hover ${className}`}
        title="Add Mini App"
      >
        {success ? (
          <Check className="h-5 w-5 text-success" />
        ) : (
          <Plus className="h-5 w-5 text-gray-900 dark:text-dark-text" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleAddMiniApp}
      disabled={isLoading || success}
      className={`flex items-center gap-2 rounded-lg border border-primary bg-transparent px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Adding...</span>
        </>
      ) : success ? (
        <>
          <Check className="h-4 w-4 text-success" />
          <span>Added!</span>
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          <span>Add Mini App</span>
        </>
      )}
    </button>
  );
}

