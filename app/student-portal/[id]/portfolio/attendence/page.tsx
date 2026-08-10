import Link from "next/link";
import { notFound } from "next/navigation";
import { ambassadorStudents } from "@/content/ambassador-students";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type AttendanceStatus =
  | "Present"
  | "Late"
  | "Absent"
  | "Excused";

type AttendanceRecord = {
  week: number;
  date: string;
  status: AttendanceStatus;
  notes: string;
};

export default async function StudentAttendancePage({
  params,
}: PageProps) {
  const { id } = await params;

  const student = ambassadorStudents.find(
    (item) => item.id === id
  );

  if (!student) {
    notFound();
  }

  const records: AttendanceRecord[] = Array.from(
    {
      length: Math.max(student.currentWeek, 1),
    },
    (_, index) => ({
      week: index + 1,
      date: `Week ${index + 1} Session`,
      status: "Present",
      notes: "Participated in the weekly Future Ready session.",
    })
  );

  const presentCount = records.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = records.filter(
    (record) => record.status === "Absent"
  ).length;

  const lateCount = records.filter(
    (record) => record.status === "Late"
  ).length;

  const excusedCount = records.filter(
    (record) => record.status === "Excused"
  ).length;

  const attendanceRate =
    records.length > 0
      ? Math.round(
          (presentCount / records.length) * 100
        )
      : 100;

  return (
    <main className="space-y-10">
      <header className="rounded-3xl bg-[#0D1B3D] px-8 py-10 text-white shadow-lg">
        <Link
          href={`/ambassador/student-portal/${student.id}`}
          className="inline-flex font-bold text-[#F2B705] hover:underline"
        >
          ← Back to Student Profile
        </Link>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
          Ambassador Christian School
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Attendance Record
        </h1>

        <p className="mt-3 text-lg leading-8 text-slate-200">
          {student.name} · Future Ready™ Pilot
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Attendance Rate"
          value={`${attendanceRate}%`}
          detail="Overall participation"
        />

        <StatCard
          label="Present"
          value={String(presentCount)}
          detail="Sessions attended"
        />

        <StatCard
          label="Late"
          value={String(lateCount)}
          detail="Late arrivals"
        />

        <StatCard
          label="Absent"
          value={String(absentCount)}
          detail="Unexcused absences"
        />

        <StatCard
          label="Excused"
          value={String(excusedCount)}
          detail="Excused absences"
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-slate-200 px-8 py-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
              Participation History
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
              Weekly Attendance
            </h2>
          </div>

          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0D1B3D] px-6 py-3 font-bold text-white hover:bg-[#172B55]"
          >
            Record Attendance
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-8 py-5 font-bold">
                  Week
                </th>

                <th className="px-5 py-5 font-bold">
                  Session
                </th>

                <th className="px-5 py-5 font-bold">
                  Status
                </th>

                <th className="px-5 py-5 font-bold">
                  Notes
                </th>

                <th className="px-8 py-5 text-right font-bold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {records.map((record) => (
                <tr
                  key={record.week}
                  className="hover:bg-slate-50"
                >
                  <td className="px-8 py-5 font-bold text-[#0D1B3D]">
                    Week {record.week}
                  </td>

                  <td className="px-5 py-5 text-slate-700">
                    {record.date}
                  </td>

                  <td className="px-5 py-5">
                    <AttendanceBadge
                      status={record.status}
                    />
                  </td>

                  <td className="px-5 py-5 text-slate-600">
                    {record.notes}
                  </td>

                  <td className="px-8 py-5 text-right">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
          Attendance Impact
        </p>

        <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
          Readiness Connection
        </h2>

        <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">
          Attendance contributes to the Future Ready™ Readiness
          Score because reliability, preparation, and consistent
          participation are essential workplace behaviors.
        </p>

        <div className="mt-7 h-4 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#F2B705]"
            style={{
              width: `${attendanceRate}%`,
            }}
          />
        </div>

        <p className="mt-3 font-bold text-[#0D1B3D]">
          Attendance contribution: {attendanceRate}%
        </p>
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

      <p className="mt-3 text-4xl font-black text-[#0D1B3D]">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {detail}
      </p>
    </article>
  );
}

function AttendanceBadge({
  status,
}: {
  status: AttendanceStatus;
}) {
  const styles: Record<
    AttendanceStatus,
    string
  > = {
    Present:
      "bg-emerald-50 text-emerald-700",
    Late:
      "bg-amber-50 text-amber-800",
    Absent:
      "bg-red-50 text-red-700",
    Excused:
      "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}