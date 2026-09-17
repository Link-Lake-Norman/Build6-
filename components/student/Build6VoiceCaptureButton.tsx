"use client";

import { useEffect, useRef, useState } from "react";

type SpeechResultEvent = Event & {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
};

type SpeechErrorEvent = Event & {
  error?: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: null | (() => void);
  onend: null | (() => void);
  onerror: null | ((event: SpeechErrorEvent) => void);
  onresult: null | ((event: SpeechResultEvent) => void);
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

type Props = {
  onTranscript: (text: string) => void;
  label?: string;
};

export default function Build6VoiceCaptureButton({
  onTranscript,
  label = "Speak instead",
}: Props) {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const speechWindow = window as SpeechWindow;
    const Recognition =
      speechWindow.SpeechRecognition ||
      speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setSupported(false);
      return;
    }

    setSupported(true);

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setMessage("Listening…");
    };

    recognition.onend = () => {
      setListening(false);
      setMessage("");
    };

    recognition.onerror = (event) => {
      setListening(false);

      if (event.error === "not-allowed") {
        setMessage("Microphone permission was not allowed.");
      } else if (event.error === "no-speech") {
        setMessage("No speech was detected. Try again.");
      } else {
        setMessage("Voice capture stopped. You can keep typing.");
      }
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript?.trim() ?? "";

      if (transcript) {
        onTranscript(transcript);
        setMessage("Added to your note.");
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [onTranscript]);

  if (!supported) {
    return (
      <p className="mt-2 text-xs text-slate-500">
        Voice capture is not available in this browser. You can type or use
        your phone&apos;s keyboard dictation.
      </p>
    );
  }

  function toggleListening() {
    const recognition = recognitionRef.current;

    if (!recognition) {
      return;
    }

    if (listening) {
      recognition.stop();
      return;
    }

    setMessage("");

    try {
      recognition.start();
    } catch {
      setMessage("Voice capture is already active.");
    }
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={toggleListening}
        className={
          listening
            ? "rounded-lg bg-red-600 px-3 py-2 text-xs font-black text-white"
            : "rounded-lg border border-[#4B2265] bg-white px-3 py-2 text-xs font-black text-[#4B2265]"
        }
      >
        {listening ? "STOP LISTENING" : `🎙 ${label.toUpperCase()}`}
      </button>

      {message ? (
        <p className="mt-2 text-xs font-bold text-slate-600">{message}</p>
      ) : null}

      <p className="mt-2 text-[11px] leading-4 text-slate-400">
        Browser speech recognition may use your device or browser speech
        service. BUILD6 stores only the text you choose to save.
      </p>
    </div>
  );
}
