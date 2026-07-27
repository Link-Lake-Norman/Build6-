export default function LicensingPage() {

  const licenses = [
    {
      partner: "Ambassador School Pilot",
      status: "Active",
      training: "Complete",
      renewal: "2027",
    },
    {
      partner: "Community Partner Network",
      status: "Pending",
      training: "In Progress",
      renewal: "2027",
    },
    {
      partner: "Employer Workforce Partner",
      status: "Active",
      training: "Complete",
      renewal: "2027",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Licensing Dashboard
        </h1>

        <p>
          Manage licensed partners, implementation progress,
          and program delivery.
        </p>

      </section>


      <section className="journey-grid">

        {licenses.map((license) => (

          <article
            className="journey-card"
            key={license.partner}
          >

            <h2>
              {license.partner}
            </h2>

            <p>
              Status: {license.status}
            </p>

            <p>
              Training: {license.training}
            </p>

            <p>
              Renewal: {license.renewal}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
