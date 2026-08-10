import PortalHeader from "@/components/layout/PortalHeader";
import { adminNavigation, adminProfile } from "@/content/admin-portal";

export default function AdminShell({
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
          portalName="Administrator Portal"
          activePath={activePath}
          navigation={adminNavigation}
          userName={adminProfile.name}
          userRole={adminProfile.role}
          userInitials={adminProfile.initials}
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
