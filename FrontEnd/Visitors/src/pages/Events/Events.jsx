import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const pageVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};

const gridVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.09, delayChildren: 0.08 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
};

function Events() {
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAllEvents, setShowAllEvents] = useState(false);

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch(`${API_URL}/api/events`);
            if (!response.ok) {
                throw new Error(`Events request failed (${response.status})`);
            }

            const data = await response.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching events:", err);
            setError("Unable to load events at the moment. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const formatDate = (date) => {
        if (!date) return "Date to be announced";

        const parsed = new Date(date);
        if (Number.isNaN(parsed.getTime())) return date;

        return parsed.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const visibleEvents = showAllEvents ? events : events.slice(0, 3);
    const hasMoreEvents = events.length > 3;

    const openEvent = (event) => {
        const eventId = event._id || event.id;
        if (eventId) navigate(`/events/${eventId}`);
    };

    const motionProps = (variants) =>
        shouldReduceMotion
            ? {}
            : {
                variants,
                initial: "hidden",
                whileInView: "visible",
                viewport: { once: true, amount: 0.12 },
            };

    return (
        <main className="min-h-screen overflow-hidden bg-[#F8F8F7] text-[#191919] transition-colors duration-500 dark:bg-[#101112] dark:text-white">
            {/* Hero */}
            <section className="relative isolate overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:pb-24">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#E31B23]/[0.055] blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-black/[0.035] blur-3xl dark:bg-white/[0.025]"
                />

                <motion.div
                    {...motionProps(pageVariants)}
                    className="relative mx-auto max-w-6xl"
                >
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#E31B23]/[0.07] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#C91B22] dark:bg-[#E31B23]/[0.12] dark:text-[#FF777C]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E31B23]" />
                            Live at Living Faith Iguosa
                        </span>

                        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                            Upcoming Events
                        </h1>

                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#666663] sm:text-base sm:leading-8 dark:text-[#A8A8A5]">
                            Join us for worship, prayer, fellowship, and the
                            life-changing Word of God at Living Faith Church
                            Iguosa.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Events list */}
            <section className="px-5 pb-24 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        {...motionProps(pageVariants)}
                        className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between"
                    >
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E31B23]">
                                Mark your calendar
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                                Upcoming at our church
                            </h2>
                        </div>
                        {!loading && !error && events.length > 0 && (
                            <p className="text-sm text-[#777773] dark:text-[#A8A8A5]">
                                {events.length}{" "}
                                {events.length === 1 ? "event" : "events"} to
                                explore
                            </p>
                        )}
                    </motion.div>

                    {loading ? (
                        <div
                            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                            aria-label="Loading events"
                            aria-busy="true"
                        >
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="animate-pulse rounded-[1.5rem] bg-white p-6 dark:bg-[#191B1C]"
                                >
                                    <div className="h-10 w-10 rounded-2xl bg-[#EFEFEC] dark:bg-[#292B2C]" />
                                    <div className="mt-7 h-3 w-24 rounded bg-[#EFEFEC] dark:bg-[#292B2C]" />
                                    <div className="mt-3 h-5 w-2/3 rounded bg-[#EFEFEC] dark:bg-[#292B2C]" />
                                    <div className="mt-5 h-3 w-1/2 rounded bg-[#EFEFEC] dark:bg-[#292B2C]" />
                                    <div className="mt-3 h-3 w-3/4 rounded bg-[#EFEFEC] dark:bg-[#292B2C]" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <motion.div
                            {...motionProps(pageVariants)}
                            className="mx-auto max-w-xl rounded-[1.5rem] bg-white px-7 py-10 text-center dark:bg-[#191B1C]"
                        >
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E31B23]/[0.08] text-[#E31B23] dark:bg-[#E31B23]/[0.13]">
                                <i className="fas fa-cloud-exclamation text-lg" aria-hidden="true" />
                            </div>
                            <h3 className="mt-5 text-xl font-semibold">
                                Events are taking a little break
                            </h3>
                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#6E6E69] dark:text-[#A8A8A5]">
                                {error}
                            </p>
                            <button
                                type="button"
                                onClick={fetchEvents}
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#191919] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333333] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E31B23] focus-visible:ring-offset-2 dark:bg-white dark:text-[#171717] dark:hover:bg-[#E8E8E6] dark:focus-visible:ring-offset-[#101112]"
                            >
                                Try again <i className="fas fa-arrow-right text-xs" aria-hidden="true" />
                            </button>
                        </motion.div>
                    ) : events.length === 0 ? (
                        <motion.div
                            {...motionProps(pageVariants)}
                            className="mx-auto max-w-xl rounded-[1.5rem] bg-white px-7 py-12 text-center dark:bg-[#191B1C]"
                        >
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F0ED] text-xl text-[#666663] dark:bg-[#292B2C] dark:text-[#D0D0CC]">
                                <i className="far fa-calendar" aria-hidden="true" />
                            </div>
                            <h3 className="mt-5 text-xl font-semibold">
                                Nothing scheduled just yet
                            </h3>
                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#6E6E69] dark:text-[#A8A8A5]">
                                There are no upcoming events to display right
                                now. Please check back soon.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            {...motionProps(gridVariants)}
                            className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            <AnimatePresence>
                                {visibleEvents.map((event, index) => {
                                    const eventId = event._id || event.id;

                                    return (
                                        <motion.article
                                            key={eventId || `${event.title}-${index}`}
                                            {...(shouldReduceMotion
                                                ? {}
                                                : {
                                                    variants: cardVariants,
                                                    initial: "hidden",
                                                    whileInView: "visible",
                                                    viewport: {
                                                        once: true,
                                                        amount: 0.12,
                                                    },
                                                    whileHover: {
                                                        y: -5,
                                                        transition: {
                                                            duration: 0.22,
                                                        },
                                                    },
                                                })}
                                            onClick={() => openEvent(event)}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === "Enter" ||
                                                    e.key === " "
                                                ) {
                                                    e.preventDefault();
                                                    openEvent(event);
                                                }
                                            }}
                                            role="link"
                                            tabIndex={0}
                                            aria-label={`View event: ${event.title || "Untitled event"}`}
                                            className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.5rem] bg-white p-6 transition-colors duration-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E31B23]/60 focus-visible:ring-offset-4 dark:bg-[#191B1C] dark:hover:bg-[#1D1F20] dark:focus-visible:ring-offset-[#101112] sm:p-7"
                                        >
                                            <div
                                                aria-hidden="true"
                                                className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-bl-[5rem] bg-[#E31B23]/[0.045] transition-transform duration-500 group-hover:scale-110 dark:bg-[#E31B23]/[0.08]"
                                            />

                                            <div className="relative flex items-start justify-between gap-4">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2F1EE] text-[#292929] transition-colors duration-300 group-hover:bg-[#E31B23] group-hover:text-white dark:bg-[#292B2C] dark:text-[#E5E5E2] dark:group-hover:bg-[#E31B23]">
                                                    <i className="fas fa-calendar-day text-base" aria-hidden="true" />
                                                </div>
                                                <span className="rounded-full bg-[#F5F4F1] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#777773] dark:bg-[#292B2C] dark:text-[#B8B8B4]">
                                                    {event.label || "Church event"}
                                                </span>
                                            </div>

                                            <div className="relative mt-6">
                                                <h3 className="text-xl font-semibold leading-snug tracking-tight text-[#20201F] transition-colors group-hover:text-[#C91B22] dark:text-white dark:group-hover:text-[#FF777C]">
                                                    {event.title || "Untitled event"}
                                                </h3>
                                                {event.description && (
                                                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6E6E69] dark:text-[#A8A8A5]">
                                                        {event.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="relative mt-6 space-y-3.5 border-t border-[#F0EFEC] pt-5 dark:border-white/[0.06]">
                                                <p className="flex items-start gap-3 text-sm text-[#555550] dark:text-[#C0C0BC]">
                                                    <i className="far fa-calendar-check mt-0.5 w-4 shrink-0 text-[#E31B23]" aria-hidden="true" />
                                                    <span>{formatDate(event.date)}</span>
                                                </p>
                                                {event.time && (
                                                    <p className="flex items-start gap-3 text-sm text-[#555550] dark:text-[#C0C0BC]">
                                                        <i className="far fa-clock mt-0.5 w-4 shrink-0 text-[#E31B23]" aria-hidden="true" />
                                                        <span>{event.time}</span>
                                                    </p>
                                                )}
                                                {event.location && (
                                                    <p className="flex items-start gap-3 text-sm text-[#555550] dark:text-[#C0C0BC]">
                                                        <i className="fas fa-location-dot mt-0.5 w-4 shrink-0 text-[#E31B23]" aria-hidden="true" />
                                                        <span>{event.location}</span>
                                                    </p>
                                                )}
                                            </div>

                                            <div className="relative mt-auto flex items-center justify-between pt-7 text-sm font-semibold">
                                                <span className="text-[#292929] dark:text-[#F0F0ED]">
                                                    Event details
                                                </span>
                                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F2EF] text-[#292929] transition-all duration-300 group-hover:bg-[#E31B23] group-hover:text-white dark:bg-[#292B2C] dark:text-white dark:group-hover:bg-[#E31B23]">
                                                    <i className="fas fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                                                </span>
                                            </div>
                                        </motion.article>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {!loading && !error && hasMoreEvents && (
                        <motion.div
                            {...motionProps(pageVariants)}
                            className="mt-10 flex justify-center"
                        >
                            <button
                                type="button"
                                onClick={() => setShowAllEvents((current) => !current)}
                                aria-expanded={showAllEvents}
                                className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#292929] transition duration-300 hover:bg-[#F0EFEC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E31B23]/60 focus-visible:ring-offset-4 dark:bg-[#191B1C] dark:text-white dark:hover:bg-[#232526] dark:focus-visible:ring-offset-[#101112]"
                            >
                                {showAllEvents ? "Show Less" : "See More Events"}
                                <i
                                    className={`fas ${showAllEvents ? "fa-arrow-up" : "fa-arrow-down"} text-xs text-[#E31B23] transition-transform duration-300 group-hover:translate-y-0.5`}
                                    aria-hidden="true"
                                />
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Closing invitation */}
            {!loading && !error && events.length > 0 && (
                <section className="px-5 pb-20 sm:px-8 lg:px-12">
                    <motion.div
                        {...motionProps(pageVariants)}
                        className="mx-auto max-w-6xl rounded-[1.75rem] bg-[#EFEDE9] px-6 py-10 text-center dark:bg-[#191B1C] sm:px-10 sm:py-12"
                    >
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E31B23]">
                            You are welcome
                        </p>
                        <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
                            Come expectant. Leave encouraged.
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#666663] dark:text-[#A8A8A5]">
                            We look forward to worshipping and growing in faith
                            with you at Living Faith Church Iguosa.
                        </p>
                    </motion.div>
                </section>
            )}
        </main>
    );
}

export default Events;
