"use client";

export default function PrintCapstoneButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      style={{
        border: 0,
        borderRadius: 10,
        background: "#0D1B3D",
        color: "white",
        padding: "11px 16px",
        fontWeight: 900,
        cursor: "pointer",
      }}
    >
      Print / Save as PDF
    </button>
  );
}
