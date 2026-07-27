"use client";

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="navigation">

      <Link href="/">
        Future Ready™
      </Link>

      <div>
        <h3>Student</h3>

        <Link href="/student-dashboard">
          Dashboard
        </Link>

        <Link href="/student-portal/profile">
          Profile
        </Link>

        <Link href="/student-portal/career-match">
          Career Match
        </Link>

        <Link href="/student-portal/opportunity-match">
          Opportunity Match
        </Link>
      </div>


      <div>
        <h3>Employer</h3>

        <Link href="/employer-dashboard">
          Dashboard
        </Link>

        <Link href="/employer-hub/manage-opportunities">
          Opportunities
        </Link>

        <Link href="/employer-hub/talent-matching">
          Talent Matching
        </Link>

        <Link href="/impact-roi">
          Impact ROI
        </Link>
      </div>


      <div>
        <h3>Admin</h3>

        <Link href="/super-admin">
          Command Center
        </Link>
      </div>

    </nav>
  );
}
