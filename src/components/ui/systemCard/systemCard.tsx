import styles from "./systemCard.module.css";

interface SystemCardProps {
    title: string;
}


const SystemCard = ({ title }: SystemCardProps) => {
    return (
        <div className={styles.SystemCardContainer}>
            <h1 className={styles.SystemCardTitle}>{title}</h1>
        </div>
    )
}

export default SystemCard;