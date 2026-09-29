import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { SomitiContext } from "../context/SomitiContext";

const navItems = [
  {
    to: "/dashboard",
    label: "ড্যাশবোর্ড",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    to: "/borrowers",
    label: "ঋণগ্রহীতা",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: "/loans",
    label: "ঋণ",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    to: "/installments",
    label: "কিস্তি",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    to: "/reports",
    label: "রিপোর্ট",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 3v18h18" />
        <path d="M18 17V9M13 17V5M8 17v-4" />
      </svg>
    ),
  },
];

function Sidebar() {
  const { user } = useContext(AuthContext);
  const { somiti } = useContext(SomitiContext);

  const firstWord = somiti?.name?.split("")[0] || "সো";

  return (
    <aside className="w-full h-full bg-[var(--primary)] text-[#EDE7D6] p-7 px-5 flex flex-col">
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="w-[34px] h-[34px] rounded-full border-[1.5px] border-[var(--accent)] flex items-center justify-center text-[15px] font-semibold text-[var(--accent)] flex-shrink-0">
          {firstWord}
        </div>
        <div className="text-lg font-semibold" style={{ fontFamily: "var(--heading)" }}>
          সমিতি
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 mt-[34px]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-[14.5px] border-l-2 ${
                isActive
                  ? "bg-[rgba(184,132,46,0.16)] text-[#F6EFDD] border-[var(--accent)]"
                  : "text-[#CFC7AE] border-transparent hover:bg-white/5 hover:text-[#EDE7D6]"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-5 border-t border-white/10 text-[12.5px] text-[#A79E86] leading-relaxed">
        ম্যানেজার: {user?.name || "..."}
        <br />
        {somiti?.name || "..."}
      </div>
    </aside>
  );
}

export default Sidebar;