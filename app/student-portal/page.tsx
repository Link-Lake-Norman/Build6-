import Link from "next/link";

import { readiness } from "@/content/readiness";

import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";


export default function StudentPortalPage() {

  return (

    <main>


      <SectionHeader
        title="Future Ready™ Student Portal"
        description="Discover your strengths, build skills, and connect your future."
      />


      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "32px",
        }}
      >

        <StatCard
          label="Readiness Score"
          value={`${readiness.student.readinessScore}%`}
        />


        <StatCard
          label="Skills Tracked"
          value={readiness.skills.length}
        />


        <StatCard
          label="Career Interests"
          value={readiness.student.careerInterests.length}
        />


      </section>


      <section style={{ marginTop: "40px" }}>

        <SectionHeader
          title="Career Identity"
          description="Your interests and strengths help shape your future pathway."
        />


        <Card>

          {readiness.student.careerInterests.map((interest) => (

            <div key={interest}>

              <Badge status={interest} />

            </div>

          ))}

        </Card>


      </section>



      <section style={{ marginTop: "40px" }}>

        <SectionHeader
          title="Your Future Ready™ Journey"
          description="Explore the next steps in your growth pathway."
        />


        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >


          <Link href="/student-portal/profile">

            <Card>

              <h3>
                My Profile
              </h3>

              <p>
                View your strengths, interests, and career identity.
              </p>

            </Card>

          </Link>



          <Link href="/student-portal/opportunities">

            <Card>

              <h3>
                Opportunities
              </h3>

              <p>
                Explore internships, mentorships, and experiences.
              </p>

            </Card>

          </Link>



          <Card>

            <h3>
              Skills Growth
            </h3>

            <p>
              Continue building communication, leadership,
              teamwork, and professional skills.
            </p>

          </Card>


        </section>


      </section>


    </main>

  );
}
