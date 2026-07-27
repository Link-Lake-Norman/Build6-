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
        Explore career readiness programs, curriculum pathways, and learning experiences.
      </p>


      <section>

        <h2>
          Curriculum Pathways
        </h2>

        {curriculum.map((item) => (

          <article key={item.id}>

            <h3>
              {item.title}
            </h3>

            <p>
              {item.description}
            </p>

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

        {lessons.slice(0, 5).map((lesson) => (

          <article key={lesson.id}>

            <h3>
              {lesson.title}
            </h3>

          </article>

        ))}

      </section>


      <section>

        <h2>
          Career Roles
        </h2>

        <p>
          Available Roles: {roles.length}
        </p>

        {roles.map((role) => (

          <article key={role.id}>

            <h3>
              {role.title}
            </h3>

          </article>

        ))}

      </section>


    </main>
  );
}
