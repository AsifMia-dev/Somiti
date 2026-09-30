import { useContext, useEffect, useState } from "react";
import { SomitiContext } from "../context/SomitiContext";
import { AuthContext } from "../context/AuthContext";
import { baseUrl } from "../helper/baseUrlHelper";
import NetWorthHero from "../components/dashboardComponent/NetWorthHero";
import StatsGrid from "../components/dashboardComponent/StatsGrid";
import CollectionFlag from "../components/dashboardComponent/CollectionFlag";
import TodaysLedgerTable from "../components/dashboardComponent/TodaysLedgerTable";
import QuickActions from "../components/dashboardComponent/QuickActions";

function DashboardPage() {
  const { somiti } = useContext(SomitiContext);
  const { accessToken } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [installmentData, setInstallmentData] = useState(null);

  useEffect(() => {
    if (!somiti?.id) return;

    fetch(`${baseUrl}/dashboard/${somiti.id}/balance-summary`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setSummary(data.data))
      .catch((err) => console.error(err));

    fetch(`${baseUrl}/installments/${somiti.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setInstallmentData(data))
      .catch((err) => console.error(err));
  }, [somiti?.id]);

  if (!summary || !installmentData) return <div>লোড হচ্ছে...</div>;

  const dueCount = installmentData.installments.filter((i) => i.status === "PENDING").length;

  return (
    <>
      <div className="flex items-start justify-between mb-6.5 gap-5 flex-wrap">
        <div>
          <h1 className="text-2xl mb-1">ড্যাশবোর্ড</h1>
          <div className="text-sm text-[var(--text)]">
            {new Date().toLocaleDateString("bn-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
        <CollectionFlag nextCollectionDate={installmentData.nextCollectionDate} dueCount={dueCount} />
      </div>

      <NetWorthHero finance={summary} />
      <StatsGrid finance={summary} todayCollection={summary.todayCollection} overdue={summary.overdue} />
      <TodaysLedgerTable installments={installmentData.installments} />
      <QuickActions />
    </>
  );
}

export default DashboardPage;