"use client";

import { usePathname } from "next/navigation";
import PublicFooter from "./PublicFooter";

/* Public pages already render their own footer, and /ambassador uses its
   authenticated workspace shell. Avoid duplicating those footers. */
const alreadyHasFooter = new Set([
  "/",
  "/about",
  "/ai-coach",
  "/assessment",
  "/athletes",
  "/athletes/professionals",
  "/connect",
  "/educators",
  "/interest",
  "/partners",
  "/schools",
  "/sponsor",
  "/workforces",
]);

export default function RouteAwareFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/ambassador") || alreadyHasFooter.has(pathname)) return null;
  return <PublicFooter />;
}
