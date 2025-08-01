"use client";
import styles from "./mechanicalSystems.module.css";
import { useRouter } from "next/navigation";
import SystemCard from "../ui/systemCard/systemCard";

const MechanicalSystems = () => {
    const router = useRouter();
    return (
        <main className={styles.MechanicalSystemsContainer}>
            <h1 className={styles.MechanicalSystemsTitle}>Mechanical Systems</h1>

            <SystemCard title="Mechanical Systems"/>

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