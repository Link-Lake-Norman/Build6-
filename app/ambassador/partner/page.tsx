import Link from "next/link";
import { partners } from "@/content/partners";
import { curriculum } from "@/content/curriculum";
import { progress } from "@/content/progress";
import { employers } from "@/content/employers";


export default function PartnerPortal() {


  const totalStudents = progress.length;


  const averageCompletion = Math.round(
    progress.reduce(
      (total, student) =>
        total + student.progressPercent,
      0
    ) / progress.length
  );


  const badgesEarned =
    progress.reduce(
      (total, student) =>
        total + student.badges.length,
      0
    );



  const reflectionsCompleted =
    progress.filter(
      (student) =>
        student.reflectionSubmitted
    ).length;



  return (

    <main className="p-8 space-y-8">


      <section>

        <h1 className="text-4xl font-bold">
          BUILD6™ Partner Portal
        </h1>


        <p className="mt-3 text-lg">
          Organization Engagement & Workforce Impact Dashboard
        </p>


      </section>






      <section className="grid md:grid-cols-4 gap-6">


        <div className="border rounded-xl p-6">

          <h2 className="font-bold">
            Active Cohorts
          </h2>

          <p className="text-4xl font-bold mt-3">
            1
          </p>

        </div>





        <div className="border rounded-xl p-6">

          <h2 className="font-bold">
            Students
          </h2>

          <p className="text-4xl font-bold mt-3">
            {totalStudents}
          </p>

        </div>





        <div className="border rounded-xl p-6">

          <h2 className="font-bold">
            Employer Connections
          </h2>

          <p className="text-4xl font-bold mt-3">
            {employers.length}
          </p>

        </div>





        <div className="border rounded-xl p-6">

          <h2 className="font-bold">
            Completion
          </h2>

          <p className="text-4xl font-bold mt-3">
            {averageCompletion}%
          </p>

        </div>


      </section>








      <section className="border rounded-xl p-6">


        <h2 className="text-2xl font-bold">
          Partner Organization Overview
        </h2>


        <div className="mt-5 space-y-3">


          <p>
            ✓ Curriculum:
            {" "}
            {curriculum.length} weeks loaded
          </p>



          <p>
            ✓ Students:
            {" "}
            {totalStudents}
          </p>



          <p>
            ✓ Reflections Completed:
            {" "}
            {reflectionsCompleted}
          </p>



          <p>
            ✓ Badges Earned:
            {" "}
            {badgesEarned}
          </p>



          <p>
            ✓ Partner Organizations:
            {" "}
            {partners.length}
          </p>


        </div>


      </section>








      <section className="border rounded-xl p-6">


        <h2 className="text-2xl font-bold">
          Student Cohort Management
        </h2>



        <p className="mt-3">
          Review student progress, readiness, portfolios, and career pathways.
        </p>



        <Link
          href="/ambassador/student"
          className="inline-block mt-5 rounded-lg border px-5 py-3 hover:bg-gray-100"
        >
          View Student Cohort
        </Link>


      </section>








      <section className="border rounded-xl p-6">


        <h2 className="text-2xl font-bold">
          Employer Ecosystem
        </h2>



        <p className="mt-3">
          Connect students with employers, mentors, internships, and workplace experiences.
        </p>



        <Link
          href="/ambassador/employer"
          className="inline-block mt-5 rounded-lg border px-5 py-3 hover:bg-gray-100"
        >
          Open Employer Portal
        </Link>


      </section>








      <section className="border rounded-xl p-6">


        <h2 className="text-2xl font-bold">
          BUILD6™ Impact Dashboard
        </h2>


        <ul className="mt-4 space-y-3">

          <li>
            ✓ Skills Developed
          </li>

          <li>
            ✓ Career Exploration Completed
          </li>

          <li>
            ✓ Employer Connections Created
          </li>

          <li>
            ✓ Internship Opportunities Generated
          </li>

          <li>
            ✓ Student Portfolios Built
          </li>

        </ul>


      </section>




    </main>

  );

}