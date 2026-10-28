import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import SermonHeader from "./components/SermonHeader";

import SermonSidebar from "./components/SermonSidebar";

import SermonPlayer from "./components/SermonPlayer";

import { useTheme } from "../../context/ThemeContext";

function AllSermons() {

    const [selectedCategory, setSelectedCategory] = useState("All");

    const [selectedType, setSelectedType] = useState("All");

    const [selectedSermon, setSelectedSermon] = useState(null);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { theme } = useTheme();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [sermons, setSermons] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [fetchError, setFetchError] = useState("");

    const [showAllCategories, setShowAllCategories] =

        useState(false);

    const categoryScrollRef = useRef(null);

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

                className="group relative w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-white text-left shadow-[0_8px_28px_rgba(0,0,0,0.035)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)] dark:border-white/[0.07] dark:bg-[#181a1b] dark:hover:bg-[#202122] dark:hover:shadow-black/30"

            >

                {/* THUMBNAIL */}

                <div className={`relative overflow-hidden ${compact ? "h-full min-h-[190px] lg:min-h-0" : "aspect-[4/3]"}`}>

                    {sermon.thumbnail ? (

                        <img

                            src={sermon.thumbnail}

                            alt={sermon.title}

                            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"

                        />

                    ) : (

                        <div className="absolute inset-0 flex items-center justify-center border border-stone-200 bg-white dark:border-[#27292d] dark:bg-[#141618]">

                            <i className="fa-solid fa-video text-3xl text-[#D91620] dark:text-[#f87171]" />

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

                            <span className="text-[#D91620] dark:text-[#f87171]">

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

                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#D91620] dark:text-[#f87171] backdrop-blur-sm">

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

            <section id={sectionId} className="mt-12 scroll-mt-24">

                <div className="mb-5 flex items-end justify-between gap-4">

                    <div>

                        <div className="flex items-center gap-2">

                            <span className="h-6 w-1 rounded-full bg-[#D91620]" />

                            <h2 className="text-xl font-black text-slate-900 dark:text-white sm:text-2xl">

                                {title}

                            </h2>

                        </div>

                        {subtitle && (

                            <p className="mt-2 text-sm text-slate-600 dark:text-[#9ca3af]">

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

                            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 dark:text-[#9ca3af] transition hover:border border-stone-200 bg-stone-100 dark:border-[#27292d] dark:bg-[#181a1d] hover:text-[#D91620] dark:text-[#f87171] sm:inline-flex"

                        >

                            View all

                            <i className="fa-solid fa-arrow-right" />

                        </button>

                    )}

                </div>

                <div className={`grid gap-5 ${gridClass}`}>
                    {items.map((sermon, index) => (
                        <motion.div
                            key={sermon.id}
                            initial={{ opacity: 0, y: 42, scale: 0.975, filter: "blur(4px)" }}
                            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                            viewport={{ once: true, amount: 0.16 }}
                            transition={{
                                // Each row arrives together, with a noticeable pause before the next row.
                                duration: 0.78,
                                delay: Math.floor(index / columns) * 0.32,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <SermonCard sermon={sermon} />
                        </motion.div>
                    ))}
                </div>

            </section>

        );

    };

    return (

        <div data-theme={theme} className="min-h-screen bg-[#faf9f7] text-[#171717] transition-colors duration-300 dark:bg-[#101112] dark:text-white">

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

                onLatestClick={handleLatestSermons}

                onPopularClick={handlePopularSermons}

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

                            onLatestClick={handleLatestSermons}

                            onPopularClick={handlePopularSermons}

                        />

                    </div>

                </div>

            )}

            {!isSidebarOpen && (

                <button

                    type="button"

                    onClick={() => setIsSidebarOpen(true)}

                    className="fixed left-4 top-[92px] z-50 hidden h-10 w-10 items-center justify-center rounded-xl border border-[#27292d] border border-stone-200 bg-stone-100 dark:border-[#27292d] dark:bg-[#181a1d] text-slate-600 dark:text-[#9ca3af] shadow-lg transition-all duration-300 hover:bg-stone-200 dark:bg-[#202226] hover:text-[#D91620] dark:text-[#f87171] lg:flex"

                    aria-label="Open sidebar"

                >

                    <i className="fa-solid fa-chevron-right text-xs" />

                </button>

            )}

            <main

                className={`transition-[margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"

                    }`}

            >

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

                    <section className="min-h-screen px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">

                        <div className="mx-auto w-full max-w-[1440px]">

                            {/* INTRO */}

                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                className="mb-7"
                            >

                                <div className="flex items-center gap-3">

                                    <span className="h-8 w-1 rounded-full bg-[#D91620]" />

                                    <div>

                                        <p className="inline-flex rounded-full border border-[#D91620]/15 bg-[#D91620]/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D91620] dark:border-white/10 dark:bg-white/[0.045] dark:text-[#ff858b]">

                                            Living Faith Church Iguosa

                                        </p>

                                        <h1 className="mt-1 text-3xl font-black sm:text-4xl">

                                            Sermons

                                        </h1>

                                    </div>

                                </div>

                                <p className="mt-4 max-w-2xl leading-7 text-slate-600 dark:text-[#9ca3af]">

                                    Explore messages that

                                    will strengthen your

                                    faith, deepen your

                                    understanding of God's

                                    Word, and encourage

                                    your walk with Christ.

                                </p>

                            </motion.div>

                            {/* CATEGORY NAVIGATION */}

                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                                className="relative mb-8 overflow-hidden rounded-[1.8rem] border border-black/[0.055] bg-white/90 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.045)] backdrop-blur-xl before:absolute before:left-0 before:top-7 before:h-14 before:w-[3px] before:rounded-r-full before:bg-[#D91620] dark:border-white/[0.07] dark:bg-[#151617] sm:p-5 lg:p-6"
                            >

                                <div className="relative flex flex-col gap-5">

                                    <div className="flex flex-wrap items-center justify-between gap-3">

                                        <div className="flex items-start gap-3">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#D91620]/[0.09] text-[#D91620] dark:bg-[#D91620]/15 dark:text-[#ff7279]">
                                                <i className="fa-solid fa-layer-group text-sm" />
                                            </span>
                                            <div>
                                                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#D91620] dark:text-[#ff7279]">
                                                    Explore the collection
                                                </p>
                                                <p className="mt-1 text-sm text-slate-600 dark:text-[#a1a1aa]">
                                                    Choose a topic or format to find a message.
                                                </p>
                                            </div>
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

                                                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-black/[0.07] bg-black/[0.025] px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-[#D91620]/30 hover:bg-[#D91620]/[0.06] hover:text-[#D91620] dark:border-white/[0.09] dark:bg-white/[0.035] dark:text-[#d4d4d8] dark:hover:border-[#ff7279]/30 dark:hover:text-[#ff7279]"

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

                                                    className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-100 dark:border-[#27292d] dark:bg-[#181a1d] text-slate-600 dark:text-[#9ca3af] transition hover:bg-stone-200 dark:bg-[#202226] hover:text-[#D91620] dark:text-[#f87171] sm:flex"

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

                                            <div className="flex min-w-max items-center gap-2.5 py-1">

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

                                                            className={`group inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-3 text-[13px] font-bold tracking-[-0.01em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D91620]/50 ${selectedCategory === category ? "bg-[#D91620] text-white shadow-[0_8px_22px_rgba(217,22,32,0.22)] ring-1 ring-[#D91620]/20" : "bg-white/70 text-stone-600 ring-1 ring-black/[0.07] hover:-translate-y-0.5 hover:bg-white hover:text-[#D91620] hover:ring-[#D91620]/25 dark:bg-white/[0.035] dark:text-[#c4c4c8] dark:ring-white/[0.08] dark:hover:bg-white/[0.07] dark:hover:text-[#ff858b]"}`}

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

                                                                        className={`group inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-3 text-[13px] font-bold tracking-[-0.01em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D91620]/50 ${selectedCategory === category ? "bg-[#D91620] text-white shadow-[0_8px_22px_rgba(217,22,32,0.22)] ring-1 ring-[#D91620]/20" : "bg-white/70 text-stone-600 ring-1 ring-black/[0.07] hover:-translate-y-0.5 hover:bg-white hover:text-[#D91620] hover:ring-[#D91620]/25 dark:bg-white/[0.035] dark:text-[#c4c4c8] dark:ring-white/[0.08] dark:hover:bg-white/[0.07] dark:hover:text-[#ff858b]"}`}

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

                                                    className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-100 dark:border-[#27292d] dark:bg-[#181a1d] text-slate-600 dark:text-[#9ca3af] transition hover:bg-stone-200 dark:bg-[#202226] hover:text-[#D91620] dark:text-[#f87171] sm:flex"

                                                >

                                                    <i className="fa-solid fa-chevron-right text-xs" />

                                                </button>

                                            )}

                                    </div>

                                    {/* MEDIA FILTER */}

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                        className="border-t border-black/[0.055] pt-4 dark:border-white/[0.07]"
                                    >

                                        <div className="flex flex-wrap items-center gap-2.5">

                                            <span className="mr-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#6f737a]">

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

                                                            ? "bg-[#D91620]/15 text-[#D91620] dark:text-[#f87171]"

                                                            : "text-slate-600 dark:text-[#9ca3af] hover:border border-stone-200 bg-stone-100 dark:border-[#27292d] dark:bg-[#181a1d] hover:text-white"

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

                                    </motion.div>

                                </div>

                            </motion.div>

                            {/* RESULTS COUNT */}

                            <div className="mb-6 flex items-center justify-between">

                                <p className="text-sm font-semibold text-slate-500 dark:text-[#6f737a]">

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

                                                className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 dark:border-[#27292d] dark:bg-[#181a1d]"

                                            >

                                                <div className="aspect-[4/3] animate-pulse bg-stone-300 dark:bg-[#27292d]" />

                                                <div className="space-y-4 p-4">

                                                    <div className="h-3 w-1/3 animate-pulse rounded bg-stone-300 dark:bg-[#27292d]" />

                                                    <div className="h-5 w-4/5 animate-pulse rounded bg-stone-300 dark:bg-[#27292d]" />

                                                    <div className="h-3 w-2/5 animate-pulse rounded bg-stone-300 dark:bg-[#27292d]" />

                                                </div>

                                            </div>

                                        )

                                    )}

                                </div>

                            ) : fetchError ? (

                                <div className="rounded-3xl border border-black/[0.06] bg-white px-6 py-16 text-center shadow-[0_12px_40px_rgba(0,0,0,0.035)] dark:border-white/[0.07] dark:bg-[#151617]">

                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400">

                                        <i className="fa-solid fa-triangle-exclamation text-xl" />

                                    </div>

                                    <h2 className="mt-5 text-xl font-bold">

                                        Unable to load sermons

                                    </h2>

                                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-[#9ca3af]">

                                        {

                                            fetchError

                                        }

                                    </p>

                                    <button

                                        type="button"

                                        onClick={

                                            fetchSermons

                                        }

                                        className="mt-6 rounded-xl bg-[#D91620] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#b8121b]"

                                    >

                                        <i className="fa-solid fa-rotate-right mr-2" />

                                        Try Again

                                    </button>

                                </div>

                            ) : filteredSermons.length >

                                0 ? (

                                <>

                                    {featuredSermon && (

                                        <motion.section
                                            initial={{ opacity: 0, y: 22 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                                            className="flex flex-col gap-5 lg:h-[85vh] lg:min-h-[560px] lg:max-h-[860px]"
                                        >

                                            {/* SECTION TITLE */}

                                            <div className="flex shrink-0 items-end justify-between gap-4 pb-1">

                                                <div>

                                                    <div className="mb-2 flex items-center gap-2.5">
                                                        <span className="h-1 w-8 rounded-full bg-[#E31B23]" />
                                                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#E31B23] dark:text-[#F7941D]">
                                                            Featured message
                                                        </p>
                                                    </div>
                                                    <h2 className="text-2xl font-black tracking-tight text-[#171717] dark:text-white sm:text-3xl lg:text-[2rem]">
                                                        Today's Message
                                                    </h2>

                                                </div>

                                            </div>

                                            {/* FEATURED CARDS */}

                                            <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[1.55fr_1fr]">

                                                {/* LARGE FEATURED CARD */}

                                                <motion.button
                                                    type="button"
                                                    initial={{ opacity: 0, scale: 0.985 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                                                    whileHover={{ y: -4 }}
                                                    whileTap={{ scale: 0.995 }}
                                                    onClick={() => handleSermonClick(featuredSermon)}
                                                    className="group relative min-h-[300px] overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-stone-100 text-left shadow-[0_18px_55px_rgba(0,0,0,0.09)] transition-shadow duration-500 hover:shadow-[0_28px_70px_rgba(0,0,0,0.18)] dark:border-white/[0.07] dark:bg-[#181a1d] lg:min-h-0"

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

                                                        <div className="absolute inset-0 border border-stone-200 bg-white dark:border-[#27292d] dark:bg-[#141618]" />

                                                    )}

                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/5 transition-opacity duration-500 group-hover:from-black/90" />

                                                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-9">

                                                        <span className="inline-flex rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                                                            {featuredSermon.category}
                                                        </span>

                                                        <h3 className="mt-3 max-w-2xl text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">

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

                                                </motion.button>

                                                {/* SUPPORTING FEATURED CARDS */}

                                                <motion.div
                                                    initial="hidden"
                                                    animate="visible"
                                                    variants={{
                                                        hidden: { opacity: 0 },
                                                        visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.18 } },
                                                    }}
                                                    className="grid min-h-0 auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-1"
                                                >

                                                    {featuredSecondarySermons.map(

                                                        (

                                                            sermon

                                                        ) => (

                                                            <motion.div
                                                                key={sermon.id}
                                                                variants={{
                                                                    hidden: { opacity: 0, y: 18 },
                                                                    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                                                                }}
                                                                className="min-h-0 [&>button]:h-full"
                                                            >
                                                                <SermonCard sermon={sermon} compact />
                                                            </motion.div>

                                                        )

                                                    )}

                                                </motion.div>

                                            </div>

                                        </motion.section>

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

                                <div className="rounded-3xl border border-black/[0.06] bg-white px-6 py-16 text-center shadow-[0_12px_40px_rgba(0,0,0,0.035)] dark:border-white/[0.07] dark:bg-[#151617]">

                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-stone-200 bg-stone-100 dark:border-[#27292d] dark:bg-[#181a1d] text-slate-500 dark:text-[#6f737a]">

                                        <i className="fa-solid fa-video-slash text-xl" />

                                    </div>

                                    <h2 className="mt-5 text-xl font-bold">

                                        No sermons found

                                    </h2>

                                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-[#9ca3af]">

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

                                        className="mt-6 rounded-xl bg-[#D91620] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b8121b]"

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
