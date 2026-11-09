import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faEnvelope,
    faTrash,
    faArrowLeft,
    faInbox,
    faFilter,
    faCheck,
    faCheckDouble,
    faReply,
    faEllipsisVertical,
    faMessage,
    faPaperPlane,
    faXmark,
    faRotate,
} from "@fortawesome/free-solid-svg-icons";

const SERVER_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_BASE_URL = `${SERVER_URL}/api/contact`;

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
};

const getInitials = (name = "") =>
    name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "?";

const formatMessageDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const getErrorMessage = async (response) => {
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
        throw new Error(result.message || "Something went wrong.");
    }

    return result;
};

export default function Messages({ token }) {
    const shouldReduceMotion = useReducedMotion();

    const [messages, setMessages] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All messages");
    const [selectedId, setSelectedId] = useState(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [notice, setNotice] = useState("");
    const [noticeType, setNoticeType] = useState("success");

    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [busyIds, setBusyIds] = useState([]);

    const [replyOpen, setReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isSendingReply, setIsSendingReply] = useState(false);

    const requestHeaders = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const showNotice = (message, type = "success") => {
        setNotice(message);
        setNoticeType(type);
    };

    const loadMessages = async () => {
        setIsLoading(true);
        setLoadError("");

        try {
            const response = await fetch(API_BASE_URL, {
                headers: requestHeaders,
            });

            const result = await getErrorMessage(response);

            const records = Array.isArray(result)
                ? result
                : result.messages || result.data || [];

            const normalized = records.map((item) => ({
                ...item,
                id: item._id || item.id,
                name: item.name || "Unknown sender",
                email: item.email || "No email provided",
                subject: item.subject || "No subject",
                message: item.message || "",
                date: formatMessageDate(item.createdAt || item.date),
                category: item.category || "General enquiry",
                read: Boolean(item.read),
            }));

            setMessages(normalized);

            setSelectedId((currentId) =>
                normalized.some((item) => item.id === currentId)
                    ? currentId
                    : normalized[0]?.id ?? null
            );
        } catch (error) {
            setLoadError(
                error.message || "Unable to connect to the messages service."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, [token]);

    const selectedMessage = messages.find(
        (message) => message.id === selectedId
    );

    const unreadCount = messages.filter((message) => !message.read).length;

    const filteredMessages = useMemo(() => {
        const query = search.trim().toLowerCase();

        return messages.filter((message) => {
            const searchableText = [
                message.name,
                message.email,
                message.subject,
                message.message,
                message.category,
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch = searchableText.includes(query);

            const matchesFilter =
                filter === "All messages" ||
                (filter === "Unread" && !message.read) ||
                (filter === "Read" && message.read);

            return matchesSearch && matchesFilter;
        });
    }, [messages, search, filter]);

    const selectMessage = async (message) => {
        setSelectedId(message.id);
        setMenuOpen(false);
        setReplyOpen(false);
        setReplyText("");
        setNotice("");

        if (message.read) return;

        setMessages((current) =>
            current.map((item) =>
                item.id === message.id ? { ...item, read: true } : item
            )
        );

        try {
            const response = await fetch(`${API_BASE_URL}/${message.id}/read`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...requestHeaders,
                },
                body: JSON.stringify({ read: true }),
            });

            await getErrorMessage(response);
        } catch (error) {
            setMessages((current) =>
                current.map((item) =>
                    item.id === message.id ? { ...item, read: false } : item
                )
            );

            showNotice(
                error.message || "Could not mark the message as read.",
                "error"
            );
        }
    };

    const toggleRead = async (id) => {
        const message = messages.find((item) => item.id === id);

        if (!message || busyIds.includes(id)) return;

        const nextRead = !message.read;

        setMenuOpen(false);
        setNotice("");

        setBusyIds((current) => [...current, id]);

        setMessages((current) =>
            current.map((item) =>
                item.id === id ? { ...item, read: nextRead } : item
            )
        );

        try {
            const response = await fetch(`${API_BASE_URL}/${id}/read`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...requestHeaders,
                },
                body: JSON.stringify({ read: nextRead }),
            });

            await getErrorMessage(response);

            showNotice(
                nextRead ? "Message marked as read." : "Message marked as unread."
            );
        } catch (error) {
            setMessages((current) =>
                current.map((item) =>
                    item.id === id ? { ...item, read: message.read } : item
                )
            );

            showNotice(
                error.message || "Could not update message status.",
                "error"
            );
        } finally {
            setBusyIds((current) => current.filter((itemId) => itemId !== id));
        }
    };

    const deleteMessage = async (message) => {
        const confirmed = window.confirm(
            `Permanently delete "${message.subject}"? This cannot be undone.`
        );

        if (!confirmed || busyIds.includes(message.id)) return;

        setBusyIds((current) => [...current, message.id]);
        setNotice("");

        try {
            const response = await fetch(`${API_BASE_URL}/${message.id}`, {
                method: "DELETE",
                headers: requestHeaders,
            });

            await getErrorMessage(response);

            const remaining = messages.filter(
                (item) => item.id !== message.id
            );

            setMessages(remaining);
            setSelectedId(remaining[0]?.id ?? null);
            setReplyOpen(false);
            setReplyText("");
            setMenuOpen(false);

            showNotice("Message deleted successfully.");
        } catch (error) {
            showNotice(
                error.message || "Could not delete the message.",
                "error"
            );
        } finally {
            setBusyIds((current) =>
                current.filter((itemId) => itemId !== message.id)
            );
        }
    };

    const sendReply = async () => {
        if (!selectedMessage || !replyText.trim()) {
            showNotice("Please enter a reply before sending.", "error");
            return;
        }

        setIsSendingReply(true);
        setNotice("");

        try {
            const response = await fetch(
                `${API_BASE_URL}/${selectedMessage.id}/reply`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...requestHeaders,
                    },
                    body: JSON.stringify({
                        reply: replyText.trim(),
                    }),
                }
            );

            const result = await getErrorMessage(response);

            setReplyText("");
            setReplyOpen(false);

            showNotice(result.message || "Reply sent successfully.");
        } catch (error) {
            showNotice(
                error.message ||
                "Unable to send your reply. Please try again.",
                "error"
            );
        } finally {
            setIsSendingReply(false);
        }
    };

    const enterTransition = shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.35, ease: "easeOut" };

    const cardClass =
        "border border-[var(--border-color)] bg-[var(--card-background)]";

    const buttonClass =
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--button-background)] px-4 py-2.5 text-xs font-semibold text-[var(--button-text)] transition hover:bg-[var(--button-hover)] disabled:cursor-not-allowed disabled:opacity-50";

    const inputClass =
        "w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-background)] px-4 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted-text)] focus:border-[#C51D27]";

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: shouldReduceMotion
                        ? { staggerChildren: 0 }
                        : { staggerChildren: 0.07 },
                },
            }}
            className="space-y-6 pb-8 text-[var(--text)]"
        >
            {/* Page heading */}

            <motion.div
                variants={fadeUp}
                transition={enterTransition}
                className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
            >
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#C51D27]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#C51D27]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C51D27]" />
                        Communication
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-[34px]">
                        Messages
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-text)]">
                        Read enquiries, prayer requests, and feedback from your church
                        community.
                    </p>
                </div>

                <div
                    className={`inline-flex w-fit items-center gap-3 rounded-xl ${cardClass} px-4 py-3`}
                >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#C51D27]/10 text-[#C51D27]">
                        <FontAwesomeIcon icon={faInbox} />
                    </span>

                    <div>
                        <p className="text-lg font-bold leading-tight">
                            {unreadCount}
                        </p>
                        <p className="mt-1 text-[11px] text-[var(--muted-text)]">
                            Unread messages
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Feedback */}

            {(loadError || notice || isLoading) && (
                <motion.div
                    variants={fadeUp}
                    transition={enterTransition}
                    role={loadError || noticeType === "error" ? "alert" : "status"}
                    className={`rounded-xl border px-4 py-3 text-sm ${loadError || noticeType === "error"
                            ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
                            : "border-[var(--border-color)] bg-[var(--card-background)] text-[var(--muted-text)]"
                        }`}
                >
                    {isLoading
                        ? "Loading messages from the backend…"
                        : loadError || notice}

                    {loadError && (
                        <button
                            type="button"
                            onClick={loadMessages}
                            className="ml-3 font-semibold underline"
                        >
                            Try again
                        </button>
                    )}
                </motion.div>
            )}

            {/* Inbox workspace */}

            <motion.section
                variants={fadeUp}
                transition={enterTransition}
                className={`grid min-h-[590px] overflow-hidden rounded-2xl ${cardClass} lg:grid-cols-[minmax(300px,0.82fr)_minmax(0,1.45fr)]`}
            >
                {/* Inbox list */}

                <aside
                    className={`min-w-0 border-b border-[var(--border-color)] lg:border-b-0 lg:border-r ${selectedMessage ? "hidden lg:block" : "block"
                        }`}
                >
                    <div className="border-b border-[var(--border-color)] p-4 sm:p-5">
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-text)]"
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search your inbox..."
                                className={`${inputClass} pl-10`}
                            />
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                            <label className="flex min-w-0 items-center gap-2 text-xs text-[var(--muted-text)]">
                                <FontAwesomeIcon icon={faFilter} />

                                <select
                                    value={filter}
                                    onChange={(event) => setFilter(event.target.value)}
                                    className="min-w-0 bg-transparent py-2 font-medium text-[var(--text)] outline-none"
                                    aria-label="Filter messages"
                                >
                                    <option>All messages</option>
                                    <option>Unread</option>
                                    <option>Read</option>
                                </select>
                            </label>

                            <span className="rounded-lg bg-[var(--hover)] px-2.5 py-1.5 text-[10px] font-semibold text-[var(--muted-text)]">
                                {filteredMessages.length} messages
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-5 py-4">
                        <h2 className="text-sm font-bold">Inbox</h2>
                        <span className="text-xs text-[var(--muted-text)]">
                            {unreadCount} unread
                        </span>
                    </div>

                    <div className="divide-y divide-[var(--border-color)]">
                        <AnimatePresence initial={false}>
                            {filteredMessages.map((message) => {
                                const isSelected = selectedId === message.id;

                                return (
                                    <motion.button
                                        layout={!shouldReduceMotion}
                                        key={message.id}
                                        type="button"
                                        initial={
                                            shouldReduceMotion ? false : { opacity: 0, y: 8 }
                                        }
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => selectMessage(message)}
                                        className={`relative flex w-full gap-3 px-4 py-4 text-left transition sm:px-5 ${isSelected
                                                ? "bg-[#C51D27]/[0.06]"
                                                : "hover:bg-[var(--hover)]"
                                            }`}
                                    >
                                        {isSelected && (
                                            <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-[#C51D27]" />
                                        )}

                                        <span
                                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-bold ${message.read
                                                    ? "bg-[var(--hover)] text-[var(--muted-text)]"
                                                    : "bg-[#C51D27]/10 text-[#C51D27]"
                                                }`}
                                        >
                                            {getInitials(message.name)}
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="flex items-start justify-between gap-2">
                                                <span
                                                    className={`truncate text-xs ${message.read
                                                            ? "font-semibold"
                                                            : "font-bold"
                                                        }`}
                                                >
                                                    {message.name}
                                                </span>

                                                <span className="shrink-0 text-[9px] text-[var(--muted-text)]">
                                                    {message.date}
                                                </span>
                                            </span>

                                            <span className="mt-1.5 block truncate text-xs font-semibold">
                                                {message.subject}
                                            </span>

                                            <span className="mt-1.5 block text-[11px] leading-5 text-[var(--muted-text)]">
                                                {message.message}
                                            </span>

                                            <span className="mt-2.5 flex items-center justify-between gap-2">
                                                <span className="rounded-md bg-[var(--hover)] px-2 py-1 text-[9px] font-medium text-[var(--muted-text)]">
                                                    {message.category}
                                                </span>

                                                {!message.read && (
                                                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#C51D27]" />
                                                )}
                                            </span>
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {filteredMessages.length === 0 && (
                        <div className="flex flex-col items-center px-5 py-12 text-center">
                            <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--hover)] text-[var(--muted-text)]">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>

                            <p className="text-sm font-semibold">
                                {messages.length
                                    ? "No matching messages"
                                    : "Inbox is empty"}
                            </p>

                            <p className="mt-1 max-w-xs text-xs leading-5 text-[var(--muted-text)]">
                                {messages.length
                                    ? "Try another search term or change the filter."
                                    : "Messages will appear here when someone contacts your church."}
                            </p>
                        </div>
                    )}
                </aside>

                {/* Message details */}

                <main
                    className={`min-w-0 ${selectedMessage ? "block" : "hidden lg:flex"
                        } flex-col`}
                >
                    {selectedMessage ? (
                        <>
                            {/* Detail toolbar */}

                            <div className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] px-4 py-3.5 sm:px-6">
                                <button
                                    type="button"
                                    onClick={() => setSelectedId(null)}
                                    className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-[var(--muted-text)] transition hover:bg-[var(--hover)] lg:hidden"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                    Inbox
                                </button>

                                <div className="hidden items-center gap-2 text-xs text-[var(--muted-text)] lg:flex">
                                    <FontAwesomeIcon icon={faInbox} />
                                    Inbox
                                    <span>/</span>
                                    <span className="font-semibold">Message details</span>
                                </div>

                                <div className="relative ml-auto flex items-center gap-1">
                                    <button
                                        type="button"
                                        title={selectedMessage.read ? "Mark unread" : "Mark read"}
                                        aria-label={selectedMessage.read ? "Mark unread" : "Mark read"}
                                        onClick={() => toggleRead(selectedMessage.id)}
                                        disabled={busyIds.includes(selectedMessage.id)}
                                        className="grid h-9 w-9 place-items-center rounded-xl text-[var(--muted-text)] transition hover:bg-[#C51D27]/10 hover:text-[#C51D27]"
                                    >
                                        <FontAwesomeIcon
                                            icon={selectedMessage.read ? faEnvelope : faCheckDouble}
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        title="Delete message"
                                        aria-label="Delete message"
                                        onClick={() => deleteMessage(selectedMessage)}
                                        disabled={busyIds.includes(selectedMessage.id)}
                                        className="grid h-9 w-9 place-items-center rounded-xl text-[var(--muted-text)] transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>

                                    <button
                                        type="button"
                                        title="More options"
                                        aria-label="More options"
                                        onClick={() => setMenuOpen((open) => !open)}
                                        className="grid h-9 w-9 place-items-center rounded-xl text-[var(--muted-text)] transition hover:bg-[var(--hover)]"
                                    >
                                        <FontAwesomeIcon icon={faEllipsisVertical} />
                                    </button>

                                    <AnimatePresence>
                                        {menuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-[var(--border-color)] bg-[var(--card-background)] p-1.5 shadow-xl"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => toggleRead(selectedMessage.id)}
                                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs hover:bg-[var(--hover)]"
                                                >
                                                    <FontAwesomeIcon icon={faCheck} />
                                                    Mark as {selectedMessage.read ? "unread" : "read"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setReplyOpen(true);
                                                        setMenuOpen(false);
                                                        setNotice("");
                                                    }}
                                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs hover:bg-[var(--hover)]"
                                                >
                                                    <FontAwesomeIcon icon={faReply} />
                                                    Reply to message
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Message body */}

                            <AnimatePresence mode="wait">
                                <motion.article
                                    key={selectedMessage.id}
                                    initial={
                                        shouldReduceMotion ? false : { opacity: 0, y: 8 }
                                    }
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.22 }}
                                    className="flex-1 p-5 sm:p-7 lg:p-8"
                                >
                                    <div className="mb-5 flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-[#C51D27]/10 px-3 py-1.5 text-[10px] font-semibold text-[#C51D27]">
                                            {selectedMessage.category}
                                        </span>

                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-medium ${selectedMessage.read
                                                    ? "bg-[var(--hover)] text-[var(--muted-text)]"
                                                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                                                }`}
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                            {selectedMessage.read ? "Read" : "Unread"}
                                        </span>
                                    </div>

                                    <h2 className="break-words text-2xl font-bold tracking-tight sm:text-[28px]">
                                        {selectedMessage.subject}
                                    </h2>

                                    <div className="mt-6 flex flex-col gap-4 border-b border-[var(--border-color)] pb-6 sm:flex-row sm:items-center">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#C51D27]/10 text-xs font-bold text-[#C51D27]">
                                                {getInitials(selectedMessage.name)}
                                            </span>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold">
                                                    {selectedMessage.name}
                                                </p>

                                                <p className="mt-1 break-all text-xs text-[var(--muted-text)]">
                                                    {selectedMessage.email}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="text-xs text-[var(--muted-text)] sm:ml-auto">
                                            {selectedMessage.date}
                                        </span>
                                    </div>

                                    <div className="min-h-40 py-7">
                                        <p className="whitespace-pre-wrap break-words text-sm leading-8 text-[var(--text)]">
                                            {selectedMessage.message}
                                        </p>
                                    </div>

                                    {/* Reply editor */}

                                    {replyOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-5 rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-4 sm:p-5"
                                        >
                                            <div className="mb-4 flex items-center justify-between gap-3">
                                                <div>
                                                    <h3 className="text-sm font-bold">
                                                        Reply to {selectedMessage.name}
                                                    </h3>

                                                    <p className="mt-1 text-xs text-[var(--muted-text)]">
                                                        Your reply will be sent to {selectedMessage.email}
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setReplyOpen(false);
                                                        setReplyText("");
                                                    }}
                                                    className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted-text)] hover:bg-[var(--hover)]"
                                                    aria-label="Close reply editor"
                                                >
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </button>
                                            </div>

                                            <textarea
                                                value={replyText}
                                                onChange={(event) => setReplyText(event.target.value)}
                                                placeholder="Write your reply here..."
                                                rows={6}
                                                disabled={isSendingReply}
                                                className={`${inputClass} resize-y leading-6`}
                                            />

                                            <div className="mt-4 flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
                                                <p className="text-[10px] text-[var(--muted-text)]">
                                                    Reply will be sent through your configured email service.
                                                </p>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setReplyOpen(false);
                                                            setReplyText("");
                                                        }}
                                                        disabled={isSendingReply}
                                                        className={buttonClass}
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={sendReply}
                                                        disabled={isSendingReply || !replyText.trim()}
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C51D27] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#A71922] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={isSendingReply ? faRotate : faPaperPlane}
                                                            className={isSendingReply ? "animate-spin" : ""}
                                                        />

                                                        {isSendingReply ? "Sending..." : "Send reply"}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Message feedback */}

                                    {notice && (
                                        <div
                                            role={noticeType === "error" ? "alert" : "status"}
                                            className={`mt-5 rounded-xl border px-4 py-3 text-xs leading-5 ${noticeType === "error"
                                                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
                                                    : "border-[#C51D27]/15 bg-[#C51D27]/5 text-[var(--text)]"
                                                }`}
                                        >
                                            {notice}
                                        </div>
                                    )}

                                    {/* Bottom actions */}

                                    <div className="flex flex-col gap-3 border-t border-[var(--border-color)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-[10px] text-[var(--muted-text)]">
                                            Message stored in your church inbox
                                        </p>

                                        {!replyOpen && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setReplyOpen(true);
                                                    setNotice("");
                                                }}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C51D27] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#A71922]"
                                            >
                                                <FontAwesomeIcon icon={faReply} />
                                                Reply to message
                                            </button>
                                        )}
                                    </div>
                                </motion.article>
                            </AnimatePresence>
                        </>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
                            <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-[#C51D27]/10 text-[#C51D27]">
                                <FontAwesomeIcon icon={faMessage} className="text-xl" />
                            </div>

                            <h2 className="text-base font-bold">Select a message</h2>

                            <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--muted-text)]">
                                Choose a message from your inbox to read the full details here.
                            </p>
                        </div>
                    )}
                </main>
            </motion.section>

            <motion.p
                variants={fadeUp}
                transition={enterTransition}
                className="text-[10px] leading-5 text-[var(--muted-text)]"
            >
                Messages are loaded from your church contact inbox.
            </motion.p>
        </motion.div>
    );
}