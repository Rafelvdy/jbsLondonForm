import styles from "./systemCard.module.css";

interface SystemCardProps {
    systemLabel: string;
    field1: { label: string, value: string | number };
    field2: { label: string, value: string | number };
    field3: { label: string, value: string | number };
}


const SystemCard = ({ systemLabel, field1, field2, field3 }: SystemCardProps) => {
    return (
        <div className={styles.SystemCardContainer}>
            <h3 className={styles.SystemCardTitle}>{systemLabel}</h3>
            <div className={styles.SystemCardContent}>
                <div className={styles.SystemCardField}>
                    <span className={styles.FieldLabel}>{field1.label}:</span>
                    <span className={styles.FieldValue}>{field1.value}</span>
                </div>
                <div className={styles.SystemCardField}>
                    <span className={styles.FieldLabel}>{field2.label}:</span>
                    <span className={styles.FieldValue}>{field2.value}</span>
                </div>
                <div className={styles.SystemCardField}>
                    <span className={styles.FieldLabel}>{field3.label}:</span>
                    <span className={styles.FieldValue}>{field3.value}</span>
                </div>
            </div>
        </div>
    )
}

export default SystemCard;