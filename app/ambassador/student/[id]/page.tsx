import { ambassadorStudents } from "@/content/ambassador-students";
import { progress } from "@/content/progress";
import { reflections } from "@/content/reflections";
import { portfolio } from "@/content/portfolio";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;


  const student = ambassadorStudents.find(
    (item) => item.id === id
  );


  if (!student) {
    return (
      <main>
        <h1>
          Student Not Found
        </h1>

        <p>
          Looking for: {id}
        </p>
      </main>
    );
  }


  const studentProgress = progress.find(
    (item) => item.studentId === student.id
  );


  const studentReflections = reflections.filter(
    (item) => item.studentId === student.id
  );


  const studentPortfolio = portfolio.find(
    (item) => item.studentId === student.id
  );


  return (
    <main>

      <section className="hero">

        <h1>
          {student.name}
        </h1>

        <p>
          Ambassador Christian School
        </p>

        <p>
          Launch Ready™ Professional Skills & Internship Readiness
        </p>

      </section>



      <section className="journey-grid">


        <article className="journey-card">

          <h2>
            Readiness Score
          </h2>

          <h3>
            {student.readinessScore}%
          </h3>

        </article>



        <article className="journey-card">

          <h2>
            Program Progress
          </h2>

          <h3>
            {studentProgress?.progressPercent ?? 0}%
          </h3>

        </article>



        <article className="journey-card">

          <h2>
            Internship Readiness
          </h2>

          <p>
            {studentProgress?.internshipReadiness ?? "Preparing"}
          </p>

        </article>



        <article className="journey-card">

          <h2>
            Skills Earned
          </h2>

          {studentProgress?.skillsEarned.map((skill) => (
            <p key={skill}>
              ✓ {skill}
            </p>
          ))}

        </article>



        <article className="journey-card">

          <h2>
            Badges
          </h2>

          {studentProgress?.badges.map((badge) => (
            <p key={badge}>
              🏅 {badge}
            </p>
          ))}

        </article>



        <article className="journey-card">

          <h2>
            Portfolio Evidence
          </h2>

          {studentPortfolio?.items.map((item) => (
            <p key={item.title}>
              ✓ {item.title} ({item.status})
            </p>
          ))}

        </article>



      </section>



      <section>

        <h2>
          Student Reflections
        </h2>


        {studentReflections.length === 0 && (
          <p>
            No reflections submitted yet.
          </p>
        )}


        {studentReflections.map((reflection) => (

          <article 
            className="journey-card"
            key={reflection.week}
          >

            <h3>
              Week {reflection.week}
            </h3>

            <p>
              {reflection.prompt}
            </p>

            <p>
              "{reflection.response}"
            </p>

            <p>
              Status: {reflection.submitted ? "Submitted" : "Pending"}
            </p>

          </article>

        ))}


      </section>


    </main>
  );
}
