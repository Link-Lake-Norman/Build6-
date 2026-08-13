import type { ReactNode } from "react";
import PlatformHeader from "@/components/PlatformHeader";
import PageHistoryControls from "@/components/navigation/PageHistoryControls";
import { getSessionUser } from "@/lib/auth/session";

export default async function AmbassadorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionUser();

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <PlatformHeader session={session} />

      <PageHistoryControls />

      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        {children}
      </div>
    </div>
  );
}
