import Link from "next/link";
import Image from "next/image";
import { studentAccounts } from "@/content/student-accounts";
import { studentProgress } from "@/content/student-progress";
import { studentProfiles } from "@/content/student-profiles";

export default async function StudentPortalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const student = studentAccounts.find(
    (student) => student.id === id
  );

  const progress = studentProgress.find(
    (item) => item.studentId === id
  );

  const profile = studentProfiles.find(
    (item) => item.studentId === id
  );

  if (!student || !progress || !profile) {
    return (
      <main className="p-8">
        Student not found
      </main>
    );
  }

  return (
    <main className="space-y-8">

      <section className="rounded-2xl bg-[#0B1F3A] p-8 text-white border-b-4 border-[#D4AF37]">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold">
              Welcome, {student.name}
            </h1>

            <p className="mt-3 text-lg">
              Your Future Ready™ Student Passport
            </p>

            <p className="mt-2 text-sm text-gray-200">
              Discover Purpose. Build Skills. Launch Your Future.
            </p>

          </div>


          <Image
            src="/brand/future-ready-logo.svg"
            alt="Future Ready"
            width={220}
            height={60}
          />

        </div>

      </section>


      <section className="grid md:grid-cols-4 gap-5">

        {[
          {
            title: "Current Week",
            value: progress.currentWeek,
          },
          {
            title: "Lessons",
            value: progress.lessonsCompleted,
          },
          {
            title: "Badges",
            value: progress.badges.length,
          },
          {
            title: "Profile",
            value: profile.profileComplete
              ? "Complete"
              : "Needs Completion",
          },
        ].map((card) => (

          <div
            key={card.title}
            className="rounded-xl bg-white border p-5 shadow-sm"
          >

            <h2 className="font-bold text-[#0B1F3A]">
              {card.title}
            </h2>

            <p className="text-3xl font-bold mt-3">
              {card.value}
            </p>

          </div>

        ))}

      </section>


      <section className="rounded-2xl bg-white border p-8">

        <h2 className="text-2xl font-bold text-[#0B1F3A]">
          Student Profile
        </h2>


        <div className="mt-5 space-y-2">

          <p>
            <strong>School:</strong> {student.school}
          </p>

          <p>
            <strong>Cohort:</strong> {student.cohort}
          </p>

          <p>
            <strong>Grade:</strong> {student.grade}
          </p>

        </div>


        <Link
          href={`/ambassador/student-portal/${id}/profile`}
          className="inline-block mt-6 rounded-lg bg-[#0B1F3A] px-6 py-3 text-white border-b-4 border-[#D4AF37]"
        >
          Build My Future Ready Profile →
        </Link>

      </section>


    </main>
  );
}
