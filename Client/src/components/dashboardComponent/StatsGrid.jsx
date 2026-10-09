function StatsGrid({ finance}) {
  const stats = [
    {
      label: "নগদ মজুদ",
      value: `৳${Number(finance.cash_balance).toLocaleString("bn-BD")}`,
      color: "text-[var(--success)]",
    },
    {
      label: "আদায়যোগ্য ঋণ",
      value: `৳${Number(finance.loan_balance).toLocaleString("bn-BD")}`,
      color: "text-[var(--info)]",
    },
    {
      label: "মোট অর্জিত মুনাফা",
      value: `৳${Number(finance.total_interest_earned).toLocaleString("bn-BD")}`,
      color: "text-[var(--info)]",
    },
    {
      label: "মোট পরিশোধিত জরিমানা",
      value: `৳${Number(finance.total_fines_collected).toLocaleString("bn-BD")}`,
      color: "text-[var(--success)]",
    },
    {
      label: "মোট অপরিশোধিত জরিমানা",
      value: `৳${Number(finance.total_fines_outstanding).toLocaleString("bn-BD")}`,
      color: "text-[var(--danger)]",
    },
 
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-3.5 mb-5 sm:mb-7">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="min-w-0 p-3 sm:p-4 sm:px-[18px] text-left bg-[var(--bg-raised)] border border-[var(--border)] rounded"
        >
          <div className="text-[11.5px] sm:text-[12.5px] text-[var(--text)] mb-1.5 sm:mb-2 truncate">
            {stat.label}
          </div>
          <div className={`font-mono text-[17px] sm:text-[19px] font-medium break-words ${stat.color}`}>
            {stat.value}
          </div>
          <div
            className={`text-[11px] sm:text-[11.5px] mt-1 sm:mt-1.5 ${
              stat.alert ? "text-[var(--danger)]" : "text-[var(--success)]"
            }`}
          >
            {stat.delta}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsGrid;