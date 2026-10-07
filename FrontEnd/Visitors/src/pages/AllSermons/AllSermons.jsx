import { useEffect, useMemo, useRef, useState } from "react";

import SermonHeader from "./components/SermonHeader";
import SermonSidebar from "./components/SermonSidebar";
import SermonPlayer from "./components/SermonPlayer";

function AllSermons() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedType, setSelectedType] = useState("All");
    const [selectedSermon, setSelectedSermon] = useState(null);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [sermons, setSermons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");

    const [showAllCategories, setShowAllCategories] =
        useState(false);

    const categoryScrollRef = useRef(null);

    /* =========================
       FETCH SERMONS
    ========================= */

    const fetchSermons = async () => {
        try {
            setIsLoading(true);
            setFetchError("");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/sermons`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch sermons");
            }

            const data = await response.json();

            setSermons(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Sermon fetch error:", error);

            setFetchError(
                "Unable to load sermons right now. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSermons();
    }, []);

    /* =========================
       CATEGORIES & FILTERS
    ========================= */

    const categories = useMemo(() => {
        return [
            "All",
            ...new Set(
                sermons
                    .map((sermon) => sermon.category)
                    .filter(Boolean)
            ),
        ];
    }, [sermons]);

    const mediaTypes = ["All", "Video", "Audio"];

    const filteredSermons = useMemo(() => {
        return sermons.filter((sermon) => {
            const categoryMatch =
                selectedCategory === "All" ||
                sermon.category === selectedCategory;

            const typeMatch =
                selectedType === "All" ||
                sermon.type === selectedType.toLowerCase();

            return categoryMatch && typeMatch;
        });
    }, [sermons, selectedCategory, selectedType]);

    const visibleCategories = categories.slice(0, 4);
    const extraCategories = categories.slice(4);

    /* =========================
       SERMON SECTIONS
    ========================= */

    const latestSermons = filteredSermons.slice(0, 8);

    const popularSermons = [...filteredSermons]
        .reverse()
        .slice(0, 6);

    const categorySermons = (category, limit = 8) => {
        return filteredSermons
            .filter(
                (sermon) =>
                    sermon.category === category
            )
            .slice(0, limit);
    };

    const prayerSermons = categorySermons("Prayer");
    const faithSermons = categorySermons("Faith");
    const wisdomSermons = categorySermons("Wisdom");
    const consecrationSermons = categorySermons("Consecration");

    /* =========================
       FEATURED SERMONS
    ========================= */

    const featuredSermon =
        filteredSermons[0] ||
        sermons[0] ||
        null;

    const featuredSecondarySermons =
        filteredSermons
            .filter(
                (sermon) =>
                    sermon.id !==
                    featuredSermon?.id
            )
            .slice(0, 2);

    /* =========================
       RELATED SERMONS
    ========================= */

    const relatedSermons = selectedSermon
        ? [
            ...sermons.filter(
                (sermon) =>
                    sermon.id !==
                    selectedSermon.id &&
                    sermon.category ===
                    selectedSermon.category
            ),

            ...sermons.filter(
                (sermon) =>
                    sermon.id !==
                    selectedSermon.id &&
                    sermon.category !==
                    selectedSermon.category
            ),
        ].slice(0, 3)
        : [];

    /* =========================
       URL SERMON
    ========================= */

    const getSermonFromUrl = () => {
        const params = new URLSearchParams(
            window.location.search
        );

        const sermonId = Number(
            params.get("sermon")
        );

        if (!sermonId) {
            return null;
        }

        return (
            sermons.find(
                (sermon) =>
                    sermon.id === sermonId
            ) || null
        );
    };

    useEffect(() => {
        if (
            isLoading ||
            sermons.length === 0
        ) {
            return;
        }

        const sermonFromUrl =
            getSermonFromUrl();

        if (sermonFromUrl) {
            setSelectedSermon(
                sermonFromUrl
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, [sermons, isLoading]);

    useEffect(() => {
        const handlePopState = () => {
            const sermonFromUrl =
                getSermonFromUrl();

            setSelectedSermon(
                sermonFromUrl
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };

        window.addEventListener(
            "popstate",
            handlePopState
        );

        return () => {
            window.removeEventListener(
                "popstate",
                handlePopState
            );
        };
    }, [sermons]);

    /* =========================
       OPEN SERMON
    ========================= */

    const handleSearchSelect = (sermon) => {
        handleSermonClick(sermon);
    };

    const handleSermonClick = (sermon) => {
        if (!sermon) {
            return;
        }

        setSelectedSermon(sermon);

        window.history.pushState(
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

        window.history.replaceState(
            {},
            "",
            "/sermons"
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /* =========================
       CATEGORY CONTROLS
    ========================= */

    const handleShowMoreCategories = () => {
        setShowAllCategories(true);

        setTimeout(() => {
            categoryScrollRef.current?.scrollTo({
                left: 0,
                behavior: "smooth",
            });
        }, 50);
    };

    const handleShowLessCategories = () => {
        setShowAllCategories(false);

        categoryScrollRef.current?.scrollTo({
            left: 0,
            behavior: "smooth",
        });
    };

    const slideCategories = (direction) => {
        if (!categoryScrollRef.current) {
            return;
        }

        categoryScrollRef.current.scrollBy({
            left:
                direction === "left"
                    ? -320
                    : 320,
            behavior: "smooth",
        });
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);

        if (category === "All") {
            setSelectedType("All");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleLatestSermons = () => {
        setSelectedCategory("All");
        setSelectedType("All");

        setTimeout(() => {
            document.getElementById("latest-sermons")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 50);
    };

    const handlePopularSermons = () => {
        setSelectedCategory("All");
        setSelectedType("All");

        setTimeout(() => {
            document.getElementById("popular-sermons")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 50);
    };

    /* =========================
       SERMON CARD
       CLEAN SINGLE-LAYER DESIGN
    ========================= */

    const SermonCard = ({
        sermon,
        compact = false,
    }) => {
        if (!sermon) {
            return null;
        }

        return (
            <button
                type="button"
                onClick={() =>
                    handleSermonClick(sermon)
                }
                className="group relative w-full overflow-hidden rounded-2xl bg-[#181a1d] text-left transition duration-300 hover:-translate-y-1 hover:bg-[#202226] hover:shadow-xl hover:shadow-black/20"
            >
                {/* THUMBNAIL */}

                <div className="relative aspect-[4/3] overflow-hidden">
                    {sermon.thumbnail ? (
                        <img
                            src={sermon.thumbnail}
                            alt={sermon.title}
                            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#141618]">
                            <i className="fa-solid fa-video text-3xl text-[#7c6cff]" />
                        </div>
                    )}

                    {/* GRADIENT */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

                    {/* TYPE */}

                    <div className="absolute left-3 top-3">
                        <span className="rounded-lg bg-black/70 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
                            {sermon.type || "Video"}
                        </span>
                    </div>

                    {/* DURATION */}

                    {sermon.duration && (
                        <div className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                            {sermon.duration}
                        </div>
                    )}

                    {/* TEXT OVERLAY */}

                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <div className="flex items-center gap-2 text-[11px] font-semibold">
                            <span className="text-[#9188ff]">
                                {sermon.category}
                            </span>

                            {sermon.date && (
                                <>
                                    <span className="text-white/40">
                                        •
                                    </span>

                                    <span className="text-white/60">
                                        {sermon.date}
                                    </span>
                                </>
                            )}
                        </div>

                        <h3
                            className={`mt-1.5 font-bold leading-5 text-white ${compact
                                ? "line-clamp-2 text-sm"
                                : "line-clamp-2 text-base sm:text-lg"
                                }`}
                        >
                            {sermon.title}
                        </h3>

                        <div className="mt-2 flex items-center gap-2 text-xs text-white/70">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#9188ff] backdrop-blur-sm">
                                <i className="fa-solid fa-user text-[9px]" />
                            </span>

                            <span className="truncate">
                                {sermon.speaker}
                            </span>
                        </div>
                    </div>
                </div>
            </button>
        );
    };

    /* =========================
       SECTION COMPONENT
    ========================= */

    const SermonSection = ({
        sectionId,
        title,
        subtitle,
        items,
        columns = 4,
        category,
    }) => {
        if (!items.length) {
            return null;
        }

        const gridClass =
            columns === 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

        return (
            <section className="mt-12">
                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="h-6 w-1 rounded-full bg-[#7c6cff]" />

                            <h2 className="text-xl font-black text-white sm:text-2xl">
                                {title}
                            </h2>
                        </div>

                        {subtitle && (
                            <p className="mt-2 text-sm text-[#9ca3af]">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {category && (
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedCategory(
                                    category
                                );

                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                });
                            }}
                            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-[#9ca3af] transition hover:bg-[#181a1d] hover:text-[#9188ff] sm:inline-flex"
                        >
                            View all
                            <i className="fa-solid fa-arrow-right" />
                        </button>
                    )}
                </div>

                <div
                    className={`grid gap-5 ${gridClass}`}
                >
                    {items.map((sermon) => (
                        <SermonCard
                            key={sermon.id}
                            sermon={sermon}
                        />
                    ))}
                </div>
            </section>
        );
    };

    /* =========================
       MAIN
    ========================= */

    return (
        <div className="min-h-screen bg-[#101112] text-white">
            <SermonHeader
                onSearchSelect={
                    handleSearchSelect
                }
                onMenuClick={() =>
                    setIsMobileMenuOpen(true)
                }
            />

            {/* DESKTOP SIDEBAR */}

            <SermonSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                onLatestClick={() => {
                    setSelectedCategory("All");
                    setSelectedType("All");
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                    });
                }}
                onPopularClick={() => {
                    setSelectedCategory("All");
                    setSelectedType("All");
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                    });
                }}
            />


            {/* MOBILE SIDEBAR */}

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    <div className="relative z-10 h-full">
                        <SermonSidebar
                            mobile={true}
                            isOpen={isMobileMenuOpen}
                            onClose={() => setIsMobileMenuOpen(false)}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            selectedType={selectedType}
                            setSelectedType={setSelectedType}
                            onLatestClick={() => {
                                setSelectedCategory("All");
                                setSelectedType("All");
                            }}
                            onPopularClick={() => {
                                setSelectedCategory("All");
                                setSelectedType("All");
                            }}
                        />
                    </div>
                </div>
            )}
            {!isSidebarOpen && (
                <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed left-4 top-[92px] z-50 hidden h-10 w-10 items-center justify-center rounded-xl border border-[#27292d] bg-[#181a1d] text-[#9ca3af] shadow-lg transition-all duration-300 hover:bg-[#202226] hover:text-[#9188ff] lg:flex"
                    aria-label="Open sidebar"
                >
                    <i className="fa-solid fa-chevron-right text-xs" />
                </button>
            )}

            <main
                className={`transition-[margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
                    }`}
            >
                {/* =========================
                    SERMON PLAYER
                ========================= */}

                {selectedSermon ? (
                    <SermonPlayer
                        selectedSermon={
                            selectedSermon
                        }
                        onBack={
                            handleBackToSermons
                        }
                        relatedSermons={
                            relatedSermons
                        }
                        SermonCard={
                            SermonCard
                        }
                    />
                ) : (
                    /* =========================
                       SERMON LIBRARY
                    ========================= */

                    <section className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
                        <div className="mx-auto max-w-7xl">
                            {/* INTRO */}

                            <div className="mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="h-8 w-1 rounded-full bg-[#7c6cff]" />

                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9188ff]">
                                            Living Faith Church Iguosa
                                        </p>

                                        <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                                            Sermons
                                        </h1>
                                    </div>
                                </div>

                                <p className="mt-4 max-w-2xl leading-7 text-[#9ca3af]">
                                    Explore messages that
                                    will strengthen your
                                    faith, deepen your
                                    understanding of God's
                                    Word, and encourage
                                    your walk with Christ.
                                </p>
                            </div>

                            {/* CATEGORY NAVIGATION */}

                            <div className="mb-8 rounded-2xl bg-[#141618] p-4 sm:p-5">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-[#6f737a]">
                                                Browse Categories
                                            </p>

                                            <p className="mt-1 text-sm text-[#9ca3af]">
                                                Find messages by topic
                                            </p>
                                        </div>

                                        {extraCategories.length >
                                            0 && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        showAllCategories
                                                            ? handleShowLessCategories
                                                            : handleShowMoreCategories
                                                    }
                                                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#181a1d] px-3 py-2 text-xs font-bold text-[#d1d5db] transition hover:bg-[#202226] hover:text-[#9188ff]"
                                                >
                                                    {showAllCategories
                                                        ? "See Less"
                                                        : "See More"}

                                                    <i
                                                        className={`fa-solid ${showAllCategories
                                                            ? "fa-chevron-up"
                                                            : "fa-chevron-down"
                                                            }`}
                                                    />
                                                </button>
                                            )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {showAllCategories &&
                                            extraCategories.length >
                                            0 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        slideCategories(
                                                            "left"
                                                        )
                                                    }
                                                    className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#181a1d] text-[#9ca3af] transition hover:bg-[#202226] hover:text-[#9188ff] sm:flex"
                                                >
                                                    <i className="fa-solid fa-chevron-left text-xs" />
                                                </button>
                                            )}

                                        <div
                                            ref={
                                                categoryScrollRef
                                            }
                                            className="scrollbar-none flex-1 overflow-x-auto scroll-smooth"
                                            style={{
                                                scrollbarWidth:
                                                    "none",
                                            }}
                                        >
                                            <div className="flex min-w-max items-center gap-2">
                                                {visibleCategories.map(
                                                    (
                                                        category
                                                    ) => (
                                                        <button
                                                            type="button"
                                                            key={
                                                                category
                                                            }
                                                            onClick={() =>
                                                                handleCategoryChange(
                                                                    category
                                                                )
                                                            }
                                                            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${selectedCategory ===
                                                                category
                                                                ? "bg-[#7c6cff] text-white shadow-lg shadow-[#7c6cff]/20"
                                                                : "bg-[#181a1d] text-[#9ca3af] hover:bg-[#27292d] hover:text-white"
                                                                }`}
                                                        >
                                                            {
                                                                category
                                                            }
                                                        </button>
                                                    )
                                                )}

                                                {extraCategories.length >
                                                    0 && (
                                                        <div
                                                            className={`flex items-center gap-2 overflow-hidden transition-all duration-500 ease-out ${showAllCategories
                                                                ? "max-w-[1600px] opacity-100"
                                                                : "max-w-0 opacity-0"
                                                                }`}
                                                        >
                                                            {extraCategories.map(
                                                                (
                                                                    category
                                                                ) => (
                                                                    <button
                                                                        type="button"
                                                                        key={
                                                                            category
                                                                        }
                                                                        onClick={() =>
                                                                            handleCategoryChange(
                                                                                category
                                                                            )
                                                                        }
                                                                        className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${selectedCategory ===
                                                                            category
                                                                            ? "bg-[#7c6cff] text-white"
                                                                            : "bg-[#181a1d] text-[#9ca3af] hover:bg-[#27292d] hover:text-white"
                                                                            }`}
                                                                    >
                                                                        {
                                                                            category
                                                                        }
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        {showAllCategories &&
                                            extraCategories.length >
                                            0 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        slideCategories(
                                                            "right"
                                                        )
                                                    }
                                                    className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#181a1d] text-[#9ca3af] transition hover:bg-[#202226] hover:text-[#9188ff] sm:flex"
                                                >
                                                    <i className="fa-solid fa-chevron-right text-xs" />
                                                </button>
                                            )}
                                    </div>

                                    {/* MEDIA FILTER */}

                                    <div className="pt-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="mr-1 text-xs font-bold uppercase tracking-wider text-[#6f737a]">
                                                Media
                                            </span>

                                            {mediaTypes.map(
                                                (type) => (
                                                    <button
                                                        type="button"
                                                        key={
                                                            type
                                                        }
                                                        onClick={() =>
                                                            setSelectedType(
                                                                type
                                                            )
                                                        }
                                                        className={`rounded-lg px-3 py-2 text-xs font-bold transition ${selectedType ===
                                                            type
                                                            ? "bg-[#7c6cff]/15 text-[#9188ff]"
                                                            : "text-[#9ca3af] hover:bg-[#181a1d] hover:text-white"
                                                            }`}
                                                    >
                                                        <i
                                                            className={`fa-solid mr-2 ${type ===
                                                                "Video"
                                                                ? "fa-video"
                                                                : type ===
                                                                    "Audio"
                                                                    ? "fa-headphones"
                                                                    : "fa-layer-group"
                                                                }`}
                                                        />

                                                        {type}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RESULTS COUNT */}

                            <div className="mb-6 flex items-center justify-between">
                                <p className="text-sm font-semibold text-[#6f737a]">
                                    {isLoading
                                        ? "Loading sermons..."
                                        : `${filteredSermons.length} ${filteredSermons.length ===
                                            1
                                            ? "sermon"
                                            : "sermons"
                                        } available`}
                                </p>
                            </div>

                            {/* LOADING */}

                            {isLoading ? (
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                    {[
                                        1,
                                        2,
                                        3,
                                        4,
                                        5,
                                        6,
                                        7,
                                        8,
                                    ].map(
                                        (
                                            item
                                        ) => (
                                            <div
                                                key={
                                                    item
                                                }
                                                className="overflow-hidden rounded-2xl bg-[#181a1d]"
                                            >
                                                <div className="aspect-[4/3] animate-pulse bg-[#27292d]" />

                                                <div className="space-y-4 p-4">
                                                    <div className="h-3 w-1/3 animate-pulse rounded bg-[#27292d]" />

                                                    <div className="h-5 w-4/5 animate-pulse rounded bg-[#27292d]" />

                                                    <div className="h-3 w-2/5 animate-pulse rounded bg-[#27292d]" />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : fetchError ? (
                                /* ERROR */

                                <div className="rounded-3xl bg-[#141618] px-6 py-16 text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                                        <i className="fa-solid fa-triangle-exclamation text-xl" />
                                    </div>

                                    <h2 className="mt-5 text-xl font-bold">
                                        Unable to load sermons
                                    </h2>

                                    <p className="mx-auto mt-2 max-w-md text-sm text-[#9ca3af]">
                                        {
                                            fetchError
                                        }
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            fetchSermons
                                        }
                                        className="mt-6 rounded-xl bg-[#7c6cff] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#9188ff]"
                                    >
                                        <i className="fa-solid fa-rotate-right mr-2" />
                                        Try Again
                                    </button>
                                </div>
                            ) : filteredSermons.length >
                                0 ? (
                                <>
                                    {/* =========================
                                        TODAY'S MESSAGE
                                        ENTIRE SECTION = 75VH
                                    ========================= */}

                                    {featuredSermon && (
                                        <section className="flex h-[75vh] min-h-[520px] flex-col">
                                            {/* SECTION TITLE */}

                                            <div className="mb-5 flex shrink-0 items-end justify-between gap-4">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9188ff]">
                                                        Featured
                                                    </p>

                                                    <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                                                        Today's Message
                                                    </h2>
                                                </div>
                                            </div>

                                            {/* FEATURED CARDS */}

                                            <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
                                                {/* LARGE FEATURED CARD */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleSermonClick(
                                                            featuredSermon
                                                        )
                                                    }
                                                    className="group relative min-h-0 overflow-hidden rounded-3xl bg-[#181a1d] text-left transition-colors duration-300 hover:bg-[#202226]"
                                                >
                                                    {featuredSermon.thumbnail ? (
                                                        <img
                                                            src={
                                                                featuredSermon.thumbnail
                                                            }
                                                            alt={
                                                                featuredSermon.title
                                                            }
                                                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-[#141618]" />
                                                    )}

                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                                                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9188ff]">
                                                            {
                                                                featuredSermon.category
                                                            }
                                                        </span>

                                                        <h3 className="mt-2 max-w-2xl text-2xl font-black text-white sm:text-3xl">
                                                            {
                                                                featuredSermon.title
                                                            }
                                                        </h3>

                                                        <p className="mt-2 text-sm text-white/70">
                                                            {
                                                                featuredSermon.speaker
                                                            }
                                                        </p>
                                                    </div>
                                                </button>

                                                {/* SUPPORTING FEATURED CARDS */}

                                                <div className="grid min-h-0 gap-5 sm:grid-cols-2 lg:grid-cols-1">
                                                    {featuredSecondarySermons.map(
                                                        (
                                                            sermon
                                                        ) => (
                                                            <SermonCard
                                                                key={
                                                                    sermon.id
                                                                }
                                                                sermon={
                                                                    sermon
                                                                }
                                                                compact
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </section>
                                    )}

                                    {/* LATEST */}

                                    <SermonSection
                                        sectionId="latest-sermons"
                                        title="Latest Sermons"
                                        subtitle="The newest messages from Living Faith Church Iguosa."
                                        items={latestSermons}
                                        columns={4}
                                    />
                                    {/* POPULAR */}

                                    <SermonSection
                                        sectionId="popular-sermons"
                                        title="Popular Messages"
                                        subtitle="Messages worth watching again and sharing with others."
                                        items={
                                            popularSermons
                                        }
                                        columns={3}
                                    />

                                    {/* PRAYER */}

                                    <SermonSection
                                        sectionId="prayer-sermons"
                                        title="Prayer"
                                        subtitle="Messages to strengthen your prayer life."
                                        items={
                                            prayerSermons
                                        }
                                        columns={4}
                                        category="Prayer"
                                    />

                                    {/* FAITH */}

                                    <SermonSection
                                        title="Faith"
                                        subtitle="Build your faith through the Word of God."
                                        items={
                                            faithSermons
                                        }
                                        columns={3}
                                        category="Faith"
                                    />

                                    {/* WISDOM */}

                                    <SermonSection
                                        title="Wisdom"
                                        subtitle="Grow in wisdom and understanding."
                                        items={
                                            wisdomSermons
                                        }
                                        columns={4}
                                        category="Wisdom"
                                    />

                                    {/* CONSECRATION */}

                                    <SermonSection
                                        title="Consecration"
                                        subtitle="Messages about dedication, purity and a life set apart for God."
                                        items={
                                            consecrationSermons
                                        }
                                        columns={3}
                                        category="Consecration"
                                    />
                                </>
                            ) : (
                                /* EMPTY */

                                <div className="rounded-3xl bg-[#141618] px-6 py-16 text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#181a1d] text-[#6f737a]">
                                        <i className="fa-solid fa-video-slash text-xl" />
                                    </div>

                                    <h2 className="mt-5 text-xl font-bold">
                                        No sermons found
                                    </h2>

                                    <p className="mx-auto mt-2 max-w-md text-sm text-[#9ca3af]">
                                        Try selecting a
                                        different category
                                        or media type.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedCategory(
                                                "All"
                                            );
                                            setSelectedType(
                                                "All"
                                            );
                                        }}
                                        className="mt-6 rounded-xl bg-[#7c6cff] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#9188ff]"
                                    >
                                        Reset Filters
                                    </button>
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