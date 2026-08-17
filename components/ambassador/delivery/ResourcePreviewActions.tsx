type Props = {
  label: string;
  previewHref: string;
  downloadHref?: string;
};

export default function ResourcePreviewActions({
  label,
  previewHref,
  downloadHref,
}: Props) {
  return (
    <div
      style={{
        border: "1px solid #E3E8F0",
        borderRadius: 14,
        padding: 14,
        background: "white",
      }}
    >
      <div
        style={{
          color: "#0D1B3D",
          fontWeight: 900,
          fontSize: 13,
          marginBottom: 10,
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <a
          href={previewHref}
          target="_blank"
          rel="noreferrer"
          style={{
            textDecoration: "none",
            background: "#0D1B3D",
            color: "white",
            padding: "9px 12px",
            borderRadius: 9,
            fontSize: 11,
            fontWeight: 900,
          }}
        >
          Preview
        </a>

        {downloadHref && (
          <a
            href={downloadHref}
            style={{
              textDecoration: "none",
              border: "1px solid #0D1B3D",
              color: "#0D1B3D",
              padding: "9px 12px",
              borderRadius: 9,
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            Download
          </a>
        )}
      </div>
    </div>
  );
}
