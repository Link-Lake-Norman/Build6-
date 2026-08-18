"use client";

import { useEffect, useMemo, useState } from "react";

type CalendarItem = {
  id: string;
  weekNumber: number;
  dayNumber: number;
  experienceType: string;
  title: string;
  description: string | null;
  eventDate: string | null;
  startTime: string | null;
  endTime: string | null;
  siteName: string | null;
  preTripPreparation: string | null;
  studentVisibleNotes: string | null;
  visibleToStudent: boolean;
  status: string;
};

type Props = {
  cohortCode?: string;
  editable?: boolean;
  compact?: boolean;
};

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function MonthlyProgramCalendar({
  cohortCode = "PILOT-2026-2027",
  editable = false,
  compact = false,
}: Props) {
  const [month, setMonth] = useState(() => new Date());
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [draft, setDraft] = useState({
    title: "",
    eventDate: "",
    weekNumber: 1,
    dayNumber: 1,
    experienceType: "GUEST_SPEAKER",
    description: "",
    startTime: "",
    endTime: "",
    siteName: "",
    preTripPreparation: "",
    studentVisibleNotes: "",
    visibleToStudent: true,
  });

  async function load() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/ambassador/calendar?cohortCode=${encodeURIComponent(
          cohortCode
        )}&month=${monthKey(month)}`,
        { cache: "no-store" }
      );

      const body = await response.json();

      if (response.ok) {
        setItems(Array.isArray(body.items) ? body.items : []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [cohortCode, month]);

  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const leading = first.getDay();
    const result: Array<Date | null> = [];

    for (let i = 0; i < leading; i += 1) result.push(null);

    for (let day = 1; day <= last.getDate(); day += 1) {
      result.push(new Date(month.getFullYear(), month.getMonth(), day));
    }

    while (result.length % 7 !== 0) result.push(null);

    return result;
  }, [month]);

  function clearDraft(date?: string) {
    setEditingId(null);
    setDraft({
      title: "",
      eventDate: date ?? "",
      weekNumber: 1,
      dayNumber: 1,
      experienceType: "GUEST_SPEAKER",
      description: "",
      startTime: "",
      endTime: "",
      siteName: "",
      preTripPreparation: "",
      studentVisibleNotes: "",
      visibleToStudent: true,
    });
  }

  function openNew(date?: string) {
    clearDraft(date);
    setShowEditor(true);
  }

  function openEdit(item: CalendarItem) {
    if (!editable) return;

    setEditingId(item.id);
    setDraft({
      title: item.title,
      eventDate: item.eventDate ? item.eventDate.slice(0, 10) : "",
      weekNumber: item.weekNumber,
      dayNumber: item.dayNumber,
      experienceType: item.experienceType,
      description: item.description ?? "",
      startTime: item.startTime ?? "",
      endTime: item.endTime ?? "",
      siteName: item.siteName ?? "",
      preTripPreparation: item.preTripPreparation ?? "",
      studentVisibleNotes: item.studentVisibleNotes ?? "",
      visibleToStudent: item.visibleToStudent,
    });
    setShowEditor(true);
  }

  async function save() {
    if (!draft.title.trim() || !draft.eventDate) return;

    const response = await fetch("/api/ambassador/calendar", {
      method: editingId ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingId,
        cohortCode,
        ...draft,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      window.alert(body?.error ?? "Calendar item could not be saved.");
      return;
    }

    setShowEditor(false);
    clearDraft();
    await load();
  }

  function moveMonth(amount: number) {
    setMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1)
    );
  }

  return (
    <section
      className={
        compact
          ? "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          : "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#008F95]">
            PROGRAM CALENDAR
          </p>

          <h2
            className={
              compact
                ? "mt-1 text-lg font-black text-[#0D1B3D]"
                : "mt-1 text-2xl font-black text-[#0D1B3D]"
            }
          >
            {formatMonth(month)}
          </h2>

          {!compact && (
            <p className="mt-1 text-sm text-slate-500">
              See topics, speakers, field experiences and preparation ahead.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-black text-[#0D1B3D]"
          >
            ←
          </button>

          <button
            type="button"
            onClick={() => setMonth(new Date())}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-[#0D1B3D]"
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => moveMonth(1)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-black text-[#0D1B3D]"
          >
            →
          </button>

          {editable && (
            <button
              type="button"
              onClick={() => openNew()}
              className="rounded-xl bg-[#0D1B3D] px-3 py-2 text-xs font-black text-white"
            >
              + Add
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-slate-400">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return (
              <div
                key={`blank-${index}`}
                className="min-h-16 rounded-lg bg-slate-50"
              />
            );
          }

          const key = dateKey(date);

          const dayItems = items.filter(
            (item) => item.eventDate?.slice(0, 10) === key
          );

          return (
            <button
              type="button"
              key={key}
              onClick={() => {
                if (editable && dayItems.length === 0) openNew(key);
              }}
              className="min-h-16 rounded-lg border border-slate-100 bg-white p-1.5 text-left hover:border-[#00A6A6]"
            >
              <span className="text-[10px] font-black text-slate-500">
                {date.getDate()}
              </span>

              <div className="mt-1 space-y-1">
                {dayItems.slice(0, compact ? 1 : 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      openEdit(item);
                    }}
                    className="rounded-md bg-[#E8F7F7] px-1.5 py-1 text-[9px] font-black leading-3 text-[#075E63]"
                    title={item.title}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {loading && (
        <p className="mt-3 text-xs font-bold text-slate-400">
          Loading calendar…
        </p>
      )}

      {showEditor && editable && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-black text-[#0D1B3D]">
              {editingId ? "Edit Calendar Item" : "Add Calendar Item"}
            </h3>

            <button
              type="button"
              onClick={() => setShowEditor(false)}
              className="text-sm font-black text-slate-500"
            >
              Close
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Topic, speaker or experience"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            />

            <input
              type="date"
              value={draft.eventDate}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  eventDate: event.target.value,
                }))
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            />

            <select
              value={draft.experienceType}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  experienceType: event.target.value,
                }))
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="GUEST_SPEAKER">Guest Speaker</option>
              <option value="FIELD_TRIP">Field Trip</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="CAREER_EXPLORATION">Career Exploration</option>
              <option value="CLASS_EVENT">Class Event</option>
            </select>

            <input
              value={draft.siteName}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  siteName: event.target.value,
                }))
              }
              placeholder="Location / organization"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={1}
                max={16}
                value={draft.weekNumber}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    weekNumber: Number(event.target.value),
                  }))
                }
                placeholder="Week"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />

              <input
                type="number"
                min={1}
                max={5}
                value={draft.dayNumber}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    dayNumber: Number(event.target.value),
                  }))
                }
                placeholder="Day"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="time"
                value={draft.startTime}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    startTime: event.target.value,
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />

              <input
                type="time"
                value={draft.endTime}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    endTime: event.target.value,
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>

          <textarea
            value={draft.preTripPreparation}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                preTripPreparation: event.target.value,
              }))
            }
            placeholder="Preparation needed — materials, speaker prep, student questions, etc."
            className="mt-3 min-h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          />

          <textarea
            value={draft.studentVisibleNotes}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                studentVisibleNotes: event.target.value,
              }))
            }
            placeholder="Student-facing note"
            className="mt-3 min-h-16 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          />

          <label className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-600">
            <input
              type="checkbox"
              checked={draft.visibleToStudent}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  visibleToStudent: event.target.checked,
                }))
              }
            />
            Show this item to students
          </label>

          <button
            type="button"
            onClick={save}
            className="mt-4 rounded-xl bg-[#00A6A6] px-4 py-2 text-sm font-black text-white"
          >
            {editingId ? "Save Changes" : "Add to Calendar"}
          </button>
        </div>
      )}
    </section>
  );
}
