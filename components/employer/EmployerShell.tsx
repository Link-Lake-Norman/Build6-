import PortalHeader from "@/components/layout/PortalHeader";
import { employerNavigation, employerProfile } from "@/content/employer-portal";

export default function EmployerShell({
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
          portalName="Employer Portal"
          activePath={activePath}
          navigation={employerNavigation}
          userName={employerProfile.contactName}
          userRole={employerProfile.companyName}
          userInitials={employerProfile.initials}
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
