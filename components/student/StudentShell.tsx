import PortalHeader from "@/components/layout/PortalHeader";
import { studentNavigation, studentProfile } from "@/content/student-portal";

export default function StudentShell({
  activePath,
  children,
}: {
  activePath: string;
  children: React.ReactNode;
}) {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <PortalHeader
          portalName="Student Experience"
          activePath={activePath}
          navigation={studentNavigation}
          userName={studentProfile.name}
          userRole={studentProfile.cohort}
          userInitials={studentProfile.initials}
        />
        {children}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    background: "#F5F7FA",
    color: "#0D1B3D",
  },
  container: {
    width: "100%",
    maxWidth: "1480px",
    margin: "0 auto",
  },
};
