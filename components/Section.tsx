import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
}

export default function Section({
  title,
  children,
}: SectionProps) {
  return (
    <section className="mb-10">

      <h2 className="mb-5 text-2xl font-bold">
        {title}
      </h2>

      {children}

    </section>
  );
}
