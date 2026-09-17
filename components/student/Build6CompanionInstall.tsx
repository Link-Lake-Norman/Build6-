"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

function isIosDevice() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  if (typeof window === "undefined") {
    return false;
  }

  const navigatorWithStandalone = navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export default function Build6CompanionInstall() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    setIos(isIosDevice());
    setInstalled(isStandalone());

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        })
        .catch((error) => {
          console.error(
            "BUILD6 service worker registration failed:",
            error,
          );
        });
    }

    function captureInstallPrompt(event: Event) {
      event.preventDefault();

      setInstallPrompt(
        event as BeforeInstallPromptEvent,
      );
    }

    function installedHandler() {
      setInstalled(true);
      setInstallPrompt(null);
    }

    window.addEventListener(
      "beforeinstallprompt",
      captureInstallPrompt,
    );

    window.addEventListener(
      "appinstalled",
      installedHandler,
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        captureInstallPrompt,
      );

      window.removeEventListener(
        "appinstalled",
        installedHandler,
      );
    };
  }, []);

  async function install() {
    if (!installPrompt) {
      if (ios) {
        setShowIosHelp(true);
      }

      return;
    }

    await installPrompt.prompt();

    const choice = await installPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setInstalled(true);
    }

    setInstallPrompt(null);
  }

  if (installed) {
    return null;
  }

  if (!installPrompt && !ios) {
    return null;
  }

  return (
    <section className="mb-5 rounded-2xl border border-[#F2B705]/50 bg-[#FFF9DF] p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.15em] text-[#725500]">
            TAKE BUILD6 WITH YOU
          </p>

          <p className="mt-1 text-sm font-bold text-[#0D1B3D]">
            Add the Student Companion to your phone&apos;s Home Screen for
            an app-style experience.
          </p>
        </div>

        <button
          type="button"
          onClick={install}
          className="shrink-0 rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white"
        >
          ADD BUILD6
        </button>
      </div>

      {showIosHelp ? (
        <div className="mt-4 rounded-xl border border-[#F2B705] bg-white p-4 text-sm leading-6 text-slate-700">
          On iPhone or iPad, tap the browser&apos;s
          <strong> Share </strong>
          button, then choose
          <strong> Add to Home Screen</strong>.
        </div>
      ) : null}
    </section>
  );
}
