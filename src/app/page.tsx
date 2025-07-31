import styles from "./page.module.css";
import BuildingInformation from "../components/buildingInformation/buildingInformation";
import MechanicalSystems from "../components/mechanicalSystems/mechanicalSystems";
import ElectricalSystems from "../components/electricalsystems/page";
import ComplianceOtherSystems from "../components/complianceOtherSystems/complianceOtherSystems";
import PpmCostingSummary from "../components/ppmCostingSummary/ppmCostingSummary";
export default function Home() {
  return (
    <main className={styles.mainContainer}>
      <div className={styles.TitleContainer}>
        <h1 className={styles.title}>JBS London - PPM Survey & Costing Sheet</h1>
        <h2 className={styles.subtitle}>Mechanical & Electrical - Commericial Building</h2>
      </div>
      
      <BuildingInformation />
      <MechanicalSystems />
      <ElectricalSystems />
      <ComplianceOtherSystems />
      <PpmCostingSummary />
    </main>
  );
}
