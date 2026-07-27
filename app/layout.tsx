import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Future Ready™",
  description: "Discover Purpose. Build Skills. Launch Your Future.",
};

function Navbar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-6 p-4">
        <Link href="/">Home</Link>
        <Link href="/academy">Academy</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/lesson">Lessons</Link>
        <Link href="/student-portal">Student Portal</Link>
        <Link href="/employer-hub">Employer Hub</Link>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}