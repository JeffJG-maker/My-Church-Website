
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBookOpen,
    faCalendarAlt,
    faMessage,
    faEnvelopeOpenText,
    faRotateRight,
    faArrowRight,
    faClock,
    faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const formatDate = (value) => {
    if (!value) return "Date not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date not available";
    }

    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
};

const formatDateTime = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
};

const getEventDate = (event) => {
    if (!event?.date) return null;

    const date = new Date(event.date);

    return Number.isNaN(date.getTime()) ? null : date;
};

const Dashboard = ({ token }) => {
    const [dashboardData, setDashboardData] = useState({
        sermons: [],
        events: [],
        messages: [],
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardData = useCallback(async () => {
        if (!token) {
            setError("Your admin session is missing. Please log in again.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const [sermonsResponse, eventsResponse, messagesResponse] =
                await Promise.all([
                    fetch(`${API_URL}/api/sermons`, { headers }),
                    fetch(`${API_URL}/api/events`, { headers }),
                    fetch(`${API_URL}/api/contact`, { headers }),
                ]);

            const responses = [
                sermonsResponse,
                eventsResponse,
                messagesResponse,
            ];

            if (responses.some((response) => response.status === 401)) {
                throw new Error(
                    "Your admin session has expired or is invalid. Please log in again."
                );
            }

            if (responses.some((response) => !response.ok)) {
                throw new Error(
                    "Some dashboard information could not be loaded. Please try again."
                );
            }

            const [sermonsData, eventsData, messagesData] =
                await Promise.all(
                    responses.map((response) => response.json())
                );

            const sermons = Array.isArray(sermonsData)
                ? sermonsData
                : sermonsData.sermons;

            const events = Array.isArray(eventsData)
                ? eventsData
                : eventsData.events;

            const messages = Array.isArray(messagesData)
                ? messagesData
                : messagesData.messages;

            if (
                !Array.isArray(sermons) ||
                !Array.isArray(events) ||
                !Array.isArray(messages)
            ) {
                throw new Error(
                    "The server returned an unexpected data format."
                );
            }

            setDashboardData({
                sermons,
                events,
                messages,
            });
        } catch (requestError) {
            setError(
                requestError.message ||
                "Unable to load dashboard information. Check your connection."
            );
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const now = new Date();

    const upcomingEvents = dashboardData.events
        .filter((event) => {
            const date = getEventDate(event);

            return (
                date &&
                date >= now &&
                event.isPublished !== false
            );
        })
        .sort((a, b) => getEventDate(a) - getEventDate(b))
        .slice(0, 5);

    const recentSermons = [...dashboardData.sermons]
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || a.date || 0).getTime();
            const dateB = new Date(b.createdAt || b.date || 0).getTime();

            return dateB - dateA;
        })
        .slice(0, 5);

    const unreadMessages = dashboardData.messages.filter(
        (message) => message.read !== true
    );

    const categories = dashboardData.sermons.reduce((result, sermon) => {
        const category = sermon.category?.trim() || "Uncategorized";

        result[category] = (result[category] || 0) + 1;

        return result;
    }, {});

    const categoryEntries = Object.entries(categories).sort(
        (a, b) => b[1] - a[1]
    );

    const statistics = [
        {
            title: "Total Sermons",
            value: dashboardData.sermons.length,
            description: "Sermons in your database",
            icon: faBookOpen,
            color: "#7c3aed",
            background: "#ede9fe",
        },
        {
            title: "Upcoming Events",
            value: upcomingEvents.length,
            description: "Published future events",
            icon: faCalendarAlt,
            color: "#ea580c",
            background: "#ffedd5",
        },
        {
            title: "Total Messages",
            value: dashboardData.messages.length,
            description: "Messages received",
            icon: faMessage,
            color: "#2563eb",
            background: "#dbeafe",
        },
        {
            title: "Unread Messages",
            value: unreadMessages.length,
            description: "Messages awaiting attention",
            icon: faEnvelopeOpenText,
            color: "#059669",
            background: "#d1fae5",
        },
    ];

    const cardClass =
        "rounded-2xl border border-[var(--border-color)] bg-[var(--card-background)] p-5 shadow-[0_5px_30px_0_var(--card-shadow)]";

    if (isLoading) {
        return (
            <section className="space-y-6">
                <div className="animate-pulse">
                    <div className="mb-2 h-6 w-48 rounded bg-[var(--sidebar-hover)]" />
                    <div className="h-4 w-72 max-w-full rounded bg-[var(--sidebar-hover)]" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className={`${cardClass} animate-pulse`}
                        >
                            <div className="mb-4 h-10 w-10 rounded-xl bg-[var(--sidebar-hover)]" />
                            <div className="mb-3 h-4 w-28 rounded bg-[var(--sidebar-hover)]" />
                            <div className="h-7 w-16 rounded bg-[var(--sidebar-hover)]" />
                        </div>
                    ))}
                </div>

                <div className={`${cardClass} py-12 text-center`}>
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[var(--sidebar-hover)] border-t-violet-600" />
                    <p className="text-sm text-[var(--muted-text)]">
                        Loading your church dashboard...
                    </p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={`${cardClass} py-14 text-center`}>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <FontAwesomeIcon icon={faRotateRight} size="lg" />
                </div>

                <h2 className="text-lg font-bold text-[var(--text)]">
                    Unable to load dashboard
                </h2>

                <p
                    role="alert"
                    className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--muted-text)]"
                >
                    {error}
                </p>

                <button
                    type="button"
                    onClick={fetchDashboardData}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                    <FontAwesomeIcon icon={faRotateRight} />
                    Try again
                </button>
            </section>
        );
    }

    return (
        <section className="space-y-6 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[var(--text)]">
                        Church Overview
                    </h2>

                    <p className="mt-1 text-sm text-[var(--muted-text)]">
                        A live overview of your church content and communications.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchDashboardData}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--hover)]"
                >
                    <FontAwesomeIcon icon={faRotateRight} />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statistics.map((stat, index) => (
                    <motion.article
                        key={stat.title}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.35,
                            delay: index * 0.07,
                        }}
                        className={`${cardClass} flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1`}
                    >
                        <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                            style={{
                                backgroundColor: stat.background,
                                color: stat.color,
                            }}
                        >
                            <FontAwesomeIcon
                                icon={stat.icon}
                                size="lg"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm text-[var(--muted-text)]">
                                {stat.title}
                            </p>

                            <h3 className="mt-1 text-2xl font-bold text-[var(--text)]">
                                {stat.value.toLocaleString()}
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-[var(--muted-text)]">
                                {stat.description}
                            </p>
                        </div>
                    </motion.article>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className={cardClass}
                >
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <h3 className="font-bold text-[var(--text)]">
                                Recent Sermons
                            </h3>
                            <p className="mt-1 text-xs text-[var(--muted-text)]">
                                Recently added church content
                            </p>
                        </div>

                        <FontAwesomeIcon
                            icon={faBookOpen}
                            className="text-violet-500"
                        />
                    </div>

                    {recentSermons.length === 0 ? (
                        <p className="py-8 text-center text-sm text-[var(--muted-text)]">
                            No sermons have been added yet.
                        </p>
                    ) : (
                        <div className="divide-y divide-[var(--border-color)]">
                            {recentSermons.map((sermon, index) => (
                                <div
                                    key={sermon._id || sermon.id || index}
                                    className="flex items-center gap-3 py-3"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--background)]">
                                        {sermon.thumbnail ? (
                                            <img
                                                src={
                                                    sermon.thumbnail.startsWith("http")
                                                        ? sermon.thumbnail
                                                        : `${API_URL}/${sermon.thumbnail.replace(/^\/+/, "")}`
                                                }
                                                alt={sermon.title || "Sermon"}
                                                className="h-full w-full object-cover"
                                                onError={(event) => {
                                                    event.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faBookOpen}
                                                className="text-violet-500"
                                            />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-[var(--text)]">
                                            {sermon.title || "Untitled sermon"}
                                        </p>
                                        <p className="mt-1 truncate text-xs text-[var(--muted-text)]">
                                            {sermon.speaker || "Speaker not specified"}
                                            {sermon.category
                                                ? ` · ${sermon.category}`
                                                : ""}
                                        </p>
                                    </div>

                                    <span className="shrink-0 text-xs text-[var(--muted-text)]">
                                        {formatDate(sermon.createdAt || sermon.date)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 }}
                    className={cardClass}
                >
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <h3 className="font-bold text-[var(--text)]">
                                Upcoming Events
                            </h3>
                            <p className="mt-1 text-xs text-[var(--muted-text)]">
                                Published events scheduled for the future
                            </p>
                        </div>

                        <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="text-orange-500"
                        />
                    </div>

                    {upcomingEvents.length === 0 ? (
                        <p className="py-8 text-center text-sm text-[var(--muted-text)]">
                            No upcoming published events.
                        </p>
                    ) : (
                        <div className="divide-y divide-[var(--border-color)]">
                            {upcomingEvents.map((event, index) => {
                                const date = getEventDate(event);

                                return (
                                    <div
                                        key={event._id || event.id || index}
                                        className="flex items-center gap-3 py-3"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                                            <span className="text-[10px] font-semibold uppercase">
                                                {date.toLocaleDateString("en", {
                                                    month: "short",
                                                })}
                                            </span>
                                            <strong className="text-lg leading-5">
                                                {date.getDate()}
                                            </strong>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-[var(--text)]">
                                                {event.title || "Untitled event"}
                                            </p>

                                            <p className="mt-1 flex items-center gap-1 truncate text-xs text-[var(--muted-text)]">
                                                <FontAwesomeIcon
                                                    icon={faClock}
                                                    className="shrink-0"
                                                />
                                                {event.time || formatDate(event.date)}
                                            </p>

                                            {event.location && (
                                                <p className="mt-1 flex items-center gap-1 truncate text-xs text-[var(--muted-text)]">
                                                    <FontAwesomeIcon
                                                        icon={faMapMarkerAlt}
                                                        className="shrink-0"
                                                    />
                                                    {event.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div className={cardClass}>
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-[var(--text)]">
                                Sermons by Category
                            </h3>
                            <p className="mt-1 text-xs text-[var(--muted-text)]">
                                Distribution based on existing sermon records
                            </p>
                        </div>

                        <FontAwesomeIcon
                            icon={faBookOpen}
                            className="text-violet-500"
                        />
                    </div>

                    {categoryEntries.length === 0 ? (
                        <p className="py-6 text-center text-sm text-[var(--muted-text)]">
                            Category statistics will appear when sermons are added.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {categoryEntries.map(([name, count], index) => {
                                const percentage =
                                    dashboardData.sermons.length > 0
                                        ? Math.round(
                                            (count /
                                                dashboardData.sermons.length) *
                                            100
                                        )
                                        : 0;

                                const colors = [
                                    "#8b5cf6",
                                    "#3b82f6",
                                    "#10b981",
                                    "#f59e0b",
                                    "#f43f5e",
                                    "#64748b",
                                ];

                                return (
                                    <div key={name}>
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <span className="truncate text-sm text-[var(--text)]">
                                                {name}
                                            </span>
                                            <span className="shrink-0 text-xs font-semibold text-[var(--muted-text)]">
                                                {count} · {percentage}%
                                            </span>
                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-[var(--background)]">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor:
                                                        colors[index % colors.length],
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className={cardClass}>
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <h3 className="font-bold text-[var(--text)]">
                                Recent Messages
                            </h3>
                            <p className="mt-1 text-xs text-[var(--muted-text)]">
                                Latest enquiries from your visitors
                            </p>
                        </div>

                        <FontAwesomeIcon
                            icon={faMessage}
                            className="text-blue-500"
                        />
                    </div>

                    {dashboardData.messages.length === 0 ? (
                        <p className="py-8 text-center text-sm text-[var(--muted-text)]">
                            No messages have been received yet.
                        </p>
                    ) : (
                        <div className="divide-y divide-[var(--border-color)]">
                            {[...dashboardData.messages]
                                .sort(
                                    (a, b) =>
                                        new Date(b.createdAt || 0).getTime() -
                                        new Date(a.createdAt || 0).getTime()
                                )
                                .slice(0, 5)
                                .map((message, index) => (
                                    <div
                                        key={message._id || index}
                                        className="flex items-start gap-3 py-3"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                                            {(message.name || "V")
                                                .trim()
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate text-sm font-semibold text-[var(--text)]">
                                                    {message.name || "Visitor"}
                                                </p>

                                                {message.read !== true && (
                                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                                                        Unread
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-1 truncate text-xs text-[var(--muted-text)]">
                                                {message.subject || "General enquiry"}
                                            </p>

                                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--muted-text)]">
                                                {message.message || ""}
                                            </p>

                                            <p className="mt-1 text-[10px] text-[var(--muted-text)]">
                                                {formatDateTime(message.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}

                    <div className="mt-4 flex items-center gap-2 text-xs text-[var(--muted-text)]">
                        <FontAwesomeIcon icon={faArrowRight} />
                        <span>
                            {unreadMessages.length} unread{" "}
                            {unreadMessages.length === 1 ? "message" : "messages"}{" "}
                            requiring attention
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
