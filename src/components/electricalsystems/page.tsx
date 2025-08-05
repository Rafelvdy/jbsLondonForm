"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/hooks/useFormContext";
import SystemCard from "../ui/systemCard/systemCard";

const ElectricalSystems = () => {
    const router = useRouter();
    const { state } = useFormContext();

    return (
        <main className={styles.MechanicalSystemsContainer}>
            <h1 className={styles.MechanicalSystemsTitle}>Electrical Systems</h1>

            {state.electricalSystems.length > 0 ? (
                state.electricalSystems.map((system) => (
                    <SystemCard 
                        key={system.id}
                        systemLabel={system.systemLabel}
                        field1={{ label: "Quantity", value: system.quantity }}
                        field2={{ label: "Location", value: system.location }}
                        field3={{ label: "Condition", value: system.condition }}
                    />
                ))
            ) : (
                <p className={styles.NoSystemsMessage}>No electrical systems added yet</p>
            )}
            
            <button 
                className={styles.AddSystemButton}
                onClick={() => {
                    router.push("/electrical-system-form")
                }}
            >Add System</button>

        </main>
    )
}

export default ElectricalSystems;