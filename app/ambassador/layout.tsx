import type { ReactNode } from "react";

import AmbassadorWorkspaceShell from "@/components/ambassador/AmbassadorWorkspaceShell";
import { getSessionUser } from "@/lib/auth/session";

export default async function AmbassadorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionUser();

  return (
    <AmbassadorWorkspaceShell session={session}>
      {children}
    </AmbassadorWorkspaceShell>
  );
}
