function StatsGrid({ finance, todayCollection, overdue }) {
  const stats = [
    {
      label: "নগদ ব্যালেন্স",
      value: `৳${Number(finance.cash_balance).toLocaleString("bn-BD")}`,
      delta: "হাতে থাকা মোট নগদ",
      color: "text-[var(--success)]",
    },
    {
      label: "ঋণ ব্যালেন্স",
      value: `৳${Number(finance.loan_balance).toLocaleString("bn-BD")}`,
      delta: `${overdue?.totalBorrowers || 0} জন ঋণগ্রহীতার মধ্যে`,
      color: "text-[var(--info)]",
    },
    {
      label: "আজকের আদায়",
      value: `৳${Number(todayCollection?.collectedAmount || 0).toLocaleString("bn-BD")}`,
      delta: `${todayCollection?.total || 0}টির মধ্যে ${todayCollection?.collectedCount || 0}টি আদায়`,
      color: "text-[var(--text-h)]",
    },
    {
      label: "এই সপ্তাহে বকেয়া",
      value: `${overdue?.count || 0} জন`,
      delta: `৳${Number(overdue?.amount || 0).toLocaleString("bn-BD")} বকেয়া, জরিমানা প্রযোজ্য`,
      color: "text-[var(--danger)]",
      alert: true,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3.5 mb-7">
      {stats.map((stat) => (
        <div key={stat.label} className="p-4 px-4.5 text-right bg-[var(--bg-raised)] border border-[var(--border)] rounded">
          <div className="text-[12.5px] text-[var(--text)] mb-2">{stat.label}</div>
          <div className={`font-mono text-[19px] font-medium ${stat.color}`}>{stat.value}</div>
          <div className={`text-[11.5px] mt-1.5 ${stat.alert ? "text-[var(--danger)]" : "text-[var(--success)]"}`}>
            {stat.delta}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsGrid;