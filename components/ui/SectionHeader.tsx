export default function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {

  return (
    <div>

      <h2>
        {title}
      </h2>

      {description && (
        <p>
          {description}
        </p>
      )}

    </div>
  );
}
