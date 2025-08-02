import styles from "./buildingInformation.module.css";
import { Input } from "../input";
import { useFormContext } from "../../hooks/useFormContext";


const BuildingInformation = () => {

    const { state, updateBuildingInfo } = useFormContext();
    return (
        <div className={styles.BuildingInformationContainer}>
            <h2 className={styles.BuildingInformationTitle}>Building Information</h2>
            <Input 
                type="text" 
                placeholder="Site Name" 
                className={styles.BuildingInformationInput}
                value={state.buildingInfo.siteName}
                onChange={(e) => updateBuildingInfo({ siteName: e.target.value })}
            />
            <Input 
                type="address" 
                placeholder="Address" 
                className={styles.BuildingInformationInput}
                value={state.buildingInfo.address}
                onChange={(e) => updateBuildingInfo({ address: e.target.value })}
            />
            <Input 
            type="text" 
            placeholder="Surveyed By" 
            className={styles.BuildingInformationInput}
            value={state.buildingInfo.surveyedBy}
            onChange={(e) => updateBuildingInfo({ surveyedBy: e.target.value })}
            />
            <Input 
            type="text" 
            placeholder="Client Contact" 
            className={styles.BuildingInformationInput}
            value={state.buildingInfo.clientContact}
            onChange={(e) => updateBuildingInfo({ clientContact: e.target.value })}
            />
            <Input 
            type="text" 
            placeholder="Building Type (Office / Retail / Mixed):" 
            className={styles.BuildingInformationInput}
            value={state.buildingInfo.buildingType}
            onChange={(e) => updateBuildingInfo({ buildingType: e.target.value })}
            />
            <Input 
            type="number" 
            placeholder="Building Size ( sq ft ):" 
            className={styles.BuildingInformationInput}
            value={state.buildingInfo.buildingSize}
            onChange={(e) => updateBuildingInfo({ buildingSize: parseInt(e.target.value) || 0 })}
            />
        </div>
    )
}

export default BuildingInformation;