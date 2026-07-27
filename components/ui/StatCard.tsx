export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {

  return (
    <div className="metric-card">

      <p>
        {label}
      </p>

      <strong>
        {value}
      </strong>

    </div>
  );
}
