function ProgressBar({ current, total }) {
  return (
    <div className="flex items-center mb-[30px]">
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div
            className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 border-[1.5px] ${
              step < current
                ? "bg-[var(--primary)] border-[var(--primary)] text-[#F6EFDD]"
                : step === current
                ? "border-[var(--accent)] text-[var(--accent-deep)] bg-[var(--bg-raised)]"
                : "border-[var(--border)] text-[var(--text)] bg-[var(--bg)]"
            }`}
          >
            {step < current ? "✓" : step}
          </div>
          {step < total && (
            <div
              className={`flex-1 h-[1.5px] mx-1 ${
                step < current ? "bg-[var(--primary)]" : "bg-[var(--border)]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default ProgressBar;