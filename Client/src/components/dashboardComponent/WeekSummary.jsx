const taka = (n) => `৳${Number(n ?? 0).toLocaleString("bn-BD")}`;

function WeekSummary({ weekSummary = {} }) {
  const expected = Number(weekSummary.expected ?? 0);
  const collected = Number(weekSummary.collected ?? 0);
  const pending = Number(weekSummary.pending ?? 0);
  const percent = expected > 0 ? Math.min(100, Math.round((collected / expected) * 100)) : 0;

  const items = [
    { label: "মোট প্রাপ্য", value: expected, color: "text-[var(--text-h)]" },
    { label: "আদায় হয়েছে", value: collected, color: "text-[var(--success)]" },
    { label: "এখনো বাকি", value: pending, color: "text-[var(--danger)]" },
  ];

  return (
    <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-lg">সাপ্তাহিক আদায়</h2>
        <span className="text-sm text-[var(--text)]">
          {percent.toLocaleString("bn-BD")}% সম্পন্ন
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="সাপ্তাহিক আদায়ের অগ্রগতি"
        className="mb-5 h-2.5 w-full overflow-hidden rounded-full bg-black/10"
      >
        <div
          className="h-full rounded-full bg-[var(--success)] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 text-xs text-[var(--text)] sm:text-sm">{item.label}</div>
            <div className={`text-base font-bold sm:text-2xl ${item.color}`}>
              {taka(item.value)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WeekSummary;