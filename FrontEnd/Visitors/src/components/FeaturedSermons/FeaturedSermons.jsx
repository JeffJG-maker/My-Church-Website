
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function FeaturedSermons() {
    const navigate = useNavigate();

    const [sermons, setSermons] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showPlayer, setShowPlayer] = useState(false);
    const [showSermonList, setShowSermonList] = useState(false);

    const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

    const getMediaUrl = (mediaUrl) => {
        if (!mediaUrl) return "";

        if (
            mediaUrl.startsWith("http://") ||
            mediaUrl.startsWith("https://") ||
            mediaUrl.startsWith("data:")
        ) {
            return mediaUrl;
        }

        const cleanUrl = mediaUrl.replace(/^\/+/, "");

        return baseUrl
            ? `${baseUrl}/${cleanUrl}`
            : `/${cleanUrl}`;
    };

    useEffect(() => {
        const controller = new AbortController();

        const fetchSermons = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${baseUrl}/api/sermons`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch sermons.");
                }

                const data = await response.json();

                const sermonData = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.sermons)
                        ? data.sermons
                        : Array.isArray(data?.data)
                            ? data.data
                            : Array.isArray(data?.data?.sermons)
                                ? data.data.sermons
                                : [];

                const sortedSermons = [...sermonData]
                    .sort((a, b) => {
                        const dateA = new Date(a.date || 0).getTime();
                        const dateB = new Date(b.date || 0).getTime();

                        return dateB - dateA;
                    })
                    .slice(0, 5);

                if (!controller.signal.aborted) {
                    setSermons(sortedSermons);
                    setCurrentIndex(0);
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Featured sermons error:", err);
                    setError("Unable to load featured sermons.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchSermons();

        return () => controller.abort();
    }, [baseUrl]);

    useEffect(() => {
        if (showPlayer) {
            setShowSermonList(false);
        }
    }, [showPlayer]);

    const currentSermon = sermons[currentIndex];

    const isAudio = currentSermon?.type?.toLowerCase() === "audio";

    const handleSermonClick = (index) => {
        if (!sermons[index]) return;

        setCurrentIndex(index);
        setShowPlayer(false);
        setShowSermonList(false);
    };

    const handlePrevious = () => {
        if (!sermons.length) return;

        setCurrentIndex((previousIndex) =>
            previousIndex === 0
                ? sermons.length - 1
                : previousIndex - 1
        );

        setShowPlayer(false);
        setShowSermonList(false);
    };

    const handleNext = () => {
        if (!sermons.length) return;

        setCurrentIndex((previousIndex) =>
            previousIndex === sermons.length - 1
                ? 0
                : previousIndex + 1
        );

        setShowPlayer(false);
        setShowSermonList(false);
    };

    const handleWatchSermon = () => {
        if (!currentSermon?.mediaUrl) {
            window.alert("This sermon does not have a media file yet.");
            return;
        }

        setShowSermonList(false);
        setShowPlayer(true);
    };

    const handleViewAllSermons = () => {
        navigate("/sermons");
    };

    const sectionClass =
        "bg-white px-5 py-14 text-[#171717] transition-colors duration-500 dark:bg-[#101112] dark:text-white sm:px-8 sm:py-16 lg:px-[7%] lg:py-20";

    if (loading) {
        return (
            <section
                className={sectionClass}
                aria-labelledby="featured-sermons-heading"
            >
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-9 max-w-3xl text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D91620]">
                            Grow in the Word
                        </p>

                        <h2
                            id="featured-sermons-heading"
                            className="mt-3 text-2xl font-semibold sm:text-3xl"
                        >
                            Featured Sermons
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                            Watch or listen to messages from Living Faith
                            Church Iguosa and grow in God's Word.
                        </p>
                    </div>

                    <div
                        className="h-[360px] animate-pulse rounded-2xl bg-gray-100 dark:bg-[#191B1D] sm:h-[440px]"
                        aria-label="Loading featured sermons"
                    />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={sectionClass}>
                <div className="mx-auto max-w-2xl text-center">
                    <i
                        className="fas fa-circle-exclamation text-2xl text-[#D91620]"
                        aria-hidden="true"
                    />

                    <h2 className="mt-4 text-lg font-semibold">
                        Unable to load sermons
                    </h2>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={handleViewAllSermons}
                        className="mt-5 rounded-lg bg-[#D91620] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B9121B]"
                    >
                        Browse All Sermons
                    </button>
                </div>
            </section>
        );
    }

    if (!sermons.length) {
        return (
            <section className={sectionClass}>
                <div className="mx-auto max-w-2xl text-center">
                    <i
                        className="fas fa-video-slash text-2xl text-[#D91620]"
                        aria-hidden="true"
                    />

                    <h2 className="mt-4 text-lg font-semibold">
                        No sermons available yet
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Our featured messages will appear here when they are
                        added. You can also visit our sermons page to explore
                        the complete collection.
                    </p>

                    <button
                        type="button"
                        onClick={handleViewAllSermons}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#D91620] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B9121B]"
                    >
                        Browse All Sermons
                        <i className="fas fa-arrow-right text-xs" />
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section
            className={`${sectionClass} pb-16 lg:pb-20`}
            aria-labelledby="featured-sermons-heading"
        >
            <div className="mx-auto max-w-7xl overflow-x-clip">

                <div className="mx-auto mb-9 max-w-3xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{
                            duration: 0.7,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D91620]">
                            Grow in the Word
                        </p>

                        <h2
                            id="featured-sermons-heading"
                            className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"
                        >
                            Featured Sermons
                        </h2>

                        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[#D91620]" />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{
                            duration: 0.7,
                            delay: 0.1,
                        }}
                        className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400"
                    >
                        Watch or listen to selected messages from Living Faith
                        Church Iguosa. Discover biblical teachings that
                        strengthen your faith, deepen your understanding of
                        God's Word, and encourage your spiritual growth.
                    </motion.p>
                </div>

                <div
                    className="relative h-[380px] overflow-hidden rounded-2xl bg-[#101112] shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:h-[460px] lg:h-[520px]"
                    onMouseEnter={() => {
                        if (!showPlayer) setShowSermonList(true);
                    }}
                    onMouseLeave={() => setShowSermonList(false)}
                >
                    {showPlayer && currentSermon?.mediaUrl ? (
                        <div className="relative flex h-full w-full items-center justify-center bg-black">
                            {isAudio ? (
                                <div className="flex w-full max-w-xl flex-col items-center px-6 text-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D91620]/15 text-2xl text-white">
                                        <i className="fas fa-headphones" />
                                    </div>

                                    <h3 className="mt-5 text-lg font-semibold text-white sm:text-xl">
                                        {currentSermon.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-400">
                                        {currentSermon.speaker}
                                    </p>

                                    <audio
                                        key={currentSermon.id || currentSermon._id}
                                        className="mt-7 w-full"
                                        controls
                                        autoPlay
                                        src={getMediaUrl(currentSermon.mediaUrl)}
                                    >
                                        Your browser does not support audio playback.
                                    </audio>
                                </div>
                            ) : (
                                <video
                                    key={currentSermon.id || currentSermon._id}
                                    className="h-full w-full object-contain"
                                    controls
                                    autoPlay
                                    playsInline
                                    preload="metadata"
                                    src={getMediaUrl(currentSermon.mediaUrl)}
                                >
                                    Your browser does not support video playback.
                                </video>
                            )}

                            <button
                                type="button"
                                onClick={() => {
                                    setShowPlayer(false);
                                    setShowSermonList(false);
                                }}
                                aria-label="Close sermon player"
                                className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-[#D91620]"
                            >
                                <i className="fas fa-times" />
                            </button>
                        </div>
                    ) : (
                        <>
                            {currentSermon.thumbnail ? (
                                <img
                                    src={getMediaUrl(currentSermon.thumbnail)}
                                    alt={`Thumbnail for ${currentSermon.title}`}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#202124]">
                                    <i className="fas fa-video text-5xl text-white/20" />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/10" />

                            <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white sm:p-8 lg:p-10">
                                <div className="max-w-2xl">
                                    <span className="inline-flex rounded-full bg-[#D91620] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                                        {currentSermon.category || "Sermon"}
                                    </span>

                                    <h3 className="mt-3 text-xl font-semibold leading-tight sm:text-2xl lg:text-3xl">
                                        {currentSermon.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-200">
                                        {currentSermon.speaker ||
                                            "Living Faith Church Iguosa"}
                                    </p>

                                    {currentSermon.description && (
                                        <p className="mt-3 max-w-xl text-sm leading-6 text-gray-300">
                                            {currentSermon.description}
                                        </p>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleWatchSermon}
                                        className="group mt-5 inline-flex items-center gap-3 rounded-lg bg-[#D91620] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#B9121B]"
                                    >
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                                            <i
                                                className={`fas ${isAudio
                                                        ? "fa-headphones"
                                                        : "fa-play"
                                                    } text-xs`}
                                            />
                                        </span>

                                        {isAudio ? "Listen Now" : "Watch Sermon"}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {!showPlayer && sermons.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={handlePrevious}
                                aria-label="Previous sermon"
                                className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-[#D91620] sm:left-4 sm:h-10 sm:w-10"
                            >
                                <i className="fas fa-chevron-left text-xs" />
                            </button>

                            <button
                                type="button"
                                onClick={handleNext}
                                aria-label="Next sermon"
                                className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-[#D91620] sm:right-4 sm:h-10 sm:w-10"
                            >
                                <i className="fas fa-chevron-right text-xs" />
                            </button>

                            <div
                                className={`absolute bottom-0 left-0 right-0 z-20 px-4 pb-4 pt-12 transition-all duration-300 sm:px-10 sm:pb-5 ${showSermonList
                                        ? "translate-y-0 opacity-100"
                                        : "pointer-events-none translate-y-5 opacity-0"
                                    }`}
                                aria-hidden={!showSermonList}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-[#101112] via-[#101112]/90 to-transparent" />

                                <div className="relative z-10 flex gap-3 overflow-x-auto pb-2">
                                    {sermons.map((sermon, index) => {
                                        const isActive = index === currentIndex;

                                        return (
                                            <button
                                                key={sermon.id || sermon._id || index}
                                                type="button"
                                                onClick={() => handleSermonClick(index)}
                                                aria-label={`Select sermon: ${sermon.title}`}
                                                aria-pressed={isActive}
                                                tabIndex={showSermonList ? 0 : -1}
                                                className={`group w-36 min-w-36 overflow-hidden rounded-lg text-left shadow-sm transition duration-300 sm:w-40 sm:min-w-40 ${isActive
                                                        ? "bg-[#292929] ring-1 ring-[#D91620]"
                                                        : "bg-[#17191A]/95 hover:bg-[#292929]"
                                                    }`}
                                            >
                                                <div className="relative aspect-video overflow-hidden bg-[#292B2D]">
                                                    {sermon.thumbnail && (
                                                        <img
                                                            src={getMediaUrl(sermon.thumbnail)}
                                                            alt={`Thumbnail for ${sermon.title}`}
                                                            loading="lazy"
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    )}

                                                    <div
                                                        className={`absolute inset-0 flex items-center justify-center transition ${isActive
                                                                ? "bg-[#D91620]/40"
                                                                : "bg-black/20 group-hover:bg-black/40"
                                                            }`}
                                                    >
                                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#D91620] shadow-lg">
                                                            <i
                                                                className={`fas ${sermon.type?.toLowerCase() === "audio"
                                                                        ? "fa-headphones"
                                                                        : "fa-play"
                                                                    } text-[10px]`}
                                                            />
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-3">
                                                    <p className="truncate text-[9px] font-semibold uppercase tracking-wider text-[#F08080]">
                                                        {sermon.category || sermon.type || "Sermon"}
                                                    </p>

                                                    <h4 className="mt-1 line-clamp-2 text-xs font-semibold leading-4 text-white">
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

                                <div className="relative z-10 mt-2 text-center">
                                    <span className="text-[10px] font-medium text-gray-400">
                                        {currentIndex + 1} / {sermons.length}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    {!showPlayer && (
                        <div
                            className={`pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-black/40 px-4 py-2 text-center text-[9px] font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-md transition-opacity duration-300 ${showSermonList ? "opacity-0" : "opacity-100"
                                }`}
                        >
                            Hover to browse featured sermons
                        </div>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.7 }}
                    className="mt-12 flex w-full flex-col items-start justify-between gap-5 md:flex-row md:items-end"
                >
                    <div className="w-full max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D91620]">
                            Keep Growing in Faith
                        </p>

                        <h3 className="mt-3 text-xl font-semibold tracking-tight text-[#171717] dark:text-white sm:text-2xl">
                            More Messages. More Spiritual Growth.
                        </h3>

                        <p className="mt-3 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-400">
                            Explore more sermons and biblical teachings from
                            Living Faith Church Iguosa. Find messages that
                            encourage your faith and help you grow in God's Word.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleViewAllSermons}
                        className="group inline-flex shrink-0 items-center gap-3 py-2 text-sm font-semibold text-[#D91620] transition-colors duration-300 hover:text-[#B9121B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D91620] focus-visible:ring-offset-4 dark:focus-visible:ring-offset-[#101112]"
                    >
                        <span>Browse All Sermons</span>

                        <span
                            className="inline-block text-base transition-transform duration-300 group-hover:translate-x-1"
                            aria-hidden="true"
                        >
                            →
                        </span>
                    </button>
                </motion.div>
            </div>
        </section>
    );
}

export default FeaturedSermons;
