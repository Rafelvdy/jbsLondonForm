"use client";
import styles from "./mechanicalSystems.module.css";
import SystemCard from "../ui/systemCard/systemCard";
import { useFormContext } from "@/hooks/useFormContext";
import Link from "next/link";

const MechanicalSystems = () => {
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

            <Link href="/mechanical-system-form" className={styles.AddSystemButton}>
                Add System
            </Link>

        </main>
    )
}

export default MechanicalSystems;