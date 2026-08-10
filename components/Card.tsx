import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
}

export default function Card({
  title,
  children,
}: CardProps) {
  return (
    <article className="rounded-xl border bg-white p-6 shadow-sm">

      {title && (
        <h2 className="mb-4 text-xl font-semibold">
          {title}
        </h2>
      )}

      {children}

    </article>
  );
}
