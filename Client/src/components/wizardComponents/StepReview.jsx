import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function StepReview({ formData }) {
  const { user } = useContext(AuthContext);

  const rows = [
    { label: "ব্যবস্থাপক", value: user?.name },
    { label: "সমিতির নাম", value: formData.name },
    { label: "নিট মূল্য", value: `৳${formData.netValue || 0}` },
    { label: "নগদ ব্যালেন্স", value: `৳${formData.cashBalance || 0}` },
    { label: "ঋণ ব্যালেন্স", value: `৳${formData.loanBalance || 0}` },
    { label: "সাপ্তাহিক কালেকশন দিন", value: formData.collection_day },
    { label: "মাসিক কালেকশন তারিখ", value: formData.monthly_collection_date },
  ];

  return (
    <div>
      <div className="text-xs text-[var(--accent-deep)] font-medium mb-2">ধাপ ৬ / ৬</div>
      <h2 className="text-[19px] mb-1.5">সব তথ্য পর্যালোচনা করুন</h2>
      <div className="text-[13px] text-[var(--text)] mb-[22px] leading-relaxed">
        নিচের তথ্য সঠিক থাকলে সমিতি তৈরি করুন বাটনে ক্লিক করুন
      </div>

      <div className="border border-[var(--border)] rounded-[3px] divide-y divide-[var(--border)]">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between px-3.5 py-2.5 text-sm">
            <span className="text-[var(--text)]">{row.label}</span>
            <span className="text-[var(--text-h)] font-medium">{row.value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepReview;