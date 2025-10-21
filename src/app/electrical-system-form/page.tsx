"use client";
import { Combobox } from "@/components/ui/combobox";
import styles from "./page.module.css";
import { useState } from "react";
import { Input } from "@/components/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "@/hooks/useFormContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhotoPickerInline from "@/components/photos/PhotoPickerInline";
import type { PhotoMeta } from "@/types/formTypes";

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

    const { addElectricalSystem } = useFormContext();
    const [photos, setPhotos] = useState<PhotoMeta[]>([]);

    const [formData, setFormData] = useState({
        quantity: 0,
        location: '',
        condition: '',
        manufacturer: '',
        model: '',
        serviceInterval: '',
        notes: '',
    })

    const handleSave = () => {
        addElectricalSystem({
            systemType: selectedSystem,
            systemLabel: systems.find(s => s.value === selectedSystem)?.label || '',
            ...formData,
            photos: photos,
        });
        // Navigate back using Next.js router - works reliably offline on all platforms
        router.replace("/");
    }

    return (
        <main className={styles.ElectricalSystemFormContainer}>
            <div className={styles.CancelContainer}>
                <Link href="/" className={styles.CancelButton}>X</Link>
            </div>
            <h1 className={styles.ElectricalSystemFormTitle}>Electrical System Form</h1>
            <Combobox 
                systems={systems}
                value={selectedSystem}
                onValueChange={handleSystemChange}
                open={isComboboxOpen}
                onOpenChange={setIsComboboxOpen}
            />
            {hasSelection && (
                <div className={styles.ElectricalSystemFormInputContainer}>
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
                    <PhotoPickerInline 
                        value={photos}
                        onChange={setPhotos}
                        maxPhotos={10}
                        maxBytesPerSystem={15 * 1024 * 1024}
                    />
                    <button onClick={handleSave} className={styles.SaveButton}>Save</button>
                </div>
            )}
        </main>
    )
}
 
export default ElectricalSystemForm;