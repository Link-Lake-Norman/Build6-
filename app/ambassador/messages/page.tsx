import { redirect } from "next/navigation";
import MessagesWorkspace from "@/components/messaging/MessagesWorkspace";
import { getSessionUser } from "@/lib/auth/session";

const allowedRoles = new Set([
  "STUDENT",
  "FACILITATOR",
  "SCHOOL_ADMIN",
  "ORGANIZATION_ADMIN",
  "SUPER_ADMIN",
]);

export default async function AmbassadorMessagesPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/ambassador/login");
  }

  if (!allowedRoles.has(session.role)) {
    redirect("/ambassador");
  }

  return (
    <main className="min-h-screen bg-[#F5F8FB] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00A6A6]">
            BUILD6™ Communication
          </p>

          <h1 className="mt-2 text-3xl font-black text-[#0B3B60]">Messages</h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Communicate directly with authorized students, facilitators, and
            program administrators.
          </p>
        </div>

        <MessagesWorkspace />
      </div>
    </main>
  );
}
