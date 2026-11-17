
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
            aria-labelledby="welcome-heading"
            className="relative isolate overflow-hidden bg-white px-5 py-16 text-[#171717] transition-colors duration-500 dark:bg-[#101112] dark:text-white sm:px-8 md:py-20 lg:px-[7%] lg:py-24"
        >
            {/* Background Decorations */}
            <div
                className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[450px] w-[450px] rounded-full bg-[#D91620]/[0.045] blur-[100px] dark:bg-[#D91620]/[0.07]"
                aria-hidden="true"
            />

            <div
                className="pointer-events-none absolute -bottom-40 -left-40 -z-10 h-[350px] w-[350px] rounded-full bg-gray-200/40 blur-[100px] dark:bg-white/[0.025]"
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-7xl">

                {/* Section Introduction */}
                <div className="flex items-center gap-3">
                    <span className="h-[2px] w-9 rounded-full bg-[#D91620]" />

                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#D91620] dark:text-white sm:text-[11px]">
                        A Home of Signs and Wonders
                    </p>
                </div>

                {/* Main Heading */}
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
                    <h2
                        id="welcome-heading"
                        className="max-w-3xl text-[2rem] font-bold leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.65rem]"
                    >
                        Where Faith Comes Alive and{" "}
                        <span className="text-[#D91620]">
                            Lives Are Transformed.
                        </span>
                    </h2>

                    <button
                        type="button"
                        onClick={() => navigate("/events")}
                        className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#D91620] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(217,22,32,0.16)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#B9121B] hover:shadow-[0_14px_30px_rgba(217,22,32,0.23)] focus:outline-none focus:ring-2 focus:ring-[#D91620] focus:ring-offset-2 dark:focus:ring-offset-[#101112]"
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

                {/* Description and Upcoming Event */}
                <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

                    {/* Church Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                            ease: smoothEase,
                        }}
                        className="max-w-2xl pt-1"
                    >
                        <p className="text-[15px] leading-8 text-gray-600 dark:text-gray-300 sm:text-base sm:leading-8">
                            Living Faith Church Iguosa is a local expression
                            of Living Faith Church Worldwide, popularly known
                            as Winners Chapel. Located in Iguosa, Edo State,
                            Nigeria, we are committed to the teaching of
                            God&apos;s Word, impactful worship, prayer and
                            fellowship, raising believers to fulfil their
                            God-given purpose.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/about")}
                            className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#D91620] transition-colors hover:text-[#B9121B] focus:outline-none focus-visible:underline dark:text-[#F15B63] dark:hover:text-white"
                        >
                            Discover Our Church

                            <span
                                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                                aria-hidden="true"
                            >
                                →
                            </span>
                        </button>
                    </motion.div>

                    {/* Upcoming Event Card */}
                    <motion.aside
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.3,
                            ease: smoothEase,
                        }}
                        className="relative overflow-hidden rounded-3xl bg-[#F8F8F8] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.055)] transition-all duration-500 hover:shadow-[0_18px_48px_rgba(0,0,0,0.085)] dark:bg-[#191B1D] dark:shadow-[0_12px_40px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_18px_48px_rgba(0,0,0,0.3)] sm:p-7"
                    >
                        {/* Decorative Accent */}
                        <div
                            className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#D91620]/[0.055] blur-2xl dark:bg-[#D91620]/[0.09]"
                            aria-hidden="true"
                        />

                        <div className="relative">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D91620] dark:text-[#F15B63]">
                                    Upcoming Event
                                </p>

                                <span className="h-2 w-2 rounded-full bg-[#D91620] shadow-[0_0_12px_rgba(217,22,32,0.4)]" />
                            </div>

                            {/* Loading State */}
                            {loading ? (
                                <div
                                    className="mt-6 animate-pulse space-y-4"
                                    aria-label="Loading upcoming event"
                                >
                                    <div className="h-7 w-3/4 rounded-lg bg-gray-200 dark:bg-[#292B2D]" />

                                    <div className="h-4 w-full rounded-lg bg-gray-200 dark:bg-[#292B2D]" />

                                    <div className="h-4 w-5/6 rounded-lg bg-gray-200 dark:bg-[#292B2D]" />
                                </div>
                            ) : event?.title || event?.name ? (
                                <>
                                    <h3 className="relative mt-5 text-xl font-bold leading-snug tracking-tight sm:text-2xl">
                                        {event.title || event.name}
                                    </h3>

                                    <div className="mt-6 space-y-5">

                                        {/* Event Date */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D91620]/[0.08] text-[#D91620] dark:bg-[#D91620]/[0.13] dark:text-[#F15B63]">
                                                <i
                                                    className="fas fa-calendar-day"
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                                                    Date
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                    {formatDate(event.date)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Event Time */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D91620]/[0.08] text-[#D91620] dark:bg-[#D91620]/[0.13] dark:text-[#F15B63]">
                                                <i
                                                    className="fas fa-clock"
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                                                    Time
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                    {event.time ||
                                                        "Time to be announced"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Event Location */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D91620]/[0.08] text-[#D91620] dark:bg-[#D91620]/[0.13] dark:text-[#F15B63]">
                                                <i
                                                    className="fas fa-location-dot"
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                                                    Location
                                                </p>

                                                <p className="mt-1 text-sm font-semibold leading-6 text-gray-700 dark:text-gray-200">
                                                    {event.location ||
                                                        "Living Faith Church Iguosa"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="mt-5">
                                    <h3 className="text-xl font-bold">
                                        Stay Connected
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                                        No upcoming event is available at
                                        the moment. Please check back soon.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.aside>
                </div>
            </div>

            {/* Gilead Medical Care */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                    duration: 0.8,
                    delay: 0.1,
                    ease: smoothEase,
                }}
                className="relative mx-auto mt-20 max-w-7xl md:mt-24"
            >
                <div className="relative overflow-hidden rounded-[28px] bg-[#F7F7F7] px-6 py-9 shadow-[0_14px_45px_rgba(0,0,0,0.055)] transition-all duration-500 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)] dark:bg-[#191B1D] dark:shadow-[0_14px_45px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_18px_50px_rgba(0,0,0,0.3)] sm:px-9 sm:py-11 md:px-12 md:py-12">

                    {/* Soft Background Accent */}
                    <div
                        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#D91620]/[0.045] blur-3xl dark:bg-[#D91620]/[0.07]"
                        aria-hidden="true"
                    />

                    <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto] md:gap-12">

                        {/* Medical Care Content */}
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3">
                                <span className="h-[2px] w-8 rounded-full bg-[#D91620]" />

                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D91620] dark:text-white">
                                    Caring Beyond the Church
                                </p>
                            </div>

                            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                                Gilead Medical Care
                            </h2>

                            <motion.p
                                className="mt-5 text-[15px] leading-8 text-gray-600 dark:text-gray-300 sm:text-base"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.1,
                                    ease: smoothEase,
                                }}
                            >
                                Your health matters to us. Gilead Medical
                                Care offers basic health checks, including
                                blood pressure and blood sugar testing,
                                alongside first-aid support for immediate
                                minor health needs.
                            </motion.p>

                            <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400">
                                Interested in learning more? Contact us,
                                and our team will be happy to provide
                                further information about the service.
                            </p>
                        </div>

                        {/* Contact Button */}
                        <div className="md:justify-self-end">
                            <button
                                type="button"
                                onClick={() => navigate("/contact")}
                                className="group inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#D91620] shadow-[0_8px_25px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_13px_30px_rgba(0,0,0,0.12)] focus:outline-none focus:ring-2 focus:ring-[#D91620] focus:ring-offset-2 dark:bg-[#292B2D] dark:text-white dark:shadow-[0_8px_25px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_13px_30px_rgba(0,0,0,0.3)] dark:focus:ring-offset-[#191B1D]"
                            >
                                Contact Us to Learn More

                                <span
                                    className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                                    aria-hidden="true"
                                >
                                    →
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

export default WelcomeSection;
