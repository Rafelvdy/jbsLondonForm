"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

const ElectricalSystems = () => {
    const router = useRouter();
    return (
        <main className={styles.MechanicalSystemsContainer}>
            <h1 className={styles.MechanicalSystemsTitle}>Electrical Systems</h1>


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