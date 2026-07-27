import { students } from "@/content/students";
import { readiness } from "@/content/readiness";
import { matches } from "@/content/matches";

export default function PartnerStudentsPage() {

  return (
    <main>

      <h1>
        Future Ready™ Partner Student Engagement
      </h1>

      <p>
        View student participation, readiness progress, and career alignment.
      </p>


      <section>

        <h2>
          Students
        </h2>

        {students.map((student) => (

          <article key={student.id}>

            <h3>
              {student.name}
            </h3>

            <p>
              Grade: {student.grade}
            </p>

            <p>
              Readiness Score: {student.readinessScore}
            </p>


            <h4>
              Interests
            </h4>

            {student.interests.map((interest) => (

              <p key={interest}>
                {interest}
              </p>

            ))}


            <h4>
              Skills
            </h4>

            {student.skills.map((skill) => (

              <p key={skill}>
                {skill}
              </p>

            ))}


            <h4>
              Experiences
            </h4>

            {student.experiences.map((experience) => (

              <p key={experience}>
                {experience}
              </p>

            ))}

          </article>

        ))}

      </section>


      <section>

        <h2>
          Readiness Progress
        </h2>

        {Object.entries(readiness).map(([key, value]) => (

          <p key={key}>
            {key}: {String(value)}
          </p>

        ))}

      </section>


      <section>

        <h2>
          Career Matches
        </h2>

        <p>
          Active Matches: {matches.length}
        </p>

      </section>

    </main>
  );
}
