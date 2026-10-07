import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Events() {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/events`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch events");
            }

            const data = await response.json();

            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);

            setError(
                "Unable to load events at the moment. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    /* =========================
       LOADING STATE
    ========================= */
    if (loading) {
        return (
            <main className="min-h-screen bg-[#f8f8ff] px-6 py-24 text-[#17172b] transition-colors duration-500 dark:bg-[#101112] dark:text-white">
                <div className="mx-auto max-w-6xl">
                    <div className="animate-pulse">
                        <div className="mx-auto h-10 w-56 rounded bg-gray-200 dark:bg-[#27292d]" />

                        <div className="mx-auto mt-4 h-5 w-80 rounded bg-gray-200 dark:bg-[#27292d]" />

                        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-[#27292d] dark:bg-[#181a1d] dark:shadow-black/20"
                                >
                                    <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-[#27292d]" />

                                    <div className="mt-6 h-5 w-40 rounded bg-gray-200 dark:bg-[#27292d]" />

                                    <div className="mt-6 space-y-4">
                                        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-[#27292d]" />

                                        <div className="h-4 w-40 rounded bg-gray-200 dark:bg-[#27292d]" />

                                        <div className="h-12 w-full rounded bg-gray-200 dark:bg-[#27292d]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    /* =========================
       ERROR STATE
    ========================= */
    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f8f8ff] px-6 text-[#17172b] transition-colors duration-500 dark:bg-[#101112] dark:text-white">
                <div className="w-full max-w-lg rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-[#27292d] dark:bg-[#181a1d] dark:shadow-black/20">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#7c6cff]/10 text-2xl text-[#6c63ff] dark:bg-[#7c6cff]/10 dark:text-[#9188ff]">
                        <i className="fas fa-exclamation-circle"></i>
                    </div>

                    <h2 className="mt-5 text-xl font-semibold">
                        Unable to Load Events
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchEvents}
                        className="mt-6 rounded-md bg-[#6c63ff] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#5b52e8] dark:bg-[#7c6cff] dark:hover:bg-[#9188ff]"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f8f8ff] px-6 py-24 text-[#17172b] transition-colors duration-500 dark:bg-[#101112] dark:text-white">
            <div className="mx-auto max-w-6xl">

                {/* PAGE HEADER */}
                <div className="text-center">
                    <span className="text-xs font-bold tracking-[0.2em] text-[#6c63ff] dark:text-[#9188ff]">
                        CHURCH EVENTS
                    </span>

                    <h1 className="mt-3 text-3xl font-bold md:text-4xl">
                        Upcoming Events
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-300 md:text-base">
                        Stay connected with everything happening at Living
                        Faith Church Iguosa. Join us for worship, prayer,
                        fellowship, and the Word of God.
                    </p>
                </div>

                {/* EVENTS */}
                {events.length === 0 ? (
                    <div className="mx-auto mt-14 max-w-lg rounded-xl border border-gray-100 bg-white p-10 text-center shadow-sm dark:border-[#27292d] dark:bg-[#181a1d] dark:shadow-black/20">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#7c6cff]/10 text-2xl text-[#6c63ff] dark:text-[#9188ff]">
                            <i className="fas fa-calendar-xmark"></i>
                        </div>

                        <h2 className="mt-5 text-xl font-semibold">
                            No Events Available
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                            There are currently no upcoming events. Please
                            check back later.
                        </p>
                    </div>
                ) : (
                    <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <article
                                key={event.id}
                                onClick={() =>
                                    navigate(`/events/${event.id}`)
                                }
                                className="
                                    group
                                    cursor-pointer
                                    rounded-xl
                                    border
                                    border-gray-100
                                    bg-white
                                    p-6
                                    text-[#17172b]
                                    shadow-sm
                                    transition-all
                                    duration-500
                                    hover:-translate-y-1
                                    hover:shadow-xl
                                    dark:border-[#27292d]
                                    dark:bg-[#181a1d]
                                    dark:text-white
                                    dark:shadow-black/20
                                "
                            >
                                {/* EVENT ICON */}
                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-[#6c63ff]/10
                                        text-xl
                                        text-[#6c63ff]
                                        transition-transform
                                        duration-300
                                        group-hover:scale-110
                                        dark:bg-[#7c6cff]/10
                                        dark:text-[#9188ff]
                                    "
                                >
                                    <i className="fas fa-calendar-day"></i>
                                </div>

                                {/* LABEL */}
                                <span className="mt-6 block text-xs font-bold tracking-wider text-[#6c63ff] dark:text-[#9188ff]">
                                    {event.label || "EVENT"}
                                </span>

                                {/* TITLE */}
                                <h2 className="mt-2 text-xl font-semibold">
                                    {event.title}
                                </h2>

                                {/* DETAILS */}
                                <div className="mt-6 space-y-4 text-sm">
                                    {/* DATE */}
                                    <div className="flex items-start gap-3">
                                        <i className="far fa-calendar-check w-5 pt-0.5 text-lg text-[#6c63ff] dark:text-[#9188ff]"></i>

                                        <p className="text-gray-600 dark:text-gray-300">
                                            {formatDate(event.date)}
                                        </p>
                                    </div>

                                    {/* TIME */}
                                    <div className="flex items-start gap-3">
                                        <i className="far fa-clock w-5 pt-0.5 text-lg text-[#6c63ff] dark:text-[#9188ff]"></i>

                                        <p className="text-gray-600 dark:text-gray-300">
                                            {event.time}
                                        </p>
                                    </div>

                                    {/* LOCATION */}
                                    <div className="flex items-start gap-3">
                                        <i className="fas fa-location-dot w-5 pt-0.5 text-lg text-[#6c63ff] dark:text-[#9188ff]"></i>

                                        <p className="leading-6 text-gray-600 dark:text-gray-300">
                                            {event.location}
                                        </p>
                                    </div>
                                </div>

                                {/* DESCRIPTION */}
                                {event.description && (
                                    <p className="mt-6 border-t border-gray-200 pt-5 text-sm leading-6 text-gray-500 dark:border-[#27292d] dark:text-gray-400">
                                        {event.description}
                                    </p>
                                )}

                                {/* VIEW EVENT */}
                                <div className="mt-6 flex items-center text-sm font-semibold text-[#6c63ff] transition-all duration-300 group-hover:gap-1 dark:text-[#9188ff]">
                                    View Event

                                    <i className="fas fa-arrow-right ml-2 transition-transform duration-300 group-hover:translate-x-1"></i>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Events;