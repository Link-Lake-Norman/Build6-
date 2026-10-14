import { readFile } from "node:fs/promises";
import path from "node:path";
import { getSessionUser } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store, max-age=0", "X-Robots-Tag": "noindex, nofollow, noarchive", "X-Content-Type-Options": "nosniff" };

export async function GET(request: Request) {
  const session = await getSessionUser();
  if (!session) return new Response("Authentication required", { status: 401, headers });
  if (session.role !== "SUPER_ADMIN") return new Response("Owner administrator access required", { status: 403, headers });
  try {
    const file = await readFile(path.join(process.cwd(), "protected-resources", "books-toolkits", "BUILD6-Internship-Playbook-REVIEW.pdf"));
    const disposition = new URL(request.url).searchParams.get("download") === "1" ? "attachment" : "inline";
    return new Response(new Uint8Array(file), { headers: { ...headers, "Content-Type": "application/pdf", "Content-Length": String(file.length), "Content-Disposition": `${disposition}; filename="BUILD6-Internship-Playbook-REVIEW.pdf"` } });
  } catch {
    return new Response("The Internship Playbook review PDF is temporarily unavailable", { status: 503, headers });
  }
}
