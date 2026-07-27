export default function Table({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <table>

      <tbody>
        {children}
      </tbody>

    </table>
  );
}
