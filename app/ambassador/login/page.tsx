import Link from "next/link";

const roles = [
  {
    id: "student",
    name: "Student",
    description:
      "Access your Future Ready™ student journey, portfolio, and opportunities.",
    dashboard: "/student-portal",
  },

  {
    id: "facilitator",
    name: "Facilitator",
    description:
      "Manage cohorts, lessons, student progress, and readiness.",
    dashboard: "/ambassador/facilitator",
  },

  {
    id: "employer",
    name: "Employer",
    description:
      "Connect with Future Ready™ talent and internship opportunities.",
    dashboard: "/employer-hub",
  },

  {
    id: "partner",
    name: "Partner",
    description:
      "Track programs, outcomes, and workforce impact.",
    dashboard: "/partner-portal",
  },

  {
    id: "admin",
    name: "Admin",
    description:
      "Manage users, organizations, analytics, and platform operations.",
    dashboard: "/super-admin",
  },
];


export default function AmbassadorLoginPage() {

  return (

    <main className="p-8 space-y-8">


      <section>

        <h1 className="text-4xl font-bold">
          Future Ready™ Login
        </h1>

        <p className="mt-3 text-lg">
          Select your role to enter the platform.
        </p>

      </section>



      <section className="grid md:grid-cols-3 gap-6">


        {roles.map((role) => (

          <div
            key={role.id}
            className="border rounded-xl p-6"
          >

            <h2 className="text-2xl font-bold">
              {role.name}
            </h2>


            <p className="mt-3">
              {role.description}
            </p>


            <Link
              href={role.dashboard}
              className="inline-block mt-5 rounded-lg bg-blue-600 px-5 py-3 text-white"
            >

              Enter {role.name}

            </Link>


          </div>

        ))}


      </section>


    </main>

  );
}