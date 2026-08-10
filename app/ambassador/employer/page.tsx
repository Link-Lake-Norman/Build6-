import Link from "next/link";
import { ambassadorStudents } from "@/content/ambassador-students";
import { opportunities } from "@/content/opportunities";
import { matches } from "@/content/matches";


export default function EmployerPortal() {


  const studentsReady =
    ambassadorStudents.filter(
      (student) => student.internshipReady
    );



  return (

    <main className="p-8 space-y-8">


      <section>

        <h1 className="text-4xl font-bold">
          Future Ready™ Employer Portal
        </h1>


        <p className="mt-3 text-lg">
          Talent Pipeline, Student Discovery, and Workforce Connection Ecosystem
        </p>


      </section>






      <section className="grid md:grid-cols-4 gap-6">


        <div className="border rounded-xl p-6">

          <h2 className="font-bold">
            Students
          </h2>

          <p className="text-4xl font-bold mt-3">
            {ambassadorStudents.length}
          </p>

        </div>




        <div className="border rounded-xl p-6">

          <h2 className="font-bold">
            Internship Ready
          </h2>

          <p className="text-4xl font-bold mt-3">
            {studentsReady.length}
          </p>

        </div>




        <div className="border rounded-xl p-6">

          <h2 className="font-bold">
            Career Opportunities
          </h2>

          <p className="text-4xl font-bold mt-3">
            {opportunities.length}
          </p>

        </div>




        <div className="border rounded-xl p-6">

          <h2 className="font-bold">
            Matches
          </h2>

          <p className="text-4xl font-bold mt-3">
            {matches.length}
          </p>

        </div>


      </section>






      <section className="border rounded-xl p-6">


        <h2 className="text-2xl font-bold">
          Future Ready™ Talent Pool
        </h2>



        {ambassadorStudents.map((student) => (

          <div
            key={student.id}
            className="border rounded-lg p-5 mt-4"
          >


            <h3 className="text-xl font-bold">
              {student.name}
            </h3>



            <p className="mt-2">
              Grade:
              {" "}
              {student.grade}
            </p>



            <p>
              Readiness Score:
              {" "}
              {student.readinessScore}%
            </p>



            <p>
              Status:
              {" "}
              {student.internshipReady
                ? "✅ Internship Ready"
                : "🚀 Building Skills"}
            </p>




            <Link
              href={`/ambassador/student-passport/${student.id}`}
              className="inline-block mt-4 rounded-lg border px-5 py-3 hover:bg-gray-100"
            >
              View Student Passport
            </Link>



          </div>

        ))}


      </section>








      <section className="border rounded-xl p-6">


        <h2 className="text-2xl font-bold">
          Internship & Career Opportunities
        </h2>



        {opportunities.map((opportunity) => (

          <div
            key={opportunity.id}
            className="border rounded-lg p-5 mt-4"
          >


            <h3 className="text-xl font-bold">
              {opportunity.title}
            </h3>



            <p>
              Industry:
              {" "}
              {opportunity.industry}
            </p>



            <p>
              Experience Level:
              {" "}
              {opportunity.experienceLevel}
            </p>



            <p>
              Skills:
              {" "}
              {opportunity.skills.join(", ")}
            </p>



          </div>

        ))}


      </section>







      <section className="border rounded-xl p-6">


        <h2 className="text-2xl font-bold">
          Employer Engagement Workflow
        </h2>



        <ul className="mt-4 space-y-3">

          <li>✓ Review Future Ready™ student talent</li>

          <li>✓ Identify aligned skills and interests</li>

          <li>✓ Create workplace experiences</li>

          <li>✓ Provide mentorship opportunities</li>

          <li>✓ Support career launch pathways</li>


        </ul>


      </section>



    </main>

  );

}