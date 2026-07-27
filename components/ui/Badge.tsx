export default function Badge({
  status,
}: {
  status: string;
}) {

  return (
    <span className="fr-badge">
      {status}
    </span>
  );
}
