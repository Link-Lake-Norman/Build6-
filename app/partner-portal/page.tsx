import Link from "next/link";

import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";


export default function PartnerPortalPage() {

  return (

    <main>

      <SectionHeader
        title="BUILD6™ Partner Portal"
        description="Connect programs, students, employers, and community impact."
      />


      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
          marginTop: "32px",
        }}
      >


        <Link href="/partner-portal/home">

          <Card>

            <Badge status="Partner" />

            <h2>
              Partner Home
            </h2>

            <p>
              Access your partner dashboard and platform resources.
            </p>

          </Card>

        </Link>



        <Link href="/partner-portal/programs">

          <Card>

            <Badge status="Programs" />

            <h2>
              Programs
            </h2>

            <p>
              Manage curriculum pathways and learning experiences.
            </p>

          </Card>

        </Link>



        <Link href="/partner-portal/students">

          <Card>

            <Badge status="Students" />

            <h2>
              Students
            </h2>

            <p>
              Review student readiness and engagement.
            </p>

          </Card>

        </Link>



        <Link href="/partner-portal/employers">

          <Card>

            <Badge status="Employers" />

            <h2>
              Employers
            </h2>

            <p>
              Explore employer connections and opportunities.
            </p>

          </Card>

        </Link>



        <Link href="/partner-portal/analytics">

          <Card>

            <Badge status="Analytics" />

            <h2>
              Impact Analytics
            </h2>

            <p>
              Measure BUILD6™ outcomes.
            </p>

          </Card>

        </Link>


      </section>


    </main>

  );

}
