"use client";

import { useEffect, useMemo, useState } from "react";
import { curriculum } from "@/content/platform";
import {
  createLessonCustomization,
  LESSON_BUILDER_PERMISSION_KEY,
  LESSON_BUILDER_STORAGE_KEY,
  type LessonCustomization,
  type LessonResource,
  type LessonResourceType,
} from "@/content/lesson-builder";

type PermissionSnapshot = {
  facilitatorLessonBuilder?: boolean;
  facilitatorAddActivities?: boolean;
  facilitatorUploadLessonResources?: boolean;
  facilitatorPublishLessonChanges?: boolean;
  facilitatorEditCoreCurriculum?: boolean;
};

const resourceTypes: LessonResourceType[] = [
  "Facilitator Guide",
  "Student Workbook",
  "Slides",
  "Activity",
  "Role Play",
  "Improv",
  "Case Scenario",
  "Video",
  "Handout",
  "Link",
];

function loadCustomizations(): LessonCustomization[] {
  try {
    const saved = window.localStorage.getItem(LESSON_BUILDER_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as LessonCustomization[]) : [];
  } catch {
    return [];
  }
}

function loadPermissions(): PermissionSnapshot {
  try {
    const saved = window.localStorage.getItem(LESSON_BUILDER_PERMISSION_KEY);
    return saved ? (JSON.parse(saved) as PermissionSnapshot) : {};
  } catch {
    return {};
  }
}

export default function LessonBuilderPage() {
  const [week, setWeek] = useState(1);
  const [mode, setMode] = useState<"Admin" | "Facilitator">("Admin");
  const [customizations, setCustomizations] = useState<LessonCustomization[]>([]);
  const [permissions, setPermissions] = useState<PermissionSnapshot>({});
  const [saved, setSaved] = useState(false);
  const [resourceDraft, setResourceDraft] = useState({
    title: "",
    type: "Activity" as LessonResourceType,
    url: "",
    notes: "",
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCustomizations(loadCustomizations());
    setPermissions(loadPermissions());
    setHydrated(true);
  }, []);

  const lesson = curriculum.find((item) => item.week === week);

  const customization = useMemo(() => {
    return (
      customizations.find((item) => item.week === week) ??
      createLessonCustomization(week)
    );
  }, [customizations, week]);

  const facilitatorCanEdit = permissions.facilitatorLessonBuilder === true;
  const canEdit = mode === "Admin" || facilitatorCanEdit;
  const canAddActivities =
    mode === "Admin" || permissions.facilitatorAddActivities === true;
  const canAddResources =
    mode === "Admin" || permissions.facilitatorUploadLessonResources === true;
  const canPublish =
    mode === "Admin" || permissions.facilitatorPublishLessonChanges === true;

  function update<K extends keyof LessonCustomization>(
    field: K,
    value: LessonCustomization[K],
  ) {
    if (!canEdit) return;

    setCustomizations((current) => {
      const existing = current.some((item) => item.week === week);
      const next: LessonCustomization = {
        ...customization,
        [field]: value,
        editedBy: mode,
      };

      return existing
        ? current.map((item) => (item.week === week ? next : item))
        : [...current, next];
    });
    setSaved(false);
  }

  function save(status: LessonCustomization["status"]) {
    if (!canEdit) return;

    const resolvedStatus = status === "Published" && !canPublish
      ? "Pending Approval"
      : status;

    const nextItem: LessonCustomization = {
      ...customization,
      status: resolvedStatus,
      editedBy: mode,
      updatedAt: new Date().toISOString(),
    };

    const next = customizations.some((item) => item.week === week)
      ? customizations.map((item) => (item.week === week ? nextItem : item))
      : [...customizations, nextItem];

    setCustomizations(next);
    window.localStorage.setItem(
      LESSON_BUILDER_STORAGE_KEY,
      JSON.stringify(next),
    );
    setSaved(true);
  }

  function addResource() {
    if (!canAddResources || !resourceDraft.title.trim()) return;

    const resource: LessonResource = {
      id: `lesson-resource-${Date.now()}`,
      title: resourceDraft.title.trim(),
      type: resourceDraft.type,
      url: resourceDraft.url.trim(),
      notes: resourceDraft.notes.trim(),
    };

    update("resources", [...customization.resources, resource]);
    setResourceDraft({
      title: "",
      type: "Activity",
      url: "",
      notes: "",
    });
  }

  function restoreSchoolVersion() {
    const next = customizations.filter((item) => item.week !== week);
    setCustomizations(next);
    window.localStorage.setItem(
      LESSON_BUILDER_STORAGE_KEY,
      JSON.stringify(next),
    );
    setSaved(true);
  }

  if (!hydrated || !lesson) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-8">
        <p className="font-black text-slate-600">Loading Lesson Builder…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[30px] bg-[#0D1B3D] px-7 py-8 text-white shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F2B705]">
            Future Ready™ Lesson Builder
          </p>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black">Build the weekly experience</h1>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-200">
                Customize delivery for Ambassador Christian School without overwriting the Future Ready™ master curriculum.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={mode}
                onChange={(event) =>
                  setMode(event.target.value as "Admin" | "Facilitator")
                }
                className="rounded-xl bg-white px-4 py-3 font-black text-[#0D1B3D]"
              >
                <option>Admin</option>
                <option>Facilitator</option>
              </select>

              <select
                value={week}
                onChange={(event) => setWeek(Number(event.target.value))}
                className="rounded-xl bg-white px-4 py-3 font-black text-[#0D1B3D]"
              >
                {curriculum.map((item) => (
                  <option key={item.week} value={item.week}>
                    Week {item.week} — {item.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {mode === "Facilitator" && !facilitatorCanEdit ? (
          <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-2xl font-black text-amber-950">
              Facilitator editing is turned off
            </h2>
            <p className="mt-2 leading-7 text-amber-900">
              An administrator can turn on Lesson Builder access in Admin → Permissions.
            </p>
          </section>
        ) : null}

        <section className="mt-8 grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-6">
            <section className={cardClass}>
              <p className={eyebrowClass}>MASTER CURRICULUM — READ ONLY</p>
              <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                Week {lesson.week}: {lesson.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-700">{lesson.objective}</p>
              <div className="mt-5 space-y-4">
                <MasterField label="Facilitator Guide" value={lesson.facilitatorGuide} />
                <MasterField label="Student Activity" value={lesson.studentActivity} />
                <MasterField label="Portfolio Evidence" value={lesson.portfolioEvidence} />
                <MasterField label="Badge" value={lesson.badgeEarned} />
              </div>
            </section>

            <section className={cardClass}>
              <p className={eyebrowClass}>VERSION STATUS</p>
              <div className="mt-4 grid gap-3">
                <Status label="School version" value={customization.status} />
                <Status label="Last editor" value={customization.editedBy} />
                <Status
                  label="Last updated"
                  value={customization.updatedAt ? "Saved" : "Not saved yet"}
                />
              </div>

              <button
                type="button"
                onClick={restoreSchoolVersion}
                className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 font-black text-slate-700"
              >
                Restore Future Ready™ master
              </button>
            </section>
          </aside>

          <section className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Field label="Local Session Title">
                <input
                  value={customization.localTitle}
                  disabled={!canEdit}
                  onChange={(event) => update("localTitle", event.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Timing">
                <input
                  value={customization.timing}
                  disabled={!canEdit}
                  onChange={(event) => update("timing", event.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Facilitator Delivery Notes">
              <textarea
                rows={5}
                value={customization.deliveryNotes}
                disabled={!canEdit}
                onChange={(event) => update("deliveryNotes", event.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="grid gap-6 lg:grid-cols-2">
              <Field label="Speaker / Professional">
                <input
                  value={customization.speakerName}
                  disabled={!canEdit}
                  onChange={(event) => update("speakerName", event.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Speaker Topic">
                <input
                  value={customization.speakerTopic}
                  disabled={!canEdit}
                  onChange={(event) => update("speakerTopic", event.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Materials">
              <textarea
                rows={3}
                value={customization.materials}
                disabled={!canEdit}
                onChange={(event) => update("materials", event.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="grid gap-6 lg:grid-cols-2">
              <Field label="Launch / Icebreaker">
                <textarea
                  rows={4}
                  value={customization.launchActivity}
                  disabled={!canAddActivities}
                  onChange={(event) => update("launchActivity", event.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Team Huddle">
                <textarea
                  rows={4}
                  value={customization.teamHuddle}
                  disabled={!canAddActivities}
                  onChange={(event) => update("teamHuddle", event.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Workplace Challenge">
                <textarea
                  rows={4}
                  value={customization.workplaceChallenge}
                  disabled={!canAddActivities}
                  onChange={(event) => update("workplaceChallenge", event.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Role Play">
                <textarea
                  rows={4}
                  value={customization.rolePlay}
                  disabled={!canAddActivities}
                  onChange={(event) => update("rolePlay", event.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Improv">
                <textarea
                  rows={4}
                  value={customization.improv}
                  disabled={!canAddActivities}
                  onChange={(event) => update("improv", event.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Case Scenario">
                <textarea
                  rows={4}
                  value={customization.caseScenario}
                  disabled={!canAddActivities}
                  onChange={(event) => update("caseScenario", event.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Reflection Prompt">
              <textarea
                rows={4}
                value={customization.reflectionPrompt}
                disabled={!canEdit}
                onChange={(event) => update("reflectionPrompt", event.target.value)}
                className={inputClass}
              />
            </Field>

            <section className={cardClass}>
              <h2 className="text-2xl font-black text-[#0D1B3D]">
                Lesson Resources
              </h2>
              <p className="mt-2 text-slate-600">
                Add workbooks, slides, handouts, videos, activities, and links for this school version.
              </p>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <input
                  value={resourceDraft.title}
                  disabled={!canAddResources}
                  onChange={(event) =>
                    setResourceDraft((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Resource title"
                  className={inputClass}
                />

                <select
                  value={resourceDraft.type}
                  disabled={!canAddResources}
                  onChange={(event) =>
                    setResourceDraft((current) => ({
                      ...current,
                      type: event.target.value as LessonResourceType,
                    }))
                  }
                  className={inputClass}
                >
                  {resourceTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>

                <input
                  value={resourceDraft.url}
                  disabled={!canAddResources}
                  onChange={(event) =>
                    setResourceDraft((current) => ({
                      ...current,
                      url: event.target.value,
                    }))
                  }
                  placeholder="URL or shared file link"
                  className={inputClass}
                />

                <input
                  value={resourceDraft.notes}
                  disabled={!canAddResources}
                  onChange={(event) =>
                    setResourceDraft((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Notes"
                  className={inputClass}
                />
              </div>

              <button
                type="button"
                onClick={addResource}
                disabled={!canAddResources || !resourceDraft.title.trim()}
                className="mt-4 rounded-xl bg-[#0D1B3D] px-5 py-3 font-black text-white disabled:opacity-40"
              >
                Add Resource
              </button>

              <div className="mt-6 grid gap-3">
                {customization.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#725500]">
                          {resource.type}
                        </p>
                        <p className="mt-1 font-black text-[#0D1B3D]">
                          {resource.title}
                        </p>
                        {resource.notes ? (
                          <p className="mt-1 text-sm text-slate-600">
                            {resource.notes}
                          </p>
                        ) : null}
                      </div>
                      {resource.url ? (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-black text-[#24569B]"
                        >
                          Open
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => save("Draft")}
                disabled={!canEdit}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-700 disabled:opacity-40"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => save("Pending Approval")}
                disabled={!canEdit}
                className="rounded-xl bg-[#725500] px-5 py-3 font-black text-white disabled:opacity-40"
              >
                Submit for Approval
              </button>

              <button
                type="button"
                onClick={() => save("Published")}
                disabled={!canEdit}
                className="rounded-xl bg-[#0D1B3D] px-5 py-3 font-black text-white disabled:opacity-40"
              >
                {canPublish ? "Publish to Cohort" : "Submit to Admin"}
              </button>
            </div>

            {saved ? (
              <p className="font-black text-emerald-700">
                Lesson version saved.
              </p>
            ) : null}
          </section>
        </section>
      </div>
    </main>
  );
}

const cardClass =
  "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";
const eyebrowClass =
  "text-sm font-black uppercase tracking-[0.14em] text-[#725500]";
const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#F2B705] focus:ring-2 focus:ring-[#F2B705]/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cardClass}>
      <span className={eyebrowClass}>{label}</span>
      {children}
    </label>
  );
}

function MasterField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
        {value}
      </p>
    </div>
  );
}

function Status({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
      <span className="font-bold text-slate-600">{label}</span>
      <span className="font-black text-[#0D1B3D]">{value}</span>
    </div>
  );
}
