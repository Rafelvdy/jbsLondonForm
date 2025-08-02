import styles from "./ppmCostingSummary.module.css";
import { Input } from "../input";
import { Textarea } from "../ui/textarea";
import { useFormContext } from "../../hooks/useFormContext";



const PpmCostingSummary = () => {

    const { state, updatePPMSummary } = useFormContext();

    return (
        <div className={styles.PpmCostingSummaryContainer}>
            <h1 className={styles.PpmCostingSummaryTitle}>PPM Costing Summary</h1>
            <Input 
                type="text" 
                placeholder="Task / Asset"
                value={state.ppmSummary.taskAsset}
                onChange={(e) => updatePPMSummary({ taskAsset: e.target.value })}
            />
            <Input 
                type="text"
                placeholder="Frequency" 
                value={state.ppmSummary.frequency}
                onChange={(e) => updatePPMSummary({ frequency: e.target.value })}
            />
            <Input 
                type="number" 
                placeholder="Labour Hours"
                value={state.ppmSummary.labourHours}
                onChange={(e) => updatePPMSummary({ labourHours: parseInt(e.target.value) || 0 })}
            />
            <Textarea 
                placeholder="Materials" 
                value={state.ppmSummary.materials}
                onChange={(e) => updatePPMSummary({ materials: e.target.value })}
            />
            <Input 
                type="text" 
                placeholder="Subcontract"
                value={state.ppmSummary.subcontract}
                onChange={(e) => updatePPMSummary({ subcontract: e.target.value })}
            />
            <Input 
                type="number" 
                placeholder="Total Cost (Est.)"
                value={state.ppmSummary.totalCost}
                onChange={(e) => updatePPMSummary({ totalCost: parseFloat(e.target.value) || 0 })}
            />
            <Textarea 
                placeholder="Notes & Recommendations"
                value={state.ppmSummary.notesRecommendations}
                onChange={(e) => updatePPMSummary({ notesRecommendations: e.target.value })}
            />
        </div>
    )
}

export default PpmCostingSummary;