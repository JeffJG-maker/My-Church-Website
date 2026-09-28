import { useRef, useState } from "react";

import SermonHeader from "./components/SermonHeader";
import SermonSidebar from "./components/SermonSidebar";
import sermons from "./data/sermons";

function AllSermons() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedType, setSelectedType] = useState("All");
    const [selectedSermon, setSelectedSermon] = useState(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            sermon.type.toLowerCase() === selectedType.toLowerCase();

        return categoryMatch && typeMatch;
    });

    /*
     * RELATED SERMONS
     * ----------------
     * Show sermons from the same category as the
     * currently selected sermon, while excluding
     * the sermon currently being viewed.
     *
     * If there are not enough sermons in the same
     * category, fill the remaining spaces with
     * other sermons.
     */
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

    const handleSearchSelect = (sermon) => {
        setSelectedSermon(sermon);
        setIsPlaying(false);
        setIsMobileMenuOpen(false);
    };

    const handleSermonClick = (sermon) => {
        setSelectedSermon(sermon);
        setIsPlaying(false);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleBackToSermons = () => {
        setSelectedSermon(null);
        setIsPlaying(false);
    };

    const handlePlayPause = () => {
        if (!mediaRef.current || !selectedSermon?.mediaUrl) {
            return;
        }

        if (mediaRef.current.paused) {
            mediaRef.current.play();
            setIsPlaying(true);
        } else {
            mediaRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleMediaEnded = () => {
        setIsPlaying(false);
    };

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen((current) => !current);
    };

    const handleMobileMenuClose = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-500 dark:bg-[#0c0c19] dark:text-white">

            <SermonHeader
                onSearchSelect={handleSearchSelect}
                onMenuClick={handleMobileMenuToggle}
            />

            {/* Desktop Sidebar */}
            <SermonSidebar />

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
                    onClick={handleMobileMenuClose}
                >
                    <div
                        className="h-full"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <SermonSidebar
                            mobile
                            onClose={handleMobileMenuClose}
                        />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="lg:pl-64">

                {selectedSermon ? (

                    /* =========================
                       SERMON DETAILS
                    ========================= */
                    <section className="min-h-[calc(100vh-5rem)] px-5 py-8 sm:px-8 lg:px-10">

                        <div className="mx-auto max-w-6xl">

                            <button
                                type="button"
                                onClick={handleBackToSermons}
                                className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#0d0761] dark:text-gray-400 dark:hover:text-white"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                Back to Sermons
                            </button>

                            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-[#333344] dark:bg-[#131323]">

                                {/* Media */}
                                <div className="relative aspect-video w-full bg-black">

                                    {selectedSermon.mediaUrl ? (
                                        selectedSermon.type === "audio" ? (
                                            <div className="flex h-full items-center justify-center p-8">
                                                <audio
                                                    ref={mediaRef}
                                                    src={selectedSermon.mediaUrl}
                                                    controls
                                                    onPlay={() =>
                                                        setIsPlaying(true)
                                                    }
                                                    onPause={() =>
                                                        setIsPlaying(false)
                                                    }
                                                    onEnded={handleMediaEnded}
                                                    className="w-full max-w-2xl"
                                                />
                                            </div>
                                        ) : (
                                            <video
                                                ref={mediaRef}
                                                src={selectedSermon.mediaUrl}
                                                controls
                                                onPlay={() =>
                                                    setIsPlaying(true)
                                                }
                                                onPause={() =>
                                                    setIsPlaying(false)
                                                }
                                                onEnded={handleMediaEnded}
                                                className="h-full w-full object-contain"
                                            />
                                        )
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">

                                            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                                                <i className="fa-solid fa-play text-2xl"></i>
                                            </div>

                                            <h2 className="text-lg font-semibold">
                                                Media coming soon
                                            </h2>

                                            <p className="mt-2 max-w-md text-sm text-white/60">
                                                The sermon media has not been uploaded yet.
                                            </p>

                                        </div>
                                    )}

                                </div>

                                {/* Details */}
                                <div className="p-6 sm:p-8">

                                    <div className="flex flex-wrap items-center gap-2">

                                        <span className="rounded-full bg-[#0d0761]/10 px-3 py-1 text-xs font-semibold text-[#0d0761] dark:bg-white/10 dark:text-white">
                                            {selectedSermon.category}
                                        </span>

                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-[#2b2b46] dark:text-gray-300">
                                            {selectedSermon.type}
                                        </span>

                                    </div>

                                    <h1 className="mt-4 text-2xl font-bold text-[#0d0761] sm:text-3xl dark:text-white">
                                        {selectedSermon.title}
                                    </h1>

                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        {selectedSermon.speaker}
                                    </p>

                                    <p className="mt-6 max-w-3xl text-sm leading-7 text-gray-600 dark:text-gray-300">
                                        {selectedSermon.description}
                                    </p>

                                    <div className="mt-8 flex flex-wrap gap-3">

                                        <button
                                            type="button"
                                            onClick={handlePlayPause}
                                            disabled={!selectedSermon.mediaUrl}
                                            className="flex items-center gap-2 rounded-xl bg-[#0d0761] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17106f] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <i
                                                className={`fa-solid ${isPlaying
                                                        ? "fa-pause"
                                                        : "fa-play"
                                                    }`}
                                            ></i>

                                            {isPlaying
                                                ? "Pause"
                                                : "Play"}
                                        </button>

                                        <a
                                            href={
                                                selectedSermon.mediaUrl ||
                                                undefined
                                            }
                                            download
                                            onClick={(event) => {
                                                if (
                                                    !selectedSermon.mediaUrl
                                                ) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-[#333344] dark:text-gray-300 dark:hover:bg-[#2b2b46]"
                                        >
                                            <i className="fa-solid fa-download"></i>

                                            Download{" "}
                                            {selectedSermon.type === "audio"
                                                ? "Audio"
                                                : "Video"}
                                        </a>

                                    </div>

                                </div>

                            </div>

                            {/* =========================
                               RELATED SERMONS
                            ========================= */}
                            {relatedSermons.length > 0 && (
                                <section className="mt-10">

                                    <div className="mb-5">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Continue Watching
                                        </p>

                                        <h2 className="mt-2 text-2xl font-bold text-[#0d0761] dark:text-white">
                                            Related Sermons
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            More sermons you may be interested in.
                                        </p>
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                                        {relatedSermons.map((sermon) => (
                                            <button
                                                key={sermon.id}
                                                type="button"
                                                onClick={() =>
                                                    handleSermonClick(sermon)
                                                }
                                                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-[#333344] dark:bg-[#131323]"
                                            >

                                                {/* Thumbnail */}
                                                <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-[#2b2b46]">

                                                    <img
                                                        src={sermon.thumbnail}
                                                        alt={sermon.title}
                                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                    />

                                                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20"></div>

                                                    <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0d0761] shadow-lg transition group-hover:scale-110">
                                                        <i className="fa-solid fa-play text-sm"></i>
                                                    </div>

                                                </div>

                                                {/* Card Details */}
                                                <div className="p-5">

                                                    <div className="flex items-center justify-between gap-3">

                                                        <span className="text-xs font-semibold text-[#0d0761] dark:text-gray-300">
                                                            {sermon.category}
                                                        </span>

                                                        <span className="text-xs capitalize text-gray-400">
                                                            {sermon.type}
                                                        </span>

                                                    </div>

                                                    <h3 className="mt-3 line-clamp-2 text-base font-bold leading-6 text-gray-900 dark:text-white">
                                                        {sermon.title}
                                                    </h3>

                                                    <p className="mt-2 truncate text-xs text-gray-500 dark:text-gray-400">
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

                    /* =========================
                       SERMON LIST
                    ========================= */
                    <section className="min-h-[calc(100vh-5rem)] px-5 py-8 sm:px-8 lg:px-10">

                        <div className="mx-auto max-w-7xl">

                            <div className="mb-8">

                                <p className="text-sm font-semibold text-[#0d0761] dark:text-gray-300">
                                    Sermon Library
                                </p>

                                <h1 className="mt-2 text-3xl font-bold text-[#0d0761] dark:text-white sm:text-4xl">
                                    All Sermons
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                                    Explore sermons, teachings and messages from Living Faith Church Iguosa.
                                </p>

                            </div>

                            {/* Filters */}
                            <div className="mb-8 space-y-5">

                                <div>
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Categories
                                    </p>

                                    <div className="flex flex-wrap gap-2">

                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedCategory(
                                                        category
                                                    )
                                                }
                                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedCategory ===
                                                        category
                                                        ? "bg-[#0d0761] text-white"
                                                        : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-[#131323] dark:text-gray-300 dark:hover:bg-[#2b2b46]"
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}

                                    </div>
                                </div>

                                <div>
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Media Type
                                    </p>

                                    <div className="flex flex-wrap gap-2">

                                        {mediaTypes.map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedType(type)
                                                }
                                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedType === type
                                                        ? "bg-[#0d0761] text-white"
                                                        : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-[#131323] dark:text-gray-300 dark:hover:bg-[#2b2b46]"
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}

                                    </div>
                                </div>

                            </div>

                            {/* Sermon Cards */}
                            {filteredSermons.length > 0 ? (

                                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                                    {filteredSermons.map((sermon) => (
                                        <button
                                            key={sermon.id}
                                            type="button"
                                            onClick={() =>
                                                handleSermonClick(sermon)
                                            }
                                            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-[#333344] dark:bg-[#131323]"
                                        >

                                            <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-[#2b2b46]">

                                                <img
                                                    src={sermon.thumbnail}
                                                    alt={sermon.title}
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />

                                                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20"></div>

                                                <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0d0761] shadow-lg transition group-hover:scale-110">
                                                    <i className="fa-solid fa-play text-sm"></i>
                                                </div>

                                            </div>

                                            <div className="p-5">

                                                <div className="flex items-center justify-between gap-3">

                                                    <span className="text-xs font-semibold text-[#0d0761] dark:text-gray-300">
                                                        {sermon.category}
                                                    </span>

                                                    <span className="text-xs capitalize text-gray-400">
                                                        {sermon.type}
                                                    </span>

                                                </div>

                                                <h2 className="mt-3 line-clamp-2 text-base font-bold leading-6 text-gray-900 dark:text-white">
                                                    {sermon.title}
                                                </h2>

                                                <p className="mt-2 truncate text-xs text-gray-500 dark:text-gray-400">
                                                    {sermon.speaker}
                                                </p>

                                            </div>

                                        </button>
                                    ))}

                                </div>

                            ) : (

                                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-[#333344] dark:bg-[#131323]">

                                    <i className="fa-solid fa-magnifying-glass text-2xl text-gray-400"></i>

                                    <h2 className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                                        No sermons found
                                    </h2>

                                    <p className="mt-2 text-sm text-gray-400">
                                        Try changing your category or media filter.
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