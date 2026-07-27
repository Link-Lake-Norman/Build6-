import { prisma } from "@/lib/prisma";


export async function getStudents() {

  return prisma.student.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

}
cat > lib/data/employers.ts <<'EOF'
import { prisma } from "@/lib/prisma";


export async function getEmployers() {

  return prisma.employer.findMany({
    include: {
      opportunities: true,
    },
  });

}
cat > lib/data/students.ts <<'EOF'
import { prisma } from "@/lib/prisma";


export async function getStudents() {

  return prisma.student.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

}
cat > lib/data/employers.ts <<'EOF'
import { prisma } from "@/lib/prisma";


export async function getEmployers() {

  return prisma.employer.findMany({
    include: {
      opportunities: true,
    },
  });

}
cat > lib/data/opportunities.ts <<'EOF'
import { prisma } from "@/lib/prisma";


export async function getOpportunities() {

  return prisma.opportunity.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

}
