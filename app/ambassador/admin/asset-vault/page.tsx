import fs from "fs";
import path from "path";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";

type VaultGroup = {
  title: string;
  description: string;
  status: string;
  directory: string;
};

const groups: VaultGroup[] = [
  {
    title: "Core Curriculum",
    description:
      "Protected Ambassador curriculum, facilitator guides, student workbooks, slides, activities, assessments, portfolio artifacts and badges.",
    status: "ACTIVE / PROTECTED",
    directory: "core-curriculum",
  },
  {
    title: "Financial Literacy + Life Economy",
    description:
      "Recovered Future Ready Friday™, Life Economy, money, decision-making and financial-literacy builds preserved for future activation or licensing.",
    status: "RECOVERED / ADD-ON",
    directory: "financial-literacy",
  },
  {
    title: "Playbooks + Facilitator Guides",
    description:
      "Reserved master library for reusable facilitator playbooks, teaching guides and implementation resources.",
    status: "AVAILABLE",
    directory: "playbooks",
  },
  {
    title: "Activities + Builds",
    description:
      "Reusable classroom activities, AI-generated builds and supplemental teaching tools.",
    status: "AVAILABLE",
    directory: "activities",
  },
  {
    title: "Assessments + Rubrics",
    description:
      "Assessment systems, rubrics, evaluation tools and evidence frameworks.",
    status: "AVAILABLE",
    directory: "assessments",
  },
  {
    title: "Experiences + Speakers",
    description:
      "Speaker Toolkit, experience curriculum, experience activities, slides, field-trip and applied-learning builds.",
    status: "RECOVERED / AVAILABLE",
    directory: "experiences",
  },
  {
    title: "Recovered / Archived Builds",
    description:
      "Older Future Ready™ components retained so a removed feature is never lost simply because it is not active.",
    status: "ARCHIVED",
    directory: "recovered-builds",
  },
];

function countFiles(directory: string) {
  if (!fs.existsSync(directory)) return 0;

  let count = 0;

  function walk(current: string) {
    for (const item of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, item.name);

      if (item.isDirectory()) {
        walk(full);
      } else {
        count += 1;
      }
    }
  }

  walk(directory);
  return count;
}

export default async function AssetVaultPage() {
  const session = await getSessionUser();

  if (
    !session ||
    ![
      "SUPER_ADMIN",
      "SCHOOL_ADMIN",
      "ORGANIZATION_ADMIN",
    ].includes(session.role)
  ) {
    redirect("/ambassador");
  }

  const root = path.join(
    process.cwd(),
    "protected-resources",
    "admin-vault",
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="rounded-3xl bg-[#0D1B3D] p-8 text-white">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
          FUTURE READY™ ADMIN
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Asset Vault
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Private master library for protected curriculum, optional modules,
          recovered builds, playbooks and future add-ons. Nothing stored here
          is automatically activated for a cohort.
        </p>

        <Link
          href="/ambassador/admin"
          className="mt-5 inline-block rounded-xl bg-white px-4 py-2 text-sm font-black text-[#0D1B3D]"
        >
          ← Admin Dashboard
        </Link>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => {
          const directory = path.join(root, group.directory);
          const fileCount = countFiles(directory);

          return (
            <article
              key={group.directory}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-black text-[#0D1B3D]">
                  {group.title}
                </h2>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-[#4B2265]">
                  {group.status}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {group.description}
              </p>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-2xl font-black text-[#0D1B3D]">
                  {fileCount}
                </p>
                <p className="text-xs font-bold text-slate-500">
                  preserved files
                </p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="font-black text-amber-950">
          Vault rule
        </p>
        <p className="mt-2 text-sm leading-6 text-amber-900">
          Assets in this library stay inactive until an authorized administrator
          deliberately chooses to add or activate them in a Future Ready™ program.
        </p>
      </section>
    </main>
  );
}
