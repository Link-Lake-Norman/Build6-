"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  studentId: string;
};

type PushStatus = {
  configured: boolean;
  publicKey: string | null;
  subscribed: boolean;
  subscriptionCount: number;
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat(
    (4 - (base64String.length % 4)) % 4,
  );

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

function supportsPush() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export default function Build6PushNotifications({
  studentId,
}: Props) {
  const [status, setStatus] = useState<PushStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadStatus = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/student/push-subscription?studentId=${encodeURIComponent(
          studentId,
        )}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to check notification settings.",
        );
      }

      setStatus(data as PushStatus);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to check notification settings.",
      );
    }
  }, [studentId]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  async function enableNotifications() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (!supportsPush()) {
        throw new Error(
          "This browser does not support web push notifications.",
        );
      }

      if (!status?.configured || !status.publicKey) {
        throw new Error(
          "BUILD6 device notifications are not configured yet.",
        );
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        throw new Error(
          "Notification permission was not granted.",
        );
      }

      const registration = await navigator.serviceWorker.ready;

      let subscription =
        await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription =
          await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              status.publicKey,
            ),
          });
      }

      const serialized = subscription.toJSON();

      const response = await fetch(
        "/api/student/push-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            subscription: serialized,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to enable device notifications.",
        );
      }

      setMessage(
        "BUILD6 device notifications are enabled on this device.",
      );

      await loadStatus();
    } catch (enableError) {
      setError(
        enableError instanceof Error
          ? enableError.message
          : "Unable to enable device notifications.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function disableNotifications() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (!supportsPush()) {
        throw new Error(
          "This browser does not support web push notifications.",
        );
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription =
        await registration.pushManager.getSubscription();

      if (subscription) {
        const response = await fetch(
          "/api/student/push-subscription",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentId,
              endpoint: subscription.endpoint,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Unable to disable device notifications.",
          );
        }

        await subscription.unsubscribe();
      }

      setMessage(
        "BUILD6 device notifications are off on this device.",
      );

      await loadStatus();
    } catch (disableError) {
      setError(
        disableError instanceof Error
          ? disableError.message
          : "Unable to disable device notifications.",
      );
    } finally {
      setBusy(false);
    }
  }

  const browserSupported = supportsPush();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            DEVICE NOTIFICATIONS
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            Get your BUILD6 focus on this device.
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            This is optional. If you enable it, BUILD6 can send your daily
            focus as a device notification in addition to keeping it inside
            your Companion.
          </p>
        </div>

        <div
          className={
            status?.subscribed
              ? "rounded-xl bg-emerald-50 px-4 py-3 text-xs font-black text-emerald-800"
              : "rounded-xl bg-slate-100 px-4 py-3 text-xs font-black text-slate-600"
          }
        >
          {status?.subscribed ? "ENABLED" : "OPTIONAL"}
        </div>
      </div>

      {!browserSupported ? (
        <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm font-bold text-amber-900">
          This browser does not currently expose web push. On iPhone or iPad,
          install BUILD6 to your Home Screen first, then open the installed
          app and return here.
        </p>
      ) : null}

      {status && !status.configured ? (
        <p className="mt-5 rounded-xl bg-[#FFF9DF] p-4 text-sm font-bold text-[#725500]">
          Device delivery is built but production notification keys have not
          been activated yet. Your 10:00 AM message still remains available
          inside BUILD6.
        </p>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
          {message}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={
            busy ||
            !browserSupported ||
            !status?.configured
          }
          onClick={enableNotifications}
          className="rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "WORKING…" : "ENABLE ON THIS DEVICE"}
        </button>

        <button
          type="button"
          disabled={busy || !browserSupported}
          onClick={disableNotifications}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          TURN OFF ON THIS DEVICE
        </button>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        BUILD6 stores only the browser subscription needed to deliver
        notifications. Notification permission can also be changed in your
        device or browser settings.
      </p>
    </section>
  );
}
