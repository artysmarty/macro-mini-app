// components/diary/barcode-scanner-modal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { X, Camera, Check, RefreshCw } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/library";
import type { FoodItem } from "@/types";

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: "breakfast" | "lunch" | "dinner" | "snacks" | null;
  onAdd: (food: FoodItem) => void;
}

// Empty - barcode lookup will use a real API like Open Food Facts or Nutritionix
const mockBarcodeDB: Record<string, FoodItem> = {};

export function BarcodeScannerModal({ isOpen, onClose, mealType, onAdd }: BarcodeScannerModalProps) {
  const [scanning, setScanning] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [scannedFood, setScannedFood] = useState<FoodItem | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      startScanning();
    } else {
      stopScanning();
      setScannedBarcode("");
      setScannedFood(null);
      setError("");
      setCameraError(false);
    }

    return () => {
      stopScanning();
    };
  }, [isOpen]);

  const startScanning = async () => {
    try {
      setLoading(true);
      setCameraError(false);
      
      if (!readerRef.current) {
        readerRef.current = new BrowserMultiFormatReader();
      }

      // Get available video input devices (rear camera preferred)
      const videoInputDevices = await readerRef.current.listVideoInputDevices();
      
      // Try to find rear camera first
      const rearCamera = videoInputDevices.find(
        (device) => device.label.toLowerCase().includes("back") || 
                   device.label.toLowerCase().includes("rear") ||
                   device.label.toLowerCase().includes("environment")
      );
      
      const selectedDevice = rearCamera || videoInputDevices[0];
      
      if (!selectedDevice) {
        throw new Error("No camera found");
      }

      // Start scanning
      readerRef.current.decodeFromVideoDevice(
        selectedDevice.deviceId,
        videoRef.current!,
        (result, error) => {
          if (result) {
            const barcode = result.getText();
            handleBarcodeDetected(barcode);
          }
          if (error && error.name !== "NotFoundException") {
            console.error("Scan error:", error);
          }
        }
      );

      // Get the stream from the video element
      if (videoRef.current && videoRef.current.srcObject) {
        streamRef.current = videoRef.current.srcObject as MediaStream;
      }
      setScanning(true);
      setLoading(false);
    } catch (err: any) {
      console.error("Camera error:", err);
      setCameraError(true);
      setLoading(false);
      setError(err.message || "Failed to access camera. Please grant camera permissions.");
    }
  };

  const stopScanning = () => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    
    setScanning(false);
  };

  const handleBarcodeDetected = (barcode: string) => {
    setScannedBarcode(barcode);
    stopScanning();

    // Lookup barcode in database
    const food = mockBarcodeDB[barcode];
    
    if (food) {
      setScannedFood(food);
      setError("");
    } else {
      // Create a new food item from barcode
      const newFood: FoodItem = {
        id: `barcode-${Date.now()}`,
        name: `Food (Barcode: ${barcode})`,
        servingSize: "1 serving",
        calories: 0,
        proteinG: 0,
        carbsG: 0,
        fatsG: 0,
        barcode: barcode,
        isPublic: false,
      };
      setScannedFood(newFood);
      setError("Food not found in database. You can edit the details below.");
    }
  };

  const handleRetry = () => {
    setScannedBarcode("");
    setScannedFood(null);
    setError("");
    setCameraError(false);
    startScanning();
  };

  const handleAddToDiary = () => {
    if (scannedFood) {
      onAdd(scannedFood);
      stopScanning();
      onClose();
    }
  };

  const handleCancel = () => {
    stopScanning();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-dark-card flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Scan Barcode</h2>
          <button
            onClick={handleCancel}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Camera Preview or Scanned Food */}
        {loading ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="text-center">
              <Camera className="mx-auto mb-4 h-12 w-12 animate-pulse text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Initializing camera...</p>
            </div>
          </div>
        ) : cameraError ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8">
            <Camera className="mb-4 h-16 w-16 text-red-400" />
            <p className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
              {error || "Camera access failed. Please grant camera permissions."}
            </p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              <RefreshCw className="h-4 w-4" />
              Tap to Retry
            </button>
            <button
              onClick={handleCancel}
              className="mt-4 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Cancel
            </button>
          </div>
        ) : scannedFood ? (
          <div className="flex flex-1 flex-col p-4 overflow-y-auto">
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Barcode detected: {scannedBarcode}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-gray-300 bg-white p-4 dark:border-dark-border dark:bg-dark-card mb-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-dark-text">
                {scannedFood.name}
              </h3>
              {scannedFood.brand && (
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{scannedFood.brand}</p>
              )}
              <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                Serving: {scannedFood.servingSize}
              </p>

              <div className="grid grid-cols-4 gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50 mb-4">
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Cal</div>
                  <div className="font-semibold">{scannedFood.calories}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">P</div>
                  <div className="font-semibold">{scannedFood.proteinG}g</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">C</div>
                  <div className="font-semibold">{scannedFood.carbsG}g</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">F</div>
                  <div className="font-semibold">{scannedFood.fatsG}g</div>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleRetry}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-dark-border dark:hover:bg-dark-hover"
                >
                  Scan Another
                </button>
                <button
                  onClick={handleAddToDiary}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                >
                  Add to {mealType ? mealType.charAt(0).toUpperCase() + mealType.slice(1) : "Diary"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            <div className="relative flex-1 bg-black">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                autoPlay
                playsInline
                muted
              />
              {/* Scanning overlay */}
              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-64 w-64 border-2 border-white border-dashed rounded-lg" />
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-300 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
              <p className="mb-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Position the barcode within the frame
              </p>
              <button
                onClick={handleCancel}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-dark-border dark:hover:bg-dark-hover"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

