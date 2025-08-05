"use client";
import styles from "./complianceOtherSystems.module.css";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/hooks/useFormContext";
import SystemCard from "../ui/systemCard/systemCard";

const ComplianceOtherSystems = () => {
    const router = useRouter();
    const { state } = useFormContext();

    return (
        <main className={styles.MechanicalSystemsContainer}>
            <h1 className={styles.MechanicalSystemsTitle}>Compliance & Other Systems</h1>

            {state.complianceSystems.length > 0 ? (
                state.complianceSystems.map((system) => (
                    <SystemCard 
                        key={system.id}
                        systemLabel={system.systemLabel}
                        field1={{ label: "Compliance Status", value: system.complianceStatus }}
                        field2={{ label: "Last Inspection Date", value: system.lastInspectionDate }}
                        field3={{ label: "Notes", value: system.notes }}
                    />
                ))
            ) : (
                <p className={styles.NoSystemsMessage}>No compliance other systems added yet</p>
            )}
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