function CollectionFlag({ nextCollectionDate, dueCount }) {
  if (!nextCollectionDate) return null;

  const next = new Date(nextCollectionDate);
  const today = new Date();
  const isToday = next.toDateString() === today.toDateString();

  const formattedDate = next.toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex items-center gap-2 bg-[var(--bg-raised)] border border-[var(--border)] px-3.5 py-2 rounded text-[13.5px] text-[var(--primary-dark)]">
      <span className="w-[7px] h-[7px] rounded-full bg-[var(--accent)]" />
      {isToday
        ? `আজ কিস্তি সংগ্রহের দিন — ${dueCount}টি কিস্তি বকেয়া`
        : `পরবর্তী কিস্তি সংগ্রহ: ${formattedDate}`}
    </div>
  );
}

export default CollectionFlag;