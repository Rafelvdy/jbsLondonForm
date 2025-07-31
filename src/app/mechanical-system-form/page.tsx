"use client";
import { Combobox } from "@/components/ui/combobox";
import styles from "./page.module.css";
import { useState } from "react";
import { Input } from "@/components/input";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

const MechanicalSystemForm = () => {
    const router = useRouter();
    const [selectedSystem, setSelectedSystem] = useState<string>("");
    const [isComboboxOpen, setIsComboboxOpen] = useState<boolean>(false);
    const hasSelection = selectedSystem !== "";

    const handleSystemChange = (value: string) => {
        setSelectedSystem(value);
    };
    
    const systems = [
        { value: "boiler", label: "Boiler(s)" },
        { value: "AC", label: "Chillers / AC Systems" },
        { value: "AHU", label: "Air Handling Units (AHUs)" },
        { value: "FCU", label: "Fan Coil Units (FCUs)" },
        { value: "pump", label: "Pumps" },
        { value: "pipework", label: "Pipework" },
        { value: "bms-controls", label: "BMS Controls" },
        { value: "ductwork", label: "Ductwork" },
        { value: "hot-water-cylinders", label: "Hot Water Cylinders" },
        { value: "water-tanks", label: "Water Tanks" },
        { value: "expansion-vessel", label: "Expansion Vessel" },
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

export default MechanicalSystemForm;