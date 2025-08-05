"use client";
import { Combobox } from "@/components/ui/combobox";
import styles from "./page.module.css";
import { useState } from "react";
import { Input } from "@/components/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "@/hooks/useFormContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MechanicalSystemForm = () => {
    const router = useRouter();
    const [selectedSystem, setSelectedSystem] = useState<string>("");
    const [isComboboxOpen, setIsComboboxOpen] = useState<boolean>(false);
    const hasSelection = selectedSystem !== "";

    const handleSystemChange = (value: string) => {
        setSelectedSystem(value);
    };
    
    const { addMechanicalSystem } = useFormContext();
    const [formData, setFormData] = useState({
        quantity: 0,
        location: '',
        condition: '',
        manufacturer: '',
        model: '',
        serviceInterval: '',
        notes: '',
    })

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

    const handleSave = () => {
        addMechanicalSystem({
            systemType: selectedSystem,
            systemLabel: systems.find(s => s.value === selectedSystem)?.label || '',
            ...formData,
        });
        // Navigate back using Next.js router - works reliably offline on all platforms
        router.replace("/");
    }

    return (
        <main className={styles.MechanicalSystemFormContainer}>
            <div className={styles.CancelContainer}>
                <Link href="/" className={styles.CancelButton}>X</Link>
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
                    <Input 
                        type="number" 
                        placeholder="Quantity" 
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    />
                    <Input 
                        type="text" 
                        placeholder="Location" 
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                    <Input 
                        type="text" 
                        placeholder="Condition" 
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    />
                    <Input 
                        type="text" 
                        placeholder="Manufacturer" 
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    />
                    <Input 
                        type="text" 
                        placeholder="Model" 
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                    <Input 
                        type="text" 
                        placeholder="Service Interval" 
                        value={formData.serviceInterval}
                        onChange={(e) => setFormData({ ...formData, serviceInterval: e.target.value })}
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

export default MechanicalSystemForm;