import Link from "next/link";

export default function EmployerHubPage() {

  return (
    <main>

      <h1>
        Future Ready™ Employer Hub
      </h1>

      <p>
        Connect employers with emerging talent, career pathways, and workforce development.
      </p>


      <section>

        <article>
          <h2>
            Manage Opportunities
          </h2>

          <p>
            Create and manage internships, career experiences, and opportunities.
          </p>

          <Link href="/employer-hub/manage-opportunities">
            Manage Opportunities
          </Link>
        </article>


        <article>
          <h2>
            Talent Matching
          </h2>

          <p>
            Connect student skills and interests with employer needs.
          </p>

          <Link href="/employer-hub/talent-matching">
            View Talent Matches
          </Link>
        </article>


        <article>
          <h2>
            Employer Impact
          </h2>

          <p>
            Measure student engagement and workforce impact.
          </p>

          <Link href="/impact-roi">
            View Impact
          </Link>
        </article>

      </section>

    </main>
  );
}
