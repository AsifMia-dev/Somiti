function getInitials(name) {
  return name?.slice(0, 2) || "??";
}

function LoanRow({ loan, onView, onEdit }) {
  return (
    <tr className="hover:bg-[#F5F1E5]">
      <td className="sticky left-0 bg-[var(--bg-raised)] py-3 px-2.5 text-right border-b border-[var(--border)] whitespace-nowrap">
        <div className="flex items-center gap-2.5 flex-row-reverse justify-start">
          <div className="w-[30px] h-[30px] rounded-full bg-[var(--success-bg)] text-[var(--primary-dark)] font-serif text-[11.5px] font-semibold flex items-center justify-center flex-shrink-0">
            {getInitials(loan.borrower?.full_name)}
          </div>
          <div>
            <div className="font-medium text-[13px]">{loan.borrower?.full_name}</div>
            <div className="text-[11px] text-[var(--text)]">খাতা #{String(loan.borrower_id).padStart(4, "0")}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-2.5 font-mono text-[12.5px] text-right border-b border-[var(--border)] whitespace-nowrap">
        ৳{Number(loan.loan_amount).toLocaleString("bn-BD")}
      </td>
      <td className="py-3 px-2.5 font-mono text-[12.5px] text-right border-b border-[var(--border)] whitespace-nowrap">
        {loan.total_installment}
      </td>
      <td className="py-3 px-2.5 font-mono text-[12.5px] text-right border-b border-[var(--border)] whitespace-nowrap">
        {loan.due_amount != null ? `৳${Number(loan.due_amount).toLocaleString("bn-BD")}` : "—"}
      </td>
      <td className="py-3 px-2.5 font-mono text-[12.5px] text-right border-b border-[var(--border)] whitespace-nowrap">
        {loan.collected_count ?? "—"}
      </td>
      <td className="py-3 px-2.5 font-mono text-[12.5px] text-right border-b border-[var(--border)] whitespace-nowrap">
        {loan.remaining_count ?? "—"}
      </td>
      <td className={`py-3 px-2.5 font-mono text-[12.5px] text-right border-b border-[var(--border)] whitespace-nowrap ${
        loan.fine_amount > 0 ? "text-[var(--danger)]" : "text-[var(--text)]"
      }`}>
        {loan.fine_amount != null ? `৳${Number(loan.fine_amount).toLocaleString("bn-BD")}` : "৳০"}
      </td>
      <td className="py-3 px-2.5 font-mono text-[12.5px] text-right text-[var(--info)] border-b border-[var(--border)] whitespace-nowrap">
        {loan.savings != null ? `৳${Number(loan.savings).toLocaleString("bn-BD")}` : "—"}
      </td>
      <td className="py-3 px-2.5 text-right border-b border-[var(--border)] whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[var(--success-bg)] text-[var(--success)]">
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          চলমান
        </span>
      </td>
      <td className="py-3 px-2.5 border-b border-[var(--border)] whitespace-nowrap">
        <div className="flex gap-1 justify-start">
          <button onClick={() => onView(loan)} title="বিস্তারিত" className="w-7 h-7 rounded-[3px] text-[var(--text)] flex items-center justify-center hover:bg-[var(--bg)] hover:text-[var(--text-h)] border border-transparent hover:border-[var(--border)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" /><circle cx="12" cy="12" r="3" /></svg>
          </button>
          <button onClick={() => onEdit(loan)} title="সম্পাদনা" className="w-7 h-7 rounded-[3px] text-[var(--text)] flex items-center justify-center hover:bg-[var(--bg)] hover:text-[var(--text-h)] border border-transparent hover:border-[var(--border)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default LoanRow;