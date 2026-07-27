import { prisma } from "@/lib/prisma";

export async function getEmployers() {
  return prisma.employer.findMany({
    include: {
      opportunities: true,
    },
  });
}
