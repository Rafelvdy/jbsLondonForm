"use client";
import { BuildingInfo, FormState, MechanicalSystem, ElectricalSystem, ComplianceSystem, PPMSummary } from "../types/formTypes";
import { createContext } from "react";

interface FormContextType {
    state: FormState;
    updateBuildingInfo: (info: Partial<BuildingInfo>) => void;
    addMechanicalSystem: (system: Omit<MechanicalSystem, 'id' | 'dateAdded'>) => void;
    updateMechanicalSystem: (id: string, system: Partial<MechanicalSystem>) => void;
    deleteMechanicalSystem: (id: string) => void;
    addElectricalSystem: (system: Omit<ElectricalSystem, 'id' | 'dateAdded'>) => void;
    updateElectricalSystem: (id: string, system: Partial<ElectricalSystem>) => void;
    deleteElectricalSystem: (id: string) => void;
    addComplianceSystem: (system: Omit<ComplianceSystem, 'id' | 'dateAdded'>) => void;
    updateComplianceSystem: (id: string, system: Partial<ComplianceSystem>) => void;
    deleteComplianceSystem: (id: string) => void;
    updatePPMSummary: (summary: Partial<PPMSummary>) => void;
    saveToLocalStorage: () => void;
    loadFromLocalStorage: () => void;
    clearForm: () => void;
}

export const FormContext = createContext<FormContextType | undefined>(undefined);