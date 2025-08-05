"use client";
import styles from "./mechanicalSystems.module.css";
import { useRouter } from "next/navigation";
import SystemCard from "../ui/systemCard/systemCard";
import { useFormContext } from "@/hooks/useFormContext";

const MechanicalSystems = () => {
    const router = useRouter();
    const { state } = useFormContext();

    return (
        <main className={styles.MechanicalSystemsContainer}>
            <h1 className={styles.MechanicalSystemsTitle}>Mechanical Systems</h1>

            {state.mechanicalSystems.length > 0 ? (
                state.mechanicalSystems.map((system) => (
                    <SystemCard 
                        key={system.id}
                        systemLabel={system.systemLabel}
                        field1={{ label: "Quantity", value: system.quantity }}
                        field2={{ label: "Location", value: system.location }}
                        field3={{ label: "Condition", value: system.condition }}
                    />
                ))
            ) : (
                <p className={styles.NoSystemsMessage}>No mechanical systems added yet</p>
            )}

            <button     
                className={styles.AddSystemButton}
                onClick={() => {
                    router.push("/mechanical-system-form")
                }}
            >Add System</button>

        </main>
    )
}

export default MechanicalSystems;