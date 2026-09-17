import * as webpush from "web-push";

type StoredPushSubscription = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

type PushPayload = {
  title: string;
  body: string;
  url: string;
};

type PushResult =
  | {
      ok: true;
      configured: true;
    }
  | {
      ok: false;
      configured: false;
      error: "Push delivery is not configured.";
    }
  | {
      ok: false;
      configured: true;
      error: string;
      statusCode: number | null;
    };

function vapidConfig() {
  const subject = process.env.VAPID_SUBJECT?.trim() ?? "";
  const publicKey = process.env.VAPID_PUBLIC_KEY?.trim() ?? "";
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim() ?? "";

  return {
    subject,
    publicKey,
    privateKey,
    configured: Boolean(subject && publicKey && privateKey),
  };
}

export function getVapidPublicKey() {
  const config = vapidConfig();

  return config.configured ? config.publicKey : null;
}

export function pushConfigured() {
  return vapidConfig().configured;
}

function errorStatusCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error
  ) {
    const value = Number(
      (error as { statusCode?: unknown }).statusCode,
    );

    return Number.isFinite(value) ? value : null;
  }

  return null;
}

function errorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message.slice(0, 1000);
  }

  return "Push delivery failed.";
}

export async function sendBuild6Push(
  subscription: StoredPushSubscription,
  payload: PushPayload,
): Promise<PushResult> {
  const config = vapidConfig();

  if (!config.configured) {
    return {
      ok: false,
      configured: false,
      error: "Push delivery is not configured.",
    };
  }

  webpush.setVapidDetails(
    config.subject,
    config.publicKey,
    config.privateKey,
  );

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify(payload),
      {
        TTL: 60 * 60,
        urgency: "normal",
        topic: "build6-daily",
      },
    );

    return {
      ok: true,
      configured: true,
    };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      error: errorMessage(error),
      statusCode: errorStatusCode(error),
    };
  }
}
