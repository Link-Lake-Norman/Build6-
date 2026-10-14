import type { Metadata } from "next";
import "./globals.css";
import "./public-header-educators-hotfix.css";
import "./approved-public-pages.css";
import "./public-visual-stability.css";
import "./build6-sitewide-contrast.css";

import RouteAwareFooter from "./components/RouteAwareFooter";

export const metadata: Metadata = {
  title: "BUILD6™",
  description:
    "Real skills. Real experiences. Real-world readiness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <RouteAwareFooter />
      </body>
    </html>
  );
}


