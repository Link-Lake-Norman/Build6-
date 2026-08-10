import Link from "next/link";
import { ambassadorStudents } from "@/content/ambassador-students";

type StudentRecord = {
  id: string;
  name: string;
  grade: string;
  progress: number;
  currentWeek: number;
  attendance: number;
  activitiesComplete: number;
  reflectionsComplete: number;
  readinessScore: number;
  status: "On Track" | "Needs Support" | "Ahead";
};

function normalizeStudent(
  student: unknown,
  index: number
): StudentRecord {
  const record =
    typeof student === "object" && student !== null
      ? (student as Record<string, unknown>)
      : {};

  const id =
    typeof record.id === "string"
      ? record.id
      : `ambassador-student-${String(index + 1).padStart(3, "0")}`;

  const name =
    typeof record.name === "string"
      ? record.name
      : `Student ${index + 1}`;

  const grade =
    typeof record.grade === "string" ||
    typeof record.grade === "number"
      ? String(record.grade)
      : "10";

  const currentWeek =
    typeof record.currentWeek === "number"
      ? record.currentWeek
      : 1;

  const readinessScore =
    typeof record.readinessScore === "number"
      ? record.readinessScore
      : 0;

  const progress =
    typeof record.progress === "number"
      ? record.progress
      : readinessScore;

  const attendance =
    typeof record.attendance === "number"
      ? record.attendance
      : 100;

  const activitiesComplete =
    typeof record.activitiesComplete === "number"
      ? record.activitiesComplete
      : Math.max(currentWeek - 1, 0);

  const reflectionsComplete =
    typeof record.reflectionsComplete === "number"
      ? record.reflectionsComplete
      : Math.max(currentWeek - 1, 0);

  let status: StudentRecord["status"] = "On Track";

  if (progress < 70) {
    status = "Needs Support";
  }

  if (progress >= 85) {
    status = "Ahead";
  }

  return {
    id,
    name,
    grade,
    progress,
    currentWeek,
    attendance,
    activitiesComplete,
    reflectionsComplete,
    readinessScore,
    status,
  };
}

export default function FacilitatorStudentsPage() {
  const roster = ambassadorStudents
    .slice(0, 20)
    .map((student, index) =>
      normalizeStudent(student, index)
    );

  const averageProgress =
    roster.length > 0
      ? Math.round(
          roster.reduce(
            (total, student) =>
              total + student.progress,
            0
          ) / roster.length
        )
      : 0;

  const averageAttendance =
    roster.length > 0
      ? Math.round(
          roster.reduce(
            (total, student) =>
              total + student.attendance,
            0
          ) / roster.length
        )
      : 0;

  const needsSupport = roster.filter(
    (student) => student.status === "Needs Support"
  ).length;

  return (
    <main className="space-y-10">
      <header className="rounded-3xl bg-[#0D1B3D] px-8 py-10 text-white shadow-lg">
        <Link
          href="/ambassador/facilitator"
          className="inline-flex font-semibold text-[#F2B705] hover:underline"
        >
          ← Back to Facilitator Dashboard
        </Link>

        <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-[#F2B705]">
          Ambassador Christian School
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Student Roster
        </h1>

        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-200">
          Review attendance, weekly progress, activities,
          reflections, readiness, and students who may need
          additional support.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Students Enrolled"
          value={String(roster.length)}
          detail="Ambassador pilot cohort"
        />

        <StatCard
          label="Average Progress"
          value={`${averageProgress}%`}
          detail="Across the full cohort"
        />

        <StatCard
          label="Average Attendance"
          value={`${averageAttendance}%`}
          detail="Current attendance rate"
        />

        <StatCard
          label="Needs Support"
          value={String(needsSupport)}
          detail="Students requiring follow-up"
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-slate-200 px-8 py-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
              Cohort Management
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
              Ambassador Students
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/ambassador/admin"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-[#0D1B3D] px-5 py-3 font-bold text-[#0D1B3D] transition hover:bg-slate-50"
            >
              Manage Students
            </Link>

            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0D1B3D] px-5 py-3 font-bold text-white transition hover:bg-[#172B55]"
            >
              Export Progress Report
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-8 py-5 font-bold">Student</th>
                <th className="px-5 py-5 font-bold">Grade</th>
                <th className="px-5 py-5 font-bold">Week</th>
                <th className="px-5 py-5 font-bold">Attendance</th>
                <th className="px-5 py-5 font-bold">Activities</th>
                <th className="px-5 py-5 font-bold">Reflections</th>
                <th className="px-5 py-5 font-bold">Progress</th>
                <th className="px-5 py-5 font-bold">Readiness</th>
                <th className="px-5 py-5 font-bold">Status</th>
                <th className="px-8 py-5 text-right font-bold">Record</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {roster.map((student) => (
                <tr
                  key={student.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-900">
                      {student.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Ambassador Christian School
                    </p>
                  </td>

                  <td className="px-5 py-6 text-slate-700">
                    {student.grade}
                  </td>

                  <td className="px-5 py-6 text-slate-700">
                    Week {student.currentWeek}
                  </td>

                  <td className="px-5 py-6">
                    <span className="font-semibold text-slate-800">
                      {student.attendance}%
                    </span>
                  </td>

                  <td className="px-5 py-6 text-slate-700">
                    {student.activitiesComplete}
                  </td>

                  <td className="px-5 py-6 text-slate-700">
                    {student.reflectionsComplete}
                  </td>

                  <td className="px-5 py-6">
                    <ProgressBar value={student.progress} />
                  </td>

                  <td className="px-5 py-6">
                    <span className="font-bold text-[#0D1B3D]">
                      {student.readinessScore}%
                    </span>
                  </td>

                  <td className="px-5 py-6">
                    <StatusBadge status={student.status} />
                  </td>

                  <td className="px-8 py-6 text-right">
                    <Link
                      href={`/ambassador/student-portal/${student.id}`}
                      className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#0D1B3D] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#172B55]"
                    >
                      Open Record
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
            Follow-Up
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#0D1B3D]">
            Students Needing Support
          </h2>

          <div className="mt-6 space-y-4">
            {roster.filter(
              (student) => student.status === "Needs Support"
            ).length > 0 ? (
              roster
                .filter(
                  (student) => student.status === "Needs Support"
                )
                .map((student) => (
                  <div
                    key={student.id}
                    className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900">
                        {student.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Progress: {student.progress}% · Attendance:{" "}
                        {student.attendance}%
                      </p>
                    </div>

                    <Link
                      href={`/ambassador/student-portal/${student.id}`}
                      className="font-bold text-[#0D1B3D] hover:underline"
                    >
                      Review →
                    </Link>
                  </div>
                ))
            ) : (
              <div className="rounded-2xl bg-emerald-50 p-6">
                <p className="font-bold text-emerald-800">
                  All students are currently on track.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
            Facilitator Workflow
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#0D1B3D]">
            Weekly Review
          </h2>

          <div className="mt-6 space-y-4">
            <WorkflowItem
              number="1"
              title="Confirm attendance"
              detail="Record who participated in the weekly session."
            />

            <WorkflowItem
              number="2"
              title="Review submissions"
              detail="Check student activities and reflections."
            />

            <WorkflowItem
              number="3"
              title="Identify support needs"
              detail="Flag missing work, concerns, or intervention needs."
            />

            <WorkflowItem
              number="4"
              title="Advance the cohort"
              detail="Move students forward when weekly work is complete."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-4xl font-bold text-[#0D1B3D]">
        {value}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {detail}
      </p>
    </article>
  );
}

function ProgressBar({
  value,
}: {
  value: number;
}) {
  const safeValue = Math.min(
    Math.max(value, 0),
    100
  );

  return (
    <div className="w-36">
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-bold text-slate-700">
          {safeValue}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-[#F2B705]"
          style={{
            width: `${safeValue}%`,
          }}
        />
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: StudentRecord["status"];
}) {
  const styles = {
    "On Track": "bg-emerald-50 text-emerald-700",
    "Needs Support": "bg-amber-50 text-amber-800",
    Ahead: "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-sm font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function WorkflowItem({
  number,
  title,
  detail,
}: {
  number: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2B705] font-bold text-[#0D1B3D]">
        {number}
      </div>

      <div>
        <p className="font-bold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          {detail}
        </p>
      </div>
    </div>
  );
}
