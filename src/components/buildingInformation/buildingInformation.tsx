import styles from "./buildingInformation.module.css";
import { Input } from "../input";


const BuildingInformation = () => {
    return (
        <div className={styles.BuildingInformationContainer}>
            <h2 className={styles.BuildingInformationTitle}>Building Information</h2>
            <Input type="text" placeholder="Site Name" className={styles.BuildingInformationInput}/>
            <Input type="address" placeholder="Address" className={styles.BuildingInformationInput}/>
            <Input type="text" placeholder="Surveyed By" className={styles.BuildingInformationInput}/>
            <Input type="text" placeholder="Client Contact" className={styles.BuildingInformationInput}/>
            <Input type="text" placeholder="Building Type (Office / Retail / Mixed):" className={styles.BuildingInformationInput}/>
            <Input type="text" placeholder="Building Size ( sq ft ):" className={styles.BuildingInformationInput}/>
        </div>
    )
}

export default BuildingInformation;