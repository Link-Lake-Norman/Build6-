import Image from "next/image";
import Link from "next/link";

export default function FutureReadyHeader() {

  return (
    <header className="border-b bg-white">

      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        <Link
          href="/"
          className="flex items-center"
        >

          <Image
            src="/brand/future-ready-logo.svg"
            alt="BUILD6"
            width={280}
            height={60}
            priority
          />

        </Link>


        <nav className="flex gap-6 text-sm font-semibold">

          <Link href="/student-portal">
            Student
          </Link>

          <Link href="/ambassador">
            Partners
          </Link>

          <Link href="/employer-hub">
            Employers
          </Link>

          <Link href="/admin">
            Admin
          </Link>

        </nav>

      </div>

    </header>
  );

}
