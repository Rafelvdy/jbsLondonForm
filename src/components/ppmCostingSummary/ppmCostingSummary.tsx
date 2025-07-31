import styles from "./ppmCostingSummary.module.css";
import { Input } from "../input";
import { Textarea } from "../ui/textarea";


const PpmCostingSummary = () => {
    return (
        <div className={styles.PpmCostingSummaryContainer}>
            <h1 className={styles.PpmCostingSummaryTitle}>PPM Costing Summary</h1>
            <Input type="text" placeholder="Task / Asset" />
            <Input type="text" placeholder="Frequency" />
            <Input type="number" placeholder="Labour Hours" />
            <Textarea placeholder="Materials" />
            <Input type="text" placeholder="Subcontract"/>
            <Input type="number" placeholder="Total Cost (Est.)"/>
            <Textarea placeholder="Notes & Recommendations"/>
        </div>
    )
}

export default PpmCostingSummary;