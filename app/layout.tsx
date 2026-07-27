import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Future Ready™",
  description:
    "Discover Purpose. Build Skills. Launch Your Future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>

        <header>

          <nav>

            <Link href="/">
              Future Ready™
            </Link>


            <Link href="/student-portal">
              Student Portal
            </Link>


            <Link href="/employer-hub">
              Employer Hub
            </Link>


            <Link href="/impact-dashboard">
              Impact
            </Link>


            <Link href="/admin">
              Admin
            </Link>

          </nav>

        </header>


        {children}

      </body>
    </html>
  );
}
