import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SomitiContext } from "../context/SomitiContext";
import { AuthContext } from "../context/AuthContext";
import { baseUrl } from "../helper/baseUrlHelper";
import BorrowersTable from "../components/borrowerComponents/BorrowersTable";

function BorrowersPage() {
  const { somiti } = useContext(SomitiContext);
  const { accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [borrowers, setBorrowers] = useState(null);

  useEffect(() => {
    if (!somiti?.id) return;

    fetch(`${baseUrl}/borrowers/${somiti.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setBorrowers(data.data))
      .catch((err) => console.error(err));
  }, [somiti?.id]);

  if (!borrowers) return <div>লোড হচ্ছে...</div>;

  return (
    <>
      <div className="flex items-center justify-between mb-5.5 gap-5 flex-wrap">
        <div>
          <h1 className="text-2xl mb-1">ঋণগ্রহীতার বিবরণ</h1>
          <div className="text-sm text-[var(--text)]">{borrowers.length} জন নিবন্ধিত ঋণগ্রহীতা</div>
        </div>
        <button
          onClick={() => navigate("/borrowers/add")}
          className="text-[13.5px] font-medium px-4.5 py-2.5 rounded-[3px] bg-[var(--primary)] text-[#F6EFDD] hover:bg-[var(--primary-dark)]"
        >
          + ঋণগ্রহীতা যোগ করুন
        </button>
      </div>

      <BorrowersTable
        borrowers={borrowers}
      />
    </>
  );
}

export default BorrowersPage;