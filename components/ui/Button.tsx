export default function Button({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <button className="fr-button">
      {children}
    </button>
  );
}
