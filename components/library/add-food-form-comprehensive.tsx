// components/library/add-food-form-comprehensive.tsx
"use client";

import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { ArrowLeft, Camera } from "lucide-react";

interface AddFoodFormComprehensiveProps {
  onBack: () => void;
  onSaveRef?: (saveFn: () => void) => void;
  onFormChange?: (isValid: boolean) => void;
}

export interface AddFoodFormRef {
  save: () => void;
}

const weightUnits = ["g", "oz", "lb", "ml", "tsp", "tbsp", "fl oz", "cup"];

export const AddFoodFormComprehensive = forwardRef<AddFoodFormRef, AddFoodFormComprehensiveProps>(
  ({ onBack, onSaveRef, onFormChange }, ref) => {
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    brand: "",
    
    // Serving Info
    servingSize: "",
    servingSizeUnit: "",
    servingWeight: "",
    servingWeightUnit: "g",
    
    // Macros (auto-calculated if not specified)
    calories: "",
    proteinG: "",
    totalFatG: "",
    saturatedFatG: "",
    transFatG: "",
    cholesterolMg: "",
    sodiumMg: "",
    totalCarbsG: "",
    fiberG: "",
    totalSugarsG: "",
    addedSugarsG: "",
    
    // Vitamins & Minerals
    vitaminDMcg: "",
    calciumMg: "",
    ironMg: "",
    potassiumMg: "",
  });

  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Auto-calculate calories if not specified (Protein 4 cal/g, Carbs 4 cal/g, Fat 9 cal/g)
  useEffect(() => {
    if (!formData.calories) {
      const protein = parseFloat(formData.proteinG) || 0;
      const carbs = parseFloat(formData.totalCarbsG) || 0;
      const fat = parseFloat(formData.totalFatG) || 0;
      const calculated = Math.round(protein * 4 + carbs * 4 + fat * 9);
      if (calculated > 0) {
        setFormData((prev) => ({ ...prev, calories: calculated.toString() }));
      }
    }
  }, [formData.proteinG, formData.totalCarbsG, formData.totalFatG, formData.calories]);

  // Validate form
  useEffect(() => {
    const isValid = !!(formData.name && formData.servingSize && formData.calories);
    onFormChange?.(isValid);
  }, [formData, onFormChange]);

  const handleScanBarcode = async () => {
    setShowBarcodeScanner(true);
    // TODO: Open camera and scan barcode
    // For now, just open a prompt
    const barcode = prompt("Enter barcode number (or scan with camera)");
    if (barcode) {
      // TODO: Fetch nutrition data from barcode API
      // Mock autofill for now
      console.log("Scanned barcode:", barcode);
    }
    setShowBarcodeScanner(false);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // TODO: Save to API
    console.log("Save food:", formData);
    // Success callback will be handled by parent
  };

  useImperativeHandle(ref, () => ({
    save: handleSubmit,
  }));

  useEffect(() => {
    if (onSaveRef) {
      onSaveRef(handleSubmit);
    }
  }, [onSaveRef]);

  // Calculate summary macros for display
  const summaryMacros = {
    calories: parseFloat(formData.calories) || 0,
    proteinG: parseFloat(formData.proteinG) || 0,
    carbsG: parseFloat(formData.totalCarbsG) || 0,
    fatsG: parseFloat(formData.totalFatG) || 0,
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

      <div className="space-y-4">
        {/* Name and Brand Section */}
        <div className="space-y-3 rounded-xl border border-gray-300 p-4 dark:border-dark-border">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name of Food *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
              placeholder="e.g., Chicken Breast"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Brand
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => updateField("brand", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Summary Section - Macro Rings */}
        <div className="rounded-xl border border-gray-300 p-4 dark:border-dark-border">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-dark-text">Summary</h3>
          <div className="flex justify-between px-4">
            <div className="flex flex-1 flex-col items-center">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Cal</div>
              <div className="text-sm font-bold text-gray-900 dark:text-dark-text">
                {summaryMacros.calories}
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Protein</div>
              <div className="text-sm font-bold text-gray-900 dark:text-dark-text">
                {summaryMacros.proteinG}g
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Carbs</div>
              <div className="text-sm font-bold text-gray-900 dark:text-dark-text">
                {summaryMacros.carbsG}g
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Fat</div>
              <div className="text-sm font-bold text-gray-900 dark:text-dark-text">
                {summaryMacros.fatsG}g
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Section */}
        <div className="rounded-xl border border-gray-300 p-4 dark:border-dark-border">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text">Nutrition</h3>
            <button
              type="button"
              onClick={handleScanBarcode}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-dark-border dark:text-gray-300 dark:hover:bg-dark-hover"
            >
              <Camera className="h-4 w-4" />
              Scan Barcode
            </button>
          </div>

          <div className="space-y-3">
            {/* Serving Size */}
            <div className="rounded-lg border border-gray-200 p-3 dark:border-dark-border">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Serving Size *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  value={formData.servingSize}
                  onChange={(e) => updateField("servingSize", e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
                  placeholder="1"
                />
                <input
                  type="text"
                  required
                  value={formData.servingSizeUnit}
                  onChange={(e) => updateField("servingSizeUnit", e.target.value)}
                  className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
                  placeholder="cup, bar, etc"
                />
              </div>
            </div>

            {/* Serving Weight (Optional) */}
            <div className="rounded-lg border border-gray-200 p-3 dark:border-dark-border">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Serving Weight (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.servingWeight}
                  onChange={(e) => updateField("servingWeight", e.target.value)}
                  inputMode="decimal"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
                  placeholder="0"
                />
                <select
                  value={formData.servingWeightUnit}
                  onChange={(e) => updateField("servingWeightUnit", e.target.value)}
                  className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
                >
                  {weightUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nutrition Fields - Each in own border */}
            <div className="rounded-lg border border-gray-200 p-3 dark:border-dark-border">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Calories (auto-calculated if not specified)
              </label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => updateField("calories", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
                placeholder="Auto-calculated"
              />
            </div>

            {[
              { key: "totalFatG", label: "Total Fat (g)" },
              { key: "saturatedFatG", label: "Saturated Fat (g)" },
              { key: "transFatG", label: "Trans Fat (g)" },
              { key: "cholesterolMg", label: "Cholesterol (mg)" },
              { key: "sodiumMg", label: "Sodium (mg)" },
              { key: "totalCarbsG", label: "Total Carb (g)" },
              { key: "fiberG", label: "Fiber (g)" },
              { key: "totalSugarsG", label: "Total Sugars (g)" },
              { key: "addedSugarsG", label: "Added Sugars (g)" },
              { key: "proteinG", label: "Protein (g)" },
              { key: "vitaminDMcg", label: "Vitamin D (mcg)" },
              { key: "calciumMg", label: "Calcium (mg)" },
              { key: "ironMg", label: "Iron (mg)" },
              { key: "potassiumMg", label: "Potassium (mg)" },
            ].map(({ key, label }) => (
              <div key={key} className="rounded-lg border border-gray-200 p-3 dark:border-dark-border">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData[key as keyof typeof formData]}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  }
);

AddFoodFormComprehensive.displayName = "AddFoodFormComprehensive";

