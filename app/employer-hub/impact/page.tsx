import { impact } from "@/content/impact";
import { employers } from "@/content/employers";
import { matches } from "@/content/matches";

export default function EmployerImpactPage() {

  return (
    <main>

      <h1>
        Employer Impact Dashboard
      </h1>

      <p>
        Measure the workforce development impact of your Future Ready™ partnership.
      </p>


      <section>

        <h2>
          Partnership Overview
        </h2>

        <p>
          Employer Partners: {employers.length}
        </p>

        <p>
          Active Talent Matches: {matches.length}
        </p>

      </section>


      <section>

        <h2>
          Ecosystem Impact
        </h2>

        <p>
          Students Served: {impact.studentsServed}
        </p>

        <p>
          Opportunities Created: {impact.opportunitiesCreated}
        </p>

        <p>
          Experiences Completed: {impact.experiencesCompleted}
        </p>

        <p>
          Readiness Growth: {impact.readinessGrowth}%
        </p>

      </section>


      <section>

        <h2>
          Employer Value
        </h2>

        <p>
          Future Ready™ helps employers build talent pipelines, support career exploration, and create measurable community workforce impact.
        </p>

      </section>

    </main>
  );
}
