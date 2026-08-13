import Link from "next/link";

const links = [
  {
    href: "/ambassador",
    label: "Dashboard",
  },
  {
    href: "/ambassador/admin",
    label: "Organization",
  },
  {
    href: "/ambassador/facilitator",
    label: "Facilitator",
  },
  {
    href: "/ambassador/student",
    label: "Student Portal",
  },
  {
    href: "/ambassador/student",
    label: "Student Passport",
  },
  {
    href: "/ambassador/curriculum/1",
    label: "Curriculum",
  },
  {
    href: "/ambassador/employers",
    label: "Employer Portal",
  },
];

export default function Navigation() {
  return (
    <nav className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}