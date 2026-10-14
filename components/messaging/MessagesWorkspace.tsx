"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Recipient = {
  id: string;
  name: string;
  role: string;
  gradeLevel: string | null;
  title: string | null;
  cohorts: {
    id: string;
    name: string;
  }[];
};

type ThreadSummary = {
  id: string;
  subject: string | null;
  threadType: string;
  updatedAt: string;
  unread: boolean;
  participants: {
    id: string;
    name: string;
    role: string;
  }[];
  latestMessage: {
    id: string;
    body: string;
    createdAt: string;
    sender: {
      id: string;
      name: string;
      role: string;
    };
  } | null;
};

type ThreadDetail = {
  id: string;
  subject: string | null;
  threadType: string;
  createdAt: string;
  updatedAt: string;
  participants: {
    id: string;
    name: string;
    role: string;
  }[];
  messages: {
    id: string;
    body: string;
    createdAt: string;
    editedAt: string | null;
    sender: {
      id: string;
      name: string;
      role: string;
    };
  }[];
};

function roleLabel(role: string) {
  switch (role) {
    case "STUDENT":
      return "Student";
    case "FACILITATOR":
      return "Facilitator";
    case "SCHOOL_ADMIN":
      return "School Admin";
    case "ORGANIZATION_ADMIN":
      return "Organization Admin";
    case "SUPER_ADMIN":
      return "Admin";
    default:
      return role
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function MessagesWorkspace() {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [thread, setThread] = useState<ThreadDetail | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [newMessageMode, setNewMessageMode] = useState(false);

  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>(
    [],
  );

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const loadInbox = useCallback(async () => {
    const response = await fetch("/api/messages", {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "Unable to load messages.");
    }

    setThreads(data.threads ?? []);
  }, []);

  const loadRecipients = useCallback(async () => {
    const response = await fetch("/api/messages/recipients", {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "Unable to load recipients.");
    }

    setRecipients(data.recipients ?? []);
  }, []);

  const openThread = useCallback(
    async (threadId: string) => {
      setThreadLoading(true);
      setStatus(null);

      try {
        const response = await fetch(`/api/messages/${threadId}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to open conversation.");
        }

        setThread(data.thread);
        setCurrentUserId(data.currentUserId);
        setSelectedThreadId(threadId);
        setNewMessageMode(false);

        await loadInbox();
      } catch (error) {
        setStatus(
          error instanceof Error
            ? error.message
            : "Unable to open conversation.",
        );
      } finally {
        setThreadLoading(false);
      }
    },
    [loadInbox],
  );

  useEffect(() => {
    async function initialize() {
      try {
        await Promise.all([loadInbox(), loadRecipients()]);
      } catch (error) {
        setStatus(
          error instanceof Error ? error.message : "Unable to load messaging.",
        );
      } finally {
        setLoading(false);
      }
    }

    void initialize();
  }, [loadInbox, loadRecipients]);

  const unreadCount = useMemo(
    () => threads.filter((item) => item.unread).length,
    [threads],
  );

  const otherParticipants = useMemo(() => {
    if (!thread || !currentUserId) {
      return [];
    }

    return thread.participants.filter(
      (participant) => participant.id !== currentUserId,
    );
  }, [thread, currentUserId]);

  async function sendNewMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedRecipientIds.length === 0 || !message.trim()) {
      setStatus("Choose a recipient and enter a message.");
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientIds: selectedRecipientIds,
          subject,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to send message.");
      }

      setSelectedRecipientIds([]);
      setSubject("");
      setMessage("");
      setNewMessageMode(false);

      await loadInbox();
      await openThread(data.threadId);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to send message.",
      );
    } finally {
      setSending(false);
    }
  }

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedThreadId || !reply.trim()) {
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      const response = await fetch(`/api/messages/${selectedThreadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: reply,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to send reply.");
      }

      setReply("");
      await openThread(selectedThreadId);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to send reply.",
      );
    } finally {
      setSending(false);
    }
  }

  function toggleRecipient(recipientId: string) {
    setSelectedRecipientIds((current) =>
      current.includes(recipientId)
        ? current.filter((id) => id !== recipientId)
        : [...current, recipientId],
    );
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="font-bold text-slate-600">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="grid min-h-[640px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[340px_1fr]">
      <aside className="border-b border-slate-200 bg-slate-50 lg:border-b-0 lg:border-r">
        <div className="border-b border-slate-200 p-5">
          <button
            type="button"
            onClick={() => {
              setNewMessageMode(true);
              setSelectedThreadId(null);
              setThread(null);
              setStatus(null);
            }}
            className="w-full rounded-xl bg-[#0B3B60] px-5 py-3 text-sm font-black text-white"
          >
            + New Message
          </button>

          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-600">
              Inbox
            </h2>

            {unreadCount > 0 ? (
              <span className="rounded-full bg-[#F4B942] px-2.5 py-1 text-xs font-black text-[#0B3B60]">
                {unreadCount} unread
              </span>
            ) : null}
          </div>
        </div>

        <div className="max-h-[560px] overflow-y-auto">
          {threads.length === 0 ? (
            <div className="p-6 text-sm leading-6 text-slate-500">
              No messages yet.
            </div>
          ) : (
            threads.map((item) => {
              const participantNames = item.participants
                .map((participant) => participant.name)
                .join(", ");

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => void openThread(item.id)}
                  className={`block w-full border-b border-slate-200 p-5 text-left transition ${
                    selectedThreadId === item.id ? "bg-white" : "hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={`text-sm text-[#0B3B60] ${
                        item.unread ? "font-black" : "font-bold"
                      }`}
                    >
                      {item.subject || participantNames || "Conversation"}
                    </p>

                    {item.unread ? (
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#00A6A6]" />
                    ) : null}
                  </div>

                  <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                    {participantNames}
                  </p>

                  {item.latestMessage ? (
                    <>
                      <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">
                        {item.latestMessage.body}
                      </p>

                      <p className="mt-2 text-xs font-semibold text-slate-400">
                        {formatDate(item.latestMessage.createdAt)}
                      </p>
                    </>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </aside>

      <section className="min-w-0">
        {status ? (
          <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm font-bold text-amber-900">
            {status}
          </div>
        ) : null}

        {newMessageMode ? (
          <form onSubmit={sendNewMessage} className="p-6 lg:p-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#00A6A6]">
                New Message
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#0B3B60]">
                Start a Conversation
              </h2>
            </div>

            <div className="mt-7">
              <label className="text-sm font-black text-[#0B3B60]">To</label>

              <div className="mt-3 max-h-52 overflow-y-auto rounded-xl border border-slate-200">
                {recipients.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500">
                    No available recipients.
                  </p>
                ) : (
                  recipients.map((recipient) => {
                    const selected = selectedRecipientIds.includes(
                      recipient.id,
                    );

                    return (
                      <label
                        key={recipient.id}
                        className="flex cursor-pointer items-center gap-3 border-b border-slate-100 p-4 last:border-b-0 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleRecipient(recipient.id)}
                          className="h-4 w-4"
                        />

                        <div className="min-w-0">
                          <p className="font-black text-[#0B3B60]">
                            {recipient.name}
                          </p>

                          <p className="text-xs font-semibold text-slate-500">
                            {roleLabel(recipient.role)}
                            {recipient.cohorts.length > 0
                              ? ` · ${recipient.cohorts
                                  .map((cohort) => cohort.name)
                                  .join(", ")}`
                              : ""}
                          </p>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="message-subject"
                className="text-sm font-black text-[#0B3B60]"
              >
                Subject
              </label>

              <input
                id="message-subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Optional subject"
                maxLength={150}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#00A6A6]"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="message-body"
                className="text-sm font-black text-[#0B3B60]"
              >
                Message
              </label>

              <textarea
                id="message-body"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={8}
                maxLength={5000}
                placeholder="Write your message..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#00A6A6]"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={sending}
                className="rounded-xl bg-[#0B3B60] px-6 py-3 text-sm font-black text-white disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>

              <button
                type="button"
                onClick={() => setNewMessageMode(false)}
                className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-black text-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : threadLoading ? (
          <div className="p-8 font-bold text-slate-600">
            Loading conversation...
          </div>
        ) : thread ? (
          <div className="flex min-h-[640px] flex-col">
            <header className="border-b border-slate-200 px-6 py-5 lg:px-8">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-[#00A6A6]">
                Conversation
              </p>

              <h2 className="mt-1 text-xl font-black text-[#0B3B60]">
                {thread.subject ||
                  otherParticipants
                    .map((participant) => participant.name)
                    .join(", ") ||
                  "Messages"}
              </h2>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                {otherParticipants
                  .map(
                    (participant) =>
                      `${participant.name} · ${roleLabel(participant.role)}`,
                  )
                  .join(" · ")}
              </p>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-6 lg:p-8">
              {thread.messages.map((item) => {
                const mine = item.sender.id === currentUserId;

                return (
                  <div
                    key={item.id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-sm lg:max-w-[70%] ${
                        mine
                          ? "bg-[#0B3B60] text-white"
                          : "border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      <p
                        className={`text-xs font-black ${
                          mine ? "text-[#F4B942]" : "text-[#00A6A6]"
                        }`}
                      >
                        {mine ? "You" : item.sender.name}
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                        {item.body}
                      </p>

                      <p
                        className={`mt-3 text-[11px] font-semibold ${
                          mine ? "text-slate-300" : "text-slate-400"
                        }`}
                      >
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={sendReply}
              className="border-t border-slate-200 bg-white p-5 lg:p-6"
            >
              <div className="flex gap-3">
                <textarea
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  rows={2}
                  maxLength={5000}
                  placeholder="Write a reply..."
                  className="min-h-[52px] flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#00A6A6]"
                />

                <button
                  type="submit"
                  disabled={sending || !reply.trim()}
                  className="self-end rounded-xl bg-[#F4B942] px-5 py-3 text-sm font-black text-[#0B3B60] disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Reply"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex min-h-[640px] items-center justify-center p-8 text-center">
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E9F5F5] text-2xl">
                ✉
              </div>

              <h2 className="mt-5 text-xl font-black text-[#0B3B60]">
                BUILD6™ Messages
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Select a conversation from your inbox or start a new message.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
