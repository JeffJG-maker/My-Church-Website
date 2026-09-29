import { useEffect, useRef, useState } from "react";
import SermonHeader from "./components/SermonHeader";
import SermonSidebar from "./components/SermonSidebar";
import sermons from "./data/sermons";

function AllSermons() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedType, setSelectedType] = useState("All");
    const [selectedSermon, setSelectedSermon] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [shareMessage, setShareMessage] = useState("");

    const mediaRef = useRef(null);

    const categories = [
        "All",
        ...new Set(sermons.map((sermon) => sermon.category)),
    ];

    const mediaTypes = ["All", "Video", "Audio"];

    const filteredSermons = sermons.filter((sermon) => {
        const categoryMatch =
            selectedCategory === "All" ||
            sermon.category === selectedCategory;

        const typeMatch =
            selectedType === "All" ||
            sermon.type === selectedType.toLowerCase();

        return categoryMatch && typeMatch;
    });

    const relatedSermons = selectedSermon
        ? [
            ...sermons.filter(
                (sermon) =>
                    sermon.id !== selectedSermon.id &&
                    sermon.category === selectedSermon.category
            ),
            ...sermons.filter(
                (sermon) =>
                    sermon.id !== selectedSermon.id &&
                    sermon.category !== selectedSermon.category
            ),
        ].slice(0, 3)
        : [];

    /*
     * Read a sermon ID from the URL.
     *
     * Example:
     * /sermons?sermon=2
     *
     * When the page loads, we find sermon ID 2
     * and automatically open that sermon.
     */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sermonId = Number(params.get("sermon"));

        if (!sermonId) {
            return;
        }

        const sermonFromUrl = sermons.find(
            (sermon) => sermon.id === sermonId
        );

        if (sermonFromUrl) {
            setSelectedSermon(sermonFromUrl);
            setIsPlaying(false);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, []);

    const handleSearchSelect = (sermon) => {
        setSelectedSermon(sermon);
        setIsPlaying(false);

        window.history.replaceState(
            {},
            "",
            `/sermons?sermon=${sermon.id}`
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleSermonClick = (sermon) => {
        setSelectedSermon(sermon);
        setIsPlaying(false);

        window.history.replaceState(
            {},
            "",
            `/sermons?sermon=${sermon.id}`
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleBackToSermons = () => {
        setSelectedSermon(null);
        setIsPlaying(false);

        window.history.replaceState({}, "", "/sermons");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handlePlayPause = () => {
        if (!mediaRef.current || !selectedSermon?.mediaUrl) {
            return;
        }

        if (isPlaying) {
            mediaRef.current.pause();
            setIsPlaying(false);
        } else {
            mediaRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleMediaEnded = () => {
        setIsPlaying(false);
    };

    const handleShare = async () => {
        if (!selectedSermon) {
            return;
        }

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

            setShareMessage("Sermon link copied!");

            setTimeout(() => {
                setShareMessage("");
            }, 2500);
        } catch (error) {
            if (error.name === "AbortError") {
                return;
            }

            try {
                await navigator.clipboard.writeText(shareUrl);

                setShareMessage("Sermon link copied!");

                setTimeout(() => {
                    setShareMessage("");
                }, 2500);
            } catch {
                setShareMessage("Unable to share sermon.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-500 dark:bg-[#0b0b19] dark:text-white">
            <SermonHeader
                onSearchSelect={handleSearchSelect}
                onMenuClick={() => setIsMobileMenuOpen(true)}
            />

            <SermonSidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
            />

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    <div className="relative z-10 h-full">
                        <SermonSidebar
                            mobile
                            onClose={() => setIsMobileMenuOpen(false)}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            selectedType={selectedType}
                            setSelectedType={setSelectedType}
                        />
                    </div>
                </div>
            )}

            <main className="lg:ml-72">
                {selectedSermon ? (
                    <section className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
                        <div className="mx-auto max-w-6xl">
                            {/* Back button */}
                            <button
                                onClick={handleBackToSermons}
                                className="mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:-translate-x-1 hover:border-[#f7b731] hover:text-[#f7b731] dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                            >
                                <i className="fa-solid fa-arrow-left" />
                                Back to Sermons
                            </button>

                            {/* Player */}
                            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#121222]">
                                <div className="relative aspect-video overflow-hidden bg-black">
                                    {selectedSermon.mediaUrl ? (
                                        selectedSermon.type === "video" ? (
                                            <video
                                                ref={mediaRef}
                                                src={selectedSermon.mediaUrl}
                                                poster={selectedSermon.thumbnail}
                                                controls
                                                className="h-full w-full object-contain"
                                                onPlay={() =>
                                                    setIsPlaying(true)
                                                }
                                                onPause={() =>
                                                    setIsPlaying(false)
                                                }
                                                onEnded={handleMediaEnded}
                                            />
                                        ) : (
                                            <div className="relative flex h-full items-center justify-center overflow-hidden">
                                                <img
                                                    src={
                                                        selectedSermon.thumbnail
                                                    }
                                                    alt={selectedSermon.title}
                                                    className="absolute inset-0 h-full w-full object-cover opacity-30 blur-xl"
                                                />

                                                <div className="relative z-10 flex w-full max-w-xl flex-col items-center px-6 text-center">
                                                    <img
                                                        src={
                                                            selectedSermon.thumbnail
                                                        }
                                                        alt={
                                                            selectedSermon.title
                                                        }
                                                        className="mb-6 h-40 w-40 rounded-2xl object-cover shadow-2xl sm:h-48 sm:w-48"
                                                    />

                                                    <audio
                                                        ref={mediaRef}
                                                        src={
                                                            selectedSermon.mediaUrl
                                                        }
                                                        controls
                                                        className="w-full"
                                                        onPlay={() =>
                                                            setIsPlaying(true)
                                                        }
                                                        onPause={() =>
                                                            setIsPlaying(false)
                                                        }
                                                        onEnded={
                                                            handleMediaEnded
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <>
                                            <img
                                                src={selectedSermon.thumbnail}
                                                alt={selectedSermon.title}
                                                className="h-full w-full object-cover"
                                            />

                                            <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                                                <div className="px-6 text-center text-white">
                                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f7b731] text-2xl text-[#0b0b25] shadow-xl">
                                                        <i
                                                            className={
                                                                selectedSermon.type ===
                                                                    "audio"
                                                                    ? "fa-solid fa-headphones"
                                                                    : "fa-solid fa-play"
                                                            }
                                                        />
                                                    </div>

                                                    <p className="text-sm font-medium sm:text-base">
                                                        Media coming soon
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Sermon information */}
                                <div className="p-5 sm:p-7 lg:p-9">
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-[#f7b731]/15 px-3 py-1 text-xs font-bold text-[#b27a00] dark:text-[#f7b731]">
                                            {selectedSermon.category}
                                        </span>

                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase text-gray-600 dark:bg-white/10 dark:text-gray-300">
                                            {selectedSermon.type}
                                        </span>
                                    </div>

                                    <h1 className="text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
                                        {selectedSermon.title}
                                    </h1>

                                    <div className="mt-4 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7b731]/15 text-[#b27a00] dark:text-[#f7b731]">
                                            <i className="fa-solid fa-user" />
                                        </div>

                                        <span>
                                            {selectedSermon.speaker}
                                        </span>
                                    </div>

                                    <p className="mt-6 max-w-4xl text-sm leading-7 text-gray-600 dark:text-gray-300 sm:text-base">
                                        {selectedSermon.description}
                                    </p>

                                    {/* Action buttons */}
                                    <div className="mt-7 flex flex-wrap items-center gap-3">
                                        <button
                                            onClick={handlePlayPause}
                                            disabled={
                                                !selectedSermon.mediaUrl
                                            }
                                            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${selectedSermon.mediaUrl
                                                    ? "bg-[#f7b731] text-[#0b0b25] hover:-translate-y-0.5 hover:shadow-lg"
                                                    : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-white/10 dark:text-gray-500"
                                                }`}
                                        >
                                            <i
                                                className={
                                                    isPlaying
                                                        ? "fa-solid fa-pause"
                                                        : "fa-solid fa-play"
                                                }
                                            />
                                            {isPlaying ? "Pause" : "Play"}
                                        </button>

                                        {selectedSermon.mediaUrl ? (
                                            <a
                                                href={
                                                    selectedSermon.mediaUrl
                                                }
                                                download
                                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:-translate-y-0.5 hover:border-[#f7b731] hover:text-[#b27a00] dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:text-[#f7b731]"
                                            >
                                                <i className="fa-solid fa-download" />
                                                Download{" "}
                                                {selectedSermon.type ===
                                                    "video"
                                                    ? "Video"
                                                    : "Audio"}
                                            </a>
                                        ) : (
                                            <button
                                                disabled
                                                className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-5 py-3 text-sm font-bold text-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-gray-500"
                                            >
                                                <i className="fa-solid fa-download" />
                                                Download{" "}
                                                {selectedSermon.type ===
                                                    "video"
                                                    ? "Video"
                                                    : "Audio"}
                                            </button>
                                        )}

                                        <button
                                            onClick={handleShare}
                                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:-translate-y-0.5 hover:border-[#f7b731] hover:text-[#b27a00] dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:text-[#f7b731]"
                                        >
                                            <i className="fa-solid fa-share-nodes" />
                                            Share
                                        </button>

                                        {shareMessage && (
                                            <span className="flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400">
                                                <i className="fa-solid fa-circle-check" />
                                                {shareMessage}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Related sermons */}
                            {relatedSermons.length > 0 && (
                                <section className="mt-10">
                                    <div className="mb-5">
                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b27a00] dark:text-[#f7b731]">
                                            Continue Watching
                                        </p>

                                        <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                                            Related Sermons
                                        </h2>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                        {relatedSermons.map((sermon) => (
                                            <button
                                                key={sermon.id}
                                                onClick={() =>
                                                    handleSermonClick(sermon)
                                                }
                                                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#121222]"
                                            >
                                                <div className="relative aspect-video overflow-hidden">
                                                    <img
                                                        src={sermon.thumbnail}
                                                        alt={sermon.title}
                                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                    />

                                                    <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/30" />

                                                    <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f7b731] text-[#0b0b25] shadow-lg">
                                                        <i className="fa-solid fa-play text-sm" />
                                                    </div>
                                                </div>

                                                <div className="p-4">
                                                    <span className="text-xs font-bold text-[#b27a00] dark:text-[#f7b731]">
                                                        {sermon.category}
                                                    </span>

                                                    <h3 className="mt-1 line-clamp-2 text-base font-bold leading-6">
                                                        {sermon.title}
                                                    </h3>

                                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                        {sermon.speaker}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </section>
                ) : (
                    <section className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
                        <div className="mx-auto max-w-7xl">
                            {/* Page heading */}
                            <div className="mb-8">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b27a00] dark:text-[#f7b731]">
                                    Living Faith Church Iguosa
                                </p>

                                <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                                    All Sermons
                                </h1>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
                                    Explore messages that will strengthen your
                                    faith, deepen your understanding of God's
                                    Word, and encourage your walk with Christ.
                                </p>
                            </div>

                            {/* Filters */}
                            <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#121222] sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                                        Categories
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() =>
                                                    setSelectedCategory(
                                                        category
                                                    )
                                                }
                                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory ===
                                                        category
                                                        ? "bg-[#f7b731] text-[#0b0b25] shadow-md"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                                        Media Type
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {mediaTypes.map((type) => (
                                            <button
                                                key={type}
                                                onClick={() =>
                                                    setSelectedType(type)
                                                }
                                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedType === type
                                                        ? "bg-[#f7b731] text-[#0b0b25] shadow-md"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sermon count */}
                            <div className="mb-5 flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                    {filteredSermons.length}{" "}
                                    {filteredSermons.length === 1
                                        ? "sermon"
                                        : "sermons"}{" "}
                                    available
                                </p>
                            </div>

                            {/* Sermon cards */}
                            {filteredSermons.length > 0 ? (
                                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {filteredSermons.map((sermon) => (
                                        <button
                                            key={sermon.id}
                                            onClick={() =>
                                                handleSermonClick(sermon)
                                            }
                                            className="group overflow-hidden rounded-3xl border border-gray-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-[#121222]"
                                        >
                                            <div className="relative aspect-video overflow-hidden">
                                                <img
                                                    src={sermon.thumbnail}
                                                    alt={sermon.title}
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                                <div className="absolute left-4 top-4">
                                                    <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                                                        {sermon.category}
                                                    </span>
                                                </div>

                                                <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f7b731] text-[#0b0b25] shadow-xl transition duration-300 group-hover:scale-110">
                                                    <i
                                                        className={
                                                            sermon.type ===
                                                                "audio"
                                                                ? "fa-solid fa-headphones"
                                                                : "fa-solid fa-play"
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <h2 className="line-clamp-2 text-lg font-black leading-7">
                                                    {sermon.title}
                                                </h2>

                                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <i className="fa-solid fa-user text-xs" />
                                                    <span>
                                                        {sermon.speaker}
                                                    </span>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-white/10">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                                        {sermon.type}
                                                    </span>

                                                    <span className="inline-flex items-center gap-1 text-sm font-bold text-[#b27a00] transition group-hover:gap-2 dark:text-[#f7b731]">
                                                        View Sermon
                                                        <i className="fa-solid fa-arrow-right text-xs" />
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-[#121222]">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/5">
                                        <i className="fa-solid fa-video-slash text-xl" />
                                    </div>

                                    <h2 className="mt-5 text-xl font-bold">
                                        No sermons found
                                    </h2>

                                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                                        Try selecting a different category or
                                        media type.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

export default AllSermons;