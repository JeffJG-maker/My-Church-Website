import React, { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faEnvelope,
    faEnvelopeOpen,
    faTrash,
    faArrowLeft,
    faInbox,
    faFilter,
    faCheck,
    faCheckDouble,
    faReply,
    faEllipsisVertical,
    faPaperPlane,
    faMessage,
} from "@fortawesome/free-solid-svg-icons";

const sampleMessages = [
    {
        id: 1,
        name: "Grace A.",
        email: "grace@example.com",
        subject: "Prayer request",
        message:
            "Good evening, please I would appreciate prayers for my family during this difficult season. Thank you for all the support and encouragement.",
        date: "Today, 10:42 AM",
        category: "Prayer request",
        read: false,
    },
    {
        id: 2,
        name: "Michael O.",
        email: "michael@example.com",
        subject: "Question about Sunday service",
        message:
            "Hello, I would like to confirm the time for the Sunday service and whether first-time visitors should register before coming. Thank you.",
        date: "Today, 9:15 AM",
        category: "General enquiry",
        read: false,
    },
    {
        id: 3,
        name: "Esther I.",
        email: "esther@example.com",
        subject: "Thank you for the message",
        message:
            "I wanted to say thank you for the sermon shared last week. It was encouraging and helped me reflect on my faith. God bless the church.",
        date: "Yesterday",
        category: "Feedback",
        read: true,
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0 },
};

function getInitials(name) {
    return name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default function Messages() {
    const shouldReduceMotion = useReducedMotion();

    // These are sample messages for preview. Replace with backend data later.
    const [messages, setMessages] = useState(sampleMessages);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All messages");
    const [selectedId, setSelectedId] = useState(sampleMessages[0]?.id ?? null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [notice, setNotice] = useState("");

    const selectedMessage = messages.find((message) => message.id === selectedId);
    const unreadCount = messages.filter((message) => !message.read).length;

    const filteredMessages = useMemo(() => {
        const query = search.trim().toLowerCase();

        return messages.filter((message) => {
            const matchesSearch =
                `${message.name} ${message.email} ${message.subject} ${message.message}`
                    .toLowerCase()
                    .includes(query);

            const matchesFilter =
                filter === "All messages" ||
                (filter === "Unread" && !message.read) ||
                (filter === "Read" && message.read);

            return matchesSearch && matchesFilter;
        });
    }, [messages, search, filter]);

    const selectMessage = (message) => {
        setSelectedId(message.id);
        setMenuOpen(false);
        setNotice("");
        if (!message.read) {
            setMessages((current) =>
                current.map((item) =>
                    item.id === message.id ? { ...item, read: true } : item
                )
            );
        }
    };

    const toggleRead = (id) => {
        setMessages((current) =>
            current.map((item) =>
                item.id === id ? { ...item, read: !item.read } : item
            )
        );
        setMenuOpen(false);
    };

    const deleteMessage = (message) => {
        const confirmed = window.confirm(
            `Delete the message "${message.subject}" from this demo inbox?`
        );

        if (!confirmed) return;

        const remaining = messages.filter((item) => item.id !== message.id);
        setMessages(remaining);
        setSelectedId(remaining[0]?.id ?? null);
        setMenuOpen(false);
        setNotice("Message removed from this local demo inbox.");
    };

    const enterTransition = shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.42, ease: "easeOut" };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: shouldReduceMotion
                        ? { staggerChildren: 0 }
                        : { staggerChildren: 0.08, delayChildren: 0.02 },
                },
            }}
            className="space-y-6 pb-8 text-neutral-900 dark:text-white"
        >
            {/* Page heading */}
            <motion.div
                variants={fadeUp}
                transition={enterTransition}
                className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
            >
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a4c] dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        Communication
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-[34px]">
                        Messages
                    </h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                        Read enquiries, prayer requests, and feedback in one place.
                    </p>
                </div>

                <div className="inline-flex w-fit items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm dark:border-neutral-800 dark:bg-[#141618]">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-[#1a1a4c] dark:bg-indigo-950/50 dark:text-indigo-300">
                        <FontAwesomeIcon icon={faInbox} />
                    </span>
                    <div>
                        <p className="text-lg font-bold leading-tight">{unreadCount}</p>
                        <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                            Unread messages
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Inbox workspace */}
            <motion.section
                variants={fadeUp}
                transition={enterTransition}
                className="grid min-h-[590px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_12px_36px_-24px_rgba(26,26,76,0.28)] dark:border-neutral-800 dark:bg-[#141618] dark:shadow-black/10 lg:grid-cols-[minmax(300px,0.82fr)_minmax(0,1.45fr)]"
            >
                {/* Inbox list */}
                <aside
                    className={`min-w-0 border-b border-neutral-200 dark:border-neutral-800 lg:border-b-0 lg:border-r ${selectedMessage ? "hidden lg:block" : "block"
                        }`}
                >
                    <div className="border-b border-neutral-100 p-4 dark:border-neutral-800 sm:p-5">
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search your inbox..."
                                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/80 py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100/70 dark:border-neutral-700 dark:bg-[#101112] dark:text-white dark:focus:border-indigo-500 dark:focus:bg-[#141618] dark:focus:ring-indigo-950/60"
                            />
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                            <label className="flex min-w-0 items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                                <FontAwesomeIcon icon={faFilter} />
                                <select
                                    value={filter}
                                    onChange={(event) => setFilter(event.target.value)}
                                    className="min-w-0 bg-transparent py-2 font-medium text-neutral-700 outline-none dark:text-neutral-200"
                                    aria-label="Filter messages"
                                >
                                    <option>All messages</option>
                                    <option>Unread</option>
                                    <option>Read</option>
                                </select>
                            </label>
                            <span className="rounded-lg bg-neutral-100 px-2.5 py-1.5 text-[10px] font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300">
                                {filteredMessages.length} messages
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-5 py-4">
                        <h2 className="text-sm font-bold">Inbox</h2>
                        <span className="text-xs text-neutral-400">
                            {unreadCount} unread
                        </span>
                    </div>

                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
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
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        onClick={() => selectMessage(message)}
                                        className={`relative flex w-full gap-3 px-4 py-4 text-left transition sm:px-5 ${isSelected
                                                ? "bg-indigo-50/70 dark:bg-indigo-950/25"
                                                : "hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                                            }`}
                                    >
                                        {isSelected && (
                                            <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-[#1a1a4c] dark:bg-indigo-400" />
                                        )}

                                        <span
                                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-bold ${message.read
                                                    ? "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                                                    : "bg-gradient-to-br from-indigo-100 to-violet-100 text-[#1a1a4c] dark:from-indigo-950 dark:to-violet-950 dark:text-indigo-200"
                                                }`}
                                        >
                                            {getInitials(message.name)}
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="flex items-start justify-between gap-2">
                                                <span
                                                    className={`truncate text-xs ${message.read
                                                            ? "font-semibold text-neutral-700 dark:text-neutral-200"
                                                            : "font-bold text-neutral-950 dark:text-white"
                                                        }`}
                                                >
                                                    {message.name}
                                                </span>
                                                <span className="shrink-0 text-[9px] text-neutral-400">
                                                    {message.date}
                                                </span>
                                            </span>

                                            <span className="mt-1.5 block truncate text-xs font-semibold text-neutral-800 dark:text-neutral-100">
                                                {message.subject}
                                            </span>

                                            <span className="mt-1.5 block text-[11px] leading-5 text-neutral-500 dark:text-neutral-400">
                                                {message.message}
                                            </span>

                                            <span className="mt-2.5 flex items-center justify-between gap-2">
                                                <span className="rounded-md bg-neutral-100 px-2 py-1 text-[9px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                                    {message.category}
                                                </span>
                                                {!message.read && (
                                                    <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
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
                            <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>
                            <p className="text-sm font-semibold">
                                {messages.length ? "No matching messages" : "Inbox is empty"}
                            </p>
                            <p className="mt-1 max-w-xs text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                                {messages.length
                                    ? "Try another search term or change the filter."
                                    : "Messages will appear here when your contact source is connected."}
                            </p>
                        </div>
                    )}
                </aside>

                {/* Message detail */}
                <main
                    className={`min-w-0 ${selectedMessage ? "block" : "hidden lg:flex"
                        } flex-col`}
                >
                    {selectedMessage ? (
                        <>
                            <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3.5 dark:border-neutral-800 sm:px-6">
                                <button
                                    type="button"
                                    onClick={() => setSelectedId(null)}
                                    className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white lg:hidden"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                    Inbox
                                </button>

                                <div className="hidden items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 lg:flex">
                                    <FontAwesomeIcon icon={faInbox} />
                                    Inbox <span className="text-neutral-300">/</span>
                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                        Message details
                                    </span>
                                </div>

                                <div className="relative ml-auto flex items-center gap-1">
                                    <button
                                        type="button"
                                        title={selectedMessage.read ? "Mark unread" : "Mark read"}
                                        aria-label={selectedMessage.read ? "Mark unread" : "Mark read"}
                                        onClick={() => toggleRead(selectedMessage.id)}
                                        className="grid h-9 w-9 place-items-center rounded-xl text-neutral-500 transition hover:bg-indigo-50 hover:text-[#1a1a4c] dark:hover:bg-neutral-800 dark:hover:text-indigo-300"
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
                                        className="grid h-9 w-9 place-items-center rounded-xl text-neutral-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>

                                    <button
                                        type="button"
                                        title="More options"
                                        aria-label="More options"
                                        onClick={() => setMenuOpen((open) => !open)}
                                        className="grid h-9 w-9 place-items-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    >
                                        <FontAwesomeIcon icon={faEllipsisVertical} />
                                    </button>

                                    <AnimatePresence>
                                        {menuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl dark:border-neutral-700 dark:bg-[#1b1d20]"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => toggleRead(selectedMessage.id)}
                                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                >
                                                    <FontAwesomeIcon icon={faCheck} />
                                                    Mark as {selectedMessage.read ? "unread" : "read"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setNotice(
                                                            "Replying will be available when an email or messaging service is connected."
                                                        );
                                                        setMenuOpen(false);
                                                    }}
                                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                >
                                                    <FontAwesomeIcon icon={faReply} />
                                                    Reply options
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.article
                                    key={selectedMessage.id}
                                    initial={
                                        shouldReduceMotion ? false : { opacity: 0, y: 8 }
                                    }
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.22, ease: "easeOut" }}
                                    className="flex-1 p-5 sm:p-7 lg:p-8"
                                >
                                    <div className="mb-5 flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-semibold text-[#1a1a4c] dark:bg-indigo-950/50 dark:text-indigo-200">
                                            {selectedMessage.category}
                                        </span>
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-medium ${selectedMessage.read
                                                    ? "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300"
                                                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                                                }`}
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                            {selectedMessage.read ? "Read" : "Unread"}
                                        </span>
                                    </div>

                                    <h2 className="break-words text-2xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-[28px]">
                                        {selectedMessage.subject}
                                    </h2>

                                    <div className="mt-6 flex flex-col gap-4 border-b border-neutral-100 pb-6 dark:border-neutral-800 sm:flex-row sm:items-center">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-xs font-bold text-[#1a1a4c] dark:from-indigo-950 dark:to-violet-950 dark:text-indigo-200">
                                                {getInitials(selectedMessage.name)}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">
                                                    {selectedMessage.name}
                                                </p>
                                                <p className="mt-1 break-all text-xs text-neutral-500 dark:text-neutral-400">
                                                    {selectedMessage.email}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="text-xs text-neutral-400 sm:ml-auto">
                                            {selectedMessage.date}
                                        </span>
                                    </div>

                                    <div className="min-h-48 py-7">
                                        <p className="whitespace-pre-wrap break-words text-sm leading-8 text-neutral-700 dark:text-neutral-300">
                                            {selectedMessage.message}
                                        </p>
                                    </div>

                                    {notice && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mb-5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs leading-5 text-indigo-900 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-indigo-200"
                                        >
                                            {notice}
                                        </motion.div>
                                    )}

                                    <div className="flex flex-col gap-3 border-t border-neutral-100 pt-5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-[10px] text-neutral-400">
                                            Demo message · Not connected to a live inbox
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setNotice(
                                                    "To send a reply, connect your backend to an email or messaging provider."
                                                )
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a1a4c] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#292967]"
                                        >
                                            <FontAwesomeIcon icon={faReply} />
                                            Reply to message
                                        </button>
                                    </div>
                                </motion.article>
                            </AnimatePresence>
                        </>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
                            <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-[#1a1a4c] dark:from-indigo-950/60 dark:to-violet-950/60 dark:text-indigo-200">
                                <FontAwesomeIcon icon={faMessage} className="text-xl" />
                            </div>
                            <h2 className="text-base font-bold">Select a message</h2>
                            <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                                Choose a message from your inbox to read the full details here.
                            </p>
                        </div>
                    )}
                </main>
            </motion.section>

            <motion.p
                variants={fadeUp}
                transition={enterTransition}
                className="text-[10px] leading-5 text-neutral-400 dark:text-neutral-500"
            >
                Sample messages are included for preview. Connect a real contact form or
                messaging service to load live messages.
            </motion.p>
        </motion.div>
    );
}
