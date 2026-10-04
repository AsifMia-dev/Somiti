function CollectionFlag({ collectionInfo }) {
  if (!collectionInfo.collectionDate  ) return null;

  const { collectionDate, daysUntil,isCollectionDay } = collectionInfo;


  const formattedDate = new Date(collectionDate).toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return (
    <div className="flex items-center gap-2 bg-[var(--bg-raised)] border border-[var(--border)] px-3.5 py-2 rounded text-[13.5px] text-[var(--primary-dark)]">
      <span className="w-[7px] h-[7px] rounded-full bg-[var(--accent)]" />
      {isCollectionDay
        ? `আজ ${formattedDate} কিস্তি সংগ্রহের দিন`
        : `পরবর্তী কিস্তি সংগ্রহ: ${formattedDate} `}~
    </div>
  );
}

export default CollectionFlag;