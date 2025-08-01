import { BuildingInfo, FormState, MechanicalSystem, PPMSummary } from "@/types/formTypes";

interface FormContextType {
    state: FormState;
    updateBuildingInfo: (info: Partial<BuildingInfo>) => void;
    addMechanicalSystem: (system: Omit<MechanicalSystem, 'id' | 'dateAdded'>) => void;
    updateMechanicalSystem: (id: string, system: Partial<MechanicalSystem>) => void;
    deleteMechanicalSystem: (id: string) => void;
    // Similar methods for electrical and compliance systems
    updatePPMSummary: (summary: Partial<PPMSummary>) => void;
    saveToLocalStorage: () => void;
    loadFromLocalStorage: () => void;
    clearForm: () => void;
}