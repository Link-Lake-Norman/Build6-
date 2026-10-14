import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const protectedSources = [
  "content/ambassador/week-01-delivery.ts",
  "content/ambassador/weeks-02-08-delivery.ts",
  "content/ambassador/weeks-09-16-delivery.ts",
];

const missingFiles = protectedSources.filter((rel) => !fs.existsSync(path.join(root, rel)));
if (missingFiles.length) {
  console.error("STOP: BUILD6 preservation guard failed.");
  console.error("Missing authoritative delivery file(s):");
  for (const f of missingFiles) console.error(` - ${f}`);
  process.exit(1);
}

const texts = Object.fromEntries(
  protectedSources.map((rel) => [rel, fs.readFileSync(path.join(root, rel), "utf8")]),
);

const expectedByFile = {
  "content/ambassador/week-01-delivery.ts": [1],
  "content/ambassador/weeks-02-08-delivery.ts": [2,3,4,5,6,7,8],
  "content/ambassador/weeks-09-16-delivery.ts": [9,10,11,12,13,14,15,16],
};

const found = new Set();
const problems = [];
for (const [rel, expected] of Object.entries(expectedByFile)) {
  const text = texts[rel];
  const fileFound = [];
  for (const week of expected) {
    const re = new RegExp(`\\bweek\\s*:\\s*${week}\\s*,`);
    if (re.test(text)) {
      found.add(week);
      fileFound.push(week);
    } else {
      problems.push(`Week ${week} not found in ${rel}`);
    }
  }
  console.log(`${rel}: ${fileFound.length ? `weeks ${fileFound.join(", ")}` : "NO EXPECTED WEEK RECORDS FOUND"}`);
}

const all = Array.from({length:16}, (_,i) => i+1);
const missing = all.filter((w) => !found.has(w));
if (missing.length || problems.length) {
  console.error("\nSTOP: BUILD6 16-week preservation guard failed.");
  if (missing.length) console.error(`Missing protected week records: ${missing.join(", ")}`);
  for (const p of problems) console.error(` - ${p}`);
  console.error("No curriculum content was changed by this check.");
  process.exit(1);
}

console.log("\nPASS: BUILD6 authoritative Ambassador curriculum contains Weeks 1–16.");
console.log("AUTHORITATIVE FILES: week-01, weeks-02-08, weeks-09-16 delivery files");
console.log("LEGACY content/curriculum.ts: ignored by preservation guard");
