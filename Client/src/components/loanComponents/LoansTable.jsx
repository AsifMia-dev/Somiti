import { useState } from "react";
import LoanRow from "./LoanRow";

function LoansTable({ loans }) {
  const [search, setSearch] = useState("");

  const filtered = loans.filter((loan) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      loan.borrower?.full_name?.toLowerCase().includes(query) ||
      String(loan.borrower_id).includes(query)
    );
  });

  return (
    <div>
      <div className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-[4px] p-4 px-[18px] mb-3.5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-[320px]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[var(--text)]">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="নাম বা খাতা নম্বর দিয়ে খুঁজুন"
              className="w-full text-[13.5px] pl-[34px] pr-3.5 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="text-[13px] px-4 py-2 rounded-full bg-[var(--primary)] text-[#F6EFDD] font-medium cursor-pointer">
              সকল ঋণ ({loans.length})
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 justify-end text-[11.5px] text-[var(--text)] mb-2.5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6" /></svg>
        সব কলাম দেখতে পাশে স্ক্রল করুন
      </div>

      <div className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-[4px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1080px]">
            <thead>
              <tr>
                <th className="sticky left-0 bg-[var(--bg)] text-right text-[11.5px] font-semibold text-[var(--text)] py-3.5 px-2.5 border-b-[1.5px] border-[var(--border)] whitespace-nowrap">ঋণগ্রহীতা</th>
                <th className="text-right text-[11.5px] font-semibold text-[var(--text)] py-3.5 px-2.5 border-b-[1.5px] border-[var(--border)] whitespace-nowrap">ঋণের পরিমাণ</th>
                <th className="text-right text-[11.5px] font-semibold text-[var(--text)] py-3.5 px-2.5 border-b-[1.5px] border-[var(--border)] whitespace-nowrap">মোট কিস্তি</th>
                <th className="text-right text-[11.5px] font-semibold text-[var(--text)] py-3.5 px-2.5 border-b-[1.5px] border-[var(--border)] whitespace-nowrap">বকেয়া কিস্তির পরিমাণ</th>
                <th className="text-right text-[11.5px] font-semibold text-[var(--text)] py-3.5 px-2.5 border-b-[1.5px] border-[var(--border)] whitespace-nowrap">আদায়কৃত কিস্তি</th>
                <th className="text-right text-[11.5px] font-semibold text-[var(--text)] py-3.5 px-2.5 border-b-[1.5px] border-[var(--border)] whitespace-nowrap">বাকি কিস্তি</th>
                <th className="text-right text-[11.5px] font-semibold text-[var(--text)] py-3.5 px-2.5 border-b-[1.5px] border-[var(--border)] whitespace-nowrap">জরিমানা</th>
                <th className="text-right text-[11.5px] font-semibold text-[var(--text)] py-3.5 px-2.5 border-b-[1.5px] border-[var(--border)] whitespace-nowrap">সঞ্চয়</th>
                <th className="text-right text-[11.5px] font-semibold text-[var(--text)] py-3.5 px-2.5 border-b-[1.5px] border-[var(--border)] whitespace-nowrap">ঋণের অবস্থা</th>
                <th className="border-b-[1.5px] border-[var(--border)]"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((loan) => (
                <LoanRow key={loan.id} loan={loan}/>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center py-3.5 px-3.5 text-[12.5px] text-[var(--text)]">
          <span>{loans.length}টি ঋণের মধ্যে {filtered.length}টি দেখানো হচ্ছে</span>
        </div>
      </div>
    </div>
  );
}

export default LoansTable;