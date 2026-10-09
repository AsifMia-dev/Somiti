function getInitials(name) {
  return name?.slice(0, 2) || "??";
}

function BorrowerRow({ borrower}) {
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
      </td>
    </tr>
  );
}

export default BorrowerRow;