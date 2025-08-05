
export interface BuildingInfo {
    siteName: string;
    address: string;
    surveyedBy: string;
    clientContact: string;
    buildingType: string;
    buildingSize: number;
}

export interface SystemBase {
    id: string; // unique id for identification
    systemType: string; // value of system name from the combo box
    systemLabel: string; // display name from the combo box
    quantity: number;
    location: string;
    condition: string;
    manufacturer: string;
    model: string;
    serviceInterval: string;
    notes: string;
    dateAdded: Date;
}

export type MechanicalSystem = SystemBase;

export type ElectricalSystem = SystemBase;

export interface ComplianceSystem {
    id: string;
    systemType: string;
    systemLabel: string;
    complianceStatus: 'yes' | 'no';
    lastInspectionDate: string; // ISO date string
    notes: string;
    dateAdded: Date;
}

export interface PPMSummary {
    taskAsset: string;
    frequency: string;
    labourHours: number;
    materials: string;
    subcontract: string;
    totalCost: number;
    notesRecommendations: string;
}

export interface FormState {
    buildingInfo: BuildingInfo;
    mechanicalSystems: MechanicalSystem[];
    electricalSystems: ElectricalSystem[];
    complianceSystems: ComplianceSystem[];
    ppmSummary: PPMSummary;
    lastModified: Date;
    isDirty: boolean; // tracking if any changes need saving
}