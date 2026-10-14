import { impact } from "@/content/impact";
import { employers } from "@/content/employers";
import { matches } from "@/content/matches";

export default function EmployerImpactPage() {
  return (
    <main>

      <h1>
        BUILD6™ Employer Impact
      </h1>

      <p>
        Measure employer engagement and workforce development outcomes.
      </p>

      <section>

        <h2>
          Platform Impact
        </h2>

        <p>Students Served: {impact.studentsServed}</p>
        <p>Employer Partners: {impact.employersConnected}</p>
        <p>Opportunities Created: {impact.internshipsCreated}</p>
        <p>Experiences Completed: {impact.skillsDeveloped}</p>
        <p>Readiness Growth: {impact.completionRate}%</p>

      </section>

      <section>

        <h2>
          Employer Network
        </h2>

        <p>Total Employer Partners: {employers.length}</p>

      </section>

      <section>

        <h2>
          Talent Matches
        </h2>

        <p>Successful Matches: {matches.length}</p>

      </section>

    </main>
  );
}
