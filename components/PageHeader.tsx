interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({
  title,
  subtitle,
}: PageHeaderProps) {
  return (
    <section className="mb-8">

      <h1 className="text-4xl font-bold">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 text-gray-600 text-lg">
          {subtitle}
        </p>
      )}

    </section>
  );
}
