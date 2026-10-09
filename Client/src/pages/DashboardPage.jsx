import { useCallback, useContext, useEffect, useState } from "react";
import { SomitiContext } from "../context/SomitiContext";
import { AuthContext } from "../context/AuthContext";
import { baseUrl } from "../helper/baseUrlHelper";
import NetWorthHero from "../components/dashboardComponent/NetWorthHero";
import StatsGrid from "../components/dashboardComponent/StatsGrid";
import CollectionFlag from "../components/dashboardComponent/CollectionFlag";
import TodaysLedgerTable from "../components/dashboardComponent/TodaysLedgerTable";
import QuickActions from "../components/dashboardComponent/QuickActions";
import OverdueTable from "../components/dashboardComponent/OverdueTable";
import { toast } from "sonner"

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
  const [overdue, setOverdue] = useState([]);
  const [collectingId, setCollectingId] = useState(null);

  const loadDashboard = useCallback(async () => {
    if (!somiti?.id || !accessToken) return;

    const controller = new AbortController();
    const options = {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
    };

    setLoading(true);

    try {
      const [summaryRes, installmentRes] = await Promise.all([
        fetch(`${baseUrl}/dashboard/${somiti.id}/balance-summary`, options),
        fetch(`${baseUrl}/installment-sheet/${somiti.id}`, options),
      ]);

      if (!summaryRes.ok || !installmentRes.ok) {
        throw new Error("Failed to load dashboard data");
      }

      const summaryJson = await summaryRes.json();
      const installmentJson = await installmentRes.json();

      setSummary(summaryJson.data);
      setInstallments(installmentJson.installments.thisWeek ?? []);
      setCollectionInfo(installmentJson.collectionInfo ?? {});
      setOverdue(installmentJson.installments.overdue ?? []);
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [somiti?.id, accessToken]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleCollect = async (installmentId) => {
    setCollectingId(installmentId);
    try {
      const res = await fetch(`${baseUrl}/installment-sheet/${somiti.id}/${installmentId}/collect`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("আদায় করা যায়নি");
      const result = await res.json();

      await loadDashboard();
      toast.success("কিস্তি সফলভাবে আদায় করা হয়েছে");

    } catch (err) {
      console.error(err);
      toast.error(err.error || "আদায় করা যায়নি");
    } finally {
      setCollectingId(null);
    }
  };

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
      <StatsGrid finance={summary} />
      
     <div className={overdue.length > 0 ? "grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5" : ""}>
        <TodaysLedgerTable
          installments={installments}
          onCollect={handleCollect}
          collectingId={collectingId}
        />
        {overdue.length > 0 && (
          <OverdueTable
            overdue={overdue}
            onCollect={handleCollect}
            collectingId={collectingId}
          />
        )}
    </div>

      <QuickActions />
    </>
  );
}

export default DashboardPage;