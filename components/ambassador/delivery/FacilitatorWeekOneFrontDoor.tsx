import Link from "next/link";

import ResourcePreviewActions from "./ResourcePreviewActions";
import WeekRhythmStrip from "./WeekRhythmStrip";
import { weekOneMainDelivery } from "@/content/ambassador/week-01-main-delivery";

export default function FacilitatorWeekOneFrontDoor() {
  return (
    <section
      style={{
        marginTop: 24,
        border: "1px solid #DDE3EC",
        borderRadius: 26,
        background: "#F8FAFC",
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 18,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              color: "#4B2265",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 1.5,
            }}
          >
            RUN THIS WEEK
          </div>

          <h2
            style={{
              margin: "6px 0 0",
              color: "#0D1B3D",
              fontSize: 30,
            }}
          >
            Week 1 · {weekOneMainDelivery.title}
          </h2>

          <p
            style={{
              maxWidth: 820,
              color: "#667085",
              lineHeight: 1.65,
              marginBottom: 0,
            }}
          >
            {weekOneMainDelivery.weeklyGoal}
          </p>
        </div>

        <Link
          href="/ambassador/curriculum"
          style={{
            textDecoration: "none",
            border: "1px solid #0D1B3D",
            color: "#0D1B3D",
            padding: "11px 15px",
            borderRadius: 11,
            fontWeight: 900,
            fontSize: 12,
          }}
        >
          Full Curriculum + Resources →
        </Link>
      </div>

      <div style={{ marginTop: 20 }}>
        <WeekRhythmStrip />
      </div>

      <div
        style={{
          marginTop: 22,
          borderRadius: 22,
          padding: 22,
          background: "white",
          border: "2px solid #F2B705",
        }}
      >
        <div
          style={{
            color: "#725500",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 1.4,
          }}
        >
          MONDAY · START IT
        </div>

        <h3
          style={{
            margin: "6px 0",
            color: "#0D1B3D",
            fontSize: 25,
          }}
        >
          {weekOneMainDelivery.capstoneTitle} · My Story Brain Map
        </h3>

        <p
          style={{
            color: "#475467",
            lineHeight: 1.6,
            maxWidth: 900,
          }}
        >
          <strong>Today's Goal:</strong> {weekOneMainDelivery.monday.goal}
        </p>

        <div
          style={{
            display: "grid",
            gap: 10,
            marginTop: 18,
          }}
        >
          {weekOneMainDelivery.monday.agenda.map((item) => (
            <div
              key={item.time}
              style={{
                display: "grid",
                gridTemplateColumns: "70px minmax(120px,180px) 1fr",
                gap: 12,
                padding: 13,
                borderRadius: 13,
                background: "#F8FAFC",
                alignItems: "start",
              }}
            >
              <strong style={{ color: "#4B2265" }}>{item.time}</strong>

              <strong style={{ color: "#0D1B3D" }}>{item.title}</strong>

              <span
                style={{
                  color: "#667085",
                  lineHeight: 1.5,
                }}
              >
                {item.detail}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 16,
            marginTop: 20,
          }}
        >
          <div
            style={{
              border: "1px solid #DDE3EC",
              borderRadius: 16,
              padding: 17,
            }}
          >
            <div
              style={{
                color: "#0D1B3D",
                fontWeight: 900,
                marginBottom: 10,
              }}
            >
              REQUIRED · KEEP US ALIGNED
            </div>

            {weekOneMainDelivery.monday.required.map((item) => (
              <div
                key={item}
                style={{
                  color: "#475467",
                  lineHeight: 1.5,
                  marginTop: 7,
                  fontSize: 13,
                }}
              >
                ☐ {item}
              </div>
            ))}
          </div>

          <div
            style={{
              border: "1px solid #D8C4E6",
              borderRadius: 16,
              padding: 17,
              background: "#FBF8FD",
            }}
          >
            <div
              style={{
                color: "#4B2265",
                fontWeight: 900,
                marginBottom: 10,
              }}
            >
              COACH FLEX
            </div>

            <p
              style={{
                color: "#5B6472",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {weekOneMainDelivery.monday.coachFlex}
            </p>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div
            style={{
              fontWeight: 900,
              color: "#0D1B3D",
              marginBottom: 10,
            }}
          >
            TODAY'S MATERIALS
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 10,
            }}
          >
            <ResourcePreviewActions
              label="Capstone + Brain Map Facilitator Preview"
              previewHref="/ambassador/capstone-guide"
            />

            <ResourcePreviewActions
              label="Week 1 Student Workbook"
              previewHref="/api/ambassador/download/01/Future-Ready-Week-01-Student-Workbook.pdf"
              downloadHref="/api/ambassador/download/01/Future-Ready-Week-01-Student-Workbook.pdf?download=1"
            />

            <ResourcePreviewActions
              label="Week 1 Facilitator Guide"
              previewHref="/api/ambassador/download/01/Future-Ready-Week-01-Facilitator-Guide.pdf"
              downloadHref="/api/ambassador/download/01/Future-Ready-Week-01-Facilitator-Guide.pdf?download=1"
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 20,
          }}
        >
          <Link
            href="/ambassador/facilitator/attendance"
            style={{
              textDecoration: "none",
              background: "#0D1B3D",
              color: "white",
              padding: "11px 15px",
              borderRadius: 10,
              fontWeight: 900,
              fontSize: 12,
            }}
          >
            Attendance
          </Link>

          <Link
            href="/ambassador/messages"
            style={{
              textDecoration: "none",
              background: "#4B2265",
              color: "white",
              padding: "11px 15px",
              borderRadius: 10,
              fontWeight: 900,
              fontSize: 12,
            }}
          >
            Messages
          </Link>

          <Link
            href="/ambassador/planner"
            style={{
              textDecoration: "none",
              border: "1px solid #0D1B3D",
              color: "#0D1B3D",
              padding: "11px 15px",
              borderRadius: 10,
              fontWeight: 900,
              fontSize: 12,
            }}
          >
            More Week 1 Resources
          </Link>
        </div>
      </div>
    </section>
  );
}
