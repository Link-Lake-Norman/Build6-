"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AttendanceTarget = {
  studentId: string;
  cohortId: string;
};

export default function MarkAllPresentButton({
  students,
}: {
  students: AttendanceTarget[];
}) {
  const router = useRouter();

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function markAllPresent() {
    if (students.length === 0) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const responses =
        await Promise.all(
          students.map((student) =>
            fetch(
              "/api/ambassador/attendance",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  studentId:
                    student.studentId,
                  cohortId:
                    student.cohortId,
                  status: "PRESENT",
                }),
              }
            )
          )
        );

      const failed =
        responses.find(
          (response) => !response.ok
        );

      if (failed) {
        throw new Error(
          "One or more attendance records could not be saved."
        );
      }

      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to mark attendance."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={markAllPresent}
        disabled={saving}
        style={{
          border: "1px solid #A6F4C5",
          background: "#ECFDF3",
          color: "#067647",
          padding: "12px 16px",
          borderRadius: 12,
          fontWeight: 900,
          fontSize: 12,
          cursor: saving
            ? "not-allowed"
            : "pointer",
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving
          ? "Saving Attendance..."
          : "✓ Mark All Present"}
      </button>

      {error ? (
        <div
          style={{
            marginTop: 6,
            maxWidth: 220,
            fontSize: 10,
            fontWeight: 800,
            color: "#B42318",
          }}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}
