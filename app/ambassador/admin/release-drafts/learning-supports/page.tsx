import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LearningSupportsDraft() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/ambassador/login");
  }

  if (![
    "SUPER_ADMIN",
    "ORGANIZATION_ADMIN",
    "SCHOOL_ADMIN"
  ].includes(session.role)) {
    redirect("/ambassador");
  }

  return (
    <main className="mx-auto max-w-5xl p-8 text-[#0D1B3D]">
      <Link
        href="/ambassador/admin"
        className="font-bold underline"
      >
        Back to Admin
      </Link>

      <p className="mt-8 font-black uppercase text-amber-700">
        Unpublished · Admin Release Draft
      </p>

      <h1 className="mt-4 text-4xl font-black">
        Accessibility &amp; Learning Supports
      </h1>

      <p className="mt-6 text-lg">
        Optional paid BUILD6 school or organization
        service. Pricing and licensing are pending
        approval.
      </p>

      <section className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="text-2xl font-black">
          Planned service components
        </h2>

        <ul className="mt-4 list-disc space-y-3 pl-6 text-lg">
          <li>Authorized staff coordination</li>
          <li>School implementation support</li>
          <li>Privacy-conscious access</li>
        </ul>
      </section>

      <p className="mt-8 rounded-xl border border-amber-300
                    bg-amber-50 p-5">
        Release status: HOLD. This is an editorial
        draft, not an active publishing control.
        Paid entitlements require separate implementation.
        Legally required accommodations must not depend
        on purchasing this service.
      </p>
    </main>
  );
}
