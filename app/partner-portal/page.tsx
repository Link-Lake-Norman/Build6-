export default function PartnerPortalPage() {

  const partners = [
    {
      title: "School Partners",
      description:
        "Manage student programs, cohorts, schedules, and curriculum delivery.",
    },
    {
      title: "Employer Partners",
      description:
        "Connect organizations with students through experiences and career pathways.",
    },
    {
      title: "Community Partners",
      description:
        "Coordinate mentors, resources, and workforce development support.",
    },
    {
      title: "Licensed Partners",
      description:
        "Access implementation resources, training, and Future Ready™ tools.",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Partner Portal
        </h1>

        <p>
          Connect schools, employers, and communities
          to build future-ready talent pipelines.
        </p>

      </section>


      <section className="journey-grid">

        {partners.map((partner) => (

          <article
            className="journey-card"
            key={partner.title}
          >

            <h2>
              {partner.title}
            </h2>

            <p>
              {partner.description}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
