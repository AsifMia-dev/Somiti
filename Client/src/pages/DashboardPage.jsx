import { useContext, useEffect, useState } from "react";
import { SomitiContext } from "../context/SomitiContext";
import { AuthContext } from "../context/AuthContext";
import { baseUrl } from "../helper/baseUrlHelper";
import NetWorthHero from "../components/dashboardComponent/NetWorthHero";
import StatsGrid from "../components/dashboardComponent/StatsGrid";
import CollectionFlag from "../components/dashboardComponent/CollectionFlag";
import TodaysLedgerTable from "../components/dashboardComponent/TodaysLedgerTable";
import QuickActions from "../components/dashboardComponent/QuickActions";
<<<<<<< HEAD
import { toast } from "sonner"
=======
>>>>>>> f1efd2809565f4182c0fff0fd5436fb67720af76

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
<<<<<<< HEAD
  const [overdue, setOverdue] = useState([]);
  const [collectingId, setCollectingId] = useState(null);
=======
>>>>>>> f1efd2809565f4182c0fff0fd5436fb67720af76

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
<<<<<<< HEAD
        fetch(`${baseUrl}/installment-sheet/${somiti.id}`, options),
=======
        fetch(`${baseUrl}/installments/${somiti.id}`, options),
>>>>>>> f1efd2809565f4182c0fff0fd5436fb67720af76
      ]);

      if (!summaryRes.ok || !installmentRes.ok) {
        throw new Error("Failed to load dashboard data");
      }

      const summaryJson = await summaryRes.json();
      const installmentJson = await installmentRes.json();

      setSummary(summaryJson.data);
<<<<<<< HEAD
      setInstallments(installmentJson.installments.thisWeek ?? []);
      setCollectionInfo(installmentJson.collectionInfo ?? {});
      setOverdue(installmentJson.installments.overdue ?? []);
=======
      setInstallments(installmentJson.installments ?? []);
      setCollectionInfo(installmentJson.collectionInfo ?? {});
>>>>>>> f1efd2809565f4182c0fff0fd5436fb67720af76
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  load();
  return () => controller.abort();
  }, []);

<<<<<<< HEAD
  const handleCollect = async (installmentId) => {
    setCollectingId(installmentId);
    try {
      const res = await fetch(`${baseUrl}/installment-sheet/${somiti.id}/${installmentId}/collect`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Collect response:", res);
      if (!res.ok) throw new Error("আদায় করা যায়নি");
      
      const result = await res.json();
      console.log("Collect result:", result.data);
      setInstallments((rows) =>
        rows.map((r) =>
          r.id === result.data.installmentId
            ? { ...r, status: result.data.status, loanCompleted: result.data.loanCompleted }
            : r
        )
      );
    } catch (err) {
      console.error(err);
      toast.error(err.error); // replace with your own toast later
    } finally {
      setCollectingId(null);
    }
  };

  console.log('Installments:', installments);

=======
>>>>>>> f1efd2809565f4182c0fff0fd5436fb67720af76
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
<<<<<<< HEAD
      <TodaysLedgerTable
          installments={installments}
          onCollect={handleCollect}
          collectingId={collectingId}
       />
=======
      <TodaysLedgerTable installments={installments} />
>>>>>>> f1efd2809565f4182c0fff0fd5436fb67720af76
      <QuickActions />
    </>
  );
}

export default DashboardPage;