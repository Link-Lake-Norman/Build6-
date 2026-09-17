import type { Metadata } from "next";

import Build6CompanionBottomNav from "@/components/student/Build6CompanionBottomNav";
import Build6CompanionInstall from "@/components/student/Build6CompanionInstall";

export const metadata: Metadata = {
  title: "BUILD6 Student Companion",
  description:
    "BUILD6 Student Companion — Build What's Next.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "BUILD6",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: [
      {
        url: "/build6-icon-180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default async function Build6CompanionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  return (
    <>
      <Build6CompanionInstall />

      {children}

      <Build6CompanionBottomNav studentId={id} />
    </>
  );
}
