"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "EXCUSED";

export default function StudentAttendanceButtons({
  studentId,
  cohortId,
  currentStatus,
}: {
  studentId: string;
  cohortId: string;
  currentStatus: AttendanceStatus | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState<AttendanceStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function saveAttendance(status: AttendanceStatus) {
    setSaving(status);
    setError(null);

    try {
      const response = await fetch("/api/ambassador/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          cohortId,
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Unable to save attendance."
        );
      }

      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save attendance."
      );
    } finally {
      setSaving(null);
    }
  }

  const presentSelected = currentStatus === "PRESENT";
  const absentSelected = currentStatus === "ABSENT";

  return (
    <div
      style={{
        marginTop: 16,
        padding: 14,
        borderRadius: 14,
        border: "1px solid #E3E8F0",
        background: "#FAFBFC",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: 1.2,
              color: "#667085",
            }}
          >
            TODAY'S ATTENDANCE
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 12,
              fontWeight: 800,
              color: "#0D1B3D",
            }}
          >
            {currentStatus
              ? currentStatus === "PRESENT"
                ? "Present"
                : currentStatus === "ABSENT"
                  ? "Absent"
                  : currentStatus === "LATE"
                    ? "Late"
                    : "Excused"
              : "Not Recorded"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <button
            type="button"
            disabled={saving !== null}
            onClick={() => saveAttendance("PRESENT")}
            style={{
              border: presentSelected
                ? "2px solid #067647"
                : "1px solid #A6F4C5",
              background: presentSelected
                ? "#067647"
                : "#ECFDF3",
              color: presentSelected
                ? "white"
                : "#067647",
              borderRadius: 10,
              padding: "9px 12px",
              fontSize: 11,
              fontWeight: 900,
              cursor:
                saving !== null ? "not-allowed" : "pointer",
              opacity: saving !== null ? 0.6 : 1,
            }}
          >
            {saving === "PRESENT" ? "Saving..." : "✓ Present"}
          </button>

          <button
            type="button"
            disabled={saving !== null}
            onClick={() => saveAttendance("ABSENT")}
            style={{
              border: absentSelected
                ? "2px solid #B42318"
                : "1px solid #FECDCA",
              background: absentSelected
                ? "#B42318"
                : "#FEF3F2",
              color: absentSelected
                ? "white"
                : "#B42318",
              borderRadius: 10,
              padding: "9px 12px",
              fontSize: 11,
              fontWeight: 900,
              cursor:
                saving !== null ? "not-allowed" : "pointer",
              opacity: saving !== null ? 0.6 : 1,
            }}
          >
            {saving === "ABSENT" ? "Saving..." : "✕ Absent"}
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            fontWeight: 800,
            color: "#B42318",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
