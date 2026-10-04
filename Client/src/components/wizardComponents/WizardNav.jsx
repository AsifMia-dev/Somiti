function WizardNav({ current, totalSteps, goBack, goNext, loading }) {
  return (
    <div className="flex justify-between items-center mt-[26px]">
      <button
        type="button"
        onClick={goBack}
        className={`text-[13.5px] text-[var(--text)] underline px-1 py-2.5 ${current === 1 ? "invisible" : ""}`}
      >
        ফিরে যান
      </button>

      <div className="flex gap-2.5">
        {current >= 3 && current < totalSteps && (
          <button
            type="button"
            onClick={goNext}
            className="text-[13.5px] text-[var(--text)] underline px-1 py-2.5"
          >
            এড়িয়ে যান
          </button>
        )}
        <button
          type="button"
          onClick={goNext}
          disabled={loading}
          className="text-[13.5px] font-medium px-5 py-[11px] rounded-[3px] bg-[var(--primary)] text-[#F6EFDD] hover:bg-[var(--primary-dark)] disabled:opacity-60"
        >
          {current === totalSteps ? (loading ? "..." : "সমিতি তৈরি করুন") : "পরবর্তী"}
        </button>
      </div>
    </div>
  );
}

export default WizardNav;