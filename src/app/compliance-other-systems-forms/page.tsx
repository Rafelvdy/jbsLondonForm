"use client";
import { Combobox } from "@/components/ui/combobox";
import styles from "./page.module.css";
import { useState } from "react";
import { Input } from "@/components/input";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

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

    return (
        <main className={styles.MechanicalSystemFormContainer}>
            <div className={styles.CancelContainer}>
                <button className={styles.CancelButton} onClick={() => {
                    router.push("..")
                }}>X</button>
            </div>
            <h1 className={styles.MechanicalSystemFormTitle}>Mechanical System Form</h1>
            <Combobox 
                systems={systems}
                value={selectedSystem}
                onValueChange={handleSystemChange}
                open={isComboboxOpen}
                onOpenChange={setIsComboboxOpen}
            />
        </main>
    )
}

export default ComplianceOtherSystemsForms;