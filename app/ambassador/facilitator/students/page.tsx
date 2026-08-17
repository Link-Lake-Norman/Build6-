import Link from "next/link";
import { redirect } from "next/navigation";
import FacilitatorShell from "@/components/facilitator/FacilitatorShell";
import RemoveStudentButton from "./RemoveStudentButton";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function Page() {
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
    const facilitator =
      await prisma.facilitator.findUnique({
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

    cohortIds =
      facilitator?.cohorts.map(
        (item) => item.cohortId
      ) ?? [];
  }

  const enrollments =
    await prisma.enrollment.findMany({
      where: {
        status: "ACTIVE",

        ...(cohortIds
          ? {
              cohortId: {
                in: cohortIds,
              },
            }
          : {}),

        ...(session.role === "SCHOOL_ADMIN" &&
        session.schoolId
          ? {
              cohort: {
                schoolId: session.schoolId,
              },
            }
          : {}),

        ...(session.role ===
          "ORGANIZATION_ADMIN" &&
        session.organizationId
          ? {
              cohort: {
                organizationId:
                  session.organizationId,
              },
            }
          : {}),
      },

      orderBy: {
        enrolledAt: "desc",
      },

      select: {
        id: true,
        enrolledAt: true,

        cohort: {
          select: {
            id: true,
            name: true,
            code: true,
            program: {
              select: {
                id: true,
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

            careerInterests: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

  const cohorts = Array.from(
    new Map(
      enrollments.map((item) => [
        item.cohort.id,
        item.cohort,
      ])
    ).values()
  );

  return (
    <FacilitatorShell activePath="/ambassador/facilitator/students">
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
            LIVE STUDENT DIRECTORY
          </div>

          <h1
            style={{
              margin: "10px 0 0",
              fontSize: 36,
            }}
          >
            Cohort Students
          </h1>

          <p
            style={{
              marginTop: 12,
              color: "#D7DFEC",
              maxWidth: 760,
              lineHeight: 1.7,
            }}
          >
            Students who register with
            their class code appear here
            automatically.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 20,
            }}
          >
            {cohorts.map((cohort) => (
              <span
                key={cohort.id}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  background:
                    "rgba(255,255,255,.10)",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {cohort.name} · {cohort.code}
              </span>
            ))}
          </div>
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
              borderBottom:
                "1px solid #E3E8F0",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  color: "#4B2265",
                  letterSpacing: 1.5,
                }}
              >
                ROSTER
              </div>

              <h2
                style={{
                  margin: "5px 0 0",
                }}
              >
                {enrollments.length} Active{" "}
                {enrollments.length === 1
                  ? "Student"
                  : "Students"}
              </h2>
            </div>

            <Link
              href="/ambassador/facilitator/students/new"
              style={{
                background: "#0D1B3D",
                color: "white",
                padding: "12px 16px",
                borderRadius: 12,
                textDecoration: "none",
                fontWeight: 900,
                fontSize: 12,
              }}
            >
              Add Student
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "#667085",
              }}
            >
              No students are currently
              enrolled in your assigned
              cohort.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(280px,1fr))",
                gap: 16,
                padding: 22,
              }}
            >
              {enrollments.map(
                (enrollment) => {
                  const student =
                    enrollment.student;

                  const name =
                    student.user
                      .displayName ||
                    `${student.user.firstName} ${student.user.lastName}`.trim();

                  const progressRecords =
                    student.lessonProgress.filter(
                      (progress) =>
                        progress.lesson.module
                          .programId ===
                        enrollment.cohort
                          .program.id
                    );

                  const completed =
                    progressRecords.filter(
                      (progress) =>
                        progress.completedAt !==
                          null ||
                        progress.percent >= 100
                    ).length;

                  const totalWeeks =
                    enrollment.cohort.program
                      .totalWeeks;

                  const progress =
                    totalWeeks > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (completed /
                              totalWeeks) *
                              100
                          )
                        )
                      : 0;

                  const initials = name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <article
                      key={enrollment.id}
                      style={{
                        border:
                          "1px solid #E3E8F0",
                        borderRadius: 18,
                        padding: 20,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          gap: 12,
                          alignItems:
                            "flex-start",
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            display: "grid",
                            placeItems:
                              "center",
                            borderRadius: 999,
                            background:
                              "#EAF2FF",
                            color: "#24569B",
                            fontWeight: 900,
                          }}
                        >
                          {initials}
                        </div>

                        <span
                          style={{
                            background:
                              "#ECFDF3",
                            color: "#067647",
                            padding:
                              "6px 9px",
                            borderRadius: 999,
                            fontSize: 10,
                            fontWeight: 900,
                          }}
                        >
                          ACTIVE
                        </span>
                      </div>

                      <h3
                        style={{
                          margin:
                            "14px 0 0",
                          fontSize: 18,
                        }}
                      >
                        {name}
                      </h3>

                      <div
                        style={{
                          marginTop: 4,
                          color: "#7A8494",
                          fontSize: 11,
                        }}
                      >
                        {student.user.email}
                      </div>

                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 11,
                          fontWeight: 800,
                          color: "#4B2265",
                        }}
                      >
                        {enrollment.cohort.name}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          marginTop: 18,
                          fontSize: 11,
                        }}
                      >
                        <span>
                          Program Progress
                        </span>
                        <strong>
                          {progress}%
                        </strong>
                      </div>

                      <div
                        style={{
                          height: 8,
                          background:
                            "#E8ECF2",
                          borderRadius: 999,
                          overflow: "hidden",
                          marginTop: 7,
                        }}
                      >
                        <div
                          style={{
                            width: `${progress}%`,
                            height: "100%",
                            background:
                              "#F2B705",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(3,1fr)",
                          gap: 8,
                          marginTop: 16,
                          padding: 13,
                          background:
                            "#F8FAFC",
                          borderRadius: 12,
                          textAlign:
                            "center",
                          fontSize: 10,
                        }}
                      >
                        <div>
                          <strong>
                            {completed}
                          </strong>
                          <div>Lessons</div>
                        </div>

                        <div>
                          <strong>
                            {student.portfolio
                              ?.artifacts
                              .length ?? 0}
                          </strong>
                          <div>Artifacts</div>
                        </div>

                        <div>
                          <strong>
                            {
                              student
                                .careerInterests
                                .length
                            }
                          </strong>
                          <div>Careers</div>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 14,
                          fontSize: 11,
                          color: "#667085",
                        }}
                      >
                        Readiness:{" "}
                        <strong>
                          {Math.round(
                            Number(
                              student.readinessScore
                            )
                          )}
                          %
                        </strong>
                        {" · "}
                        Profile:{" "}
                        <strong>
                          {student.profileComplete
                            ? "Complete"
                            : "In Progress"}
                        </strong>
                      </div>

                      <div
                        style={{
                          marginTop: 18,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <Link
                          href={`/ambassador/student-passport/${student.id}`}
                          style={{
                            display: "inline-block",
                            color: "#0D1B3D",
                            fontSize: 11,
                            fontWeight: 900,
                            textDecoration: "none",
                          }}
                        >
                          Open Student Passport →
                        </Link>

                        <RemoveStudentButton
                          enrollmentId={enrollment.id}
                          studentName={name}
                        />
                      </div>


                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </main>
    </FacilitatorShell>
  );
}
