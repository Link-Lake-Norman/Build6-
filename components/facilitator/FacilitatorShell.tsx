import type { CSSProperties, ReactNode } from "react";
import PortalHeader from "@/components/layout/PortalHeader";
import {
  facilitatorNavigation,
  facilitatorProfile,
} from "@/content/facilitator";

export default function FacilitatorShell({
  activePath,
  children,
}: {
  activePath: string;
  children: ReactNode;
}) {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <PortalHeader
          portalName="Facilitator Portal"
          activePath={activePath}
          navigation={facilitatorNavigation}
          userName={facilitatorProfile.name}
          userRole={facilitatorProfile.role}
          userInitials={facilitatorProfile.initials}
        />

        <section style={styles.content}>
          {children}
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#F5F7FA",
    padding: "24px",
  },
  container: {
    maxWidth: "1500px",
    margin: "0 auto",
  },
  content: {
    marginTop: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
};