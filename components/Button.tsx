import Link from "next/link";

interface ButtonProps {
  href: string;
  label: string;
}

export default function Button({
  href,
  label,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
    >
      {label}
    </Link>
  );
}
