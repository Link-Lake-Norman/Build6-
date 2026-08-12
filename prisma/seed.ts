import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  let organization = await prisma.organization.findFirst({
    where: {
      name: "Ambassador Christian School",
    },
  });

  if (!organization) {
    organization = await prisma.organization.create({
      data: {
        name: "Ambassador Christian School",
        slug: "ambassador-christian-school",
        type: "SCHOOL",
      },
    });
  }

  const existingStudent = await prisma.student.findFirst({
    where: {
      name: "Alex Johnson",
      organizationId: organization.id,
    },
  });

  if (!existingStudent) {
    await prisma.student.create({
      data: {
        name: "Alex Johnson",
        grade: "11",
        readinessScore: 82,
        interests: [],
        skills: [],
        organization: {
          connect: {
            id: organization.id,
          },
        },
      },
    });
  }

  console.log("Future Ready seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
