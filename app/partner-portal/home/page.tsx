import Link from "next/link";

export default function PartnerHomePage() {
  return (
    <main>

      <h1>
        Future Ready™ Partner Home
      </h1>

      <p>
        Your connection point for students, programs, employers, and impact.
      </p>


      <section>

        <article>
          <h2>
            Programs
          </h2>

          <p>
            Manage career readiness programs and student experiences.
          </p>

          <Link href="/partner-portal/programs">
            View Programs
          </Link>
        </article>


        <article>
          <h2>
            Student Engagement
          </h2>

          <p>
            Track student participation and progress.
          </p>

          <Link href="/partner-portal/students">
            View Students
          </Link>
        </article>


        <article>
          <h2>
            Employer Connections
          </h2>

          <p>
            Connect students with employer opportunities.
          </p>

          <Link href="/partner-portal/employers">
            View Employers
          </Link>
        </article>


        <article>
          <h2>
            Impact Reporting
          </h2>

          <p>
            Review ecosystem outcomes and measurements.
          </p>

          <Link href="/partner-portal/analytics">
            View Impact
          </Link>
        </article>

      </section>

    </main>
  );
}
