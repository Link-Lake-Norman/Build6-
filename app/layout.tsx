import type { Metadata } from "next";
import "./globals.css";
import Navigation from "../components/navigation";

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

        <Navigation />

        {children}

      </body>
    </html>
  );
}
