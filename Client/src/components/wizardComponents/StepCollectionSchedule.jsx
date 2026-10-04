const weekdayToBangla = {
  SATURDAY: "শনিবার",
  SUNDAY: "রবিবার",
  MONDAY: "সোমবার",
  TUESDAY: "মঙ্গলবার",
  WEDNESDAY: "বুধবার",
  THURSDAY: "বৃহস্পতিবার",
  FRIDAY: "শুক্রবার",
};

function StepCollectionSchedule({ formData, handleChange }) {
  return (
    <div>
      <div className="text-xs text-[var(--accent-deep)] font-medium mb-2">ধাপ ৫ / ৬</div>
      <h2 className="text-[19px] mb-1.5">কালেকশন সময়সূচি</h2>
      <div className="text-[13px] text-[var(--text)] mb-[22px] leading-relaxed">
        সাপ্তাহিক ও মাসিক কিস্তি সংগ্রহের দিন নির্ধারণ করুন
      </div>

      <div className="mb-4">
        <label className="block text-xs mb-1.5 text-[var(--text)]">সাপ্তাহিক কালেকশন দিন</label>
        <select
          name="collection_day"
          value={formData.collection_day}
          onChange={handleChange}
          className="w-full text-sm px-3 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)]"
        >
          {Object.entries(weekdayToBangla).map(([enValue, bnLabel]) => (
            <option key={enValue} value={enValue}>{bnLabel}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs mb-1.5 text-[var(--text)]">মাসিক কালেকশন তারিখ</label>
        <select
          name="monthly_collection_date"
          value={formData.monthly_collection_date}
          onChange={handleChange}
          className="w-full text-sm px-3 py-2.5 rounded-[3px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)]"
        >
          {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default StepCollectionSchedule;