import { curriculum } from "@/content/curriculum";

export default function StudentPassportPage() {

  const completedLessons = curriculum.slice(0, 5);

  const skills = completedLessons.flatMap(
    (lesson) => lesson.skillsEarned
  );

  const badges = completedLessons.map(
    (lesson) => lesson.badgeEarned
  );


  return (

    <main className="p-8">


      <section className="mb-8">

        <h1 className="text-4xl font-bold">
          Future Ready™ Student Passport
        </h1>

        <p className="mt-3 text-lg">
          A digital record of skills, experiences, and career readiness.
        </p>

      </section>



      <section className="grid md:grid-cols-3 gap-6 mb-8">


        <div className="border rounded-xl p-6">

          <h2 className="font-bold text-xl">
            Student
          </h2>

          <p className="mt-3">
            Future Ready Student
          </p>

        </div>


        <div className="border rounded-xl p-6">

          <h2 className="font-bold text-xl">
            Readiness Score
          </h2>

          <p className="text-4xl mt-3">
            85%
          </p>

        </div>


        <div className="border rounded-xl p-6">

          <h2 className="font-bold text-xl">
            Badges Earned
          </h2>

          <p className="text-4xl mt-3">
            {badges.length}
          </p>

        </div>


      </section>




      <section className="border rounded-xl p-6 mb-8">

        <h2 className="text-2xl font-bold">
          Skills Developed
        </h2>


        <div className="mt-4">

          {skills.map((skill, index) => (

            <p key={index}>
              ✓ {skill}
            </p>

          ))}

        </div>


      </section>





      <section className="border rounded-xl p-6 mb-8">

        <h2 className="text-2xl font-bold">
          Future Ready™ Badges
        </h2>


        <div className="mt-4">

          {badges.map((badge) => (

            <p key={badge}>
              🏆 {badge}
            </p>

          ))}

        </div>


      </section>





      <section className="border rounded-xl p-6">

        <h2 className="text-2xl font-bold">
          Portfolio Evidence
        </h2>


        {completedLessons.map((lesson)=>(

          <div
            key={lesson.week}
            className="mt-4"
          >

            <p className="font-semibold">
              Week {lesson.week}: {lesson.title}
            </p>

            <p>
              {lesson.portfolioEvidence}
            </p>

          </div>

        ))}


      </section>



    </main>

  );
}
