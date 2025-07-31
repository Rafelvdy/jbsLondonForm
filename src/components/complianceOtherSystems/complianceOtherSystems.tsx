"use client";
import styles from "./complianceOtherSystems.module.css";
import { useRouter } from "next/navigation";

const ComplianceOtherSystems = () => {
    const router = useRouter();
    return (
        <main className={styles.MechanicalSystemsContainer}>
            <h1 className={styles.MechanicalSystemsTitle}>Compliance & Other Systems</h1>


            <button 
                className={styles.AddSystemButton}
                onClick={() => {
                    router.push("/compliance-other-systems-forms")
                }}
            >Add System</button>

        </main>
    )
}

export default ComplianceOtherSystems;