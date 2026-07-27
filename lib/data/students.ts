import { prisma } from "@/lib/prisma";

export async function getStudents() {
  return prisma.student.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
