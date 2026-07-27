"use client";

import { partners } from "@/content/partners";

export default function PartnerPortal() {

  return (
    <main>

      <section>
        <h1>
          Future Ready™ Partner Portal
        </h1>

        <p>
          Manage partnerships, programs, student engagement, and impact.
        </p>
      </section>


      <section>

        {partners.map((partner) => (

          <article key={partner.id}>

            <h2>
              {partner.name}
            </h2>

            <p>
              Partner Type: {partner.type}
            </p>

            <p>
              Students Supported: {partner.studentsSupported}
            </p>

            <p>
              Status: {partner.status}
            </p>


            <h3>
              Programs
            </h3>

            {partner.programs.map((program) => (

              <p key={program}>
                {program}
              </p>

            ))}

          </article>

        ))}

      </section>

    </main>
  );
}
