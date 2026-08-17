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

  const averageReadiness =
    students.length > 0
      ? Math.round(
          students.reduce((sum, student) => sum + student.readiness, 0) /
            students.length,
        )
      : 0;

  return (
    <FacilitatorShell activePath="/ambassador/facilitator">
      <main
        style={{
          padding: 24,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <section
          style={{
            borderRadius: 28,
            padding: 32,
            background: "#0D1B3D",
            color: "white",
          }}
        >
          <div
            style={{
              color: "#F2B705",
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: 2,
            }}
          >
            FACILITATOR COMMAND CENTER
          </div>

          <h1
            style={{
              margin: "10px 0 0",
              fontSize: 38,
            }}
          >
            Welcome, {session.name}
          </h1>

          <p
            style={{
              marginTop: 14,
              maxWidth: 760,
              lineHeight: 1.7,
              color: "#D7DFEC",
            }}
          >
            Your live cohort, weekly teaching plan, student progress, and Future
            Ready™ delivery tools are connected here.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 22,
            }}
          >
            {cohorts.map((cohort) => (
              <span
                key={cohort.id}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,.10)",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {cohort.name} · {cohort.code}
              </span>
            ))}
          </div>
        </section>

        <FacilitatorWeekOneFrontDoor />

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 16,
            marginTop: 24,
          }}
        >
          <Metric label="Active Students" value={students.length} />

          <Metric label="Average Progress" value={`${averageProgress}%`} />

          <Metric label="Average Readiness" value={`${averageReadiness}%`} />

          <Metric label="Active Cohorts" value={cohorts.length} />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 16,
            marginTop: 24,
          }}
        >
          <ActionCard
            eyebrow="TEACH"
            title="Weekly Delivery Dashboard"
            description="Core curriculum, daily agenda, AI activity builder, traditions, tangible takeaways, and field experiences."
            href="/ambassador/planner"
            action="Open Weekly Planner"
          />

          <ActionCard
            eyebrow="STUDENTS"
            title="Live Student Roster"
            description="View registered students, progress, readiness, Passports, and cohort enrollment."
            href="/ambassador/facilitator/students"
            action="Manage Students"
          />

          <ActionCard
            eyebrow="ADD"
            title="Add Student"
            description="Add a student to your assigned Future Ready™ cohort."
            href="/ambassador/facilitator/students/new"
            action="Add Student"
          />

          <ActionCard
            eyebrow="ATTENDANCE"
            title="Attendance"
            description="Record participation and attendance for the current cohort."
            href="/ambassador/facilitator/attendance"
            action="Open Attendance"
          />

          <ActionCard
            eyebrow="COMMUNICATE"
            title="Messages"
            description="Communicate directly with students and authorized program administrators."
            href="/ambassador/messages"
            action="Open Messages"
          />
        </section>

        <section
          style={{
            marginTop: 24,
            border: "1px solid #E3E8F0",
            borderRadius: 24,
            background: "white",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: 22,
              borderBottom: "1px solid #E3E8F0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
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
                LIVE ROSTER
              </div>

              <h2
                style={{
                  margin: "5px 0 0",
                }}
              >
                Your Students
              </h2>
            </div>

            <Link
              href="/ambassador/facilitator/students"
              style={{
                color: "#0D1B3D",
                textDecoration: "none",
                fontWeight: 900,
                fontSize: 12,
              }}
            >
              Open Full Roster →
            </Link>
          </div>

          {students.length === 0 ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "#667085",
              }}
            >
              No active students are currently enrolled in your assigned cohort.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                gap: 16,
                padding: 22,
              }}
            >
              {students.map((student) => (
                <article
                  key={student.enrollmentId}
                  style={{
                    border: "1px solid #E3E8F0",
                    borderRadius: 18,
                    padding: 20,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                    }}
                  >
                    {student.name}
                  </h3>

                  <div
                    style={{
                      color: "#7A8494",
                      fontSize: 11,
                      marginTop: 4,
                    }}
                  >
                    {student.email}
                  </div>

                  <div
                    style={{
                      color: "#4B2265",
                      fontSize: 11,
                      fontWeight: 900,
                      marginTop: 8,
                    }}
                  >
                    {student.cohortName}
                  </div>

                  <div
                    style={{
                      marginTop: 16,
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                    }}
                  >
                    <span>Progress</span>

                    <strong>{student.progress}%</strong>
                  </div>

                  <div
                    style={{
                      height: 8,
                      marginTop: 7,
                      borderRadius: 999,
                      overflow: "hidden",
                      background: "#E8ECF2",
                    }}
                  >
                    <div
                      style={{
                        width: `${student.progress}%`,
                        height: "100%",
                        background: "#F2B705",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      gap: 8,
                      marginTop: 16,
                      padding: 12,
                      borderRadius: 12,
                      background: "#F8FAFC",
                      textAlign: "center",
                      fontSize: 10,
                    }}
                  >
                    <div>
                      <strong>{student.completed}</strong>
                      <div>Lessons</div>
                    </div>

                    <div>
                      <strong>{student.readiness}%</strong>
                      <div>Readiness</div>
                    </div>

                    <div>
                      <strong>{student.artifacts}</strong>
                      <div>Artifacts</div>
                    </div>
                  </div>

                  <Link
                    href={`/ambassador/student-passport/${student.studentId}`}
                    style={{
                      display: "inline-block",
                      marginTop: 16,
                      color: "#0D1B3D",
                      textDecoration: "none",
                      fontWeight: 900,
                      fontSize: 11,
                    }}
                  >
                    Open Passport →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </FacilitatorShell>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        border: "1px solid #E3E8F0",
        borderRadius: 18,
        background: "white",
        padding: 20,
      }}
    >
      <div
        style={{
          color: "#667085",
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: 1,
        }}
      >
        {label.toUpperCase()}
      </div>

      <div
        style={{
          marginTop: 8,
          color: "#0D1B3D",
          fontSize: 32,
          fontWeight: 900,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ActionCard({
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
    <article
      style={{
        border: "1px solid #E3E8F0",
        borderRadius: 20,
        background: "white",
        padding: 22,
      }}
    >
      <div
        style={{
          color: "#F2B705",
          fontWeight: 900,
          fontSize: 10,
          letterSpacing: 1.5,
        }}
      >
        {eyebrow}
      </div>

      <h2
        style={{
          margin: "8px 0 0",
          color: "#0D1B3D",
          fontSize: 20,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: "#667085",
          fontSize: 12,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      <Link
        href={href}
        style={{
          display: "inline-block",
          marginTop: 10,
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
