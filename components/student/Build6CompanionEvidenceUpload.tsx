"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  studentId: string;
};

export default function Build6CompanionEvidenceUpload({
  studentId,
}: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function upload() {
    setError("");
    setMessage("");

    if (!file) {
      setError("Choose a photo or evidence file first.");
      return;
    }

    if (!title.trim()) {
      setError("Give the evidence a short title.");
      return;
    }

    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("file", file);

    setSaving(true);

    try {
      const response = await fetch("/api/student/companion-evidence", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to upload evidence.");
      }

      setMessage("Saved privately to your BUILD6 evidence portfolio.");
      setTitle("");
      setDescription("");
      setFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      router.refresh();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload evidence.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
        CAPTURE EVIDENCE
      </p>

      <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
        Add a photo or file to my story.
      </h2>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
        Save a photo from a speaker visit, field experience, project,
        certificate, handwritten note, feedback, or another piece of evidence
        that shows what you did or learned.
      </p>

      <div className="mt-6 grid gap-5">
        <label className="block">
          <span className="text-sm font-black text-[#0D1B3D]">
            Evidence title
          </span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Example: Terracon workplace visit"
            maxLength={160}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-[#0D1B3D] outline-none focus:border-[#4B2265]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-black text-[#0D1B3D]">
            Why does this matter?
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="What does this show about your experience, growth, skills or interests?"
            maxLength={1200}
            className="mt-2 w-full rounded-xl border border-slate-300 p-4 text-[#0D1B3D] outline-none focus:border-[#4B2265]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-black text-[#0D1B3D]">
            Photo or evidence file
          </span>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={(event) =>
              setFile(event.target.files?.[0] ?? null)
            }
            className="mt-2 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm"
          />

          <p className="mt-2 text-xs text-slate-500">
            JPG, PNG, WEBP or PDF · maximum 10 MB.
          </p>
        </label>
      </div>

      {error ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
          {message}
        </div>
      ) : null}

      <button
        type="button"
        onClick={upload}
        disabled={saving}
        className="mt-6 rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white disabled:opacity-50"
      >
        {saving ? "UPLOADING…" : "SAVE PRIVATE EVIDENCE →"}
      </button>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Evidence is stored privately. It is not made public by uploading it.
      </p>
    </section>
  );
}
