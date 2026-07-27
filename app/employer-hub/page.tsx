import Link from "next/link";

import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";


export default function EmployerHubPage() {

  return (

    <main>

      <SectionHeader
        title="Future Ready™ Employer Hub"
        description="Connect employers with emerging talent, career pathways, and workforce development."
      />


      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
          marginTop: "32px",
        }}
      >


        <Link href="/employer-hub/manage-opportunities">

          <Card>

            <Badge status="Active" />

            <h2>
              Manage Opportunities
            </h2>

            <p>
              Create and manage internships, career experiences,
              and opportunities.
            </p>

          </Card>

        </Link>



        <Link href="/employer-hub/talent-matching">

          <Card>

            <Badge status="Matching Engine" />

            <h2>
              Talent Matching
            </h2>

            <p>
              Connect student skills and interests with employer needs.
            </p>

          </Card>

        </Link>



        <Link href="/impact-roi">

          <Card>

            <Badge status="Analytics" />

            <h2>
              Employer Impact
            </h2>

            <p>
              Measure student engagement and workforce impact.
            </p>

          </Card>

        </Link>


      </section>


    </main>

  );

}
