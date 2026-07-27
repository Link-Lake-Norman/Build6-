import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";


export default function AdminPage() {

  const metrics = [
    {
      title: "Students",
      value: "20",
      description: "Active Future Ready™ participants",
    },
    {
      title: "Employers",
      value: "12",
      description: "Employer partners connected",
    },
    {
      title: "Opportunities",
      value: "8",
      description: "Career experiences available",
    },
    {
      title: "Experiences",
      value: "15",
      description: "Completed and active experiences",
    },
  ];


  return (

    <main>

      <SectionHeader
        title="Future Ready™ Admin Hub"
        description="Manage students, employers, experiences, and workforce readiness data."
      />


      <div
        style={{
          marginTop: "16px",
        }}
      >

        <Badge status="Governance Dashboard" />

      </div>


      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
          marginTop: "32px",
        }}
      >

        {metrics.map((metric) => (

          <StatCard
            key={metric.title}
            label={metric.title}
            value={metric.value}
          />

        ))}

      </section>


      <section
        style={{
          marginTop: "40px",
        }}
      >

        <h2>
          Platform Governance
        </h2>


        <p>
          Future Ready™ administrators oversee users,
          organizations, programs, permissions, and
          platform operations.
        </p>


      </section>


    </main>

  );

}
