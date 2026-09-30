const statusMap = {
  COLLECTED: { label: "আদায়কৃত", className: "bg-[var(--success-bg)] text-[var(--success)]" },
  PENDING: { label: "মুলতুবি", className: "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]" },
  MISSED: { label: "বকেয়া", className: "bg-[var(--danger-bg)] text-[var(--danger)]" },
};

function TodaysLedgerTable({ installments }) {
  return (
    <div className="bg-[var(--bg-raised)] border border-[var(--border)] rounded px-6 pt-5.5 pb-2.5 mb-6.5">
      <div className="flex justify-between items-baseline mb-3.5">
        <h3 className="text-[16.5px]">আজকের কিস্তির খাতা</h3>
        <span className="text-[12.5px] text-[var(--text)]">{installments.length} জন তালিকাভুক্ত</span>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-right text-xs font-medium text-[var(--text)] pb-2.5 border-b-[1.5px] border-[var(--border)]">ঋণগ্রহীতা</th>
            <th className="text-right text-xs font-medium text-[var(--text)] pb-2.5 border-b-[1.5px] border-[var(--border)]">ঋণ খাতা</th>
            <th className="text-right text-xs font-medium text-[var(--text)] pb-2.5 border-b-[1.5px] border-[var(--border)]">বকেয়া</th>
            <th className="text-right text-xs font-medium text-[var(--text)] pb-2.5 border-b-[1.5px] border-[var(--border)]">স্ট্যাটাস</th>
          </tr>
        </thead>
        <tbody>
          {installments.map((inst) => {
            const status = statusMap[inst.status] || statusMap.PENDING;
            return (
              <tr key={inst.id} className="cursor-pointer hover:bg-[var(--bg)]">
                <td className="py-3 text-[13.5px] text-right border-b border-[var(--border)]">{inst.borrower.full_name}</td>
                <td className="py-3 text-[13px] font-mono text-right border-b border-[var(--border)]">#{String(inst.loan_id).padStart(4, "0")}</td>
                <td className="py-3 text-[13px] font-mono text-right border-b border-[var(--border)]">৳{Number(inst.installment_amount).toLocaleString("bn-BD")}</td>
                <td className="py-3 text-right border-b border-[var(--border)]">
                  <span className={`inline-flex items-center gap-1.5 text-[12.5px] px-2.5 py-1 rounded-full ${status.className}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {status.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TodaysLedgerTable;