import { partners } from "@/content/partners";
import { impact } from "@/content/impact";

export default function PartnerAnalyticsPage() {

  const totalStudents = partners.reduce(
    (total, partner) =>
      total + partner.studentsSupported,
    0
  );

  return (
    <main>

      <h1>
        Future Ready™ Partner Impact Analytics
      </h1>


      <section>

        <h2>
          Partner Overview
        </h2>

        <p>
          Active Partners: {partners.length}
        </p>

        <p>
          Students Supported Through Partners: {totalStudents}
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
          Employer Partners: {impact.employerPartners}
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

    </main>
  );
}
