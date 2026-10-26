import { useMemo } from "react";

function PreviousLoanInfo({ form, onChange }) {

  const maxProvidedDate = useMemo(() => {
    const n = Number(form.completed_installment) || 0;
    const d = new Date();
    d.setDate(d.getDate() - n * 7); // weekly only, since monthly is disabled right now
    return d.toISOString().slice(0, 10);
  }, [form.completed_installment]);

  return (
    <div className="border border-[var(--accent)] bg-[rgba(184,132,46,0.08)] rounded-[3px] p-4 mb-[22px]">
      <div className="text-right mb-3">
        <p className="text-[13px] font-medium text-[var(--text-h)]">
          পূর্ববর্তী ঋণের তথ্য যুক্ত করুন
        </p>
        <p className="text-[11.5px] text-[var(--text)] mt-1">
          এই ঋণ আগে থেকেই চালু — বাকি কিস্তি সিস্টেম নিজে হিসাব করবে
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-right">
          <label className="block text-xs text-[var(--text)] mb-1.5">
            আদায়কৃত কিস্তির পরিমাণ <span className="text-[var(--danger)]">*</span>
          </label>
          <input
            type="text"
            name="completed_installment"
            value={form.completed_installment}
            onChange={onChange}
            placeholder="0"
            className="w-full text-[13.5px] px-3.5 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-right"
          />
        </div>

        <div className="text-right">
          <label className="block text-xs text-[var(--text)] mb-1.5">
            ঋণ প্রদানের তারিখ <span className="text-[var(--danger)]">*</span>
          </label>
          <input
            type="date"
            name="loan_provided_date"
            value={form.loan_provided_date}
            max={maxProvidedDate}
            onChange={onChange}
            className="w-full text-[13.5px] px-3.5 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-right [color-scheme:light]"
          />
        </div>

        <div className="col-span-2 text-right">
          <label className="block text-xs text-[var(--text)] mb-1.5">
            মোট আদায়কৃত জরিমানা (৳)
          </label>
          <input
            type="text"
            name="total_fine_collected"
            value={form.total_fine_collected}
            onChange={onChange}
            placeholder="0"
            className="w-full text-[13.5px] px-3.5 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-right"
          />
        </div>
      </div>
    </div>
  );
}

export default PreviousLoanInfo;