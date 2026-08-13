import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import WeeklyPlanner from "./WeeklyPlanner";

export default async function PlannerPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/ambassador/login");
  }

  if (
    session.role !== "SUPER_ADMIN" &&
    session.role !== "FACILITATOR"
  ) {
    redirect("/ambassador");
  }

  let defaultCohortCode =
    "PILOT-2026-2027";

  if (session.role === "FACILITATOR") {
    const assignment =
      await prisma.cohortFacilitator.findFirst({
        where: {
          facilitator: {
            userId: session.id,
            deletedAt: null,
          },
          cohort: {
            status: "ACTIVE",
            deletedAt: null,
          },
        },
        orderBy: [
          {
            isLead: "desc",
          },
          {
            createdAt: "asc",
          },
        ],
        select: {
          cohort: {
            select: {
              code: true,
            },
          },
        },
      });

    if (assignment?.cohort.code) {
      defaultCohortCode =
        assignment.cohort.code;
    }
  }

  return (
    <WeeklyPlanner
      defaultCohortCode={
        defaultCohortCode
      }
      role={session.role}
    />
  );
}
