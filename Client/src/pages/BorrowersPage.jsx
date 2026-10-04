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

  const handleView = (borrower) => {
    navigate(`/borrowers/${borrower.id}`);
  };

  const handleEdit = (borrower) => {
    navigate(`/borrowers/${borrower.id}/edit`);
  };

  const handleDelete = async (borrower) => {
    if (!window.confirm(`${borrower.full_name} কে মুছে ফেলতে চান?`)) return;

    try {
      const res = await fetch(`${baseUrl}/borrowers/${somiti.id}/${borrower.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("ঋণগ্রহীতা মুছে ফেলা হয়েছে");
        setBorrowers((prev) => prev.filter((b) => b.id !== borrower.id));
      } else {
        toast.error(data.error || "মুছে ফেলা যায়নি");
      }
    } catch (err) {
      console.error(err);
      toast.error("কিছু ভুল হয়েছে");
    }
  };

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
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
}

export default BorrowersPage;