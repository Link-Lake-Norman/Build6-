interface StatCardProps {
  label: string;
  value: string | number;
  detail?: string;
}

export default function StatCard({
  label,
  value,
  detail,
}: StatCardProps) {
  return (
    <article className="rounded-xl border bg-white p-6 shadow-sm">
      <p className="text-gray-500">
        {label}
      </p>

      <h2 className="mt-3 text-4xl font-bold">
        {value}
      </h2>

      {detail ? (
        <p className="mt-2 text-sm text-gray-500">
          {detail}
        </p>
      ) : null}
    </article>
  );
}
