export function EmployerHero({
  eyebrow,
  title,
  description,
  meta,
  symbol = "↗",
}: {
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
  symbol?: string;
}) {
  return (
    <section style={styles.hero}>
      <div>
        <div style={styles.eyebrow}>{eyebrow}</div>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.description}>{description}</p>
        {meta && <div style={styles.meta}>{meta}</div>}
      </div>
      <div style={styles.symbol}>{symbol}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <article style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statDescription}>{description}</div>
    </article>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div style={styles.track}>
      <div style={{ ...styles.fill, width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function StatusPill({ value }: { value: string }) {
  const key = value.toLowerCase();
  const palette =
    key.includes("placed") || key.includes("filled") || key.includes("offer")
      ? { background: "#DCFCE7", color: "#166534" }
      : key.includes("interview") || key.includes("open") || key.includes("recommended")
        ? { background: "#FEF3C7", color: "#92400E" }
        : { background: "#E8ECF2", color: "#596273" };

  return <span style={{ ...styles.pill, ...palette }}>{value}</span>;
}

export const employerStyles: Record<string, React.CSSProperties> = {
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: "16px",
    marginTop: "22px",
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1.35fr) minmax(280px,.75fr)",
    gap: "22px",
    marginTop: "22px",
    alignItems: "start",
  },
  card: {
    background: "#FFFFFF",
    border: "1px solid #E3E8F0",
    borderRadius: "22px",
    boxShadow: "0 10px 28px rgba(13,27,61,.06)",
    overflow: "hidden",
  },
  padding: { padding: "24px" },
  eyebrow: { color: "#A47700", fontSize: "10px", fontWeight: 900, letterSpacing: ".12em" },
  title: { margin: "7px 0 0", color: "#0D1B3D", fontSize: "22px" },
  description: { margin: "8px 0 0", color: "#6B7280", fontSize: "13px", lineHeight: 1.6 },
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    padding: "18px 24px",
    background: "#FAFBFD",
    borderTop: "1px solid #EDF0F5",
    borderBottom: "1px solid #EDF0F5",
  },
  input: {
    minHeight: "42px",
    padding: "10px 13px",
    border: "1px solid #D9DFE8",
    borderRadius: "10px",
    background: "#FFFFFF",
    color: "#0D1B3D",
    fontSize: "12px",
  },
  button: {
    minHeight: "40px",
    padding: "9px 14px",
    border: "none",
    borderRadius: "10px",
    background: "#0D1B3D",
    color: "#FFFFFF",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 850,
  },
  secondaryButton: {
    minHeight: "40px",
    padding: "9px 14px",
    border: "1px solid #F0D46B",
    borderRadius: "10px",
    background: "#FFF7D6",
    color: "#725500",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 850,
  },
};

const styles: Record<string, React.CSSProperties> = {
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "28px",
    marginTop: "22px",
    padding: "38px",
    borderRadius: "26px",
    background: "linear-gradient(135deg,#0D1B3D 0%,#152B5C 62%,#1A376F 100%)",
    color: "#FFFFFF",
    boxShadow: "0 18px 40px rgba(13,27,61,.18)",
  },
  eyebrow: { color: "#F2B705", fontSize: "11px", fontWeight: 900, letterSpacing: ".14em" },
  title: { margin: "10px 0 0", maxWidth: "850px", fontSize: "clamp(34px,5vw,56px)", lineHeight: 1.03, letterSpacing: "-.04em" },
  description: { maxWidth: "760px", margin: "16px 0 0", color: "#D9E2F2", lineHeight: 1.7, fontSize: "15px" },
  meta: { marginTop: "20px", color: "#FFFFFF", fontSize: "12px", fontWeight: 750 },
  symbol: { width: "128px", height: "128px", display: "grid", placeItems: "center", flexShrink: 0, border: "2px solid rgba(242,183,5,.8)", borderRadius: "999px", color: "#F2B705", fontSize: "54px" },
  stat: { padding: "22px", background: "#FFFFFF", border: "1px solid #E3E8F0", borderRadius: "18px", boxShadow: "0 8px 22px rgba(13,27,61,.05)" },
  statLabel: { color: "#6B7280", fontSize: "10px", fontWeight: 850, letterSpacing: ".08em", textTransform: "uppercase" },
  statValue: { marginTop: "8px", color: "#0D1B3D", fontSize: "31px", fontWeight: 950 },
  statDescription: { marginTop: "4px", color: "#7A8494", fontSize: "10px" },
  track: { height: "8px", background: "#E9EDF3", borderRadius: "999px", overflow: "hidden" },
  fill: { height: "100%", background: "#F2B705", borderRadius: "999px" },
  pill: { display: "inline-flex", padding: "6px 9px", borderRadius: "999px", fontSize: "9px", fontWeight: 900, whiteSpace: "nowrap" },
};
