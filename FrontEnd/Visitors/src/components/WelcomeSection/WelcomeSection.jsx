import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const smoothEase = [0.22, 1, 0.36, 1];

function WelcomeSection() {
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch upcoming event
    useEffect(() => {
        const controller = new AbortController();

        const fetchUpcomingEvent = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `${API_URL}/api/events/upcoming`,
                    {
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch upcoming event.");
                }

                const data = await response.json();

                const upcomingEvent =
                    data?.event ||
                    data?.data?.event ||
                    data?.data ||
                    data;

                setEvent(upcomingEvent);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Upcoming event error:", error);
                    setEvent(null);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchUpcomingEvent();

        return () => controller.abort();
    }, []);

    // Format event date
    const formatDate = (date) => {
        if (!date) return "Date to be announced";

        const eventDate = new Date(date);

        if (Number.isNaN(eventDate.getTime())) {
            return date;
        }

        return eventDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <section
            id="welcome"
            className="relative overflow-hidden bg-white px-5 py-16 text-[#171717] transition-colors duration-500 dark:bg-[#101112] dark:text-white sm:px-8 md:py-20 lg:px-[7%] lg:py-24"
        >
            {/* Subtle Background Decoration */}
            <div
                className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#D91620]/[0.035] blur-3xl dark:bg-[#D91620]/[0.045]"
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-7xl">
                {/* Welcome Label */}
                <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-[#D91620]" />

                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D91620] dark:text-white">
                        You Are Welcome
                    </p>
                </div>

                {/* Welcome Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.1,
                        ease: smoothEase,
                    }}
                    className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
                >
                    <h2 className="max-w-4xl text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
                        Come and experience the presence of God with us.
                    </h2>

                    <button
                        type="button"
                        onClick={() => navigate("/events")}
                        className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#D91620] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#B9121B] focus:outline-none focus:ring-2 focus:ring-[#D91620] focus:ring-offset-2 dark:focus:ring-offset-[#101112]"
                    >
                        View Events

                        <span
                            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                            aria-hidden="true"
                        >
                            →
                        </span>
                    </button>
                </motion.div>

                {/* Welcome Description and Upcoming Event */}
                <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                    {/* Welcome Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                            ease: smoothEase,
                        }}
                        className="max-w-2xl"
                    >
                        <p className="text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg sm:leading-8">
                            Join us for worship, prayer, fellowship, and the
                            teaching of God&apos;s Word. We look forward to
                            sharing in faith and growing together with you.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/about")}
                            className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D91620] transition-colors hover:text-[#B9121B] focus:outline-none focus-visible:underline dark:text-white dark:hover:text-gray-200"
                        >
                            Get to Know Us

                            <span
                                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                                aria-hidden="true"
                            >
                                →
                            </span>
                        </button>
                    </motion.div>

                    {/* Upcoming Event */}
                    <motion.aside
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.3,
                            ease: smoothEase,
                        }}
                        className="rounded-2xl bg-[#F7F7F7] p-6 dark:bg-[#191B1D] sm:p-7"
                    >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D91620] dark:text-white">
                            Upcoming Event
                        </p>

                        {/* Loading State */}
                        {loading ? (
                            <div
                                className="mt-5 animate-pulse space-y-4"
                                aria-label="Loading upcoming event"
                            >
                                <div className="h-7 w-3/4 rounded-lg bg-gray-200 dark:bg-[#292B2D]" />

                                <div className="h-4 w-full rounded-lg bg-gray-200 dark:bg-[#292B2D]" />

                                <div className="h-4 w-5/6 rounded-lg bg-gray-200 dark:bg-[#292B2D]" />
                            </div>
                        ) : event?.title || event?.name ? (
                            <>
                                <h3 className="mt-3 text-2xl font-bold leading-tight">
                                    {event.title || event.name}
                                </h3>

                                <div className="mt-5 space-y-4">
                                    {/* Event Date */}
                                    <div className="flex items-start gap-3">
                                        <i
                                            className="fas fa-calendar-day mt-1 w-4 text-[#D91620] dark:text-white"
                                            aria-hidden="true"
                                        />

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Date
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                                {formatDate(event.date)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Event Time */}
                                    <div className="flex items-start gap-3">
                                        <i
                                            className="fas fa-clock mt-1 w-4 text-[#D91620] dark:text-white"
                                            aria-hidden="true"
                                        />

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Time
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                                {event.time ||
                                                    "Time to be announced"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Event Location */}
                                    <div className="flex items-start gap-3">
                                        <i
                                            className="fas fa-location-dot mt-1 w-4 text-[#D91620] dark:text-white"
                                            aria-hidden="true"
                                        />

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Location
                                            </p>

                                            <p className="mt-1 text-sm font-medium leading-6 text-gray-700 dark:text-gray-200">
                                                {event.location ||
                                                    "Living Faith Church Iguosa"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="mt-4">
                                <h3 className="text-xl font-semibold">
                                    Stay Connected
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                                    No upcoming event is available at the
                                    moment. Please check back soon.
                                </p>
                            </div>
                        )}
                    </motion.aside>
                </div>
            </div>

            {/* Gilead Medical Care */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                    duration: 0.8,
                    delay: 0.1,
                    ease: smoothEase,
                }}
                className="relative mx-auto mt-20 max-w-7xl border-t border-gray-200 pt-12 dark:border-white/10 md:mt-24 md:pt-16"
            >
                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto] md:gap-12">
                    {/* Medical Care Content */}
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-[#D91620]" />

                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D91620] dark:text-white">
                                Caring Beyond the Church
                            </p>
                        </div>

                        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                            Gilead Medical Care
                        </h2>

                        <motion.p className="mt-5 text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg sm:leading-8"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25}}
                            transition={{
                                duration: 0.8,
                                delay: 0.1,
                                ease: smoothEase,
                            }}
                        >
                            Your health matters to us. Gilead Medical Care
                            offers basic health checks, including blood
                            pressure and blood sugar testing, alongside
                            first-aid support for immediate minor health
                            needs.
                        </motion.p>

                        <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
                            Interested in learning more? Contact us, and
                            our team will be happy to provide further
                            information about the service.
                        </p>
                    </div>

                    {/* Contact Button */}
                    <div className="md:justify-self-end">
                        <button
                            type="button"
                            onClick={() => navigate("/contact")}
                            className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#ececec] px-6 py-3.5 text-sm font-semibold text-[#D91620] transition-all duration-300 hover:-translate-y-1 hover:bg-[lightgrey] focus:outline-none focus:ring-2 focus:ring-[#D91620] focus:ring-offset-2 dark:focus:ring-offset-[#101112] dark:text-white dark:bg-[#2b2b2b]"
                        >
                            Contact Us to Learn More

                            <span
                                className="inline-block transition-transform duration-300 group-hover:translate-x-1 dark:text-[#D91620]"
                                aria-hidden="true"
                            >
                                →
                            </span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

export default WelcomeSection;