import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function SermonPlayer({
    selectedSermon,
    onBack,
    relatedSermons = [],
    SermonCard,
}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [shareMessage, setShareMessage] = useState("");
    const [mediaError, setMediaError] = useState(false);
    const [downloadMessage, setDownloadMessage] = useState("");
    const [showVideoControls, setShowVideoControls] = useState(true);

    const mediaRef = useRef(null);
    const controlsTimerRef = useRef(null);

    const getMediaUrl = (url) => {
        if (!url) return "";

        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }

        const apiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
        const cleanUrl = url.replace(/^\/+/, "");

        return `${apiUrl}/${cleanUrl}`;
    };

    const mediaUrl = getMediaUrl(selectedSermon?.mediaUrl);
    const hasMedia = Boolean(selectedSermon?.mediaUrl && mediaUrl);
    const isVideo = selectedSermon?.type === "video";

    useEffect(() => {
        setIsPlaying(false);
        setMediaError(false);
        setShareMessage("");
        setDownloadMessage("");
        setShowVideoControls(true);

        if (controlsTimerRef.current) {
            window.clearTimeout(controlsTimerRef.current);
        }

        if (mediaRef.current) {
            mediaRef.current.pause();
            mediaRef.current.currentTime = 0;
        }
    }, [selectedSermon?.id, mediaUrl]);

    const handlePlayPause = async () => {
        if (!mediaRef.current || !mediaUrl || mediaError) return;

        if (isPlaying) {
            mediaRef.current.pause();
            setIsPlaying(false);
            return;
        }

        try {
            await mediaRef.current.play();
            setIsPlaying(true);
            setMediaError(false);
        } catch (error) {
            console.error("Media playback error:", error);
            setMediaError(true);
            setIsPlaying(false);
        }
    };

    const handleMediaEnded = () => {
        setIsPlaying(false);
    };

    const handleMediaError = () => {
        setIsPlaying(false);
        setMediaError(true);

        console.error("Unable to load media:", mediaUrl);
    };

    const revealVideoControls = () => {
        setShowVideoControls(true);

        if (controlsTimerRef.current) {
            window.clearTimeout(controlsTimerRef.current);
        }

        if (isVideo && isPlaying) {
            controlsTimerRef.current = window.setTimeout(() => {
                setShowVideoControls(false);
            }, 3200);
        }
    };

    useEffect(() => {
        if (!isVideo || !isPlaying) {
            setShowVideoControls(true);

            if (controlsTimerRef.current) {
                window.clearTimeout(controlsTimerRef.current);
            }
        } else {
            setShowVideoControls(false);
        }

        return () => {
            if (controlsTimerRef.current) {
                window.clearTimeout(controlsTimerRef.current);
            }
        };
    }, [isVideo, isPlaying]);

    const showTemporaryMessage = (setter, message, duration = 2500) => {
        setter(message);

        window.setTimeout(() => {
            setter("");
        }, duration);
    };

    const handleDownload = async () => {
        if (!mediaUrl) return;

        try {
            setDownloadMessage("Preparing download…");

            const response = await fetch(mediaUrl);

            if (!response.ok) {
                throw new Error("Failed to download media.");
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            const extension =
                selectedSermon?.type === "audio" ? "mp3" : "mp4";

            const safeTitle = (
                selectedSermon?.title || "sermon"
            ).replace(/[\\/:*?"<>|]/g, "-");

            link.href = blobUrl;
            link.download = `${safeTitle}.${extension}`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(blobUrl);

            showTemporaryMessage(
                setDownloadMessage,
                "Download started."
            );
        } catch (error) {
            console.error("Download error:", error);

            showTemporaryMessage(
                setDownloadMessage,
                "Unable to download this sermon.",
                3000
            );
        }
    };

    const handleShare = async () => {
        if (!selectedSermon) return;

        const shareUrl = `${window.location.origin}/sermons?sermon=${selectedSermon.id}`;

        const shareData = {
            title: selectedSermon.title,
            text: `Watch "${selectedSermon.title}" from Living Faith Church Iguosa.`,
            url: shareUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            await navigator.clipboard.writeText(shareUrl);

            showTemporaryMessage(
                setShareMessage,
                "Sermon link copied!"
            );
        } catch (error) {
            if (error?.name === "AbortError") return;

            try {
                await navigator.clipboard.writeText(shareUrl);

                showTemporaryMessage(
                    setShareMessage,
                    "Sermon link copied!"
                );
            } catch {
                showTemporaryMessage(
                    setShareMessage,
                    "Unable to share sermon."
                );
            }
        }
    };

    const spring = {
        type: "spring",
        stiffness: 90,
        damping: 20,
    };

    const fadeUp = {
        hidden: {
            opacity: 0,
            y: 22,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: spring,
        },
    };

    return (
        <motion.section
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {
                    opacity: 0,
                },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.08,
                    },
                },
            }}
            className="min-h-screen bg-[#faf9f7] px-4 py-6 text-[#202124] dark:bg-[#101112] dark:text-[#f4f4f5] sm:px-6 sm:py-8 lg:px-10"
        >
            <div className="mx-auto max-w-[1440px]">

                {/* Back Navigation */}

                <motion.div
                    variants={fadeUp}
                    className="mb-7 flex items-center justify-between"
                >
                    <button
                        type="button"
                        onClick={onBack}
                        className="group inline-flex items-center gap-3 rounded-full bg-black/[0.045] px-4 py-2.5 text-sm font-semibold text-[#55565a] transition duration-300 hover:-translate-x-1 hover:bg-black/[0.075] hover:text-[#e31b23] dark:bg-white/[0.055] dark:text-white/70 dark:hover:bg-white/[0.09] dark:hover:text-[#ff646b]"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm transition group-hover:shadow-md dark:bg-white/10">
                            <i className="fa-solid fa-arrow-left text-xs" />
                        </span>

                        Back to sermons
                    </button>

                    <span className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-black/35 dark:text-white/35 sm:inline-flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#e31b23]" />
                        Living Faith Church · Iguosa
                    </span>
                </motion.div>

                {/* Cinematic Player */}

                <motion.div
                    variants={fadeUp}
                    onPointerMove={() => {
                        if (isVideo && isPlaying) {
                            revealVideoControls();
                        }
                    }}
                    onPointerDown={() => {
                        if (isVideo && isPlaying) {
                            revealVideoControls();
                        }
                    }}
                    onMouseLeave={() => {
                        if (isVideo && isPlaying) {
                            setShowVideoControls(false);
                        }
                    }}
                    className="relative isolate overflow-hidden rounded-[28px] bg-[#080909] shadow-[0_28px_90px_rgba(0,0,0,0.16)] dark:shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:rounded-[34px]"
                >
                    <div className="relative h-[62vh] min-h-[440px] max-h-[820px] sm:h-[70vh]">

                        {/* Video / Audio Media */}

                        {hasMedia && !mediaError ? (
                            isVideo ? (
                                <video
                                    ref={mediaRef}
                                    src={mediaUrl}
                                    poster={selectedSermon?.thumbnail}
                                    className="h-full w-full bg-black object-contain"
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onEnded={handleMediaEnded}
                                    onError={handleMediaError}
                                    preload="metadata"
                                    playsInline
                                />
                            ) : (
                                <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#101112]">

                                    {selectedSermon?.thumbnail && (
                                        <img
                                            src={selectedSermon.thumbnail}
                                            alt=""
                                            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-3xl"
                                        />
                                    )}

                                    <div className="relative z-10 flex w-full flex-col items-center px-6 text-center">

                                        {selectedSermon?.thumbnail ? (
                                            <motion.img
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.92,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                transition={{
                                                    duration: 0.7,
                                                }}
                                                src={selectedSermon.thumbnail}
                                                alt={selectedSermon.title}
                                                className="mb-7 aspect-square w-44 rounded-[26px] object-cover shadow-[0_20px_70px_rgba(0,0,0,0.45)] sm:w-56"
                                            />
                                        ) : (
                                            <div className="mb-7 flex h-44 w-44 items-center justify-center rounded-[26px] bg-white/[0.06] text-white/50 sm:h-56 sm:w-56">
                                                <i className="fa-solid fa-headphones text-5xl" />
                                            </div>
                                        )}

                                        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-white/45">
                                            Audio message
                                        </p>

                                        <audio
                                            ref={mediaRef}
                                            src={mediaUrl}
                                            onPlay={() => setIsPlaying(true)}
                                            onPause={() => setIsPlaying(false)}
                                            onEnded={handleMediaEnded}
                                            onError={handleMediaError}
                                            preload="metadata"
                                        />

                                        <button
                                            type="button"
                                            onClick={handlePlayPause}
                                            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e31b23] text-white shadow-[0_10px_40px_rgba(227,27,35,0.35)] transition hover:scale-105 hover:bg-[#c8171e]"
                                            aria-label={isPlaying ? "Pause sermon" : "Play sermon"}
                                        >
                                            <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"} ${isPlaying ? "" : "translate-x-0.5"}`} />
                                        </button>

                                        <p className="mt-4 text-xs font-medium text-white/55">
                                            {isPlaying ? "Now playing" : "Tap to listen"}
                                        </p>
                                    </div>
                                </div>
                            )
                        ) : mediaError ? (
                            <div className="flex h-full items-center justify-center bg-[#101112] px-6 text-center">
                                <div className="max-w-sm">

                                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e31b23]/15 text-[#ff646b]">
                                        <i className="fa-solid fa-circle-exclamation text-xl" />
                                    </div>

                                    <h2 className="text-xl font-bold text-white">
                                        Unable to load this media
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-white/55">
                                        This sermon could not be loaded. Please check your connection and try again.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMediaError(false);

                                            if (mediaRef.current) {
                                                mediaRef.current.load();
                                            }
                                        }}
                                        className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#171819] transition hover:bg-white/85"
                                    >
                                        Try again
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#101112]">

                                {selectedSermon?.thumbnail && (
                                    <img
                                        src={selectedSermon.thumbnail}
                                        alt=""
                                        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-3xl"
                                    />
                                )}

                                <div className="relative z-10 max-w-lg px-6 text-center">

                                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/[0.08] text-white/75">
                                        <i className={`fa-solid ${isVideo ? "fa-play" : "fa-headphones"} text-xl`} />
                                    </div>

                                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
                                        Coming soon
                                    </p>

                                    <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                                        Sermon media is on its way
                                    </h2>

                                    <p className="mt-2 text-sm text-white/50">
                                        Please check back soon to watch or listen to this message.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Video Details and Controls */}

                        {(!isVideo || !isPlaying || showVideoControls) && (
                            <>
                                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/75 via-transparent to-black/85" />

                                {/* Top Sermon Information */}

                                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-6 sm:p-9">
                                    <div className="flex items-start justify-between gap-5">

                                        <div className="max-w-3xl">

                                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/[0.12] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-xl">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#ff646b]" />
                                                {selectedSermon?.category || "Sermon"}
                                            </div>

                                            <h1 className="text-balance text-2xl font-black leading-tight tracking-[-0.035em] text-white sm:text-3xl lg:text-5xl">
                                                {selectedSermon?.title}
                                            </h1>

                                            <p className="mt-3 text-sm font-medium text-white/65 sm:text-base">
                                                {selectedSermon?.speaker}
                                            </p>
                                        </div>

                                        <div className="hidden rounded-2xl bg-white/[0.09] px-4 py-3 text-right backdrop-blur-xl md:block">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/45">
                                                Now sharing
                                            </p>

                                            <p className="mt-1 text-xs font-semibold text-white/85">
                                                The Word · The Faith
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Player Controls */}

                                <div className="absolute inset-x-0 bottom-0 z-30 p-5 sm:p-8">
                                    <div className="flex items-end justify-between gap-4">

                                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.07 }}
                                                whileTap={{ scale: 0.94 }}
                                                onClick={handlePlayPause}
                                                disabled={!hasMedia || mediaError}
                                                aria-label={isPlaying ? "Pause sermon" : "Play sermon"}
                                                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e31b23] text-white shadow-[0_8px_35px_rgba(227,27,35,0.38)] transition disabled:cursor-not-allowed disabled:opacity-40 sm:h-[68px] sm:w-[68px]"
                                            >
                                                <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"} ${isPlaying ? "" : "translate-x-0.5"} text-lg`} />
                                            </motion.button>

                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                                                    {isPlaying ? "Currently playing" : "Featured message"}
                                                </p>

                                                <p className="mt-1 truncate text-sm font-semibold text-white sm:text-base">
                                                    {selectedSermon?.title}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2">

                                            <motion.button
                                                type="button"
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.96 }}
                                                onClick={handleDownload}
                                                disabled={!hasMedia || mediaError}
                                                title="Download sermon"
                                                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.12] text-white/90 backdrop-blur-xl transition hover:bg-white/[0.2] disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto sm:gap-2 sm:px-4"
                                            >
                                                <i className="fa-solid fa-download text-sm" />

                                                <span className="hidden text-xs font-semibold sm:inline">
                                                    Download
                                                </span>
                                            </motion.button>

                                            <motion.button
                                                type="button"
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.96 }}
                                                onClick={handleShare}
                                                title="Share sermon"
                                                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.12] text-white/90 backdrop-blur-xl transition hover:bg-white/[0.2] sm:w-auto sm:gap-2 sm:px-4"
                                            >
                                                <i className="fa-solid fa-share-nodes text-sm" />

                                                <span className="hidden text-xs font-semibold sm:inline">
                                                    Share
                                                </span>
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Download / Share Feedback */}

                                    <AnimatePresence>
                                        {(downloadMessage || shareMessage) && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    y: 8,
                                                    scale: 0.96,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: 6,
                                                }}
                                                className="mt-4 flex justify-end"
                                            >
                                                <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#202124] shadow-xl">
                                                    {downloadMessage || shareMessage}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Related Sermons */}

                {relatedSermons?.length > 0 && SermonCard && (
                    <motion.section
                        variants={fadeUp}
                        className="mt-14 pb-12 sm:mt-16"
                    >
                        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                            <div>
                                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#e31b23]">
                                    Keep growing
                                </p>

                                <h2 className="text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                                    Continue watching
                                </h2>

                                <p className="mt-2 text-sm text-black/50 dark:text-white/45">
                                    More messages to strengthen your walk with God.
                                </p>
                            </div>

                            <span className="text-xs font-semibold text-black/35 dark:text-white/35">
                                {relatedSermons.length}{" "}
                                {relatedSermons.length === 1 ? "message" : "messages"}
                            </span>
                        </div>

                        <motion.div
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.08,
                                    },
                                },
                            }}
                            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                        >
                            {relatedSermons.map((sermon) => (
                                <motion.div
                                    key={sermon.id}
                                    variants={{
                                        hidden: {
                                            opacity: 0,
                                            y: 18,
                                        },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: spring,
                                        },
                                    }}
                                >
                                    <SermonCard sermon={sermon} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.section>
                )}
            </div>
        </motion.section>
    );
}

export default SermonPlayer;