import { prisma } from "@/lib/prisma";

export async function getOpportunities() {
  return prisma.internship.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      employer: true,
    },
  });
}
