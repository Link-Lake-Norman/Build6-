import Link from "next/link";

const links = [
  { href: "/ambassador", label: "Ambassador Home" },
  { href: "/ambassador/facilitator", label: "Facilitator" },
  { href: "/ambassador/facilitator/attendance", label: "Attendance" },
  { href: "/ambassador/facilitator/students", label: "Students" },
  { href: "/ambassador/operations", label: "Operations" },
  { href: "/ambassador/professionals", label: "Professionals" },
  { href: "/ambassador/session-planner", label: "Session Planner" },
  { href: "/ambassador/lesson-builder", label: "Lesson Builder" },
  { href: "/ambassador/messages", label: "Messages" },
  { href: "/ambassador/projects", label: "Project Studio" },
  { href: "/ambassador/admin/command-center", label: "Admin Center" },
  {
    href: "/ambassador/student-portal/ambassador-student-001",
    label: "Student Portal",
  },
];

export default function PlatformHeader() {
  return (
    <>
      <header className="border-b-4 border-[#F2B705] bg-[#0D1B3D] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/ambassador">
            <p className="text-2xl font-black">Future Ready™</p>
            <p className="mt-1 text-sm text-slate-300">
              Discover Purpose. Build Skills. Launch Your Future.
            </p>
          </Link>

          <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F2B705]">
              Ambassador Christian School
            </p>
            <p className="mt-1 font-semibold">
              Future Ready™ Pilot Program
            </p>
          </div>
        </div>
      </header>

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-6 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-[#F2B705] hover:bg-[#FFF9E6]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
