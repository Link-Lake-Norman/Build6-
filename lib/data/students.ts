import { prisma } from "@/lib/prisma";

export async function getStudents() {
  return prisma.student.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      organization: true,
    },
  });
}

export async function getOpportunities() {
  return prisma.opportunity.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      employer: true,
    },
  });
}


