import Link from "next/link";
import { redirect } from "next/navigation";

import FacilitatorShell from "@/components/facilitator/FacilitatorShell";
import FacilitatorWeekOneFrontDoor from "@/components/ambassador/delivery/FacilitatorWeekOneFrontDoor";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function FacilitatorPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/ambassador/login");
  }

  if (
    session.role !== "FACILITATOR" &&
    session.role !== "SCHOOL_ADMIN" &&
    session.role !== "ORGANIZATION_ADMIN" &&
    session.role !== "SUPER_ADMIN"
  ) {
    redirect("/ambassador");
  }

  let cohortIds: string[] | undefined;

  if (session.role === "FACILITATOR") {
    const facilitator = await prisma.facilitator.findUnique({
      where: {
        userId: session.id,
      },
      select: {
        cohorts: {
          select: {
            cohortId: true,
          },
        },
      },
    });

    cohortIds = facilitator?.cohorts.map((item) => item.cohortId) ?? [];
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      status: "ACTIVE",

      ...(cohortIds
        ? {
            cohortId: {
              in: cohortIds,
            },
          }
        : {}),

      ...(session.role === "SCHOOL_ADMIN" && session.schoolId
        ? {
            cohort: {
              schoolId: session.schoolId,
            },
          }
        : {}),

      ...(session.role === "ORGANIZATION_ADMIN" && session.organizationId
        ? {
            cohort: {
              organizationId: session.organizationId,
            },
          }
        : {}),
    },

    orderBy: {
      enrolledAt: "desc",
    },

    select: {
      id: true,

      cohort: {
        select: {
          id: true,
          name: true,
          code: true,

          program: {
            select: {
              id: true,
              name: true,
              totalWeeks: true,
            },
          },
        },
      },

      student: {
        select: {
          id: true,
          readinessScore: true,
          profileComplete: true,

          user: {
            select: {
              firstName: true,
              lastName: true,
              displayName: true,
              email: true,
            },
          },

          lessonProgress: {
            select: {
              percent: true,
              completedAt: true,

              lesson: {
                select: {
                  module: {
                    select: {
                      programId: true,
                    },
                  },
                },
              },
            },
          },

          portfolio: {
            select: {
              artifacts: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const cohorts = Array.from(
    new Map(
      enrollments.map((enrollment) => [
        enrollment.cohort.id,
        enrollment.cohort,
      ]),
    ).values(),
  );

  const students = enrollments.map((enrollment) => {
    const student = enrollment.student;

    const name =
      student.user.displayName ||
      `${student.user.firstName} ${student.user.lastName}`.trim();

    const relevantProgress = student.lessonProgress.filter(
      (item) => item.lesson.module.programId === enrollment.cohort.program.id,
    );

    const completed = relevantProgress.filter(
      (item) => item.completedAt !== null || item.percent >= 100,
    ).length;

    const totalWeeks = enrollment.cohort.program.totalWeeks;

    const progress =
      totalWeeks > 0
        ? Math.min(100, Math.round((completed / totalWeeks) * 100))
        : 0;

    return {
      enrollmentId: enrollment.id,
      studentId: student.id,
      name,
      email: student.user.email,
      cohortName: enrollment.cohort.name,
      cohortCode: enrollment.cohort.code,
      progress,
      completed,
      readiness: Math.round(Number(student.readinessScore)),
      artifacts: student.portfolio?.artifacts.length ?? 0,
      profileComplete: student.profileComplete,
    };
  });

  const averageProgress =
    students.length > 0
      ? Math.round(
          students.reduce((sum, student) => sum + student.progress, 0) /
            students.length,
        )
      : 0;

  const studentsAssessed = students.filter(
    (student) => student.readiness > 0,
  ).length;

  return (
    <FacilitatorShell activePath="/ambassador/facilitator">
      <main
        style={{
          padding: 24,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* SIMPLE WELCOME */}

        <section
          style={{
            borderRadius: 28,
            padding: 30,
            background: "#0D1B3D",
            color: "white",
          }}
        >
          <div
            style={{
              color: "#F2B705",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 2,
            }}
          >
            FUTURE READY™ FACILITATOR
          </div>

          <h1
            style={{
              margin: "8px 0 0",
              fontSize: 34,
            }}
          >
            Welcome, {session.name}
          </h1>

          <p
            style={{
              marginTop: 10,
              maxWidth: 680,
              lineHeight: 1.6,
              color: "#D7DFEC",
            }}
          >
            Everything you need to teach, support students, and manage your
            Future Ready™ cohort is here.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 18,
            }}
          >
            {cohorts.map((cohort) => (
              <span
                key={cohort.id}
                style={{
                  padding: "7px 11px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,.10)",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {cohort.name}
              </span>
            ))}
          </div>
        </section>

        {/* TODAY - PRIMARY WORK AREA */}

        <section style={{ marginTop: 22 }}>
          <div
            style={{
              marginBottom: 12,
            }}
          >
            <div
              style={{
                color: "#4B2265",
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 1.5,
              }}
            >
              START HERE
            </div>

            <h2
              style={{
                margin: "4px 0 0",
                color: "#0D1B3D",
                fontSize: 25,
              }}
            >
              Today&apos;s Class
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#667085",
                fontSize: 13,
              }}
            >
              Your current lesson and the tools you need to deliver it.
            </p>
          </div>

          <FacilitatorWeekOneFrontDoor />
        </section>

        {/* QUICK STATUS */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 12,
            marginTop: 22,
          }}
        >
          <Metric label="Students" value={students.length} />
          <Metric
            label="Assessments Complete"
            value={`${studentsAssessed}/${students.length}`}
          />
          <Metric label="Program Progress" value={`${averageProgress}%`} />
        </section>

        {/* LESSON PLANNING */}

        <DashboardSection
          eyebrow="TEACH"
          title="Lesson Plan & Teaching Tools"
          description="Open when you want to plan ahead, customize a lesson, or add materials."
        >
          <div style={toolGridStyle}>
            <ToolLink
              title="Curriculum & Lesson Plan"
              description="Review the full lesson, facilitator guidance, activities, and weekly materials."
              href="/ambassador/curriculum"
              action="Open Curriculum"
            />

            <ToolLink
              title="Weekly Planner"
              description="Manage the weekly delivery plan, agenda, classroom activities, and experiences."
              href="/ambassador/planner"
              action="Open Planner"
            />

            <ToolLink
              title="Program / Lesson Builder"
              description="Customize activities, facilitation, classroom delivery, and supplemental materials."
              href="/ambassador/lesson-builder?week=1"
              action="Open Lesson Builder"
            />
          </div>
        </DashboardSection>

        {/* STUDENTS */}

        <DashboardSection
          eyebrow="STUDENTS"
          title={`Students & Progress · ${students.length}`}
          description="Attendance, assessments, Passports, progress, student work, and enrollment."
        >
          <div style={toolGridStyle}>
            <ToolLink
              title="Live Student Roster"
              description="Your main student workspace. Take attendance and review each student's progress and Passport."
              href="/ambassador/facilitator/students"
              action="Open Students"
            />

            <ToolLink
              title="Add Student"
              description="Enroll a new student into your assigned Future Ready™ cohort."
              href="/ambassador/facilitator/students/new"
              action="Add Student"
            />
          </div>

          <div
            style={{
              marginTop: 18,
              borderRadius: 16,
              background: "#F8FAFC",
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                alignItems: "center",
              }}
            >
              <strong style={{ color: "#0D1B3D" }}>
                Quick cohort status
              </strong>

              <span style={smallStatusStyle}>
                {students.length} active students
              </span>

              <span style={smallStatusStyle}>
                {studentsAssessed} assessments complete
              </span>

              <span style={smallStatusStyle}>
                {averageProgress}% average progress
              </span>
            </div>
          </div>
        </DashboardSection>

        {/* FRIDAY */}

        <DashboardSection
          eyebrow="APPLY"
          title="Friday & Applied Learning"
          description="Use for Friday check-ins, applied learning, reflection, and classroom follow-through."
        >
          <div style={toolGridStyle}>
            <ToolLink
              title="Friday Command Center"
              description="Manage the Friday student experience and weekly applied-learning workflow."
              href="/ambassador/facilitator/friday"
              action="Open Friday"
            />

            <ToolLink
              title="Reflections"
              description="Review student reflection work and learning evidence."
              href="/ambassador/facilitator/reflections"
              action="Review Reflections"
            />

            <ToolLink
              title="Badges"
              description="Review and manage Future Ready™ student milestone recognition."
              href="/ambassador/facilitator/badges"
              action="Open Badges"
            />
          </div>
        </DashboardSection>

        {/* COMMUNICATION */}

        <DashboardSection
          eyebrow="CONNECT"
          title="Communication"
          description="Reach students and authorized Future Ready™ program administrators."
        >
          <div style={toolGridStyle}>
            <ToolLink
              title="Messages"
              description="Communicate directly with students and program administrators."
              href="/ambassador/messages"
              action="Open Messages"
            />
          </div>
        </DashboardSection>

        {/* ADVANCED */}

        <DashboardSection
          eyebrow="MORE"
          title="Analytics & Advanced Tools"
          description="Additional program information is here when you need it—not in the way when you don't."
        >
          <div style={toolGridStyle}>
            <ToolLink
              title="Analytics"
              description="Review cohort and student program performance."
              href="/ambassador/facilitator/analytics"
              action="Open Analytics"
            />

            <ToolLink
              title="Student Passports"
              description="Access individual student evidence, readiness, reflections, progress, and Capstone work from the roster."
              href="/ambassador/facilitator/students"
              action="Choose Student"
            />
          </div>
        </DashboardSection>
      </main>
    </FacilitatorShell>
  );
}

const toolGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: 12,
};

const smallStatusStyle = {
  borderRadius: 999,
  background: "white",
  border: "1px solid #E3E8F0",
  padding: "7px 11px",
  color: "#667085",
  fontSize: 11,
  fontWeight: 800,
};

function DashboardSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <details
      style={{
        marginTop: 16,
        border: "1px solid #E3E8F0",
        borderRadius: 20,
        background: "white",
        overflow: "hidden",
      }}
    >
      <summary
        style={{
          cursor: "pointer",
          padding: 20,
          listStylePosition: "inside",
        }}
      >
        <span
          style={{
            color: "#4B2265",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: 1.5,
            marginRight: 10,
          }}
        >
          {eyebrow}
        </span>

        <strong
          style={{
            color: "#0D1B3D",
            fontSize: 17,
          }}
        >
          {title}
        </strong>

        <div
          style={{
            marginTop: 5,
            marginLeft: 23,
            color: "#667085",
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </summary>

      <div
        style={{
          borderTop: "1px solid #EEF1F5",
          padding: 18,
        }}
      >
        {children}
      </div>
    </details>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        border: "1px solid #E3E8F0",
        borderRadius: 16,
        background: "white",
        padding: 16,
      }}
    >
      <div
        style={{
          color: "#667085",
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: 1,
        }}
      >
        {label.toUpperCase()}
      </div>

      <div
        style={{
          marginTop: 5,
          color: "#0D1B3D",
          fontSize: 25,
          fontWeight: 900,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ToolLink({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <article
      style={{
        border: "1px solid #E3E8F0",
        borderRadius: 16,
        background: "#FCFCFD",
        padding: 17,
      }}
    >
      <h3
        style={{
          margin: 0,
          color: "#0D1B3D",
          fontSize: 16,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: "7px 0 0",
          color: "#667085",
          fontSize: 11,
          lineHeight: 1.55,
        }}
      >
        {description}
      </p>

      <Link
        href={href}
        style={{
          display: "inline-block",
          marginTop: 11,
          color: "#0D1B3D",
          textDecoration: "none",
          fontWeight: 900,
          fontSize: 11,
        }}
      >
        {action} →
      </Link>
    </article>
  );
}
