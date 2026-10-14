"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RemoveStudentButton({
  enrollmentId,
  studentName,
}: {
  enrollmentId: string;
  studentName: string;
}) {
  const router = useRouter();

  const [
    removing,
    setRemoving,
  ] = useState(false);

  async function removeStudent() {
    const confirmed =
      window.confirm(
        `Remove ${studentName} from this cohort?\n\nTheir BUILD6™ account, Passport, work, and history will NOT be deleted.`
      );

    if (!confirmed) {
      return;
    }

    setRemoving(true);

    try {
      const response = await fetch(
        "/api/ambassador/enrollments",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            enrollmentId,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to remove student."
        );
      }

      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to remove student."
      );
    } finally {
      setRemoving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={removeStudent}
      disabled={removing}
      style={{
        border:
          "1px solid #F3B8B8",
        background: "white",
        color: "#B42318",
        borderRadius: 10,
        padding: "9px 12px",
        fontWeight: 900,
        fontSize: 11,
        cursor: removing
          ? "not-allowed"
          : "pointer",
        opacity: removing
          ? 0.5
          : 1,
      }}
    >
      {removing
        ? "Removing..."
        : "Remove from Cohort"}
    </button>
  );
}
