import type { ReactNode } from "react";

import AmbassadorWorkspaceShell from "@/components/ambassador/AmbassadorWorkspaceShell";
import { getSessionUser } from "@/lib/auth/session";

import AccessibilityLearningTools from "@/components/student/AccessibilityLearningTools";

export default async function AmbassadorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionUser();

  return (
    <AmbassadorWorkspaceShell session={session}>
      {children}
      <AccessibilityLearningTools
        role={session?.role ?? null}
        studentId={session?.studentId ?? null}
      />
    </AmbassadorWorkspaceShell>
  );
}
