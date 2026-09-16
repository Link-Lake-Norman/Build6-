type MissingItem = {
  title: string;
  weekNumber: number;
  dayNumber: number | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendMissingWorkEmail({
  to,
  firstName,
  items,
  actionUrl,
}: {
  to: string;
  firstName: string;
  items: MissingItem[];
  actionUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    return {
      sent: false,
      error: "RESEND_API_KEY or RESEND_FROM_EMAIL is not configured.",
    };
  }

  const rows = items
    .map(
      (item) => `
        <li style="margin:0 0 10px;">
          <strong>Week ${item.weekNumber}${
            item.dayNumber ? ` · Day ${item.dayNumber}` : ""
          }</strong><br />
          ${escapeHtml(item.title)}
        </li>
      `,
    )
    .join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "BUILD6 — You Have Work to Complete",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#0D1B3D;">
          <h1 style="font-size:26px;">You have required work to complete.</h1>
          <p>Hi ${escapeHtml(firstName)},</p>
          <p>
            Your BUILD6™ Future Ready™ portal still shows the following required
            work as incomplete:
          </p>
          <ul>${rows}</ul>
          <p>
            <strong>Important:</strong> Save Draft does not count as complete.
            Finish the work and press <strong>SUBMIT</strong>. Your portal should
            show a green check when the submission is recorded.
          </p>
          <p>
            If work listed in this Friday reminder is still incomplete the
            following Monday, <strong>30 participation points will be deducted.</strong>
          </p>
          <p style="margin:26px 0;">
            <a href="${escapeHtml(actionUrl)}"
               style="display:inline-block;background:#0D1B3D;color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:10px;font-weight:700;">
              COMPLETE MY WORK
            </a>
          </p>
          <p>
            BUILD6™ Future Ready™ Experience
          </p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    return {
      sent: false,
      error: `Resend returned ${response.status}: ${message.slice(0, 300)}`,
    };
  }

  return {
    sent: true,
    error: null,
  };
}
