import { useRef, useState } from "react";

function SermonPlayer({
    selectedSermon,
    onBack,
    relatedSermons,
    SermonCard,
}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [shareMessage, setShareMessage] = useState("");
    const [mediaError, setMediaError] = useState(false);
    const [downloadMessage, setDownloadMessage] = useState("");

    const mediaRef = useRef(null);

    /*
     * Convert backend media paths into complete URLs.
     *
     * Example:
     * media/sermon.mp4
     *
     * becomes:
     * http://localhost:5000/media/sermon.mp4
     */
    const getMediaUrl = (url) => {
        if (!url) return "";

        // If the backend already provides a complete URL,
        // use it directly.
        if (
            url.startsWith("http://") ||
            url.startsWith("https://")
        ) {
            return url;
        }

        const apiUrl = (
            import.meta.env.VITE_API_URL || ""
        ).replace(/\/$/, "");

        // Remove leading slashes.
        const cleanUrl = url.replace(/^\/+/, "");

        return `${apiUrl}/${cleanUrl}`;
    };

    const mediaUrl = getMediaUrl(
        selectedSermon?.mediaUrl
    );

    /*
     * PLAY / PAUSE
     */
    const handlePlayPause = () => {
        if (!mediaRef.current || !mediaUrl) {
            return;
        }

        if (isPlaying) {
            mediaRef.current.pause();
            setIsPlaying(false);
        } else {
            mediaRef.current
                .play()
                .then(() => {
                    setIsPlaying(true);
                    setMediaError(false);
                })
                .catch((error) => {
                    console.error(
                        "Media playback error:",
                        error
                    );

                    setMediaError(true);
                    setIsPlaying(false);
                });
        }
    };

    /*
     * MEDIA ENDED
     */
    const handleMediaEnded = () => {
        setIsPlaying(false);
    };

    /*
     * MEDIA ERROR
     */
    const handleMediaError = () => {
        setIsPlaying(false);
        setMediaError(true);

        console.error(
            "Unable to load media:",
            mediaUrl
        );
    };

    /*
     * DOWNLOAD MEDIA
     *
     * We fetch the media first, convert it to a Blob,
     * then create a temporary download link.
     *
     * This prevents the browser from simply opening
     * the video in a new/full-screen player.
     */
    const handleDownload = async () => {
        if (!mediaUrl) {
            return;
        }

        try {
            setDownloadMessage("Preparing download...");

            const response = await fetch(mediaUrl);

            if (!response.ok) {
                throw new Error(
                    "Failed to download media."
                );
            }

            const blob = await response.blob();

            const blobUrl =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = blobUrl;

            const fileName = `${selectedSermon.title}.${selectedSermon.type === "audio"
                ? "mp3"
                : "mp4"
                }`;

            link.download = fileName;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(blobUrl);

            setDownloadMessage("Download started.");

            setTimeout(() => {
                setDownloadMessage("");
            }, 2500);
        } catch (error) {
            console.error(
                "Download error:",
                error
            );

            setDownloadMessage(
                "Unable to download this sermon."
            );

            setTimeout(() => {
                setDownloadMessage("");
            }, 3000);
        }
    };

    /*
     * SHARE SERMON
     */
    const handleShare = async () => {
        if (!selectedSermon) {
            return;
        }

        const shareUrl =
            `${window.location.origin}/sermons?sermon=${selectedSermon.id}`;

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

            await navigator.clipboard.writeText(
                shareUrl
            );

            setShareMessage(
                "Sermon link copied!"
            );

            setTimeout(() => {
                setShareMessage("");
            }, 2500);
        } catch (error) {
            if (error?.name === "AbortError") {
                return;
            }

            try {
                await navigator.clipboard.writeText(
                    shareUrl
                );

                setShareMessage(
                    "Sermon link copied!"
                );

                setTimeout(() => {
                    setShareMessage("");
                }, 2500);
            } catch {
                setShareMessage(
                    "Unable to share sermon."
                );
            }
        }
    };

    return (
        <section className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-6xl">

                {/* BACK BUTTON */}
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-6 inline-flex items-center gap-2 rounded-xl bg-[#181a1d] px-4 py-2.5 text-sm font-semibold text-[#d1d5db] transition hover:-translate-x-1 hover:bg-[#202226] hover:text-[#9188ff]"
                >
                    <i className="fa-solid fa-arrow-left" />
                    Back to Sermons
                </button>

                {/* PLAYER CONTAINER */}
                <div className="group relative h-[75vh] min-h-[500px] overflow-hidden rounded-3xl bg-black shadow-2xl shadow-black/20">

                    {/* VIDEO / AUDIO */}
                    {selectedSermon.mediaUrl &&
                        !mediaError ? (
                        selectedSermon.type ===
                            "video" ? (
                            <video
                                ref={mediaRef}
                                src={mediaUrl}
                                poster={
                                    selectedSermon.thumbnail
                                }
                                className="h-full w-full object-contain"
                                onPlay={() =>
                                    setIsPlaying(true)
                                }
                                onPause={() =>
                                    setIsPlaying(false)
                                }
                                onEnded={
                                    handleMediaEnded
                                }
                                onError={
                                    handleMediaError
                                }
                                preload="metadata"
                            />
                        ) : (
                            /* AUDIO PLAYER */
                            <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#101112]">

                                {selectedSermon.thumbnail && (
                                    <img
                                        src={
                                            selectedSermon.thumbnail
                                        }
                                        alt=""
                                        className="absolute inset-0 h-full w-full object-cover opacity-20 blur-2xl"
                                    />
                                )}

                                <div className="relative z-10 flex flex-col items-center px-6 text-center">

                                    {selectedSermon.thumbnail && (
                                        <img
                                            src={
                                                selectedSermon.thumbnail
                                            }
                                            alt={
                                                selectedSermon.title
                                            }
                                            className="mb-6 h-56 w-56 rounded-2xl object-cover shadow-2xl"
                                        />
                                    )}

                                    <audio
                                        ref={mediaRef}
                                        src={mediaUrl}
                                        onPlay={() =>
                                            setIsPlaying(
                                                true
                                            )
                                        }
                                        onPause={() =>
                                            setIsPlaying(
                                                false
                                            )
                                        }
                                        onEnded={
                                            handleMediaEnded
                                        }
                                        onError={
                                            handleMediaError
                                        }
                                        preload="metadata"
                                    />

                                    <p className="text-sm font-semibold text-white/70">
                                        Audio Sermon
                                    </p>
                                </div>
                            </div>
                        )
                    ) : mediaError ? (
                        /* ERROR STATE */
                        <div className="flex h-full items-center justify-center bg-black px-6 text-center">
                            <div>

                                <i className="fa-solid fa-circle-exclamation mb-4 text-4xl text-[#9188ff]" />

                                <h2 className="text-xl font-bold text-white">
                                    Unable to load this media
                                </h2>

                                <p className="mt-2 text-sm text-[#9ca3af]">
                                    The sermon media could
                                    not be loaded. Please
                                    try again later.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMediaError(
                                            false
                                        )
                                    }
                                    className="mt-6 rounded-xl bg-[#7c6cff] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#9188ff]"
                                >
                                    Try Again
                                </button>

                            </div>
                        </div>
                    ) : (
                        /* MEDIA COMING SOON */
                        <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#101112]">

                            {selectedSermon.thumbnail && (
                                <img
                                    src={
                                        selectedSermon.thumbnail
                                    }
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover opacity-20 blur-2xl"
                                />
                            )}

                            <div className="relative z-10 px-6 text-center">

                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#7c6cff] text-2xl text-white shadow-xl">

                                    <i
                                        className={
                                            selectedSermon.type ===
                                                "audio"
                                                ? "fa-solid fa-headphones"
                                                : "fa-solid fa-play"
                                        }
                                    />

                                </div>

                                <p className="text-sm font-medium text-white sm:text-base">
                                    Media coming soon
                                </p>

                            </div>
                        </div>
                    )}

                    {/* PLAYER OVERLAY */}
                    <div
                        className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 ${isPlaying
                            ? "opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
                            : "pointer-events-auto opacity-100"
                            }`}
                    >

                        {/* TOP INFORMATION */}
                        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent px-5 pb-20 pt-6 sm:px-8 sm:pt-8">

                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9188ff]">
                                {selectedSermon.category}
                            </p>

                            <h1 className="mt-2 max-w-4xl text-xl font-black leading-tight text-white sm:text-2xl lg:text-3xl">
                                {selectedSermon.title}
                            </h1>

                            <p className="mt-1 text-sm text-white/70">
                                {selectedSermon.speaker}
                            </p>

                        </div>

                        {/* BOTTOM CONTROLS */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent px-5 pb-5 pt-24 sm:px-8 sm:pb-7">

                            <div className="flex items-center justify-between gap-4">

                                {/* PLAY / PAUSE */}
                                <button
                                    type="button"
                                    onClick={
                                        handlePlayPause
                                    }
                                    disabled={
                                        !mediaUrl ||
                                        mediaError
                                    }
                                    className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#7c6cff] shadow-lg transition hover:scale-105 hover:bg-[#9188ff] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label={
                                        isPlaying
                                            ? "Pause sermon"
                                            : "Play sermon"
                                    }
                                >
                                    <i
                                        className={
                                            isPlaying
                                                ? "fa-solid fa-pause"
                                                : "fa-solid fa-play"
                                        }
                                    />
                                </button>

                                {/* ACTION BUTTONS */}
                                <div className="flex items-center gap-2">

                                    {/* DOWNLOAD */}
                                    {mediaUrl &&
                                        !mediaError ? (
                                        <button
                                            type="button"
                                            onClick={
                                                handleDownload
                                            }
                                            className="pointer-events-auto inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-[#7c6cff]"
                                        >
                                            <i className="fa-solid fa-download" />
                                            <span>
                                                Download
                                            </span>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled
                                            className="pointer-events-auto inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white/40"
                                        >
                                            <i className="fa-solid fa-download" />
                                            <span>
                                                Download
                                            </span>
                                        </button>
                                    )}

                                    {/* SHARE */}
                                    <button
                                        type="button"
                                        onClick={
                                            handleShare
                                        }
                                        className="pointer-events-auto inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-[#7c6cff]"
                                    >
                                        <i className="fa-solid fa-share-nodes" />
                                        <span>
                                            Share
                                        </span>
                                    </button>

                                    {/* DOWNLOAD MESSAGE */}
                                    {downloadMessage && (
                                        <span className="pointer-events-auto rounded-lg bg-black/70 px-3 py-2 text-xs font-semibold text-green-400 backdrop-blur-md">
                                            {
                                                downloadMessage
                                            }
                                        </span>
                                    )}

                                    {/* SHARE MESSAGE */}
                                    {shareMessage && (
                                        <span className="pointer-events-auto rounded-lg bg-black/70 px-3 py-2 text-xs font-semibold text-green-400 backdrop-blur-md">
                                            {shareMessage}
                                        </span>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RELATED SERMONS */}
                {relatedSermons.length > 0 && (
                    <section className="mt-10">

                        <div className="mb-5">

                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9188ff]">
                                Continue Watching
                            </p>

                            <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                                Related Sermons
                            </h2>

                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                            {relatedSermons.map(
                                (sermon) => (
                                    <SermonCard
                                        key={sermon.id}
                                        sermon={sermon}
                                    />
                                )
                            )}

                        </div>
                    </section>
                )}

            </div>
        </section>
    );
}

export default SermonPlayer;