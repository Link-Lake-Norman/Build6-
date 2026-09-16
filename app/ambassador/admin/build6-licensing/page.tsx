import Link from "next/link";
import LicenseControlCenter from "./LicenseControlCenter";

export default function Build6LicensingAdminPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f4f7f9" }}>
      <div
        style={{
          width: "min(1280px, calc(100% - 32px))",
          margin: "0 auto",
          padding: "28px 0 18px",
        }}
      >
        <Link
          href="/ambassador/admin"
          style={{
            color: "#0a5c68",
            fontWeight: 800,
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          ← Back to Admin
        </Link>
      </div>

      <LicenseControlCenter />
    </main>
  );
}
