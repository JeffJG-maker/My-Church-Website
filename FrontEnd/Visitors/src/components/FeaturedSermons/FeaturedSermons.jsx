import { useEffect, useState } from "react";

function FeaturedSermons() {
    const [sermons, setSermons] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showPlayer, setShowPlayer] = useState(false);
    const [showSermonList, setShowSermonList] = useState(false);

    const baseUrl = import.meta.env.VITE_API_URL;

    const getMediaUrl = (mediaUrl) => {
        if (!mediaUrl) return "";

        if (
            mediaUrl.startsWith("http://") ||
            mediaUrl.startsWith("https://")
        ) {
            return mediaUrl;
        }

        const cleanUrl = mediaUrl.replace(/^\/+/, "");

        return `${baseUrl}/${cleanUrl}`;
    };

    useEffect(() => {
        const fetchSermons = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${baseUrl}/api/sermons`);

                if (!response.ok) {
                    throw new Error("Failed to fetch sermons.");
                }

                const data = await response.json();

                const sortedSermons = [...data]
                    .sort(
                        (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                    )
                    .slice(0, 5);

                setSermons(sortedSermons);
            } catch (err) {
                console.error("Featured sermons error:", err);
                setError("Unable to load featured sermons.");
            } finally {
                setLoading(false);
            }
        };

        fetchSermons();
    }, [baseUrl]);

    const currentSermon = sermons[currentIndex];

    const handleSermonClick = (index) => {
        const sermon = sermons[index];

        if (!sermon) return;

        setCurrentIndex(index);

        if (sermon.mediaUrl) {
            setShowPlayer(true);
        } else {
            setShowPlayer(false);
        }
    };

    const handlePrevious = () => {
        if (!sermons.length) return;

        const newIndex =
            currentIndex === 0
                ? sermons.length - 1
                : currentIndex - 1;

        handleSermonClick(newIndex);
    };

    const handleNext = () => {
        if (!sermons.length) return;

        const newIndex =
            currentIndex === sermons.length - 1
                ? 0
                : currentIndex + 1;

        handleSermonClick(newIndex);
    };

    const handleWatchSermon = () => {
        if (!currentSermon?.mediaUrl) {
            alert("This sermon does not have a media file yet.");
            return;
        }

        setShowPlayer(true);
    };

    if (loading) {
        return (
            <section className="bg-white px-5 py-20 text-[#171717] dark:bg-[#101112] dark:text-white sm:px-8 lg:px-[7%]">
                <div className="mx-auto max-w-7xl">
                    {/* SECTION TITLE */}
                    <div className="mx-auto mb-10 max-w-6xl text-center">
                        <div className="mx-auto h-8 w-56 animate-pulse rounded bg-gray-200 dark:bg-[#181a1d]" />

                        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-gray-200 dark:bg-[#181a1d]" />

                        <div className="mx-auto mt-4 h-4 max-w-xl animate-pulse rounded bg-gray-200 dark:bg-[#181a1d]" />
                    </div>

                    {/* PLAYER SKELETON */}
                    <div className="h-[80vh] max-h-[80vh] min-h-[420px] animate-pulse rounded-2xl bg-gray-100 dark:bg-[#181a1d]" />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-white px-5 py-20 text-[#171717] dark:bg-[#101112] dark:text-white sm:px-8 lg:px-[7%]">
                <div className="mx-auto max-w-2xl text-center">
                    <i className="fas fa-circle-exclamation text-3xl text-[#E31B23] dark:text-[#F7941D]" />

                    <h2 className="mt-4 text-xl font-semibold">
                        Unable to load sermons
                    </h2>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {error}
                    </p>
                </div>
            </section>
        );
    }

    if (!sermons.length) {
        return (
            <section className="bg-white px-5 py-20 text-[#171717] dark:bg-[#101112] dark:text-white sm:px-8 lg:px-[7%]">
                <div className="mx-auto max-w-2xl text-center">
                    <i className="fas fa-video-slash text-3xl text-[#E31B23] dark:text-[#F7941D]" />

                    <h2 className="mt-4 text-xl font-semibold">
                        No sermons available
                    </h2>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        New sermons will appear here when they are added.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white px-5 py-20 pb-40 text-[#171717] transition-colors duration-500 dark:bg-[#101112] dark:text-white sm:px-8 lg:px-[7%]">
            <div className="mx-auto max-w-7xl">
                {/* SECTION TITLE */}
                <div className="mx-auto mb-10 max-w-6xl text-center">
                    <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
                        Featured Sermons
                    </h2>

                    <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-[#E31B23] dark:bg-[#F7941D]" />

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
                        Listen to messages that strengthen your faith, build
                        your spiritual life and help you fulfill God's purpose.
                    </p>
                </div>

                {/* MAIN SERMON PLAYER */}
                <div
                    className="relative h-[80vh] max-h-[80vh] min-h-[420px] overflow-hidden rounded-2xl bg-black"
                    onMouseEnter={() => setShowSermonList(true)}
                    onMouseLeave={() => setShowSermonList(false)}
                >
                    {/* CURRENT SERMON */}
                    <div className="absolute inset-0">
                        {showPlayer && currentSermon?.mediaUrl ? (
                            <div className="flex h-full w-full items-center justify-center bg-black">
                                {currentSermon.type?.toLowerCase() === "audio" ? (
                                    <div className="flex w-full max-w-xl flex-col items-center px-6 text-center">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#E31B23]/10 text-3xl text-[#F7941D]">
                                            <i className="fas fa-headphones" />
                                        </div>

                                        <h3 className="mt-6 text-xl font-semibold text-white">
                                            {currentSermon.title}
                                        </h3>

                                        <p className="mt-2 text-sm text-gray-400">
                                            {currentSermon.speaker}
                                        </p>

                                        <audio
                                            className="mt-8 w-full"
                                            controls
                                            autoPlay
                                            src={getMediaUrl(
                                                currentSermon.mediaUrl
                                            )}
                                        >
                                            Your browser does not support audio
                                            playback.
                                        </audio>
                                    </div>
                                ) : (
                                    <video
                                        key={currentSermon.id}
                                        className="h-full w-full object-contain"
                                        controls
                                        autoPlay
                                        playsInline
                                        src={getMediaUrl(
                                            currentSermon.mediaUrl
                                        )}
                                    >
                                        Your browser does not support video
                                        playback.
                                    </video>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* THUMBNAIL */}
                                <img
                                    src={getMediaUrl(
                                        currentSermon.thumbnail
                                    )}
                                    alt={currentSermon.title}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />

                                {/* DARK OVERLAY */}
                                <div className="absolute inset-0 bg-black/55" />

                                {/* CONTENT */}
                                <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white sm:p-8 lg:p-10">
                                    <div className="max-w-2xl">
                                        <span className="inline-flex rounded-full bg-[#E31B23] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                                            {currentSermon.category || "Sermon"}
                                        </span>

                                        <h3 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                                            {currentSermon.title}
                                        </h3>

                                        <p className="mt-3 text-sm text-gray-200 sm:text-base">
                                            {currentSermon.speaker}
                                        </p>

                                        {currentSermon.description && (
                                            <p className="mt-4 max-w-xl text-sm leading-6 text-gray-300">
                                                {currentSermon.description}
                                            </p>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleWatchSermon}
                                            className="
                                                group
                                                mt-6
                                                inline-flex
                                                items-center
                                                gap-3
                                                rounded-lg
                                                bg-[#E31B23]
                                                px-5
                                                py-3
                                                text-sm
                                                font-semibold
                                                text-white
                                                shadow-lg
                                                shadow-black/20
                                                transition-all
                                                duration-300
                                                hover:-translate-y-1
                                                hover:bg-[#C9151C]
                                            "
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                                                <i
                                                    className={`fas ${currentSermon.type?.toLowerCase() ===
                                                            "audio"
                                                            ? "fa-headphones"
                                                            : "fa-play"
                                                        } text-xs transition-transform duration-300 group-hover:scale-110`}
                                                />
                                            </span>

                                            {currentSermon.type?.toLowerCase() ===
                                                "audio"
                                                ? "Listen Now"
                                                : "Watch Sermon"}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* LEFT NAVIGATION BUTTON */}
                    <button
                        type="button"
                        onClick={handlePrevious}
                        aria-label="Previous sermon"
                        className={`
                            absolute
                            left-4
                            top-1/2
                            z-30
                            flex
                            h-11
                            w-11
                            -translate-y-1/2
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/20
                            bg-black/50
                            text-white
                            backdrop-blur-md
                            transition-all
                            duration-300
                            hover:bg-[#E31B23]
                            ${showSermonList
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-3 opacity-0 pointer-events-none"
                            }
                        `}
                    >
                        <i className="fas fa-chevron-left text-sm" />
                    </button>

                    {/* RIGHT NAVIGATION BUTTON */}
                    <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next sermon"
                        className={`
                            absolute
                            right-4
                            top-1/2
                            z-30
                            flex
                            h-11
                            w-11
                            -translate-y-1/2
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/20
                            bg-black/50
                            text-white
                            backdrop-blur-md
                            transition-all
                            duration-300
                            hover:bg-[#E31B23]
                            ${showSermonList
                                ? "translate-x-0 opacity-100"
                                : "translate-x-3 opacity-0 pointer-events-none"
                            }
                        `}
                    >
                        <i className="fas fa-chevron-right text-sm" />
                    </button>

                    {/* HOVER SERMON LIST */}
                    <div
                        className={`
                            absolute
                            bottom-0
                            left-0
                            right-0
                            z-20
                            px-12
                            pb-5
                            pt-16
                            transition-all
                            duration-400
                            ${showSermonList
                                ? "translate-y-0 opacity-100"
                                : "pointer-events-none translate-y-8 opacity-0"
                            }
                        `}
                    >
                        {/* BACKGROUND GRADIENT */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#101112] via-[#101112]/90 to-transparent" />

                        {/* SERMON ROW */}
                        <div className="relative z-10 flex gap-3 overflow-hidden">
                            {sermons.map((sermon, index) => {
                                const isActive = index === currentIndex;

                                return (
                                    <button
                                        key={sermon.id}
                                        type="button"
                                        onClick={() =>
                                            handleSermonClick(index)
                                        }
                                        className={`
                                            group
                                            min-w-0
                                            flex-1
                                            overflow-hidden
                                            rounded-lg
                                            border
                                            text-left
                                            transition-all
                                            duration-300
                                            ${isActive
                                                ? "border-[#E31B23] bg-[#181a1d]"
                                                : "border-white/10 bg-[#141618]/90 hover:border-[#F7941D]/50 hover:bg-[#181a1d]"
                                            }
                                        `}
                                    >
                                        {/* THUMBNAIL */}
                                        <div className="relative aspect-video overflow-hidden">
                                            <img
                                                src={getMediaUrl(
                                                    sermon.thumbnail
                                                )}
                                                alt={sermon.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            <div
                                                className={`
                                                    absolute
                                                    inset-0
                                                    flex
                                                    items-center
                                                    justify-center
                                                    transition-all
                                                    duration-300
                                                    ${isActive
                                                        ? "bg-[#E31B23]/70"
                                                        : "bg-black/30 group-hover:bg-black/50"
                                                    }
                                                `}
                                            >
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#E31B23] shadow-lg">
                                                    <i
                                                        className={`fas ${sermon.type?.toLowerCase() ===
                                                                "audio"
                                                                ? "fa-headphones"
                                                                : "fa-play"
                                                            } text-[10px]`}
                                                    />
                                                </span>
                                            </div>

                                            {/* ACTIVE INDICATOR */}
                                            {isActive && (
                                                <div className="absolute left-2 top-2 rounded-full bg-[#F7941D] px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-white">
                                                    Playing
                                                </div>
                                            )}
                                        </div>

                                        {/* SERMON INFO */}
                                        <div className="p-3">
                                            <p className="truncate text-[8px] font-semibold uppercase tracking-wider text-[#F7941D]">
                                                {sermon.category ||
                                                    sermon.type ||
                                                    "Sermon"}
                                            </p>

                                            <h4
                                                className={`
                                                    mt-1
                                                    line-clamp-2
                                                    text-xs
                                                    font-semibold
                                                    leading-4
                                                    ${isActive
                                                        ? "text-[#F7941D]"
                                                        : "text-white"
                                                    }
                                                `}
                                            >
                                                {sermon.title}
                                            </h4>

                                            <p className="mt-1 truncate text-[10px] text-gray-400">
                                                {sermon.speaker}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* CURRENT POSITION */}
                        <div className="relative z-10 mt-3 text-center">
                            <span className="text-[10px] font-medium text-gray-400">
                                {currentIndex + 1} / {sermons.length}
                            </span>
                        </div>
                    </div>

                    {/* TOP HOVER INDICATOR */}
                    <div
                        className={`
                            absolute
                            left-1/2
                            top-5
                            z-20
                            -translate-x-1/2
                            rounded-full
                            border
                            border-white/10
                            bg-black/40
                            px-4
                            py-2
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.2em]
                            text-white/70
                            backdrop-blur-md
                            transition-all
                            duration-300
                            ${showSermonList
                                ? "translate-y-0 opacity-0"
                                : "translate-y-0 opacity-100"
                            }
                        `}
                    >
                        Move mouse here to browse sermons
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FeaturedSermons;