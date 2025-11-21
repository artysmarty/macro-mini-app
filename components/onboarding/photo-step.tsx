// components/onboarding/photo-step.tsx
"use client";

import { useState, useRef } from "react";
import { Upload, X, Camera } from "lucide-react";

interface PhotoStepProps {
  data?: File;
  onUpdate: (photo: File) => void;
}

export function PhotoStep({ data, onUpdate }: PhotoStepProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    onUpdate(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    onUpdate(null as any);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold">Starting Photo</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Optional: Upload a starting progress photo to track your transformation.
        </p>
      </div>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full rounded-lg object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 hover:border-gray-400 dark:border-gray-600"
        >
          <Camera className="mb-4 h-12 w-12 text-gray-400" />
          <p className="mb-2 font-medium">Click to upload photo</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            or drag and drop
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

