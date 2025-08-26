"use client";
import React, { useReducer, useEffect, ReactNode } from 'react';
import { FormContext } from './FormContext';
import { FormState, BuildingInfo, MechanicalSystem, ElectricalSystem, ComplianceSystem, PPMSummary, PhotoMeta } from '../types/formTypes';
import { v4 as uuidv4 } from 'uuid';

type SystemKind = 'mechanical' | 'electrical' | 'compliance';

type FormAction =
    | { type: 'UPDATE_BUILDING_INFO'; payload: Partial<BuildingInfo> }
    | { type: 'ADD_MECHANICAL_SYSTEM'; payload: Omit<MechanicalSystem, 'id' | 'dateAdded'> }
    | { type: 'UPDATE_MECHANICAL_SYSTEM'; payload: { id: string; system: Partial<MechanicalSystem> } }
    | { type: 'DELETE_MECHANICAL_SYSTEM'; payload: string }
    | { type: 'ADD_ELECTRICAL_SYSTEM'; payload: Omit<ElectricalSystem, 'id' | 'dateAdded'> }
    | { type: 'UPDATE_ELECTRICAL_SYSTEM'; payload: { id: string; system: Partial<ElectricalSystem> } }
    | { type: 'DELETE_ELECTRICAL_SYSTEM'; payload: string }
    | { type: 'ADD_COMPLIANCE_SYSTEM'; payload: Omit<ComplianceSystem, 'id' | 'dateAdded'> }
    | { type: 'UPDATE_COMPLIANCE_SYSTEM'; payload: { id: string; system: Partial<ComplianceSystem> } }
    | { type: 'DELETE_COMPLIANCE_SYSTEM'; payload: string }
    | { type: 'UPDATE_PPM_SUMMARY'; payload: Partial<PPMSummary> }
    | { type: 'LOAD_FROM_STORAGE'; payload: FormState }
    | { type: 'MARK_CLEAN' }
    | { type: 'CLEAR_FORM' }
    // NEW: photos
    | { type: 'ADD_SYSTEM_PHOTO'; payload: { systemKind: SystemKind; systemId: string; photo: PhotoMeta } }
    | { type: 'REMOVE_SYSTEM_PHOTO'; payload: { systemKind: SystemKind; systemId: string; photoId: string } };

const initialState: FormState = {
    buildingInfo: {
        siteName: '',
        address: '',
        surveyedBy: '',
        clientContact: '',
        buildingType: '',
        buildingSize: 0
    },
    mechanicalSystems: [],
    electricalSystems: [],
    complianceSystems: [],
    ppmSummary: {
        taskAsset: '',
        frequency: '',
        labourHours: 0,
        materials: '',
        subcontract: '',
        totalCost: 0,
        notesRecommendations: ''
    },
    lastModified: new Date(),
    isDirty: false
};

function addPhotoToList<T extends { id: string; photos?: PhotoMeta[] }>(list: T[], systemId: string, photo: PhotoMeta): T[] {
    return list.map(item => {
        if (item.id !== systemId) return item;
        const existing = item.photos ?? [];
        return { ...item, photos: [...existing, photo] } as T;
    });
}
function removePhotoFromList<T extends { id: string; photos?: PhotoMeta[] }>(list: T[], systemId: string, photoId: string): T[] {
    return list.map(item => {
        if (item.id !== systemId) return item;
        const existing = item.photos ?? [];
        return { ...item, photos: existing.filter(p => p.id !== photoId) } as T;
    });
}

const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
        case 'UPDATE_BUILDING_INFO':
            return {
                ...state,
                buildingInfo: { ...state.buildingInfo, ...action.payload },
                lastModified: new Date(),
                isDirty: true
            };

        case 'ADD_MECHANICAL_SYSTEM': {
            const newMechanicalSystem: MechanicalSystem = {
                ...action.payload,
                id: uuidv4(),
                dateAdded: new Date()
            };
            return {
                ...state,
                mechanicalSystems: [...state.mechanicalSystems, newMechanicalSystem],
                lastModified: new Date(),
                isDirty: true
            };
        }

        case 'UPDATE_MECHANICAL_SYSTEM':
            return {
                ...state,
                mechanicalSystems: state.mechanicalSystems.map(system =>
                    system.id === action.payload.id
                        ? { ...system, ...action.payload.system }
                        : system
                ),
                lastModified: new Date(),
                isDirty: true
            };

        case 'DELETE_MECHANICAL_SYSTEM':
            return {
                ...state,
                mechanicalSystems: state.mechanicalSystems.filter(system => system.id !== action.payload),
                lastModified: new Date(),
                isDirty: true
            };

        case 'ADD_ELECTRICAL_SYSTEM': {
            const newElectricalSystem: ElectricalSystem = {
                ...action.payload,
                id: uuidv4(),
                dateAdded: new Date()
            };
            return {
                ...state,
                electricalSystems: [...state.electricalSystems, newElectricalSystem],
                lastModified: new Date(),
                isDirty: true
            };
        }

        case 'UPDATE_ELECTRICAL_SYSTEM':
            return {
                ...state,
                electricalSystems: state.electricalSystems.map(system =>
                    system.id === action.payload.id
                        ? { ...system, ...action.payload.system }
                        : system
                ),
                lastModified: new Date(),
                isDirty: true
            };

        case 'DELETE_ELECTRICAL_SYSTEM':
            return {
                ...state,
                electricalSystems: state.electricalSystems.filter(system => system.id !== action.payload),
                lastModified: new Date(),
                isDirty: true
            };

        case 'ADD_COMPLIANCE_SYSTEM': {
            const newComplianceSystem: ComplianceSystem = {
                ...action.payload,
                id: uuidv4(),
                dateAdded: new Date()
            };
            return {
                ...state,
                complianceSystems: [...state.complianceSystems, newComplianceSystem],
                lastModified: new Date(),
                isDirty: true
            };
        }

        case 'UPDATE_COMPLIANCE_SYSTEM':
            return {
                ...state,
                complianceSystems: state.complianceSystems.map(system =>
                    system.id === action.payload.id
                        ? { ...system, ...action.payload.system }
                        : system
                ),
                lastModified: new Date(),
                isDirty: true
            };

        case 'DELETE_COMPLIANCE_SYSTEM':
            return {
                ...state,
                complianceSystems: state.complianceSystems.filter(system => system.id !== action.payload),
                lastModified: new Date(),
                isDirty: true
            };

        case 'UPDATE_PPM_SUMMARY':
            return {
                ...state,
                ppmSummary: { ...state.ppmSummary, ...action.payload },
                lastModified: new Date(),
                isDirty: true
            };

        case 'LOAD_FROM_STORAGE':
            return { ...action.payload, isDirty: false };

        case 'MARK_CLEAN':
            return { ...state, isDirty: false };

        case 'CLEAR_FORM':
            return { ...initialState, lastModified: new Date() };

        case 'ADD_SYSTEM_PHOTO': {
            const { systemKind, systemId, photo } = action.payload;
            if (systemKind === 'mechanical') {
                return {
                    ...state,
                    mechanicalSystems: addPhotoToList(state.mechanicalSystems, systemId, photo),
                    lastModified: new Date(),
                    isDirty: true
                };
            }
            if (systemKind === 'electrical') {
                return {
                    ...state,
                    electricalSystems: addPhotoToList(state.electricalSystems, systemId, photo),
                    lastModified: new Date(),
                    isDirty: true
                };
            }
            return {
                ...state,
                complianceSystems: addPhotoToList(state.complianceSystems, systemId, photo),
                lastModified: new Date(),
                isDirty: true
            };
        }

        case 'REMOVE_SYSTEM_PHOTO': {
            const { systemKind, systemId, photoId } = action.payload;
            if (systemKind === 'mechanical') {
                return {
                    ...state,
                    mechanicalSystems: removePhotoFromList(state.mechanicalSystems, systemId, photoId),
                    lastModified: new Date(),
                    isDirty: true
                };
            }
            if (systemKind === 'electrical') {
                return {
                    ...state,
                    electricalSystems: removePhotoFromList(state.electricalSystems, systemId, photoId),
                    lastModified: new Date(),
                    isDirty: true
                };
            }
            return {
                ...state,
                complianceSystems: removePhotoFromList(state.complianceSystems, systemId, photoId),
                lastModified: new Date(),
                isDirty: true
            };
        }

        default:
            return state;
    }
};

const STORAGE_KEY = 'jbs-forms-data';

interface FormProviderProps {
    children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(formReducer, initialState);

    useEffect(() => {
        loadFromLocalStorage();
    }, []);

    // ...existing action creators...

    const addSystemPhoto = (args: { systemKind: SystemKind; systemId: string; photo: PhotoMeta }) => {
        dispatch({ type: 'ADD_SYSTEM_PHOTO', payload: args });
    };

    const removeSystemPhoto = (args: { systemKind: SystemKind; systemId: string; photoId: string }) => {
        dispatch({ type: 'REMOVE_SYSTEM_PHOTO', payload: args });
    };

    const saveToLocalStorage = () => {
        try {
            const dataToSave = {
                ...state,
                lastModified: new Date().toISOString(),
                isDirty: false
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
            dispatch({ type: 'MARK_CLEAN' });
            console.log('Form data saved to localStorage');
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    };

    const loadFromLocalStorage = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsedData = JSON.parse(stored);
                const loadedState: FormState = {
                    ...parsedData,
                    lastModified: new Date(parsedData.lastModified),
                    mechanicalSystems: parsedData.mechanicalSystems.map((system: MechanicalSystem) => ({
                        ...system,
                        dateAdded: new Date(system.dateAdded)
                    })),
                    electricalSystems: parsedData.electricalSystems.map((system: ElectricalSystem) => ({
                        ...system,
                        dateAdded: new Date(system.dateAdded)
                    })),
                    complianceSystems: parsedData.complianceSystems.map((system: ComplianceSystem) => ({
                        ...system,
                        dateAdded: new Date(system.dateAdded)
                    }))
                };
                dispatch({ type: 'LOAD_FROM_STORAGE', payload: loadedState });
                console.log('Form data loaded from localStorage');
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
        }
    };

    const clearForm = () => {
        dispatch({ type: 'CLEAR_FORM' });
        localStorage.removeItem(STORAGE_KEY);
    };

    const contextValue = {
        state,
        // ...existing exports...
        addMechanicalSystem: (system: Omit<MechanicalSystem, 'id' | 'dateAdded'>) => dispatch({ type: 'ADD_MECHANICAL_SYSTEM', payload: system }),
        updateMechanicalSystem: (id: string, system: Partial<MechanicalSystem>) => dispatch({ type: 'UPDATE_MECHANICAL_SYSTEM', payload: { id, system } }),
        deleteMechanicalSystem: (id: string) => dispatch({ type: 'DELETE_MECHANICAL_SYSTEM', payload: id }),
        addElectricalSystem: (system: Omit<ElectricalSystem, 'id' | 'dateAdded'>) => dispatch({ type: 'ADD_ELECTRICAL_SYSTEM', payload: system }),
        updateElectricalSystem: (id: string, system: Partial<ElectricalSystem>) => dispatch({ type: 'UPDATE_ELECTRICAL_SYSTEM', payload: { id, system } }),
        deleteElectricalSystem: (id: string) => dispatch({ type: 'DELETE_ELECTRICAL_SYSTEM', payload: id }),
        addComplianceSystem: (system: Omit<ComplianceSystem, 'id' | 'dateAdded'>) => dispatch({ type: 'ADD_COMPLIANCE_SYSTEM', payload: system }),
        updateComplianceSystem: (id: string, system: Partial<ComplianceSystem>) => dispatch({ type: 'UPDATE_COMPLIANCE_SYSTEM', payload: { id, system } }),
        deleteComplianceSystem: (id: string) => dispatch({ type: 'DELETE_COMPLIANCE_SYSTEM', payload: id }),

        addSystemPhoto,
        removeSystemPhoto,

        updateBuildingInfo: (info: Partial<BuildingInfo>) => dispatch({ type: 'UPDATE_BUILDING_INFO', payload: info }),
        updatePPMSummary: (summary: Partial<PPMSummary>) => dispatch({ type: 'UPDATE_PPM_SUMMARY', payload: summary }),
        saveToLocalStorage,
        loadFromLocalStorage,
        clearForm
    };

    return (
        <FormContext.Provider value={contextValue}>
            {children}
        </FormContext.Provider>
    );
};