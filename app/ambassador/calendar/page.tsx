import { redirect } from "next/navigation";

import MonthlyProgramCalendar from "@/components/ambassador/calendar/MonthlyProgramCalendar";
import { getSessionUser } from "@/lib/auth/session";

export default async function AmbassadorCalendarPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/ambassador/login");
  }

  const editable =
    session.role === "FACILITATOR" ||
    session.role === "SCHOOL_ADMIN" ||
    session.role === "ORGANIZATION_ADMIN" ||
    session.role === "SUPER_ADMIN";

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 md:px-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#008F95]">
          FUTURE READY™
        </p>

        <h1 className="mt-1 text-3xl font-black text-[#0D1B3D]">
          Monthly Program Calendar
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Look ahead at class topics, speakers, field experiences and preparation.
        </p>
      </div>

      <MonthlyProgramCalendar editable={editable} />
    </div>
  );
}
