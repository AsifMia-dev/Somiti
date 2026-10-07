const thClass =
  "text-right text-xs font-medium text-[var(--text)] pb-2.5 border-b-[1.5px] border-[var(--border)]";
const tdClass = "py-3 text-right border-b border-[var(--border)]";

function ActionCell({ row, onCollect, collecting }) {
  if (row.status === "PAID") {
    const label = row.loanCompleted ? "ঋণ পরিশোধিত" : "আদায়কৃত";
    return (
      <span className="inline-flex items-center gap-1.5 text-[12.5px] px-2.5 py-1 rounded-full bg-[var(--success-bg)] text-[var(--success)]">
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {label}
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={collecting}
      onClick={() => onCollect(row.id)}
      className="text-[12.5px] px-3 py-1 rounded bg-[var(--primary)] text-[#F6EFDD] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {collecting ? "অপেক্ষা করুন..." : "আদায় করুন"}
    </button>
  );
}

function TodaysLedgerTable({ installments, onCollect, collectingId }) {
  return (
    <div className="bg-[var(--bg-raised)] border border-[var(--border)] rounded px-6 pt-5.5 pb-2.5 mb-6.5">
      <div className="flex justify-between items-baseline mb-3.5">
        <h3 className="text-[16.5px]">আজকের কিস্তির খাতা</h3>
        <span className="text-[12.5px] text-[var(--text)]">
          {installments.length} জন তালিকাভুক্ত
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={thClass}>ঋণগ্রহীতা</th>
              <th className={thClass}>কিস্তি নং</th>
              <th className={thClass}>কিস্তির পরিমাণ</th>
              <th className={thClass}>কার্যক্রম</th>
            </tr>
          </thead>
          <tbody>
            {installments.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-[13px] text-[var(--text)]">
                  এই সপ্তাহে কোনো কিস্তি নেই
                </td>
              </tr>
            )}

            {installments.map((row) => (
              <tr key={row.id} className="hover:bg-[var(--bg)]">
                <td className={`${tdClass} text-[13.5px]`}>{row.borrower.full_name}</td>
                <td className={`${tdClass} text-[13px] font-mono`}>
                  {Number(row.installNo).toLocaleString("bn-BD")}
                </td>
                <td className={`${tdClass} text-[13px] font-mono`}>
                  ৳{Number(row.installment_amount).toLocaleString("bn-BD")}
                </td>
                <td className={tdClass}>
                  <ActionCell
                    row={row}
                    onCollect={onCollect}
                    collecting={collectingId === row.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TodaysLedgerTable;