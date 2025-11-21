// components/library/barcode-scanner.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Camera, X } from "lucide-react";
import type { FoodItem } from "@/types";

interface BarcodeScannerProps {
  onBack: () => void;
}

// Mock barcode lookup - in production, use a real API like Open Food Facts or Nutritionix
const mockBarcodeDB: Record<string, FoodItem> = {
  "049000042563": {
    id: "barcode-1",
    name: "Quaker Oats Old Fashioned",
    brand: "Quaker",
    servingSize: "1/2 cup (40g)",
    calories: 150,
    proteinG: 5,
    carbsG: 27,
    fatsG: 3,
    barcode: "049000042563",
    isPublic: true,
  },
};

export function BarcodeScanner({ onBack }: BarcodeScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [scannedFood, setScannedFood] = useState<FoodItem | null>(null);
  const [error, setError] = useState("");

  const handleScan = async (scannedBarcode: string) => {
    setBarcode(scannedBarcode);
    
    // Lookup barcode in database
    const food = mockBarcodeDB[scannedBarcode];
    
    if (food) {
      setScannedFood(food);
      setError("");
    } else {
      setError("Food not found. You can add it manually.");
      setScannedFood(null);
    }
  };

  const handleManualInput = () => {
    const manualBarcode = prompt("Enter barcode (UPC):");
    if (manualBarcode) {
      handleScan(manualBarcode);
    }
  };

  const handleAddToLibrary = async () => {
    if (scannedFood) {
      // TODO: Save to library via API
      console.log("Add to library:", scannedFood);
      onBack();
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {!scannedFood ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <Camera className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold">Scan Barcode</h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Use your camera to scan a product barcode
            </p>
            
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={() => {
                  setScanning(true);
                  // TODO: Implement actual camera scanner using react-qr-reader or similar
                  // For now, simulate scan
                  setTimeout(() => {
                    handleScan("049000042563");
                    setScanning(false);
                  }, 1000);
                }}
                disabled={scanning}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {scanning ? "Scanning..." : "Start Scanning"}
              </button>
              <button
                onClick={handleManualInput}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium dark:border-gray-600"
              >
                Enter Barcode Manually
              </button>
            </div>

            {barcode && (
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Scanned: {barcode}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
            <p className="font-semibold">Tip:</p>
            <p>Make sure the barcode is well-lit and clearly visible in the camera view.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{scannedFood.name}</h3>
                {scannedFood.brand && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{scannedFood.brand}</p>
                )}
                <p className="text-xs text-gray-500">Barcode: {scannedFood.barcode}</p>
              </div>
              <button
                onClick={() => {
                  setScannedFood(null);
                  setBarcode("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Serving</div>
                <div className="font-semibold">{scannedFood.servingSize}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Calories</div>
                <div className="font-semibold">{scannedFood.calories}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <div className="text-gray-600 dark:text-gray-400">Protein</div>
                <div className="font-semibold">{scannedFood.proteinG}g</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400">Carbs</div>
                <div className="font-semibold">{scannedFood.carbsG}g</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400">Fats</div>
                <div className="font-semibold">{scannedFood.fatsG}g</div>
              </div>
            </div>

            <button
              onClick={handleAddToLibrary}
              className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Add to Library
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

