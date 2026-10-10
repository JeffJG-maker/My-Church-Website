import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function WelcomeSection() {
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.15,
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const fetchUpcomingEvent = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/events/upcoming`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch upcoming event");
                }

                const data = await response.json();
                setEvent(data);
            } catch (error) {
                console.error("Upcoming event error:", error);
                setEvent(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingEvent();
    }, []);

    const formatDate = (date) => {
        if (!date) {
            return "Date to be announced";
        }

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
            ref={sectionRef}
            className={`
                relative
                overflow-hidden
                bg-[#FFF7F2]
                px-5
                py-14
                text-[#171717]
                transition-all
                duration-700
                dark:bg-[#101112]
                dark:text-white
                sm:px-8
                lg:flex
                lg:h-[85vh]
                lg:min-h-[680px]
                lg:items-center
                lg:px-[7%]
                lg:py-10
                ${isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }
            `}
        >
            {/* Background accents */}
            <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#E31B23]/5 blur-3xl dark:bg-[#E31B23]/10" />

            <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[#F7941D]/5 blur-3xl dark:bg-[#F7941D]/10" />

            <div className="relative mx-auto w-full max-w-7xl">
                {/* Small heading */}
                <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-[#E31B23]" />

                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E31B23] dark:text-[#F7941D]">
                        You Are Welcome
                    </p>
                </div>

                {/* Main heading + View All Events */}
                <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
                    <h2 className="max-w-4xl text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-[3.5rem]">
                        Come and experience the presence of God with us.
                    </h2>

                    <button
                        type="button"
                        onClick={() => navigate("/events")}
                        className="
                            group
                            inline-flex
                            w-fit
                            shrink-0
                            items-center
                            gap-3
                            rounded-lg
                            bg-[#E31B23]
                            px-6
                            py-3.5
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-[#E31B23]/20
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:bg-[#C9151C]
                            hover:shadow-[#E31B23]/30
                        "
                    >
                        View All Events

                        <i className="fas fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Content underneath heading */}
                <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                    {/* Welcome text */}
                    <div className="max-w-2xl">
                        <p className="text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg sm:leading-8">
                            Join us for worship, prayer, fellowship, and the
                            teaching of God's Word. We are a family of believers
                            committed to knowing God, growing in His Word, and
                            making a positive impact in our community.
                        </p>

                        <p className="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
                            At Living Faith Church Iguosa, we believe that every
                            individual has a God-given purpose and a place within
                            the body of Christ.
                        </p>
                    </div>

                    {/* Upcoming Event */}
                    <div className="border-t border-gray-200 pt-6 dark:border-[#27292d] lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E31B23] dark:text-[#F7941D]">
                            Upcoming Event
                        </p>

                        {loading ? (
                            <div className="mt-4 animate-pulse space-y-4">
                                <div className="h-7 w-3/4 rounded bg-gray-200 dark:bg-[#181a1d]" />

                                <div className="h-4 w-full rounded bg-gray-200 dark:bg-[#181a1d]" />

                                <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-[#181a1d]" />

                                <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-[#181a1d]" />
                            </div>
                        ) : event ? (
                            <>
                                <h3 className="mt-3 text-2xl font-bold leading-tight text-[#171717] dark:text-white">
                                    {event.title}
                                </h3>

                                <div className="mt-5 space-y-4">
                                    {/* DATE */}
                                    <div className="flex items-start gap-3">
                                        <i className="fas fa-calendar-day mt-1 w-4 text-[#E31B23] dark:text-[#F7941D]" />

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Date
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                                {formatDate(event.date)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* TIME */}
                                    <div className="flex items-start gap-3">
                                        <i className="fas fa-clock mt-1 w-4 text-[#E31B23] dark:text-[#F7941D]" />

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

                                    {/* LOCATION */}
                                    <div className="flex items-start gap-3">
                                        <i className="fas fa-location-dot mt-1 w-4 text-[#E31B23] dark:text-[#F7941D]" />

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Location
                                            </p>

                                            <p className="mt-1 text-sm leading-6 font-medium text-gray-700 dark:text-gray-200">
                                                {event.location ||
                                                    "Living Faith Church Iguosa"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="mt-4">
                                <h3 className="text-2xl font-bold">
                                    Stay Connected
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                                    There is currently no upcoming event
                                    available. Check back later for new events.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WelcomeSection;