import Link from "next/link";
import { readiness } from "../../content/readiness";

export default function StudentPortalPage() {
  return (
    <main>
      <section className="hero">
        <h1>
          BUILD6™ Student Portal
        </h1>

        <p>
          Discover your strengths, build skills, and connect your future.
        </p>

        <p>
          Your readiness score: {readiness.student.readinessScore}%
        </p>

        <Link href="/dashboard">
          Go to Dashboard
        </Link>
      </section>
    </main>
  );
}
