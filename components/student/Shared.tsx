export function StudentHero({
  eyebrow,
  title,
  description,
  meta,
  symbol = "✦",
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

export function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <article style={styles.metric}>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.metricValue}>{value}</div>
      <div style={styles.metricDescription}>{description}</div>
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

export function Pill({ value }: { value: string }) {
  const key = value.toLowerCase();
  const palette =
    key.includes("complete") || key.includes("earned") || key.includes("approved") || key.includes("strong")
      ? { background: "#DCFCE7", color: "#166534" }
      : key.includes("current") || key.includes("pending") || key.includes("progress") || key.includes("developing")
        ? { background: "#FEF3C7", color: "#92400E" }
        : { background: "#E8ECF2", color: "#596273" };

  return <span style={{ ...styles.pill, ...palette }}>{value}</span>;
}

export const studentStyles: Record<string, React.CSSProperties> = {
  metricGrid: {
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
  sectionTitle: { margin: "7px 0 0", color: "#0D1B3D", fontSize: "22px" },
  sectionDescription: { margin: "8px 0 0", color: "#6B7280", fontSize: "13px", lineHeight: 1.6 },
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
  symbol: {
    width: "128px", height: "128px", display: "grid", placeItems: "center",
    flexShrink: 0, border: "2px solid rgba(242,183,5,.8)", borderRadius: "999px",
    color: "#F2B705", fontSize: "54px",
  },
  metric: { padding: "22px", background: "#FFFFFF", border: "1px solid #E3E8F0", borderRadius: "18px", boxShadow: "0 8px 22px rgba(13,27,61,.05)" },
  metricLabel: { color: "#6B7280", fontSize: "10px", fontWeight: 850, letterSpacing: ".08em", textTransform: "uppercase" },
  metricValue: { marginTop: "8px", color: "#0D1B3D", fontSize: "31px", fontWeight: 950 },
  metricDescription: { marginTop: "4px", color: "#7A8494", fontSize: "10px" },
  track: { height: "8px", background: "#E9EDF3", borderRadius: "999px", overflow: "hidden" },
  fill: { height: "100%", background: "#F2B705", borderRadius: "999px" },
  pill: { display: "inline-flex", padding: "6px 9px", borderRadius: "999px", fontSize: "9px", fontWeight: 900, whiteSpace: "nowrap" },
};
