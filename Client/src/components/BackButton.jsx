import { useNavigate } from "react-router-dom";

function BackButton({ label = "পূর্বের পৃষ্ঠায় ফিরে যান" }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-1.5 text-[13px] text-[var(--text)] cursor-pointer mb-4 flex-row-reverse hover:text-[var(--text-h)] justify-end w-full"
    >
      <span>&larr;</span>
      {label}
    </div>
  );
}

export default BackButton;