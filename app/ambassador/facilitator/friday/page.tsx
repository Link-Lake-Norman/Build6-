import Link from "next/link";
import { redirect } from "next/navigation";

import FacilitatorShell from "@/components/facilitator/FacilitatorShell";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STAFF_ROLES = new Set([
  "FACILITATOR",
  "SCHOOL_ADMIN",
  "ORGANIZATION_ADMIN",
  "SUPER_ADMIN",
]);

function money(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function studentName(student: {
  user: {
    firstName: string;
    lastName: string;
    displayName: string | null;
  };
}) {
  return (
    student.user.displayName ||
    `${student.user.firstName} ${student.user.lastName}`.trim()
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getCurrentWeek(
  progress: {
    lesson: {
      weekNumber: number;
    };
  }[],
) {
  if (!progress.length) return 1;

  return Math.max(1, ...progress.map((item) => item.lesson.weekNumber));
}

export default async function FacilitatorFridayPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/ambassador/login");
  }

  if (!STAFF_ROLES.has(session.role)) {
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

          economySettings: {
            select: {
              enabled: true,
              fridayCheckEnabled: true,
            },
          },
        },
      },

      student: {
        select: {
          id: true,

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
              lesson: {
                select: {
                  weekNumber: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const studentIds = enrollments.map((enrollment) => enrollment.student.id);

  const cohortIdsForData = Array.from(
    new Set(enrollments.map((enrollment) => enrollment.cohort.id)),
  );

  const [accounts, fridayChecks, peerLoans, goals, bills] = await Promise.all([
    prisma.lifeAccount.findMany({
      where: {
        studentId: {
          in: studentIds,
        },
        cohortId: {
          in: cohortIdsForData,
        },
      },
    }),

    prisma.fridayMoneyCheck.findMany({
      where: {
        studentId: {
          in: studentIds,
        },
        cohortId: {
          in: cohortIdsForData,
        },
      },
      orderBy: {
        weekNumber: "desc",
      },
    }),

    prisma.peerLoan.findMany({
      where: {
        cohortId: {
          in: cohortIdsForData,
        },
        OR: [
          {
            borrowerStudentId: {
              in: studentIds,
            },
          },
          {
            lenderStudentId: {
              in: studentIds,
            },
          },
        ],
      },
    }),

    prisma.lifeGoal.findMany({
      where: {
        studentId: {
          in: studentIds,
        },
        cohortId: {
          in: cohortIdsForData,
        },
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.economyBill.findMany({
      where: {
        cohortId: {
          in: cohortIdsForData,
        },
        active: true,
      },
    }),
  ]);

  const rows = enrollments.map((enrollment) => {
    const student = enrollment.student;
    const cohort = enrollment.cohort;

    const name = studentName(student);

    const weekNumber = getCurrentWeek(student.lessonProgress);

    const account = accounts.find(
      (item) => item.studentId === student.id && item.cohortId === cohort.id,
    );

    const check = fridayChecks.find(
      (item) =>
        item.studentId === student.id &&
        item.cohortId === cohort.id &&
        item.weekNumber === weekNumber,
    );

    const borrowedLoans = peerLoans.filter(
      (loan) =>
        loan.borrowerStudentId === student.id &&
        loan.cohortId === cohort.id &&
        ["ACTIVE", "LATE", "DEFAULTED"].includes(loan.status),
    );

    const amountOwedCents = borrowedLoans.reduce(
      (total, loan) =>
        total + Math.max(0, loan.repaymentCents - loan.amountRepaidCents),
      0,
    );

    const lateLoans = borrowedLoans.filter(
      (loan) => loan.status === "LATE" || loan.status === "DEFAULTED",
    );

    const defaultedLoans = borrowedLoans.filter(
      (loan) => loan.status === "DEFAULTED",
    );

    const goal = goals.find(
      (item) => item.studentId === student.id && item.cohortId === cohort.id,
    );

    const savingsCents = account?.savingsCents ?? 0;

    const goalProgress =
      goal && goal.targetCents > 0
        ? Math.min(100, Math.round((savingsCents / goal.targetCents) * 100))
        : 0;

    const now = new Date();
    const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const studentBills = bills.filter((bill) => {
      if (bill.cohortId !== cohort.id) return false;

      const billStudentId =
        "studentId" in bill
          ? (bill as { studentId?: string | null }).studentId
          : null;

      if (billStudentId && billStudentId !== student.id) {
        return false;
      }

      return !bill.nextDueAt || new Date(bill.nextDueAt) <= sevenDays;
    });

    const upcomingBillsCents = studentBills.reduce(
      (total, bill) => total + bill.amountCents,
      0,
    );

    const checkingCents = account?.checkingCents ?? 0;

    const fridayComplete =
      check?.status === "COMPLETED" || check?.completedAt !== null;

    const economyEnabled =
      cohort.economySettings?.enabled === true &&
      cohort.economySettings?.fridayCheckEnabled === true;

    const recoveryMode =
      defaultedLoans.length > 0 || account?.status === "RECOVERY";

    const billPressure = upcomingBillsCents > checkingCents;

    const needsConversation =
      recoveryMode ||
      lateLoans.length > 0 ||
      billPressure ||
      (economyEnabled && !fridayComplete);

    return {
      enrollmentId: enrollment.id,
      studentId: student.id,
      name,
      initials: initials(name),
      email: student.user.email,
      cohortName: cohort.name,
      cohortCode: cohort.code,
      weekNumber,
      economyEnabled,
      fridayComplete,
      checkStatus: check?.status ?? "NOT STARTED",
      checkingCents,
      savingsCents,
      trustScore: account?.trustScore ?? 70,
      fridayStreak: account?.fridayStreak ?? 0,
      amountOwedCents,
      lateLoanCount: lateLoans.length,
      defaultedLoanCount: defaultedLoans.length,
      recoveryMode,
      upcomingBillsCents,
      billPressure,
      goalProgress,
      needsConversation,
    };
  });

  const activeEconomyStudents = rows.filter((row) => row.economyEnabled);

  const fridayCompleteCount = activeEconomyStudents.filter(
    (row) => row.fridayComplete,
  ).length;

  const needsConversationCount = rows.filter(
    (row) => row.needsConversation,
  ).length;

  const recoveryCount = rows.filter((row) => row.recoveryMode).length;

  const lateDebtCount = rows.filter((row) => row.lateLoanCount > 0).length;

  const completionRate =
    activeEconomyStudents.length > 0
      ? Math.round((fridayCompleteCount / activeEconomyStudents.length) * 100)
      : 0;

  return (
    <FacilitatorShell activePath="/ambassador/facilitator/friday">
      <main
        style={{
          maxWidth: 1450,
          margin: "0 auto",
          width: "100%",
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
            FUTURE READY™ FRIDAY
          </div>

          <h1
            style={{
              margin: "10px 0 0",
              fontSize: 38,
            }}
          >
            Friday Command Center
          </h1>

          <p
            style={{
              marginTop: 12,
              maxWidth: 800,
              color: "#D7DFEC",
              lineHeight: 1.7,
            }}
          >
            See who completed the weekly money check, who is under financial
            pressure, and who needs a conversation before the week closes.
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 22,
            }}
          >
            <Link href="/ambassador/facilitator" style={darkButton}>
              ← Facilitator Dashboard
            </Link>

            <Link href="/ambassador/planner" style={goldButton}>
              Open Daily Hub
            </Link>
          </div>
        </section>

        <section style={statGrid}>
          <Stat
            label="Friday Completion"
            value={`${completionRate}%`}
            detail={`${fridayCompleteCount} of ${activeEconomyStudents.length} complete`}
          />

          <Stat
            label="Needs Conversation"
            value={String(needsConversationCount)}
            detail="Students requiring attention"
          />

          <Stat
            label="Recovery Mode"
            value={String(recoveryCount)}
            detail="Students rebuilding financial standing"
          />

          <Stat
            label="Late / Defaulted Debt"
            value={String(lateDebtCount)}
            detail="Borrowers with overdue peer obligations"
          />
        </section>

        <section style={card}>
          <div
            style={{
              padding: 22,
              borderBottom: "1px solid #E3E8F0",
            }}
          >
            <div
              style={{
                color: "#4B2265",
                fontWeight: 900,
                fontSize: 12,
                letterSpacing: 1.5,
              }}
            >
              CLASSROOM MONEY PULSE
            </div>

            <h2
              style={{
                margin: "6px 0 0",
              }}
            >
              Student Friday Status
            </h2>
          </div>

          {rows.length === 0 ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "#667085",
              }}
            >
              No active students were found in your assigned cohorts.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))",
                gap: 16,
                padding: 22,
              }}
            >
              {rows.map((row) => (
                <article
                  key={row.enrollmentId}
                  style={{
                    border: row.needsConversation
                      ? "2px solid #F2B705"
                      : "1px solid #E3E8F0",
                    borderRadius: 20,
                    padding: 20,
                    background: "white",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      <div style={avatar}>{row.initials}</div>

                      <div>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: 17,
                          }}
                        >
                          {row.name}
                        </h3>

                        <div
                          style={{
                            marginTop: 4,
                            color: "#7A8494",
                            fontSize: 11,
                          }}
                        >
                          {row.cohortName} · Week {row.weekNumber}
                        </div>
                      </div>
                    </div>

                    <Status
                      label={
                        !row.economyEnabled
                          ? "Economy Off"
                          : row.fridayComplete
                            ? "Friday Complete"
                            : "Friday Open"
                      }
                      good={row.fridayComplete}
                    />
                  </div>

                  <div style={moneyGrid}>
                    <MiniStat
                      label="Checking"
                      value={money(row.checkingCents)}
                    />

                    <MiniStat label="Savings" value={money(row.savingsCents)} />

                    <MiniStat label="Trust" value={String(row.trustScore)} />

                    <MiniStat
                      label="Friday Streak"
                      value={String(row.fridayStreak)}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: 16,
                      display: "grid",
                      gap: 8,
                    }}
                  >
                    {row.recoveryMode && <Alert>⚠ Recovery Mode active</Alert>}

                    {row.amountOwedCents > 0 && (
                      <Alert>
                        Peer debt remaining: {money(row.amountOwedCents)}
                      </Alert>
                    )}

                    {row.lateLoanCount > 0 && (
                      <Alert>
                        {row.lateLoanCount} late/defaulted peer loan
                        {row.lateLoanCount === 1 ? "" : "s"}
                      </Alert>
                    )}

                    {row.billPressure && (
                      <Alert>
                        Upcoming bills {money(row.upcomingBillsCents)} exceed
                        checking
                      </Alert>
                    )}

                    {!row.fridayComplete && row.economyEnabled && (
                      <Alert>Friday Money Check still open</Alert>
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: 18,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 11,
                        marginBottom: 7,
                      }}
                    >
                      <span>Savings Goal</span>
                      <strong>{row.goalProgress}%</strong>
                    </div>

                    <div style={progressTrack}>
                      <div
                        style={{
                          ...progressFill,
                          width: `${row.goalProgress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginTop: 18,
                    }}
                  >
                    <Link
                      href={`/ambassador/student-portal/${row.studentId}/life-account/friday`}
                      style={smallButton}
                    >
                      Open Friday
                    </Link>

                    <Link
                      href={`/ambassador/student-portal/${row.studentId}/life-account`}
                      style={smallButton}
                    >
                      Life Account
                    </Link>

                    <Link
                      href={`/ambassador/student-passport/${row.studentId}`}
                      style={smallOutlineButton}
                    >
                      Passport
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </FacilitatorShell>
  );
}

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div style={statCard}>
      <div
        style={{
          color: "#667085",
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: 1,
        }}
      >
        {label.toUpperCase()}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 32,
          fontWeight: 900,
          color: "#0D1B3D",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 5,
          color: "#7A8494",
          fontSize: 12,
        }}
      >
        {detail}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 12,
        background: "#F8FAFC",
      }}
    >
      <div
        style={{
          color: "#7A8494",
          fontSize: 10,
          fontWeight: 800,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 4,
          color: "#0D1B3D",
          fontSize: 15,
          fontWeight: 900,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Status({ label, good }: { label: string; good: boolean }) {
  return (
    <span
      style={{
        borderRadius: 999,
        padding: "7px 10px",
        fontSize: 10,
        fontWeight: 900,
        whiteSpace: "nowrap",
        background: good ? "#E8F7EE" : "#FFF4D6",
        color: good ? "#17663A" : "#805B00",
      }}
    >
      {label}
    </span>
  );
}

function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "9px 11px",
        borderRadius: 10,
        background: "#FFF8E6",
        color: "#725300",
        fontSize: 11,
        fontWeight: 800,
      }}
    >
      {children}
    </div>
  );
}

const statGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
  gap: 14,
  marginTop: 20,
};

const statCard = {
  padding: 20,
  borderRadius: 18,
  background: "white",
  border: "1px solid #E3E8F0",
};

const card = {
  marginTop: 20,
  borderRadius: 24,
  background: "white",
  border: "1px solid #E3E8F0",
  overflow: "hidden",
};

const avatar = {
  width: 46,
  height: 46,
  display: "grid",
  placeItems: "center",
  borderRadius: 999,
  background: "#EAF2FF",
  color: "#24569B",
  fontWeight: 900,
  flexShrink: 0,
};

const moneyGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  gap: 8,
  marginTop: 18,
};

const progressTrack = {
  height: 8,
  background: "#E9EDF3",
  borderRadius: 999,
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  background: "#F2B705",
  borderRadius: 999,
};

const darkButton = {
  display: "inline-block",
  padding: "11px 14px",
  borderRadius: 11,
  textDecoration: "none",
  background: "rgba(255,255,255,.12)",
  color: "white",
  fontSize: 11,
  fontWeight: 900,
};

const goldButton = {
  display: "inline-block",
  padding: "11px 14px",
  borderRadius: 11,
  textDecoration: "none",
  background: "#F2B705",
  color: "#0D1B3D",
  fontSize: 11,
  fontWeight: 900,
};

const smallButton = {
  display: "inline-block",
  padding: "9px 11px",
  borderRadius: 9,
  textDecoration: "none",
  background: "#0D1B3D",
  color: "white",
  fontSize: 10,
  fontWeight: 900,
};

const smallOutlineButton = {
  display: "inline-block",
  padding: "8px 10px",
  borderRadius: 9,
  textDecoration: "none",
  border: "1px solid #D8DEE8",
  color: "#0D1B3D",
  fontSize: 10,
  fontWeight: 900,
};
