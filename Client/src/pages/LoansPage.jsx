import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SomitiContext } from "../context/SomitiContext";
import { AuthContext } from "../context/AuthContext";
import { baseUrl } from "../helper/baseUrlHelper";
import LoansTable from "../components/loanComponents/LoansTable";

function LoansPage() {
  const { somiti } = useContext(SomitiContext);
  const { accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loans, setLoans] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!somiti?.id) return;
    setLoading(true);
    fetch(`${baseUrl}/loans/${somiti.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) =>{
        setLoans(data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [somiti?.id]);

  const handleView = (loan) => {
    navigate(`/loans/${loan.id}`);
  };

  const handleEdit = (loan) => {
    navigate(`/loans/${loan.id}/edit`);
  };

  if(loading || loans === null) {
    return <div>Loading...</div>;
  }

  const activeCount = loans.length || 0; // placeholder — replace once status field is confirmed

  return (
    <>
      <div className="flex items-center justify-between mb-5.5 gap-5 flex-wrap">
        <div>
          <h1 className="text-2xl mb-1">ঋণ</h1>
          <div className="text-sm text-[var(--text)]">{activeCount}টি চলমান ঋণ</div>
        </div>
        <button
          onClick={() => navigate("/loans/add")}
          className="text-[13.5px] font-medium px-4.5 py-2.5 rounded-[3px] bg-[var(--primary)] text-[#F6EFDD] hover:bg-[var(--primary-dark)]"
        >
          + নতুন ঋণ প্রদান
        </button>
      </div>

      <LoansTable loans={loans} onView={handleView} onEdit={handleEdit} />

      {/* ProvideLoanModal goes here once built */}
    </>
  );
}

export default LoansPage;