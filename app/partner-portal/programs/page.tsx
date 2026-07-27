import { curriculum } from "@/content/curriculum";
import { lessons } from "@/content/lessons";
import { roles } from "@/content/roles";

export default function PartnerProgramsPage() {

  return (
    <main>

      <h1>
        Future Ready™ Partner Programs
      </h1>

      <p>
        Explore career readiness pathways, learning experiences, and future roles.
      </p>


      <section>

        <h2>
          Curriculum Pathways
        </h2>

        {curriculum.map((item, index) => (

          <article key={index}>

            <h3>
              {item.phase}
            </h3>

            <p>
              {item.weeks}
            </p>

            <p>
              {item.description}
            </p>


            <h4>
              Modules
            </h4>

            {item.modules.map((module) => (

              <p key={module}>
                {module}
              </p>

            ))}

          </article>

        ))}

      </section>


      <section>

        <h2>
          Learning Experiences
        </h2>

        <p>
          Total Lessons: {lessons.length}
        </p>

      </section>


      <section>

        <h2>
          Career Roles
        </h2>

        <p>
          Available Roles: {roles.length}
        </p>

      </section>


    </main>
  );
}
