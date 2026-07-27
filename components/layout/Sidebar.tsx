import Link from "next/link";

export default function Sidebar() {

  return (
    <aside className="sidebar">

      <h2>
        Future Ready™
      </h2>

      <nav>

        <Link href="/dashboard">
          Dashboard
        </Link>

        <Link href="/student-portal">
          Students
        </Link>

        <Link href="/employer-hub">
          Employers
        </Link>

        <Link href="/partner-portal">
          Partners
        </Link>

        <Link href="/admin">
          Admin
        </Link>

      </nav>

    </aside>
  );
}
