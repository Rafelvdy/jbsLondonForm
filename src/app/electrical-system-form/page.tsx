"use client";
import { Combobox } from "@/components/ui/combobox";
import styles from "./page.module.css";
import { useState } from "react";
import { Input } from "@/components/input";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

const ElectricalSystemForm = () => {
    const router = useRouter();
    const [selectedSystem, setSelectedSystem] = useState<string>("");
    const [isComboboxOpen, setIsComboboxOpen] = useState<boolean>(false);
    const hasSelection = selectedSystem !== "";

    const handleSystemChange = (value: string) => {
        setSelectedSystem(value);
    };
    
    const systems = [
        { value: "main-distribution-board", label: "Main Distribution Board" },
        { value: "sub-distribution-board", label: "Sub Distribution Board" },
        { value: "e-lighting", label: "Emergency Lighting" },
        { value: "g-lighting", label: "General Lighting" },
        { value: "power-s/c", label: "Power Sockets / Circuits" },
        { value: "fire-alarm-system", label: "Fire Alarm System" },
        { value: "cctv-system", label: "CCTV System" },
        { value: "access-control", label: "Access Control" },
        { value: "generate/ups", label: "Generator / UPS" },
        { value: "lightning-protection", label: "Lightning Protection" },
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
            {hasSelection && (
                <div className={styles.MechanicalSystemFormInputContainer}>
                    <Input type="number" placeholder="Quantity" />
                    <Input type="text" placeholder="Location" />
                    <Input type="text" placeholder="Condition" />
                    <Input type="text" placeholder="Manufacturer" />
                    <Input type="text" placeholder="Model" />
                    <Input type="text" placeholder="Service Interval" />
                    <Textarea placeholder="Notes" />

                </div>
            )}
        </main>
    )
}

export default ElectricalSystemForm;