import { useNavigate } from "react-router-dom";

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function BackButton({ label = "পূর্বের পৃষ্ঠায় ফিরে যান" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-1.5 text-[16px] text-[var(--text)] cursor-pointer mb-4 flex-row-reverse hover:text-[var(--text-h)] justify-end w-full"
    >
      <ArrowLeftIcon />
      {label}
    </button>
  );
}

export default BackButton;