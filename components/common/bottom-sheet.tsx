// components/common/bottom-sheet.tsx
"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  centered?: boolean; // New prop to enable centered mode
}

export function BottomSheet({ isOpen, onClose, title, children, centered = false }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Centered mode (for Food Detail Sheet)
  if (centered) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
        
        {/* Centered Sheet */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div 
            className="w-full max-w-md max-h-[90vh] rounded-2xl bg-white shadow-2xl dark:bg-dark-card overflow-hidden pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3 dark:border-dark-border">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">{title}</h2>
                <button
                  onClick={onClose}
                  className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            
            {/* Content */}
            <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-4">
              {children}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Bottom-anchored mode (default, for backward compatibility)
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] rounded-t-[32px] bg-white shadow-2xl dark:bg-dark-card">
        {/* Handle */}
        <div className="flex items-center justify-center pt-3 pb-2">
          <div className="h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
        
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3 dark:border-dark-border">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">{title}</h2>
            <button
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="max-h-[calc(85vh-80px)] overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </>
  );
}

