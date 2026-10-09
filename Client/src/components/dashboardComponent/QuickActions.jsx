import { useNavigate } from "react-router-dom";
function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="flex gap-3 flex-wrap">
      <button onClick={() => navigate("/borrowers/add")}
       className="text-[13.5px] font-medium px-4.5 py-2.5 rounded bg-[var(--primary)] text-[#F6EFDD] hover:bg-[var(--primary-dark)]">
        + ঋণগ্রহীতা যোগ করুন
      </button>
      <button onClick={() => navigate("/loans/add")}
       className="text-[13.5px] font-medium px-4.5 py-2.5 rounded border border-[var(--border)] bg-[var(--bg-raised)] hover:border-[var(--text)]">
        + ঋণ প্রদান
      </button>
    </div>
  );
}

export default QuickActions;