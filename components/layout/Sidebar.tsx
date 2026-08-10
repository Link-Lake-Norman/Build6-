import Link from "next/link";

export default function Sidebar() {

  return (

    <aside className="sidebar">

      <h2>
        Future Ready™
      </h2>


      <p className="text-sm">
        Workforce Ecosystem
      </p>


      <nav className="mt-6 space-y-3">


        <Link
          href="/ambassador"
          className="block rounded-lg border p-3 hover:bg-gray-100"
        >
          Dashboard
        </Link>



        <Link
          href="/ambassador/student"
          className="block rounded-lg border p-3 hover:bg-gray-100"
        >
          Students
        </Link>




        <Link
          href="/ambassador/student-portal/ambassador-student-001"
          className="block rounded-lg border p-3 hover:bg-gray-100"
        >
          Student Portal
        </Link>




        <Link
          href="/ambassador/student-passport/ambassador-student-001"
          className="block rounded-lg border p-3 hover:bg-gray-100"
        >
          Student Passport
        </Link>




        <Link
          href="/ambassador/facilitator"
          className="block rounded-lg border p-3 hover:bg-gray-100"
        >
          Facilitator
        </Link>




        <Link
          href="/ambassador/employer"
          className="block rounded-lg border p-3 hover:bg-gray-100"
        >
          Employer Portal
        </Link>




        <Link
          href="/ambassador/partner"
          className="block rounded-lg border p-3 hover:bg-gray-100"
        >
          Partner Portal
        </Link>




        <Link
          href="/ambassador/admin"
          className="block rounded-lg border p-3 hover:bg-gray-100"
        >
          Admin Command Center
        </Link>



      </nav>


    </aside>

  );

}