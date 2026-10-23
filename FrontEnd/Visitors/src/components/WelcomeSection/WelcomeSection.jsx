import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { motion, useReducedMotion } from "framer-motion";



const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");



const ANIMATION_DURATION = 1.15;
const ANIMATION_EASE = [0.22, 1, 0.36, 1];


function WelcomeSection() {

    const navigate = useNavigate();

    const shouldReduceMotion = useReducedMotion();



    const [event, setEvent] = useState(null);

    const [loading, setLoading] = useState(true);



    useEffect(() => {

        const controller = new AbortController();



        const fetchUpcomingEvent = async () => {

            try {

                setLoading(true);



                const response = await fetch(`${API_URL}/api/events/upcoming`, {

                    signal: controller.signal,

                });



                if (!response.ok) {

                    throw new Error("Failed to fetch upcoming event");

                }



                const data = await response.json();

                setEvent(data?.event || data?.data?.event || data?.data || data);

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



    const formatDate = (date) => {

        if (!date) return "Date to be announced";



        const eventDate = new Date(date);



        if (Number.isNaN(eventDate.getTime())) return date;



        return eventDate.toLocaleDateString("en-US", {

            month: "long",

            day: "numeric",

            year: "numeric",

        });

    };



    const motionProps = (delay = 0) =>
        shouldReduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 48 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.18 },
                transition: {
                    duration: ANIMATION_DURATION,
                    delay,
                    ease: ANIMATION_EASE,
                },
            };



    return (

        <section

            id="welcome"

            className="relative overflow-hidden bg-white px-5 py-16 text-[#171717] transition-colors duration-500 dark:bg-[#101112] dark:text-white sm:px-8 lg:px-[7%] lg:py-24"

        >

            <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#D91620]/[0.035] blur-3xl dark:bg-[#D91620]/[0.045]" />

            <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-black/[0.025] blur-3xl dark:bg-white/[0.025]" />



            <div className="relative mx-auto w-full max-w-7xl">

                <motion.div

                    {...motionProps()}

                    className="flex items-center gap-3"

                >

                    <span className="h-px w-8 bg-[#D91620] dark:bg-[#D91620]" />

                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D91620] dark:text-white">

                        You Are Welcome

                    </p>

                </motion.div>



                <motion.div

                    {...motionProps(0.05)}

                    className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10"

                >

                    <h2 className="max-w-4xl text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-[3.5rem]">

                        Come and experience the presence of God with us.

                    </h2>



                    <motion.button

                        type="button"

                        onClick={() => navigate("/events")}

                        whileHover={shouldReduceMotion ? undefined : { y: -3 }}

                        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}

                        className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#D91620] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(217,22,32,0.14)] transition-colors duration-300 hover:bg-[#B9121B] focus:outline-none focus:ring-2 focus:ring-[#D91620]/30 focus:ring-offset-2 dark:focus:ring-offset-[#101112]"

                    >

                        View All Events

                        <i className="fas fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1" />

                    </motion.button>

                </motion.div>



                <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">

                    <motion.div

                        {...motionProps(0.08)}

                        className="max-w-2xl"

                    >

                        <p className="text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg sm:leading-8">

                            Join us for worship, prayer, fellowship, and the

                            teaching of God&apos;s Word. We are a family of

                            believers committed to knowing God, growing in His

                            Word, and making a positive impact in our community.

                        </p>



                        <p className="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">

                            At Living Faith Church Iguosa, we believe that every

                            individual has a God-given purpose and a place within

                            the body of Christ.

                        </p>



                        <button

                            type="button"

                            onClick={() => navigate("/about")}

                            className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D91620] transition-colors hover:text-[#B9121B] focus:outline-none focus:underline dark:text-white dark:hover:text-gray-200"

                        >

                            Learn more about us

                            <i className="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1" />

                        </button>

                    </motion.div>



                    <motion.aside

                        {...motionProps(0.12)}

                        className="rounded-3xl bg-[#F7F7F7] p-6 shadow-[0_12px_36px_rgba(0,0,0,0.045)] dark:bg-[#191B1D] dark:shadow-black/20 sm:p-7"

                    >

                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D91620] dark:text-white">

                            Upcoming Event

                        </p>



                        {loading ? (

                            <div
                                className="mt-5 animate-pulse space-y-4"
                                aria-label="Loading upcoming event"
                                role="status"
                            >

                                <div className="h-7 w-3/4 rounded-lg bg-gray-200 dark:bg-[#292B2D]" />

                                <div className="h-4 w-full rounded-lg bg-gray-200 dark:bg-[#292B2D]" />

                                <div className="h-4 w-5/6 rounded-lg bg-gray-200 dark:bg-[#292B2D]" />

                                <div className="h-4 w-2/3 rounded-lg bg-gray-200 dark:bg-[#292B2D]" />

                            </div>

                        ) : event?.title || event?.name ? (

                            <>

                                <h3 className="mt-3 text-2xl font-bold leading-tight text-[#171717] dark:text-white">

                                    {event.title || event.name}

                                </h3>



                                <div className="mt-5 space-y-4">

                                    <div className="flex items-start gap-3">

                                        <i className="fas fa-calendar-day mt-1 w-4 text-[#D91620] dark:text-white" />

                                        <div>

                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">

                                                Date

                                            </p>

                                            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200">

                                                {formatDate(event.date)}

                                            </p>

                                        </div>

                                    </div>



                                    <div className="flex items-start gap-3">

                                        <i className="fas fa-clock mt-1 w-4 text-[#D91620] dark:text-white" />

                                        <div>

                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">

                                                Time

                                            </p>

                                            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200">

                                                {event.time || "Time to be announced"}

                                            </p>

                                        </div>

                                    </div>



                                    <div className="flex items-start gap-3">

                                        <i className="fas fa-location-dot mt-1 w-4 text-[#D91620] dark:text-white" />

                                        <div>

                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">

                                                Location

                                            </p>

                                            <p className="mt-1 text-sm font-medium leading-6 text-gray-700 dark:text-gray-200">

                                                {event.location || "Living Faith Church Iguosa"}

                                            </p>

                                        </div>

                                    </div>

                                </div>



                                <button

                                    type="button"

                                    onClick={() => navigate("/events")}

                                    className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D91620] transition-colors hover:text-[#B9121B] dark:text-white dark:hover:text-gray-200"

                                >

                                    Explore events

                                    <i className="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1" />

                                </button>

                            </>

                        ) : (

                            <div className="mt-4">

                                <h3 className="text-2xl font-bold">Stay Connected</h3>

                                <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">

                                    There is currently no upcoming event available.

                                    Check back later for new events.

                                </p>

                                <button

                                    type="button"

                                    onClick={() => navigate("/events")}

                                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#D91620] hover:text-[#B9121B] dark:text-white dark:hover:text-gray-200"

                                >

                                    View all events

                                    <i className="fas fa-arrow-right text-xs" />

                                </button>

                            </div>

                        )}

                    </motion.aside>

                </div>



                <motion.section
                    id="about-us"
                    {...motionProps(0.05)}
                    className="mt-20 border-t border-gray-100 pt-14 dark:border-white/[0.07] sm:mt-24 sm:pt-16"
                    aria-labelledby="about-us-heading"
                >
                    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="h-px w-8 bg-[#D91620]" />
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D91620] dark:text-white">
                                    About Living Faith Church Iguosa
                                </p>
                            </div>

                            <h2
                                id="about-us-heading"
                                className="mt-5 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
                            >
                                Faith that grows. Love that serves.
                            </h2>
                        </div>

                        <div className="max-w-3xl">
                            <p className="text-base leading-8 text-gray-600 dark:text-gray-300 sm:text-lg">
                                Living Faith Church Iguosa is a local congregation within Living Faith Church Worldwide,
                                committed to worship, prayer, fellowship, growing in God’s Word, and serving our community.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate("/about")}
                                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D91620] transition-colors hover:text-[#B9121B] focus:outline-none focus:underline dark:text-white dark:hover:text-gray-200"
                            >
                                Learn more about us
                                <i className="fas fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </motion.section>

                <motion.div
                    {...motionProps(0.08)}
                    className="mt-10 rounded-2xl bg-[#F7F7F7] p-6 dark:bg-[#191B1D] sm:p-8"
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D91620]/10 text-[#D91620] dark:bg-white/10 dark:text-white">
                            <i className="fas fa-heart-pulse text-xl" aria-hidden="true" />
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D91620] dark:text-white">
                                Community Outreach
                            </p>
                            <h3 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
                                Free Gilead Medical Care
                            </h3>
                            <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 dark:text-gray-300 sm:text-base">
                                Through this outreach, the centre seeks to serve the community with practical care and compassion alongside its spiritual ministry.
                            </p>
                        </div>
                    </div>
                </motion.div>

            </div>

        </section>

    );

}



export default WelcomeSection;
