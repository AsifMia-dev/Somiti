import { useState } from "react";
import BorrowerRow from "./BorrowerRow";

function BorrowersTable({ borrowers }) {
  const [search, setSearch] = useState("");

  const filtered = borrowers.filter((b) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      b.full_name?.toLowerCase().includes(query) ||
      b.phone?.includes(query) ||
      b.nid_number?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-[4px] p-4 px-[18px] mb-5">
        <div className="relative max-w-[320px]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[var(--text)]">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="নাম, ফোন বা এনআইডি দিয়ে খুঁজুন"
            className="w-full text-[13.5px] pl-[34px] pr-3.5 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      <div className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-[4px] px-6">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-right text-xs font-semibold text-[var(--text)] py-4 px-2 border-b-[1.5px] border-[var(--border)]">ঋণগ্রহীতা</th>
              <th className="text-right text-xs font-semibold text-[var(--text)] py-4 px-2 border-b-[1.5px] border-[var(--border)]">ফোন নম্বর</th>
              <th className="text-right text-xs font-semibold text-[var(--text)] py-4 px-2 border-b-[1.5px] border-[var(--border)]">এনআইডি</th>
              <th className="text-right text-xs font-semibold text-[var(--text)] py-4 px-2 border-b-[1.5px] border-[var(--border)]">পিতার নাম</th>
              <th className="text-right text-xs font-semibold text-[var(--text)] py-4 px-2 border-b-[1.5px] border-[var(--border)]">ঠিকানা</th>
              <th className="border-b-[1.5px] border-[var(--border)]"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((borrower) => (
              <BorrowerRow
                key={borrower.id}
                borrower={borrower}
              />
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center py-3.5 text-[12.5px] text-[var(--text)]">
          <span>{borrowers.length} জনের মধ্যে {filtered.length} জন দেখানো হচ্ছে</span>
        </div>
      </div>
    </div>
  );
}

export default BorrowersTable;