// components/diary/add-food-menu.tsx
"use client";

import { useState, useEffect } from "react";
import { BookOpen, Scan, FileText, Sparkles } from "lucide-react";
import { AddFromLibraryModal } from "./add-from-library-modal";
import { BarcodeScannerModal } from "./barcode-scanner-modal";
import { QuickAddModal } from "./quick-add-modal";
import { AISuggestModal } from "./ai-suggest-modal";

import type { FoodItem } from "@/types";

interface AddFoodMenuProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: "breakfast" | "lunch" | "dinner" | "snacks" | null;
  onAddFood: (food: FoodItem | FoodItem[], mealTypeOverride?: "breakfast" | "lunch" | "dinner" | "snacks" | null, quantityOverride?: number) => void;
}

export function AddFoodMenu({ isOpen, onClose, mealType, onAddFood }: AddFoodMenuProps) {
  const [activeView, setActiveView] = useState<string | null>(null);
  const [touchStartY, setTouchStartY] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setActiveView(null);
    }
  }, [isOpen]);

  // Handle swipe down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchEndY = e.touches[0].clientY;
    const deltaY = touchEndY - touchStartY;
    
    // If swiping down more than 100px, close
    if (deltaY > 100 && !activeView) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const actions = [
    {
      id: "library",
      label: "Add from Library",
      icon: BookOpen,
      color: "bg-primary",
      onClick: () => setActiveView("library"),
    },
    {
      id: "barcode",
      label: "Scan Barcode",
      icon: Scan,
      color: "bg-success",
      onClick: () => setActiveView("barcode"),
    },
    {
      id: "quick-add",
      label: "Quick Add",
      icon: FileText,
      color: "bg-warning",
      onClick: () => setActiveView("quick-add"),
    },
    {
      id: "ai-suggest",
      label: "AI Suggest",
      icon: Sparkles,
      color: "bg-info",
      onClick: () => setActiveView("ai-suggest"),
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />
      
      {/* Centered Modal - FORCE centered, NOT bottom-anchored */}
      <div 
        style={{
          position: 'fixed',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          zIndex: 50,
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '384px',
            borderRadius: '16px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            pointerEvents: 'auto',
            margin: 'auto',
            padding: '0px',
            top: 'auto',
            bottom: 'auto',
          }}
        >
          {/* Header - NO X button */}
          <div style={{ padding: '16px', paddingBottom: '16px', borderBottom: 'none' }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: 600,
              textAlign: 'center',
              margin: 0,
              color: '#111827'
            }}>
              Add Food
            </h2>
          </div>
          
          {/* Content - FORCE 2x2 Grid */}
          <div style={{ padding: '16px', paddingTop: '16px', paddingBottom: '24px' }}>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => action.onClick()}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid #D1D5DB',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: action.color === 'bg-primary' ? '#3A7BFF' :
                                      action.color === 'bg-success' ? '#28CC8B' :
                                      action.color === 'bg-warning' ? '#FFB74D' :
                                      '#67C8FF',
                      color: 'white',
                    }}>
                      <Icon size={24} />
                    </div>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      textAlign: 'center',
                      color: '#111827',
                    }}>
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modals for each action */}
      {activeView === "library" && (
        <AddFromLibraryModal
          isOpen={true}
          onClose={() => setActiveView(null)}
          mealType={mealType}
                  onAdd={(food, quantity) => {
                    // Pass mealType explicitly to preserve it even if modal closes
                    console.log("AddFromLibraryModal onAdd called:", { food, mealType, quantity });
                    if (!mealType) {
                      console.error("mealType is null in AddFoodMenu!");
                      alert("Error: Meal type not selected. Please try again.");
                      return;
                    }
                    onAddFood(food, mealType, quantity);
                    setActiveView(null);
                    onClose();
                  }}
        />
      )}

      {activeView === "barcode" && (
        <BarcodeScannerModal
          isOpen={true}
          onClose={() => setActiveView(null)}
          mealType={mealType}
          onAdd={(food) => {
            // Pass mealType explicitly to preserve it even if modal closes
            onAddFood(food, mealType);
            setActiveView(null);
            onClose();
          }}
        />
      )}

      {activeView === "quick-add" && (
        <QuickAddModal
          isOpen={true}
          onClose={() => setActiveView(null)}
          mealType={mealType}
          onAdd={(food) => {
            // Pass mealType explicitly to preserve it even if modal closes
            onAddFood(food, mealType);
            setActiveView(null);
            onClose();
          }}
        />
      )}

      {activeView === "ai-suggest" && (
        <AISuggestModal
          isOpen={true}
          onClose={() => setActiveView(null)}
          mealType={mealType}
          onAdd={(meals) => {
            // Pass mealType explicitly to preserve it even if modal closes
            onAddFood(meals, mealType);
            setActiveView(null);
            onClose();
          }}
        />
      )}
    </>
  );
}

