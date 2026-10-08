function getInitials(name) {
  return name?.slice(0, 2) || "??";
}

function BorrowerRow({ borrower, onView, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-[#F5F1E5]">
      <td className="py-3.5 px-2 text-right border-b border-[var(--border)]">
        <div className="flex items-center gap-3 flex-row-reverse justify-end">
            <div className="font-medium text-[13.5px]">{borrower.full_name}</div>
            <div className="w-8 h-8 rounded-full bg-[var(--success-bg)] text-[var(--primary-dark)] font-serif text-xs font-semibold flex items-center justify-center flex-shrink-0">
              {getInitials(borrower.full_name)}
          </div>
        </div>
      </td>
      <td className="py-3.5 px-2 text-[13.5px] text-right border-b border-[var(--border)]">{borrower.phone}</td>
      <td className="py-3.5 px-2 text-[13.5px] text-right border-b border-[var(--border)]">{borrower.nid_number || "—"}</td>
      <td className="py-3.5 px-2 text-[13.5px] text-right border-b border-[var(--border)]">{borrower.father_name || "—"}</td>
      <td className="py-3.5 px-2 text-[13.5px] text-right border-b border-[var(--border)]">{borrower.village_address || "—"}</td>
      <td className="py-3.5 px-2 border-b border-[var(--border)]">
        <div className="flex gap-1.5 justify-start">
          <button onClick={() => onView(borrower)} title="বিস্তারিত দেখুন" className="w-[30px] h-[30px] rounded-[3px] text-[var(--text)] flex items-center justify-center hover:bg-[var(--bg)] hover:text-[var(--text-h)] border border-transparent hover:border-[var(--border)]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" /><circle cx="12" cy="12" r="3" /></svg>
          </button>
          <button onClick={() => onEdit(borrower)} title="সম্পাদনা" className="w-[30px] h-[30px] rounded-[3px] text-[var(--text)] flex items-center justify-center hover:bg-[var(--bg)] hover:text-[var(--text-h)] border border-transparent hover:border-[var(--border)]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
          </button>
          <button onClick={() => onDelete(borrower)} title="মুছে ফেলুন" className="w-[30px] h-[30px] rounded-[3px] text-[var(--text)] flex items-center justify-center hover:bg-[var(--danger-bg)] hover:text-[var(--danger)] border border-transparent hover:border-[var(--danger)]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" /></svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default BorrowerRow;