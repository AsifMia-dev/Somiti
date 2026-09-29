function NetWorthHero({ finance }) {
  if (!finance) return null;

  const netWorth = Number(finance.cash_balance) + Number(finance.loan_balance);

  return (
    <div className="flex items-center gap-9 px-9 py-7 mb-6 flex-row-reverse text-right bg-[var(--bg-raised)] border border-[var(--border)] rounded">
      <div className="w-[120px] h-[120px] rounded-full border-2 border-[var(--accent)] outline outline-1 outline-[var(--accent)] outline-offset-[5px] flex flex-col items-center justify-center flex-shrink-0 rotate-3">
        <div className="text-[10.5px] tracking-wide text-[var(--accent-deep)] mb-1">নিট মূল্য</div>
        <div className="font-mono text-lg font-medium text-[var(--primary-dark)]">
          ৳{netWorth.toLocaleString("bn-BD")}
        </div>
      </div>

      <div>
        <p className="text-[13px] text-[var(--text)] mb-1.5">সমিতির আর্থিক অবস্থান</p>
        <h2 className="text-[19px] mb-2">মোট নিট মূল্য ৳{netWorth.toLocaleString("bn-BD")}</h2>
        <p className="text-[13.5px] text-[var(--text)] max-w-[48ch] leading-relaxed">
          নগদ ব্যালেন্স এবং বিতরণকৃত ঋণের সমষ্টি থেকে এই মূল্য নির্ধারিত হয়েছে।
        </p>
        <div className="text-[12.5px] text-[var(--text)] mt-2.5">
          নগদ <b className="text-[var(--text-h)] font-mono font-medium">৳{Number(finance.cash_balance).toLocaleString("bn-BD")}</b>
          &nbsp;+&nbsp;
          ঋণ বকেয়া <b className="text-[var(--text-h)] font-mono font-medium">৳{Number(finance.loan_balance).toLocaleString("bn-BD")}</b>
        </div>
      </div>
    </div>
  );
}

export default NetWorthHero;