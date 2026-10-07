import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollReveal from "../ScrollReveal/ScrollReveal";

function EventCard() {
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

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
        <ScrollReveal>
            <div className="relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 text-[#17172b] shadow-sm shadow-[#e0e0ff] transition-all duration-500 dark:border-white/10 dark:bg-[#121222] dark:text-white dark:shadow-none sm:p-5 lg:p-5">
                {/* Decorative glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#6c63ff]/5 blur-3xl dark:bg-[#6c63ff]/10" />

                {loading ? (
                    <div className="relative h-full animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-white/10" />

                            <div className="flex-1">
                                <div className="h-2.5 w-24 rounded bg-gray-100 dark:bg-white/10" />
                                <div className="mt-2 h-4 w-36 rounded bg-gray-100 dark:bg-white/10" />
                            </div>
                        </div>

                        <div className="mt-4 aspect-[16/8] rounded-xl bg-gray-100 dark:bg-white/5" />

                        <div className="mt-4 space-y-3">
                            <div className="h-10 rounded-xl bg-gray-100 dark:bg-white/5" />
                            <div className="h-10 rounded-xl bg-gray-100 dark:bg-white/5" />
                            <div className="h-10 rounded-xl bg-gray-100 dark:bg-white/5" />
                        </div>

                        <div className="mt-4 h-10 rounded-lg bg-gray-100 dark:bg-white/10" />
                    </div>
                ) : event ? (
                    <div className="relative flex h-full flex-col">
                        {/* EVENT HEADER */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6c63ff]/10 text-[#6c63ff] dark:bg-[#9b94ff]/10 dark:text-[#9b94ff]">
                                <i className="fas fa-calendar-days" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6c63ff] dark:text-[#9b94ff]">
                                    Upcoming Event
                                </p>

                                <h2 className="mt-0.5 truncate text-base font-bold text-[#17172b] dark:text-white">
                                    {event.title}
                                </h2>
                            </div>
                        </div>

                        {/* EVENT IMAGE */}
                        <div className="relative mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-[#0b0b18]">
                            {event.image ? (
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="aspect-[16/8] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                                />
                            ) : (
                                <div className="flex aspect-[16/8] items-center justify-center bg-gradient-to-br from-[#6c63ff]/20 via-[#f8f8ff] to-[#e0e0ff] dark:from-[#6c63ff]/20 dark:via-[#121222] dark:to-[#0b0b18]">
                                    <i className="fas fa-church text-3xl text-[#6c63ff] dark:text-[#9b94ff]" />
                                </div>
                            )}

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent dark:from-black/30" />
                        </div>

                        {/* EVENT DETAILS */}
                        <div className="mt-4 space-y-2.5">
                            {/* DATE */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#6c63ff]/10 text-sm text-[#6c63ff] dark:bg-[#9b94ff]/10 dark:text-[#9b94ff]">
                                    <i className="fas fa-calendar-day" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6c63ff] dark:text-[#9b94ff]">
                                        Date
                                    </p>

                                    <p className="truncate text-xs font-medium text-[#17172b] dark:text-gray-200">
                                        {formatDate(event.date)}
                                    </p>
                                </div>
                            </div>

                            {/* TIME */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#6c63ff]/10 text-sm text-[#6c63ff] dark:bg-[#9b94ff]/10 dark:text-[#9b94ff]">
                                    <i className="fas fa-clock" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6c63ff] dark:text-[#9b94ff]">
                                        Time
                                    </p>

                                    <p className="truncate text-xs font-medium text-[#17172b] dark:text-gray-200">
                                        {event.time || "Time to be announced"}
                                    </p>
                                </div>
                            </div>

                            {/* LOCATION */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#6c63ff]/10 text-sm text-[#6c63ff] dark:bg-[#9b94ff]/10 dark:text-[#9b94ff]">
                                    <i className="fas fa-location-dot" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6c63ff] dark:text-[#9b94ff]">
                                        Location
                                    </p>

                                    <p className="line-clamp-2 text-xs font-medium leading-4 text-[#17172b] dark:text-gray-200">
                                        {event.location ||
                                            "Living Faith Church Iguosa"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* VIEW ALL EVENTS */}
                        <button
                            type="button"
                            onClick={() => navigate("/events")}
                            className="group mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-[#6c63ff] px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-[#6c63ff]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#5b52e8] hover:shadow-[#6c63ff]/30 dark:bg-[#7b73ff] dark:hover:bg-[#6c63ff]"
                        >
                            View All Events

                            <i className="fas fa-arrow-right text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    </div>
                ) : (
                    /* NO EVENT */
                    <div className="relative flex h-full flex-col">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6c63ff]/10 text-[#6c63ff] dark:bg-[#9b94ff]/10 dark:text-[#9b94ff]">
                                <i className="fas fa-calendar-xmark" />
                            </div>

                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6c63ff] dark:text-[#9b94ff]">
                                    Upcoming Event
                                </p>

                                <h2 className="mt-0.5 text-base font-bold">
                                    Stay Connected
                                </h2>
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col items-center justify-center text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6c63ff]/10 text-xl text-[#6c63ff] dark:bg-[#9b94ff]/10 dark:text-[#9b94ff]">
                                <i className="fas fa-calendar-days" />
                            </div>

                            <h3 className="mt-4 text-lg font-bold">
                                No Upcoming Event
                            </h3>

                            <p className="mt-2 max-w-xs text-xs leading-5 text-gray-500 dark:text-gray-400">
                                There is currently no upcoming event available.
                                Check back later for new events.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/events")}
                            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#6c63ff] px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-[#6c63ff]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#5b52e8] dark:bg-[#7b73ff] dark:hover:bg-[#6c63ff]"
                        >
                            View All Events

                            <i className="fas fa-arrow-right text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    </div>
                )}
            </div>
        </ScrollReveal>
    );
}

export default EventCard;