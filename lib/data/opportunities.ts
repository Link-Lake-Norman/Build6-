import { prisma } from "@/lib/prisma";

export async function getOpportunities() {
  return prisma.opportunity.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
