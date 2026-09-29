import { useContext, useEffect, useState } from "react";
import { SomitiContext } from "../context/SomitiContext";
import { AuthContext } from "../context/AuthContext";
import { baseUrl } from "../helper/baseUrlHelper";
import NetWorthHero from "../components/dashboardComponent/NetWorthHero";
import StatsGrid from "../components/dashboardComponent/StatsGrid";

function DashboardPage() {
  console.log("Dashboard")
  const { somiti } = useContext(SomitiContext);
  const { accessToken } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!somiti?.id) return;

    fetch(`${baseUrl}/dashboard/${somiti.id}/balance-summary`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setSummary(data.data)
        
      })
      .catch((err) => console.error(err));
  }, [somiti?.id]);

  if (!summary) return <div>লোড হচ্ছে...</div>;

  return (
    <>
      <NetWorthHero finance={summary} />
      <StatsGrid finance={summary} todayCollection={summary.todayCollection} overdue={summary.overdue} />
    </>
  );
}

export default DashboardPage;
