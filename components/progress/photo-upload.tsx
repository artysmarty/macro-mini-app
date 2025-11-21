// components/progress/photo-upload.tsx
"use client";

import { useState, useRef } from "react";
import { Upload, Camera, X, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { useAccount } from "wagmi";

interface PhotoUploadProps {
  onUploadComplete?: (photoUrl: string) => void;
}

export function PhotoUpload({ onUploadComplete }: PhotoUploadProps) {
  const { address } = useAccount();
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [photoType, setPhotoType] = useState<"front" | "side" | "back">("front");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setPhoto(file);
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

  const handleUpload = async () => {
    if (!photo || !address) return;

    setUploading(true);
    try {
      // Create FormData
      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("userId", address);
      formData.append("date", format(new Date(), "yyyy-MM-dd"));
      formData.append("type", photoType);

      // TODO: Upload to storage (S3, Cloudinary, etc.)
      // const response = await fetch("/api/photos/upload", {
      //   method: "POST",
      //   body: formData,
      // });
      // const { url } = await response.json();

      // Mock upload
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const mockUrl = URL.createObjectURL(photo);

      // TODO: Save photo metadata to database
      // await fetch("/api/photos", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     userId: address,
      //     date: format(new Date(), "yyyy-MM-dd"),
      //     type: photoType,
      //     storageUrl: mockUrl,
      //   }),
      // });

      if (onUploadComplete) {
        onUploadComplete(mockUrl);
      }

      // Reset
      setPhoto(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";

      alert("Photo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Upload Progress Photo</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track your transformation with photos
        </p>
      </div>

      {/* Photo Type Selector */}
      <div>
        <label className="mb-2 block text-sm font-medium">Photo Angle</label>
        <div className="flex gap-2">
          {(["front", "side", "back"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setPhotoType(type)}
              className={`flex-1 rounded-lg border-2 px-4 py-2 capitalize transition-colors ${
                photoType === type
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      {!preview ? (
        <div className="space-y-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 hover:border-gray-400 dark:border-gray-600"
          >
            <Upload className="mb-4 h-12 w-12 text-gray-400" />
            <p className="mb-2 font-medium">Click to upload from device</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">or</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
              className="mt-2 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Camera className="h-4 w-4" />
              Take Photo
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full rounded-lg object-cover"
            />
            <button
              onClick={() => {
                setPhoto(null);
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                if (cameraInputRef.current) cameraInputRef.current.value = "";
              }}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <ImageIcon className="h-5 w-5" />
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>
        </div>
      )}

      <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
        <p className="font-semibold">Privacy Note:</p>
        <p>Photos are stored securely and only used for your progress tracking. They can be used to generate your 3D avatar with your consent.</p>
      </div>
    </div>
  );
}

