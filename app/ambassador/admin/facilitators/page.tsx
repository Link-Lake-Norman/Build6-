import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";
import FacilitatorForm from "./FacilitatorForm";

export default async function FacilitatorAdminPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/ambassador/login");
  }

  if (session.role !== "SUPER_ADMIN") {
    redirect("/ambassador");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#725500]">
        BUILD6™ Administration
      </p>

      <h1 className="mt-3 text-4xl font-black text-[#0D1B3D]">
        Facilitator Accounts
      </h1>

      <p className="mt-4 max-w-2xl leading-7 text-slate-600">
        Create the live Ambassador facilitator account
        without removing the BUILD6™ demo facilitator.
      </p>

      <FacilitatorForm />
    </main>
  );
}
