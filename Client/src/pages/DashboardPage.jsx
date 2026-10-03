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
  const [summary, setSummary] = useState({
    cashBalance: 0,
    loanBalance: 0,
    todayCollection: 0,
    overdue: 0,
  });
  const [installments, setInstallments] = useState([]);
  const [collectionInfo, setCollectionInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!somiti?.id || !accessToken) return;

  const controller = new AbortController();
  const options = {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: controller.signal,
  };

  const load = async () => {
    setLoading(true);
    try {
      const [summaryRes, installmentRes] = await Promise.all([
        fetch(`${baseUrl}/dashboard/${somiti.id}/balance-summary`, options),
        fetch(`${baseUrl}/installments/${somiti.id}`, options),
      ]);

      if (!summaryRes.ok || !installmentRes.ok) {
        throw new Error("Failed to load dashboard data");
      }

      const summaryJson = await summaryRes.json();
      const installmentJson = await installmentRes.json();

      setSummary(summaryJson.data);
      setInstallments(installmentJson.installments ?? []);
      setCollectionInfo(installmentJson.collectionInfo ?? {});
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  load();
  return () => controller.abort();
  }, []);

  if (loading) return <div>লোড হচ্ছে...</div>;

  return (
    <>
      <div className="flex items-start justify-between mb-6.5 gap-5 flex-wrap">
        <div>
          <h1 className="text-2xl mb-1">ড্যাশবোর্ড</h1>
          <div className="text-sm text-[var(--text)]">
            {new Date().toLocaleDateString("bn-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
        <CollectionFlag collectionInfo={collectionInfo} />
      </div>

      <NetWorthHero finance={summary} />
      <StatsGrid finance={summary} todayCollection={summary.todayCollection} overdue={summary.overdue} />
      <TodaysLedgerTable installments={installments} />
      <QuickActions />
    </>
  );
}

export default DashboardPage;