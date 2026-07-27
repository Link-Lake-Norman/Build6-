export default function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {

  return (
    <div className="metric-card">

      <h3>
        {title}
      </h3>

      <strong>
        {value}
      </strong>

    </div>
  );
}
