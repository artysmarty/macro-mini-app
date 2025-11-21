// components/dashboard/photo-carousel.tsx
"use client";

import { useState } from "react";
import { Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// Mock photos - will be replaced with actual API data
const mockPhotos = [
  { id: "1", date: "2024-01-01", url: "/placeholder.jpg" },
  { id: "2", date: "2024-01-08", url: "/placeholder.jpg" },
  { id: "3", date: "2024-01-15", url: "/placeholder.jpg" },
];

export function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % mockPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + mockPhotos.length) % mockPhotos.length);
  };

  if (mockPhotos.length === 0) {
    return (
      <div className="rounded-xl border border-gray-300 bg-white p-8 text-center shadow-card dark:border-dark-border dark:bg-dark-card dark:shadow-card-dark">
        <ImageIcon className="mx-auto mb-2 h-12 w-12 text-gray-400" />
        <p className="text-sm text-gray-500 dark:text-gray-400">No progress photos yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-gray-300 bg-white overflow-hidden shadow-card dark:border-dark-border dark:bg-dark-card dark:shadow-card-dark">
        <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800">
          {mockPhotos[currentIndex] && (
            <button
              onClick={() => setViewerOpen(true)}
              className="relative h-full w-full"
            >
              <div className="relative h-full w-full">
                {mockPhotos[currentIndex].url !== "/placeholder.jpg" ? (
                  <Image
                    src={mockPhotos[currentIndex].url}
                    alt={`Progress photo from ${mockPhotos[currentIndex].date}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <div className="progress-photo-overlay absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="text-sm font-medium">
                    {new Date(mockPhotos[currentIndex].date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>
          )}

          {/* Navigation */}
          {mockPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dots */}
          {mockPhotos.length > 1 && (
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
              {mockPhotos.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Viewer */}
      {viewerOpen && mockPhotos[currentIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          onClick={() => setViewerOpen(false)}
        >
          <div className="relative h-full w-full">
            {mockPhotos[currentIndex].url !== "/placeholder.jpg" ? (
              <Image
                src={mockPhotos[currentIndex].url}
                alt={`Progress photo from ${mockPhotos[currentIndex].date}`}
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ImageIcon className="h-24 w-24 text-white/50" />
              </div>
            )}
            <button
              onClick={() => setViewerOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

