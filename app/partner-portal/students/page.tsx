import { getStudents } from "@/lib/data/students";
import { readiness } from "@/content/readiness";
import { matches } from "@/content/matches";

export default async function PartnerStudentsPage() {
  const students = await getStudents();

  return (
    <main>
      <h1>Future Ready™ Partner Student Engagement</h1>

      <p>
        View student participation, readiness progress, and career alignment.
      </p>

      <section>
        <h2>Students</h2>

        {students.map((student) => (
          <article key={student.id}>
            <h3>{student.name}</h3>

            {student.grade && (
              <p>
                Grade: {student.grade}
              </p>
            )}

            {student.readinessScore !== null &&
              student.readinessScore !== undefined && (
                <p>
                  Readiness Score: {student.readinessScore}
                </p>
              )}

            <h4>Interests</h4>

            {student.interests.length > 0 ? (
              student.interests.map((interest) => (
                <p key={interest}>{interest}</p>
              ))
            ) : (
              <p>No interests recorded.</p>
            )}

            <h4>Skills</h4>

            {student.skills.length > 0 ? (
              student.skills.map((skill) => (
                <p key={skill}>{skill}</p>
              ))
            ) : (
              <p>No skills recorded.</p>
            )}
          </article>
        ))}
      </section>

      <section>
        <h2>Readiness Progress</h2>

        {Object.entries(readiness).map(([key, value]) => (
          <p key={key}>
            {key}: {String(value)}
          </p>
        ))}
      </section>

      <section>
        <h2>Career Matches</h2>

        <p>
          Active Matches: {matches.length}
        </p>
      </section>
    </main>
  );
}
