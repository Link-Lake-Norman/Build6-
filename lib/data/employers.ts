import { prisma } from "@/lib/prisma";

export async function getEmployers() {
  return prisma.employer.findMany({
    where: {
      deletedAt: null,
      isActive: true,
    },
    include: {
      internships: {
        where: {
          deletedAt: null,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}
