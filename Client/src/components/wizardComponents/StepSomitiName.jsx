function StepSomitiName({ formData, handleChange }) {
  return (
    <div>
      <div className="text-xs text-[var(--accent-deep)] font-medium mb-2">ধাপ ১ / ৬</div>
      <h2 className="text-[19px] mb-1.5">সমিতির নাম দিন</h2>
      <div className="text-[13px] text-[var(--text)] mb-[22px] leading-relaxed">
        এই নামেই আপনার সমিতি তালিকাভুক্ত হবে
      </div>

      <div>
        <label className="block text-xs mb-1.5 text-[var(--text)]">সমিতির নাম</label>
        <input
          required
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="যেমন: হবিগঞ্জ কল্যাণ সমিতি"
          className="w-full text-[15px] px-3.5 py-3 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] placeholder:text-[#A79E86] focus:outline-none focus:border-[var(--accent)]"
        />
      </div>
    </div>
  );
}

export default StepSomitiName;