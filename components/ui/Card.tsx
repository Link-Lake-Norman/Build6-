export default function Card({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="metric-card">
      {children}
    </div>
  );
}
