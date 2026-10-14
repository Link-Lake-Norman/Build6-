import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b p-4">
      <div className="flex gap-6">
        <Link href="/">
          Home
        </Link>

        <Link href="/assessment" className="font-bold">FREE ASSESSMENT</Link>

        <Link href="/academy">
          Academy
        </Link>

        <Link href="/dashboard">
          Dashboard
        </Link>

        <Link href="/student-portal">
          Student Portal
        </Link>

        <Link href="/employer-hub">
          Employer Hub
        </Link>
      </div>
    </nav>
  );
}