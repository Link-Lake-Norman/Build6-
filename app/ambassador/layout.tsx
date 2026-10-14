import type { ReactNode } from "react";

import AmbassadorWorkspaceShell from "@/components/ambassador/AmbassadorWorkspaceShell";
import { getSessionUser } from "@/lib/auth/session";

import AccessibilityLearningTools from "@/components/student/AccessibilityLearningTools";
import Build6StudentPriorityAlert from "@/components/student/Build6StudentPriorityAlert";

export default async function AmbassadorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionUser();

  return (
    <AmbassadorWorkspaceShell session={session}>
      {session?.role === "STUDENT" && session.studentId ? (
        <Build6StudentPriorityAlert studentId={session.studentId} />
      ) : null}
      {children}
      <AccessibilityLearningTools
        role={session?.role ?? null}
        studentId={session?.studentId ?? null}
      />
    </AmbassadorWorkspaceShell>
  );
}
