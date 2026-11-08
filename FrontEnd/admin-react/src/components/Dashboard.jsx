import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

const BRAND_RED = "#D91620";
const ACCENT_RED = "#C51D27";

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

    if (Number.isNaN(date.getTime())) {
        return "";
    }

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

const cardClass =
    "rounded-[18px] bg-[var(--card-background)] p-5 shadow-[0_8px_28px_rgba(0,0,0,0.045)] transition-shadow duration-300 hover:shadow-[0_12px_34px_rgba(0,0,0,0.075)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.16)]";

const SectionHeading = ({ title, subtitle, icon }) => (
    <div className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
            <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--text)]">
                {title}
            </h3>

            {subtitle && (
                <p className="mt-1 text-xs leading-5 text-[var(--muted-text)]">
                    {subtitle}
                </p>
            )}
        </div>

        {icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D91620]/[0.06] text-[#C51D27]">
                <FontAwesomeIcon icon={icon} />
            </span>
        )}
    </div>
);

const Dashboard = ({ token }) => {
    const [dashboardData, setDashboardData] = useState({
        sermons: [],
        events: [],
        messages: [],
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAllCategories, setShowAllCategories] = useState(false);

    // Fetch dashboard information
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

            const [
                sermonsResponse,
                eventsResponse,
                messagesResponse,
            ] = await Promise.all([
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

            const [
                sermonsData,
                eventsData,
                messagesData,
            ] = await Promise.all(
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

    // Upcoming events
    const upcomingEvents = useMemo(
        () =>
            dashboardData.events
                .filter((event) => {
                    const date = getEventDate(event);

                    return (
                        date &&
                        date >= now &&
                        event.isPublished !== false
                    );
                })
                .sort(
                    (a, b) => getEventDate(a) - getEventDate(b)
                )
                .slice(0, 5),
        [dashboardData.events]
    );

    // Recent sermons
    const recentSermons = useMemo(
        () =>
            [...dashboardData.sermons]
                .sort((a, b) => {
                    const dateA = new Date(
                        a.createdAt || a.date || 0
                    ).getTime();

                    const dateB = new Date(
                        b.createdAt || b.date || 0
                    ).getTime();

                    return dateB - dateA;
                })
                .slice(0, 5),
        [dashboardData.sermons]
    );

    // Unread messages
    const unreadMessages = dashboardData.messages.filter(
        (message) => message.read !== true
    );

    // Sermon categories
    const categoryEntries = useMemo(() => {
        const categories = dashboardData.sermons.reduce(
            (result, sermon) => {
                const category =
                    sermon.category?.trim() || "Uncategorized";

                result[category] = (result[category] || 0) + 1;

                return result;
            },
            {}
        );

        return Object.entries(categories).sort(
            (a, b) => b[1] - a[1]
        );
    }, [dashboardData.sermons]);

    // Dashboard statistics
    const statistics = [
        {
            title: "Total Sermons",
            value: dashboardData.sermons.length,
            description: "Sermons in your database",
            icon: faBookOpen,
        },
        {
            title: "Upcoming Events",
            value: upcomingEvents.length,
            description: "Published future events",
            icon: faCalendarAlt,
        },
        {
            title: "Total Messages",
            value: dashboardData.messages.length,
            description: "Messages received",
            icon: faMessage,
        },
        {
            title: "Unread Messages",
            value: unreadMessages.length,
            description: "Messages awaiting attention",
            icon: faEnvelopeOpenText,
        },
    ];

    // Loading state
    if (isLoading) {
        return (
            <section className="space-y-6">
                <div className="animate-pulse">
                    <div className="mb-2 h-6 w-48 rounded-lg bg-[var(--sidebar-hover)]" />

                    <div className="h-4 w-72 max-w-full rounded-lg bg-[var(--sidebar-hover)]" />
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
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[var(--sidebar-hover)] border-t-[#D91620]" />

                    <p className="text-sm text-[var(--muted-text)]">
                        Loading your church dashboard...
                    </p>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section className={`${cardClass} py-14 text-center`}>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D91620]/[0.07] text-[#C51D27]">
                    <FontAwesomeIcon
                        icon={faRotateRight}
                        size="lg"
                    />
                </div>

                <h2 className="text-lg font-semibold text-[var(--text)]">
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
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D91620] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B9121B]"
                >
                    <FontAwesomeIcon icon={faRotateRight} />
                    Try again
                </button>
            </section>
        );
    }

    return (
        <section className="space-y-6 pb-8">
            {/* Dashboard heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C51D27]">
                        Dashboard
                    </p>

                    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">
                        Church Overview
                    </h2>

                    <p className="mt-1.5 text-sm text-[var(--muted-text)]">
                        A clear overview of your church content and communications.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchDashboardData}
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--card-background)] px-4 py-2.5 text-sm font-medium text-[var(--text)] shadow-[0_4px_16px_rgba(0,0,0,0.045)] transition hover:text-[#C51D27]"
                >
                    <FontAwesomeIcon icon={faRotateRight} />
                    Refresh
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statistics.map((stat, index) => (
                    <motion.article
                        key={stat.title}
                        initial={{
                            opacity: 0,
                            y: 14,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.35,
                            delay: index * 0.06,
                        }}
                        className={`${cardClass} flex items-start gap-4`}
                    >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#D91620]/[0.06] text-[#C51D27]">
                            <FontAwesomeIcon
                                icon={stat.icon}
                                size="lg"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm text-[var(--muted-text)]">
                                {stat.title}
                            </p>

                            <h3 className="mt-1 text-[28px] font-semibold leading-tight tracking-[-0.04em] text-[var(--text)]">
                                {stat.value.toLocaleString()}
                            </h3>

                            <p className="mt-1.5 text-xs leading-5 text-[var(--muted-text)]">
                                {stat.description}
                            </p>
                        </div>
                    </motion.article>
                ))}
            </div>

            {/* Recent Sermons and Upcoming Events */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {/* Recent Sermons */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 12,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.4,
                    }}
                    className={cardClass}
                >
                    <SectionHeading
                        title="Recent Sermons"
                        subtitle="Recently added church content"
                        icon={faBookOpen}
                    />

                    {recentSermons.length === 0 ? (
                        <p className="py-8 text-center text-sm text-[var(--muted-text)]">
                            No sermons have been added yet.
                        </p>
                    ) : (
                        <div className="space-y-1">
                            {recentSermons.map((sermon, index) => (
                                <div
                                    key={sermon._id || sermon.id || index}
                                    className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-[var(--hover)]"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--background)] text-[#C51D27]">
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
                                                    event.currentTarget.style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <FontAwesomeIcon icon={faBookOpen} />
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

                {/* Upcoming Events */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 12,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.4,
                        delay: 0.06,
                    }}
                    className={cardClass}
                >
                    <SectionHeading
                        title="Upcoming Events"
                        subtitle="Published events scheduled for the future"
                        icon={faCalendarAlt}
                    />

                    {upcomingEvents.length === 0 ? (
                        <p className="py-8 text-center text-sm text-[var(--muted-text)]">
                            No upcoming published events.
                        </p>
                    ) : (
                        <div className="space-y-1">
                            {upcomingEvents.map((event, index) => {
                                const date = getEventDate(event);

                                return (
                                    <div
                                        key={event._id || event.id || index}
                                        className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-[var(--hover)]"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#D91620]/[0.06] text-[#C51D27]">
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

                                            <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[var(--muted-text)]">
                                                <FontAwesomeIcon
                                                    icon={faClock}
                                                    className="shrink-0"
                                                />

                                                {event.time || formatDate(event.date)}
                                            </p>

                                            {event.location && (
                                                <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[var(--muted-text)]">
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

            {/* Sermon Categories and Recent Messages */}
            <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
                {/* Sermons by Category */}
                <div className={`${cardClass} self-start`}>
                    <SectionHeading
                        title="Sermons by Category"
                        subtitle="Distribution of your sermon library"
                        icon={faBookOpen}
                    />

                    {categoryEntries.length === 0 ? (
                        <p className="py-6 text-center text-sm text-[var(--muted-text)]">
                            Category statistics will appear when sermons are added.
                        </p>
                    ) : (
                        <div className="space-y-5">
                            {/* First four categories stay visible */}
                            {categoryEntries.slice(0, 4).map(([name, count]) => {
                                const percentage =
                                    dashboardData.sermons.length > 0
                                        ? Math.round(
                                            (count / dashboardData.sermons.length) * 100
                                        )
                                        : 0;

                                return (
                                    <div key={name}>
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <span className="truncate text-sm text-[var(--text)]">
                                                {name}
                                            </span>

                                            <span className="shrink-0 text-xs font-medium text-[var(--muted-text)]">
                                                {count} · {percentage}%
                                            </span>
                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-[var(--background)]">
                                            <motion.div
                                                initial={{
                                                    width: 0,
                                                }}
                                                animate={{
                                                    width: `${percentage}%`,
                                                }}
                                                transition={{
                                                    duration: 0.55,
                                                    ease: "easeOut",
                                                }}
                                                className="h-full rounded-full bg-[#D91620]/80"
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Animated additional categories */}
                            <AnimatePresence initial={false}>
                                {showAllCategories && (
                                    <motion.div
                                        key="additional-categories"
                                        initial={{
                                            height: 0,
                                            opacity: 0,
                                            y: -8,
                                        }}
                                        animate={{
                                            height: "auto",
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            height: 0,
                                            opacity: 0,
                                            y: -6,
                                        }}
                                        transition={{
                                            height: {
                                                duration: 0.35,
                                                ease: [0.22, 1, 0.36, 1],
                                            },
                                            opacity: {
                                                duration: 0.22,
                                            },
                                            y: {
                                                duration: 0.25,
                                            },
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="space-y-5 pt-1">
                                            {categoryEntries.slice(4).map(([name, count]) => {
                                                const percentage =
                                                    dashboardData.sermons.length > 0
                                                        ? Math.round(
                                                            (count / dashboardData.sermons.length) * 100
                                                        )
                                                        : 0;

                                                return (
                                                    <div key={name}>
                                                        <div className="mb-2 flex items-center justify-between gap-3">
                                                            <span className="truncate text-sm text-[var(--text)]">
                                                                {name}
                                                            </span>

                                                            <span className="shrink-0 text-xs font-medium text-[var(--muted-text)]">
                                                                {count} · {percentage}%
                                                            </span>
                                                        </div>

                                                        <div className="h-2 overflow-hidden rounded-full bg-[var(--background)]">
                                                            <motion.div
                                                                initial={{
                                                                    width: 0,
                                                                }}
                                                                animate={{
                                                                    width: `${percentage}%`,
                                                                }}
                                                                transition={{
                                                                    duration: 0.5,
                                                                    ease: "easeOut",
                                                                }}
                                                                className="h-full rounded-full bg-[#D91620]/80"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Expand / Collapse button */}
                    {categoryEntries.length > 4 && (
                        <button
                            type="button"
                            onClick={() =>
                                setShowAllCategories((current) => !current)
                            }
                            aria-expanded={showAllCategories}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-[#C51D27] transition hover:bg-[#D91620]/[0.06]"
                        >
                            {showAllCategories
                                ? "Show fewer categories"
                                : `Show all ${categoryEntries.length} categories`}

                            <motion.span
                                animate={{
                                    rotate: showAllCategories ? 180 : 0,
                                }}
                                transition={{
                                    duration: 0.25,
                                    ease: "easeOut",
                                }}
                                className="text-xs"
                                aria-hidden="true"
                            >
                                ▾
                            </motion.span>
                        </button>
                    )}
                </div>

                {/* Recent Messages */}
                <div className={`${cardClass} self-start`}>
                    <SectionHeading
                        title="Recent Messages"
                        subtitle="Latest enquiries from your visitors"
                        icon={faMessage}
                    />

                    {dashboardData.messages.length === 0 ? (
                        <p className="py-8 text-center text-sm text-[var(--muted-text)]">
                            No messages have been received yet.
                        </p>
                    ) : (
                        <div className="space-y-1">
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
                                        className="flex items-start gap-3 rounded-xl px-2 py-3 transition hover:bg-[var(--hover)]"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D91620]/[0.07] text-sm font-semibold text-[#C51D27]">
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
                                                    <span className="rounded-full bg-[#D91620]/[0.07] px-2 py-0.5 text-[10px] font-semibold text-[#C51D27]">
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
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            className="text-[#C51D27]"
                        />

                        <span>
                            {unreadMessages.length} unread{" "}
                            {unreadMessages.length === 1
                                ? "message"
                                : "messages"}{" "}
                            requiring attention
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;