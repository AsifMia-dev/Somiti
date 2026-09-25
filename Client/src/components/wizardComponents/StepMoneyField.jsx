function StepMoneyField({ stepNumber, totalSteps, title, subtitle, fieldName, formData, handleChange }) {
  return (
    <div>
      <div className="text-xs text-[var(--accent-deep)] font-medium mb-2">
        ধাপ {stepNumber} / {totalSteps}
      </div>
      <h2 className="text-[19px] mb-1.5">
        {title} <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] ml-1.5">ঐচ্ছিক</span>
      </h2>
      <div className="text-[13px] text-[var(--text)] mb-[22px] leading-relaxed">
        {subtitle}
      </div>

      <div>
        <label className="block text-xs mb-1.5 text-[var(--text)]">{title} (৳)</label>
        <input
          type="number"
          min="0"
          name={fieldName}
          value={formData[fieldName]}
          onChange={handleChange}
          placeholder="0"
          className="w-full text-[15px] px-3.5 py-3 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] placeholder:text-[#A79E86] font-mono focus:outline-none focus:border-[var(--accent)]"
        />
        <div className="text-[11.5px] text-[var(--text)] mt-1.5">খালি রাখলে ডিফল্ট মান ৳0 ধরা হবে</div>
      </div>
    </div>
  );
}

export default StepMoneyField;