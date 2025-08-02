"use client";
import { Combobox } from "@/components/ui/combobox";
import styles from "./page.module.css";
import { useState } from "react";
import { Input } from "@/components/input";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useFormContext } from "@/hooks/useFormContext";


const ComplianceOtherSystemsForms = () => {
    const router = useRouter();
    const [selectedSystem, setSelectedSystem] = useState<string>("");
    const [isComboboxOpen, setIsComboboxOpen] = useState<boolean>(false);
    const hasSelection = selectedSystem !== "";

    const handleSystemChange = (value: string) => {
        setSelectedSystem(value);
    };
    
    const systems = [
        { value: "fire-alarm-test-certificate", label: "Fire Alarm Test Certificate" },
        { value: "emergency-lighting-test", label: "Emergency Lighting Test" },
        { value: "gas-safety-certificate", label: "Gas Safety Certificate" },
        { value: "f-gas-record", label: "F-Gas Record" },
        { value: "EICR", label: "Electrical Condition Report (EICR)"},
        { value: "pat-testing-schedule", label: "PAT Testing Schedule" },
        { value: "legionella-risk-assessment", label: "Legionella Risk Assessment" },
        { value: "water-treatment-dosing", label: "Water Treatment / Dosing" },
    ]

    const { addComplianceSystem } = useFormContext();

    const [formData, setFormData] = useState({
        complianceStatus: 'yes' as 'yes' | 'no',
        lastInspectionDate: '',
        notes: '',
    })

    const handleSave = () => {
        addComplianceSystem({
            systemType: selectedSystem,
            systemLabel: systems.find(s => s.value === selectedSystem)?.label || '',
            ...formData,
        })
        router.push("..");
    }

    return (
        <main className={styles.MechanicalSystemFormContainer}>
            <div className={styles.CancelContainer}>
                <button className={styles.CancelButton} onClick={() => {
                    router.push("..")
                }}>X</button>
            </div>
            <h1 className={styles.MechanicalSystemFormTitle}>Compliance & Other Systems Form</h1>
            <Combobox 
                systems={systems}
                value={selectedSystem}
                onValueChange={handleSystemChange}
                open={isComboboxOpen}
                onOpenChange={setIsComboboxOpen}
            />
            {hasSelection && (
                <div className={styles.MechanicalSystemFormInputContainer}>
                    <RadioGroup 
                        defaultValue="yes" 
                        className={styles.RadioGroup}
                        onValueChange={(value) => setFormData({ ...formData, complianceStatus: value as 'yes' | 'no' })}
                    >
                        <div className={styles.RadioGroupItem}>
                            <RadioGroupItem value="yes" id="yes" />
                            <Label htmlFor="yes">Yes</Label>
                        </div>
                        <div className={styles.RadioGroupItem}>
                            <RadioGroupItem value="no" id="no" />
                            <Label htmlFor="no">No</Label>
                        </div>
                    </RadioGroup>
                    <Input 
                        type="date" 
                        placeholder="Last Inspection Date" 
                        value={formData.lastInspectionDate}
                        onChange={(e) => setFormData({ ...formData, lastInspectionDate: e.target.value })}
                    />
                    <Textarea 
                        placeholder="Notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                    <button onClick={handleSave}>Save</button>
                </div>
            )}
        </main>
    )
}

export default ComplianceOtherSystemsForms;