import Link from "next/link";

import { weekOneMainDelivery } from "@/content/ambassador/week-01-main-delivery";

type Props = {
  audience?: "facilitator" | "student";
  studentId?: string;
};

export default function WeekRhythmStrip({
  audience = "facilitator",
  studentId,
}: Props) {
  function getHref(index: number) {
    if (audience === "student" && studentId) {
      const studentBase = `/ambassador/student-portal/${studentId}`;

      return [
        `${studentBase}/capstone`,
        `${studentBase}/lesson/1`,
        `${studentBase}/lesson/1`,
        `${studentBase}/lesson/1`,
        `${studentBase}/life-account/friday`,
      ][index];
    }

    return [
      "/ambassador/capstone-guide",
      "/ambassador/curriculum",
      "/ambassador/planner",
      "/ambassador/planner",
      "/ambassador/facilitator/friday",
    ][index];
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(145px,1fr))",
        gap: 10,
      }}
    >
      {weekOneMainDelivery.rhythm.map((item, index) => {
        const href = getHref(index);

        return (
          <Link
            key={item.day}
            href={href}
            style={{
              display: "block",
              border: index === 0 ? "2px solid #F2B705" : "1px solid #D9E0EA",
              borderRadius: 16,
              padding: 14,
              background: index === 0 ? "#FFF9DF" : "white",
              textDecoration: "none",
              transition: "transform .15s ease, box-shadow .15s ease",
            }}
          >
            <div
              style={{
                color: "#4B2265",
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: 1.2,
              }}
            >
              {item.day.toUpperCase()}
            </div>

            <div
              style={{
                color: "#0D1B3D",
                fontSize: 15,
                fontWeight: 900,
                marginTop: 5,
              }}
            >
              {item.label}
            </div>

            <div
              style={{
                color: "#667085",
                fontSize: 11,
                lineHeight: 1.45,
                marginTop: 4,
              }}
            >
              {item.title}
            </div>

            <div
              style={{
                color: "#0D1B3D",
                fontSize: 10,
                fontWeight: 900,
                marginTop: 10,
              }}
            >
              Open →
            </div>
          </Link>
        );
      })}
    </div>
  );
}
