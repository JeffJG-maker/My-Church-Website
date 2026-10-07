import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/events/${id}`
                );

                if (!response.ok) {
                    throw new Error("Event not found");
                }

                const data = await response.json();

                setEvent(data);
            } catch (err) {
                console.error("Failed to fetch event:", err);
                setError("Unable to load this event.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    /* =========================
       LOADING STATE
    ========================= */
    if (loading) {
        return (
            <main className="min-h-screen bg-[#f8f8ff] px-6 py-24 transition-colors duration-500 dark:bg-[#101112]">
                <div className="mx-auto max-w-6xl animate-pulse">
                    <div className="mb-8 h-4 w-28 rounded bg-gray-200 dark:bg-[#27292d]" />

                    <div className="mb-6 h-5 w-40 rounded bg-gray-200 dark:bg-[#27292d]" />

                    <div className="mb-8 h-14 max-w-3xl rounded bg-gray-200 dark:bg-[#27292d]" />

                    <div className="mb-10 grid gap-6 md:grid-cols-3">
                        <div className="h-20 rounded bg-gray-200 dark:bg-[#181a1d]" />
                        <div className="h-20 rounded bg-gray-200 dark:bg-[#181a1d]" />
                        <div className="h-20 rounded bg-gray-200 dark:bg-[#181a1d]" />
                    </div>

                    <div className="mb-6 h-8 w-56 rounded bg-gray-200 dark:bg-[#27292d]" />

                    <div className="space-y-3">
                        <div className="h-4 w-full rounded bg-gray-200 dark:bg-[#27292d]" />
                        <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-[#27292d]" />
                        <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-[#27292d]" />
                    </div>
                </div>
            </main>
        );
    }

    /* =========================
       ERROR STATE
    ========================= */
    if (error || !event) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f8f8ff] px-6 transition-colors duration-500 dark:bg-[#101112]">
                <div className="text-center">
                    <div className="mb-5 text-5xl text-gray-300 dark:text-[#27292d]">
                        <i className="fa-solid fa-calendar-xmark"></i>
                    </div>

                    <h1 className="mb-3 text-2xl font-bold text-[#17172b] dark:text-white">
                        Event Not Found
                    </h1>

                    <p className="mb-7 text-gray-600 dark:text-gray-400">
                        {error || "The event you are looking for does not exist."}
                    </p>

                    <button
                        onClick={() => navigate("/events")}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#6c63ff] px-6 py-3 font-semibold text-white shadow-lg shadow-[#6c63ff]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#5b52e8] hover:shadow-xl hover:shadow-[#6c63ff]/25 dark:bg-[#7c6cff] dark:hover:bg-[#9188ff]"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        Back to Events
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f8f8ff] text-[#17172b] transition-colors duration-500 dark:bg-[#101112] dark:text-white">

            {/* ================= HERO ================= */}
            <section className="px-6 pb-16 pt-28 md:pb-20 md:pt-36">
                <div className="mx-auto max-w-6xl">

                    {/* Back Link */}
                    <button
                        onClick={() => navigate("/events")}
                        className="group mb-10 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors duration-300 hover:text-[#6c63ff] dark:text-gray-400 dark:hover:text-[#9188ff]"
                    >
                        <i className="fa-solid fa-arrow-left transition-transform duration-300 group-hover:-translate-x-1"></i>
                        Back to Events
                    </button>

                    {/* Event Label */}
                    <div className="mb-5 flex items-center gap-3">
                        <span className="h-[2px] w-10 bg-[#6c63ff] dark:bg-[#7c6cff]"></span>

                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#6c63ff] dark:text-[#9188ff]">
                            {event.label || "UPCOMING EVENT"}
                        </span>
                    </div>

                    {/* Event Title */}
                    <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                        {event.title}
                    </h1>

                    <div className="mt-6 h-1 w-20 bg-[#6c63ff] dark:bg-[#7c6cff]"></div>
                </div>
            </section>

            {/* ================= EVENT INFORMATION ================= */}
            <section className="px-6 pb-16">
                <div className="mx-auto max-w-6xl">

                    <div className="grid gap-10 border-y border-gray-200 py-10 dark:border-[#27292d] md:grid-cols-3 md:gap-8">

                        {/* DATE */}
                        <div className="flex gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6c63ff]/10 text-[#6c63ff] dark:bg-[#7c6cff]/10 dark:text-[#9188ff]">
                                <i className="fa-regular fa-calendar text-lg"></i>
                            </div>

                            <div>
                                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Date
                                </p>

                                <p className="font-semibold leading-relaxed">
                                    {formatDate(event.date)}
                                </p>
                            </div>
                        </div>

                        {/* TIME */}
                        <div className="flex gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6c63ff]/10 text-[#6c63ff] dark:bg-[#7c6cff]/10 dark:text-[#9188ff]">
                                <i className="fa-regular fa-clock text-lg"></i>
                            </div>

                            <div>
                                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Time
                                </p>

                                <p className="font-semibold leading-relaxed">
                                    {event.time}
                                </p>
                            </div>
                        </div>

                        {/* LOCATION */}
                        <div className="flex gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6c63ff]/10 text-[#6c63ff] dark:bg-[#7c6cff]/10 dark:text-[#9188ff]">
                                <i className="fa-solid fa-location-dot text-lg"></i>
                            </div>

                            <div>
                                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Location
                                </p>

                                <p className="font-semibold leading-relaxed">
                                    {event.location}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================= EVENT CONTENT ================= */}
            <section className="px-6 pb-24">
                <div className="mx-auto max-w-6xl">

                    <div
                        className={`grid items-start gap-12 ${event.image
                                ? "lg:grid-cols-[1fr_0.9fr]"
                                : "lg:max-w-4xl"
                            }`}
                    >

                        {/* DESCRIPTION */}
                        <div>
                            <div className="mb-6 flex items-center gap-3">
                                <span className="h-8 w-1 rounded-full bg-[#6c63ff] dark:bg-[#7c6cff]"></span>

                                <h2 className="text-2xl font-bold md:text-3xl">
                                    About This Event
                                </h2>
                            </div>

                            <p className="max-w-3xl text-base leading-8 text-gray-600 dark:text-gray-300 md:text-lg">
                                {event.description ||
                                    "Join us for a powerful time of worship, prayer, fellowship, and the Word of God."}
                            </p>
                        </div>

                        {/* EVENT IMAGE */}
                        {event.image && (
                            <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm dark:border-[#27292d] dark:shadow-black/20">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="h-auto max-h-[450px] w-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                            </div>
                        )}

                    </div>

                    {/* Bottom Navigation */}
                    <div className="mt-16 border-t border-gray-200 pt-8 dark:border-[#27292d]">
                        <button
                            onClick={() => navigate("/events")}
                            className="group inline-flex items-center gap-3 font-semibold text-[#17172b] transition-all duration-300 hover:text-[#6c63ff] dark:text-white dark:hover:text-[#9188ff]"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 transition-all duration-300 group-hover:border-[#6c63ff] group-hover:bg-[#6c63ff] group-hover:text-white dark:border-[#27292d] dark:group-hover:border-[#7c6cff] dark:group-hover:bg-[#7c6cff] dark:group-hover:text-white">
                                <i className="fa-solid fa-arrow-left"></i>
                            </span>

                            Back to All Events
                        </button>
                    </div>

                </div>
            </section>
        </main>
    );
}

export default EventDetails;