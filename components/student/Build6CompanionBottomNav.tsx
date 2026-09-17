"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  studentId: string;
};

const navItems = [
  {
    key: "today",
    label: "Today",
    suffix: "/companion",
  },
  {
    key: "journal",
    label: "Journal",
    suffix: "/companion/journal",
  },
  {
    key: "work",
    label: "Work",
    suffix: "/assignments",
  },
  {
    key: "identity",
    label: "Who I Am",
    suffix: "/profile",
  },
  {
    key: "story",
    label: "My Story",
    suffix: "/capstone",
  },
];

export default function Build6CompanionBottomNav({
  studentId,
}: Props) {
  const pathname = usePathname();

  const base = `/ambassador/student-portal/${studentId}`;

  return (
    <nav
      aria-label="BUILD6 Companion navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.10)] backdrop-blur md:left-1/2 md:max-w-3xl md:-translate-x-1/2 md:rounded-t-2xl md:border-x"
    >
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const href = `${base}${item.suffix}`;

          const exactToday =
            item.key === "today" &&
            pathname === `${base}/companion`;

          const active =
            exactToday ||
            (item.key !== "today" &&
              pathname.startsWith(href));

          return (
            <Link
              key={item.key}
              href={href}
              className={
                active
                  ? "rounded-xl bg-[#0D1B3D] px-1 py-2 text-center text-[11px] font-black text-white"
                  : "rounded-xl px-1 py-2 text-center text-[11px] font-black text-slate-500 hover:bg-slate-100"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
