import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://build6.education"),

  title: {
    default: "BUILD6™ | Build What's Next",
    template: "%s | BUILD6™",
  },

  description:
    "BUILD6™ is an experiential development platform that helps students, athletes, teams and employees build real-world skills, confidence, connections and readiness for what comes next.",

  applicationName: "BUILD6™",

  keywords: [
    "BUILD6",
    "career readiness",
    "life readiness",
    "workforce readiness",
    "student development",
    "student athlete development",
    "soft skills training",
    "employee development",
    "employee retention",
    "professional development",
    "career exploration",
    "work-based learning",
    "financial literacy",
    "AI literacy",
    "leadership development",
    "communication skills",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://build6.education",
    siteName: "BUILD6™",
    title: "BUILD6™ | Build What's Next",
    description:
      "Real skills. Real experiences. Real-world readiness. BUILD6™ helps people discover who they are, build the skills that matter and prepare for what comes next.",
  },

  twitter: {
    card: "summary_large_image",
    title: "BUILD6™ | Build What's Next",
    description:
      "Real skills. Real experiences. Real-world readiness.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
