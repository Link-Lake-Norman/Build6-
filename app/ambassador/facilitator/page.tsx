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

  const primaryCohort = cohorts[0];

  return (
    <FacilitatorShell activePath="/ambassador/facilitator">
      <main
        style={{
          padding: 24,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* COHORT OPERATING HEADER */}
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
            FUTURE READY™ · FACILITATOR DASHBOARD
          </div>

          <h1 style={{ margin: "8px 0 0", fontSize: 34 }}>
            {primaryCohort?.name ?? "Your Cohort"}
          </h1>

          <p
            style={{
              marginTop: 10,
              maxWidth: 760,
              lineHeight: 1.6,
              color: "#D7DFEC",
            }}
          >
            Welcome, {session.name}. This is your operating center for teaching,
            planning, student support, attendance, communication, and program delivery.
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

        {/* PRIMARY ACTIONS */}
        <section style={{ marginTop: 22 }}>
          <div style={{ marginBottom: 12 }}>
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
              Run Your Cohort
            </h2>
            <p
              style={{
                margin: "6px 0 0",
                color: "#667085",
                fontSize: 13,
              }}
            >
              Your most important facilitator actions are always visible here.
            </p>
          </div>

          <div style={primaryActionGridStyle}>
            <PrimaryAction
              eyebrow="TEACH"
              title="Teach Next Class"
              description="Open the organized Teaching Workspace for the current week and class day."
              href="/ambassador/curriculum"
              action="Open Teaching Workspace"
            />
            <PrimaryAction
              eyebrow="PLAN"
              title="Edit / Customize"
              description="Adjust the delivery plan, add activities, attach assets, or prepare an experience."
              href="/ambassador/planner"
              action="Open Planner"
            />
            <PrimaryAction
              eyebrow="OPERATIONS"
              title="Take Attendance"
              description="Record attendance for the students in your active cohort."
              href="/ambassador/facilitator/attendance"
              action="Take Attendance"
            />
            <PrimaryAction
              eyebrow="STUDENT WORK"
              title="Review Students"
              description="Open the roster to review progress, Passports, evidence, assessments, and student work."
              href="/ambassador/facilitator/students"
              action="Open Student Workspace"
            />
          </div>
        </section>

        {/* TODAY / NEXT CLASS */}
        <section style={{ marginTop: 22 }}>
          <FacilitatorWeekOneFrontDoor />
        </section>

        {/* COHORT SNAPSHOT */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 12,
            marginTop: 22,
          }}
        >
          <Metric label="Active Students" value={students.length} />
          <Metric
            label="Assessments Complete"
            value={`${studentsAssessed}/${students.length}`}
          />
          <Metric label="Program Progress" value={`${averageProgress}%`} />
        </section>

        {/* ORGANIZED OPERATING AREAS */}
        <section style={{ marginTop: 28 }}>
          <div
            style={{
              color: "#4B2265",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 1.5,
            }}
          >
            FACILITATOR WORKSPACE
          </div>
          <h2
            style={{
              margin: "4px 0 0",
              color: "#0D1B3D",
              fontSize: 25,
            }}
          >
            Everything Else, Organized by the Work You&apos;re Doing
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              color: "#667085",
              fontSize: 13,
              maxWidth: 760,
              lineHeight: 1.6,
            }}
          >
            Curriculum, planning, students, attendance, messages, and deeper tools
            remain intact. They now support this dashboard instead of competing with it.
          </p>
        </section>

        <DashboardSection
          eyebrow="TEACH + PLAN"
          title="Curriculum, Planner & Lesson Building"
          description="Use the Teaching Workspace to teach. Open planning tools only when you need to customize or build."
        >
          <div style={toolGridStyle}>
            <ToolLink
              title="Teaching Workspace"
              description="Your primary day-of-class view: objective, teaching flow, student work, evidence, assets, assignments, and notes."
              href="/ambassador/curriculum"
              action="Teach"
            />
            <ToolLink
              title="Weekly Planner"
              description="The backstage editor for your weekly and daily delivery plan."
              href="/ambassador/planner"
              action="Edit / Customize"
            />
            <ToolLink
              title="Lesson Builder + AI Activities"
              description="Create supplemental classroom activities and detailed facilitation assets when the core plan needs an enhancement."
              href="/ambassador/lesson-builder?week=1"
              action="Build an Activity"
            />
          </div>
        </DashboardSection>

        <DashboardSection
          eyebrow="STUDENTS"
          title={`Students, Work & Progress · ${students.length}`}
          description="Roster, assessments, Passports, progress, evidence, reflections, portfolio work, and Capstone access."
        >
          <div style={toolGridStyle}>
            <ToolLink
              title="Student Workspace"
              description="Open the active roster and choose a student to review progress, evidence, Passport, and program work."
              href="/ambassador/facilitator/students"
              action="Open Students"
            />
            <ToolLink
              title="Add Student"
              description="Enroll a new student into your assigned Future Ready™ cohort."
              href="/ambassador/facilitator/students/new"
              action="Add Student"
            />
            <ToolLink
              title="Attendance"
              description="Record and review attendance without leaving the facilitator workflow."
              href="/ambassador/facilitator/attendance"
              action="Open Attendance"
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
              <strong style={{ color: "#0D1B3D" }}>Cohort snapshot</strong>
              <span style={smallStatusStyle}>{students.length} active students</span>
              <span style={smallStatusStyle}>
                {studentsAssessed} assessments complete
              </span>
              <span style={smallStatusStyle}>
                {averageProgress}% average progress
              </span>
            </div>
          </div>
        </DashboardSection>

        <DashboardSection
          eyebrow="CONNECT + APPLY"
          title="Messages, Experiences & Weekly Application"
          description="Communication and applied learning stay accessible without crowding the daily teaching workflow."
        >
          <div style={toolGridStyle}>
            <ToolLink
              title="Messages"
              description="Communicate directly with students and authorized Future Ready™ program administrators."
              href="/ambassador/messages"
              action="Open Messages"
            />
            <ToolLink
              title="Friday Command Center"
              description="Manage Friday check-ins, reflection, applied learning, and weekly follow-through."
              href="/ambassador/facilitator/friday"
              action="Open Friday"
            />
            <ToolLink
              title="Experiences"
              description="Add or manage speakers, employer connections, field trips, and applied-learning experiences from the planner."
              href="/ambassador/planner"
              action="Manage Experiences"
            />
          </div>
        </DashboardSection>

        <DashboardSection
          eyebrow="RESOURCES + INSIGHT"
          title="Resources, Evidence & Advanced Tools"
          description="Use these tools when you need deeper program information. They stay out of the way during normal class delivery."
        >
          <div style={toolGridStyle}>
            <ToolLink
              title="Curriculum + Asset Library"
              description="Access weekly playbooks, worksheets, slides, activity kits, assessments, facilitator guides, and additional resources."
              href="/ambassador/curriculum"
              action="Open Resources"
            />
            <ToolLink
              title="Student Passports"
              description="Choose a student to access readiness, reflections, portfolio evidence, progress, and Capstone work."
              href="/ambassador/facilitator/students"
              action="Choose Student"
            />
            <ToolLink
              title="Analytics"
              description="Review cohort and student program performance when deeper reporting is needed."
              href="/ambassador/facilitator/analytics"
              action="Open Analytics"
            />
          </div>
        </DashboardSection>
      </main>
    </FacilitatorShell>
  );
}


const primaryActionGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
  gap: 12,
};

function PrimaryAction({
  eyebrow,
  title,
  description,
  href,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        border: "1px solid #DCE3EC",
        borderRadius: 20,
        background: "white",
        padding: 20,
        textDecoration: "none",
        boxShadow: "0 8px 24px rgba(13,27,61,.06)",
      }}
    >
      <div
        style={{
          color: "#4B2265",
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: 1.4,
        }}
      >
        {eyebrow}
      </div>
      <h3
        style={{
          margin: "6px 0 0",
          color: "#0D1B3D",
          fontSize: 18,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: "8px 0 0",
          color: "#667085",
          fontSize: 12,
          lineHeight: 1.55,
        }}
      >
        {description}
      </p>
      <div
        style={{
          marginTop: 14,
          color: "#0D1B3D",
          fontWeight: 900,
          fontSize: 11,
        }}
      >
        {action} →
      </div>
    </Link>
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
