"use client";

import Link from "next/link";
import { roles } from "../../content/roles";

export default function DashboardPage() {

  return (
    <main>

      <section className="hero">

        <h1>
          BUILD6™ Platform Dashboard
        </h1>

        <p>
          Choose your role and access your BUILD6 ecosystem.
        </p>

      </section>


      <section className="journey-grid">

        {roles.map((role) => (

          <article
            className="journey-card"
            key={role.id}
          >

            <h2>
              {role.name}
            </h2>

            <p>
              Access your platform tools:
            </p>


            {role.features.map((feature) => (

              <p key={feature}>
                {feature}
              </p>

            ))}


            <Link href={role.dashboard}>
              Open {role.name} Dashboard
            </Link>

          </article>

        ))}

      </section>

    </main>
  );
}
