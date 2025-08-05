"use client";
import styles from "./page.module.css";
import BuildingInformation from "../components/buildingInformation/buildingInformation";
import MechanicalSystems from "../components/mechanicalSystems/mechanicalSystems";
import ElectricalSystems from "../components/electricalsystems/page";
import ComplianceOtherSystems from "../components/complianceOtherSystems/complianceOtherSystems";
import PpmCostingSummary from "../components/ppmCostingSummary/ppmCostingSummary";
import CacheLoadingOverlay from "../components/CacheLoadingOverlay";
import { useFormContext } from "@/hooks/useFormContext";
import { useCacheManager } from "@/hooks/useCacheManager";
import { useState, useEffect } from "react";

export default function Home() {
  const { saveToLocalStorage } = useFormContext();
  const [isSaving, setIsSaving] = useState(false);
  const [showCacheOverlay, setShowCacheOverlay] = useState(false);
  const { isLoading, progress, cachePages } = useCacheManager();

  // Start caching on component mount
  useEffect(() => {
    const startCaching = async () => {
      setShowCacheOverlay(true);
      await cachePages();
    };
    
    // Small delay to ensure the UI is ready
    const timer = setTimeout(startCaching, 100);
    return () => clearTimeout(timer);
  }, [cachePages]);

  const handleSave = () => {
    setIsSaving(true);
    saveToLocalStorage();
    setIsSaving(false);
  }

  const handleCacheComplete = () => {
    setShowCacheOverlay(false);
  }

  return (
    <>
      <main className={styles.mainContainer}>
        <div className={styles.TitleContainer}>
          <h1 className={styles.title}>JBS London - PPM Survey & Costing Sheet</h1>
          <h2 className={styles.subtitle}>Mechanical & Electrical - Commericial Building</h2>
        </div>
        
        <BuildingInformation />
        <MechanicalSystems />
        <ElectricalSystems />
        <ComplianceOtherSystems />
        <PpmCostingSummary />

        <button className={styles.SaveButton} onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </button>
      </main>

      {/* Cache Loading Overlay */}
      <CacheLoadingOverlay 
        isVisible={showCacheOverlay && isLoading}
        progress={progress}
        onComplete={handleCacheComplete}
      />
    </>
  );
}
