function getInitials(name) {
  return name?.slice(0, 2) || "??";
}

function LoanRow({ loan, onView, onEdit }) {
 console.log(loan);
  return (
    <tr className="hover:bg-[#F5F1E5]">
      <td className="sticky left-0 bg-[var(--bg-raised)] py-3 px-2.5 text-right border-b border-[var(--border)] whitespace-nowrap">
        <div className="flex items-center gap-2.5 flex-row-reverse justify-start">
          <div className="w-[30px] h-[30px] rounded-full bg-[var(--success-bg)] text-[var(--primary-dark)] font-serif text-[11.5px] font-semibold flex items-center justify-center flex-shrink-0">
            {getInitials(loan.loan.borrower?.full_name)}
          </div>
          <div>
            <div className="font-medium text-[13px]">{loan.loan.borrower?.full_name}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-2.5 font-mono text-[12.5px] text-right border-b border-[var(--border)] whitespace-nowrap">
        ৳{Number(loan.loan.loan_amount).toLocaleString("bn-BD")}
      </td>
      <td className="py-3 px-2.5 font-mono text-[12.5px] text-right border-b border-[var(--border)] whitespace-nowrap">
        {loan.loan.total_installment}
      </td>
      <td className="py-3 px-2.5 font-mono text-[12.5px] text-right border-b border-[var(--border)] whitespace-nowrap">
        {loan.due_amount != null ? `৳${Number(loan.due_amount).toLocaleString("bn-BD")}` : "—"}
      </td>
      <td className="py-3 px-2.5 font-mono text-[12.5px] text-right border-b border-[var(--border)] whitespace-nowrap">
        {loan.loan.completed_installment ?? "—"}
      </td>
      <td className="py-3 px-2.5 font-mono text-[12.5px] text-right border-b border-[var(--border)] whitespace-nowrap">
        {loan.loan.total_installment - loan.loan.completed_installment ?? "—"}
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
        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
            loan.status === 'ACTIVE' 
              ? 'bg-[var(--success-bg)] text-[var(--success)]' 
              : 'bg-[var(--muted-bg)] text-[var(--muted)]'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {loan.status === 'ACTIVE' ? 'চলমান' : 'সম্পন্ন'}
        </span>
      </td>
    </tr>
  );
}

export default LoanRow;