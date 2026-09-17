import { NextRequest, NextResponse } from "next/server";

import {
  BUILD6_DAILY_NOTIFICATION_PREFIX,
  buildDailyFocusMessage,
  newYorkClock,
} from "@/lib/build6/companion-daily";
import { prisma } from "@/lib/prisma";
import {
  pushConfigured,
  sendBuild6Push,
} from "@/lib/build6/web-push";

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();

  return Boolean(
    secret &&
      request.headers.get("authorization") === `Bearer ${secret}`,
  );
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  const force = request.nextUrl.searchParams.get("force") === "1";
  const clock = newYorkClock();

  if (!force && clock.hour !== 10) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "Outside the 10:00 AM America/New_York delivery hour.",
      dateKey: clock.dateKey,
      localHour: clock.hour,
    });
  }

  const type = `${BUILD6_DAILY_NOTIFICATION_PREFIX}${clock.dateKey}`;

  const students = await prisma.student.findMany({
    where: {
      deletedAt: null,
      user: {
        role: "STUDENT",
        status: "ACTIVE",
        deletedAt: null,
      },
      enrollments: {
        some: {
          status: "ACTIVE",
          cohort: {
            status: "ACTIVE",
            deletedAt: null,
          },
        },
      },
    },
    select: {
      id: true,
      userId: true,
      user: {
        select: {
          firstName: true,
          displayName: true,
        },
      },
      profile: {
        select: {
          strengths: true,
          values: true,
          futureGoals: true,
          skillsToBuild: true,
        },
      },
      studentSkills: {
        select: {
          skill: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 1,
      },
      enrollments: {
        where: {
          status: "ACTIVE",
        },
        select: {
          cohortId: true,
        },
        orderBy: {
          enrolledAt: "desc",
        },
        take: 1,
      },
    },
  });

  let created = 0;
  let alreadyExists = 0;
  let noActiveCohort = 0;
  let pushSent = 0;
  let pushFailed = 0;
  let pushDisabled = 0;
  let pushNotConfigured = 0;

  for (const student of students) {
    const existing = await prisma.notification.findFirst({
      where: {
        userId: student.userId,
        type,
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      alreadyExists += 1;
      continue;
    }

    const cohortId = student.enrollments[0]?.cohortId ?? null;

    if (!cohortId) {
      noActiveCohort += 1;
      continue;
    }

    const startOfToday = new Date();

    const upcomingExperience =
      await prisma.cohortExperience.findFirst({
        where: {
          cohortId,
          visibleToStudent: true,
          eventDate: {
            gte: startOfToday,
          },
        },
        select: {
          title: true,
          eventDate: true,
        },
        orderBy: {
          eventDate: "asc",
        },
      });

    const firstName =
      student.user.firstName ||
      student.user.displayName?.split(" ")[0] ||
      "Student";

    const message = buildDailyFocusMessage({
      firstName,
      strength: student.profile?.strengths,
      value: student.profile?.values,
      skill:
        student.profile?.skillsToBuild ||
        student.studentSkills[0]?.skill.name ||
        "",
      goal: student.profile?.futureGoals,
      upcomingExperienceTitle: upcomingExperience?.title,
      upcomingExperienceDate: upcomingExperience?.eventDate,
    });

    const actionUrl =
      `/ambassador/student-portal/${student.id}/companion`;

    await prisma.notification.create({
      data: {
        userId: student.userId,
        type,
        title: "Your 10:00 AM BUILD6 Focus",
        message,
        actionUrl,
      },
    });

    created += 1;

    const subscriptions =
      await prisma.pushSubscription.findMany({
        where: {
          userId: student.userId,
          enabled: true,
        },
        select: {
          id: true,
          endpoint: true,
          p256dh: true,
          auth: true,
        },
      });

    if (subscriptions.length > 0 && !pushConfigured()) {
      pushNotConfigured += subscriptions.length;
    } else {
      for (const subscription of subscriptions) {
        const result = await sendBuild6Push(
          subscription,
          {
            title: "Your 10:00 AM BUILD6 Focus",
            body: "Your BUILD6 message is ready.",
            url: actionUrl,
          },
        );

        if (result.ok) {
          pushSent += 1;

          await prisma.pushSubscription.update({
            where: {
              id: subscription.id,
            },
            data: {
              lastSentAt: new Date(),
              lastError: null,
            },
          });

          continue;
        }

        if (!result.configured) {
          pushNotConfigured += 1;
          continue;
        }

        pushFailed += 1;

        const disable =
          result.statusCode === 404 ||
          result.statusCode === 410;

        if (disable) {
          pushDisabled += 1;
        }

        await prisma.pushSubscription.update({
          where: {
            id: subscription.id,
          },
          data: {
            enabled: disable ? false : true,
            lastError: result.error,
          },
        });
      }
    }
  }

  return NextResponse.json({
    ok: true,
    skipped: false,
    dateKey: clock.dateKey,
    localHour: clock.hour,
    eligibleStudents: students.length,
    created,
    alreadyExists,
    noActiveCohort,
    pushSent,
    pushFailed,
    pushDisabled,
    pushNotConfigured,
  });
}
