import { prisma } from "@/lib/prisma";

export async function getStudents() {
  const students = await prisma.student.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      careerInterests: true,
      studentSkills: {
        include: {
          skill: true,
        },
      },
    },
  });

  return students.map((student) => ({
    id: student.id,

    name:
      student.user.displayName ||
      `${student.user.firstName} ${student.user.lastName}`.trim(),

    grade: student.gradeLevel || "Not specified",

    readinessScore: Number(student.readinessScore),

    interests: student.careerInterests.map((interest) => {
      return interest.careerName;
    }),

    skills: student.studentSkills.map((studentSkill) => {
      return studentSkill.skill.name;
    }),
  }));
}

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
