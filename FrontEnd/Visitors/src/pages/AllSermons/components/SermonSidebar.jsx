import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";

const categories = [
    { name: "Prayer", icon: "fa-hands-praying" },
    { name: "Faith", icon: "fa-heart" },
    { name: "Wisdom", icon: "fa-lightbulb" },
    { name: "Consecration", icon: "fa-fire-flame-curved" },
];

const mainLinks = [
    {
        id: "all",
        label: "All Sermons",
        icon: "fa-layer-group",
    },
    {
        id: "latest",
        label: "Latest Sermons",
        icon: "fa-clock",
    },
    {
        id: "popular",
        label: "Popular Sermons",
        icon: "fa-fire",
    },
];

const mediaTypes = [
    { label: "All", icon: "fa-layer-group" },
    { label: "Video", icon: "fa-video" },
    { label: "Audio", icon: "fa-headphones" },
];

function SermonSidebar({
    mobile = false,
    isOpen = true,
    onClose,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    onLatestClick,
    onPopularClick,
}) {
    const { theme } = useTheme();

    const [showCategories, setShowCategories] = useState(true);
    const [activeNav, setActiveNav] = useState("all");
    const [isScrolling, setIsScrolling] = useState(false);

    const scrollContainerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);

    const isDark = theme === "dark";

    const colors = {
        background: isDark ? "bg-[#101112]" : "bg-white",
        text: isDark ? "text-[#f5f5f5]" : "text-[#171717]",
        muted: isDark ? "text-[#a1a1aa]" : "text-[#737373]",
        border: isDark ? "border-white/[0.08]" : "border-black/[0.07]",
        hover: isDark
            ? "hover:bg-white/[0.045]"
            : "hover:bg-black/[0.035]",
        active: isDark
            ? "bg-[#E31B23]/[0.12]"
            : "bg-[#E31B23]/[0.06]",
        activeText: isDark ? "text-white" : "text-[#171717]",
    };

    // Show the scrollbar during scrolling, then hide it when scrolling stops.
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;

        if (!scrollContainer) return;

        const handleScroll = () => {
            setIsScrolling(true);

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
                scrollTimeoutRef.current = null;
            }, 800);
        };

        scrollContainer.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    // Clear the scrollbar state when the sidebar closes.
    useEffect(() => {
        if (!isOpen) {
            setIsScrolling(false);

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
                scrollTimeoutRef.current = null;
            }
        }
    }, [isOpen]);

    const closeOnMobile = () => {
        if (mobile && onClose) {
            onClose();
        }
    };

    const handleCategoryClick = (category) => {
        setActiveNav("category");
        setSelectedCategory(category);
        setSelectedType("All");

        closeOnMobile();
    };

    const handleAllSermons = () => {
        setActiveNav("all");
        setSelectedCategory("All");
        setSelectedType("All");

        closeOnMobile();
    };

    const handleLatest = () => {
        setActiveNav("latest");

        if (onLatestClick) {
            onLatestClick();
        }

        closeOnMobile();
    };

    const handlePopular = () => {
        setActiveNav("popular");

        if (onPopularClick) {
            onPopularClick();
        }

        closeOnMobile();
    };

    const handleMediaType = (type) => {
        setActiveNav("all");
        setSelectedType(type);

        closeOnMobile();
    };

    const handleNavigation = (id) => {
        if (id === "all") {
            handleAllSermons();
        } else if (id === "latest") {
            handleLatest();
        } else if (id === "popular") {
            handlePopular();
        }
    };

    return (
        <>
            {/* THIN, AUTO-HIDING SCROLLBAR */}
            <style>
                {`
                    .sermon-sidebar-scroll {
                        scrollbar-width: thin;
                        scrollbar-color: transparent transparent;
                    }

                    .sermon-sidebar-scroll::-webkit-scrollbar {
                        width: 2px;
                        height: 2px;
                    }

                    .sermon-sidebar-scroll::-webkit-scrollbar-track {
                        background: transparent;
                    }

                    .sermon-sidebar-scroll::-webkit-scrollbar-thumb {
                        background-color: transparent;
                        border-radius: 999px;
                        transition: background-color 200ms ease;
                    }

                    .sermon-sidebar-scroll.is-scrolling {
                        scrollbar-color: rgba(227, 27, 35, 0.65) transparent;
                    }

                    .sermon-sidebar-scroll.is-scrolling::-webkit-scrollbar-thumb {
                        background-color: rgba(227, 27, 35, 0.65);
                    }

                    .sermon-sidebar-scroll.is-scrolling::-webkit-scrollbar-thumb:hover {
                        background-color: rgba(227, 27, 35, 0.9);
                    }

                    @media (prefers-reduced-motion: reduce) {
                        .sermon-sidebar-scroll::-webkit-scrollbar-thumb {
                            transition: none;
                        }
                    }
                `}
            </style>

            <aside
                aria-label="Sermon navigation"
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex h-screen flex-col
                    overflow-hidden
                    ${colors.background}
                    ${colors.text}
                    ${mobile
                        ? "w-[min(86vw,320px)] lg:hidden"
                        : "hidden w-[272px] lg:flex"
                    }
                    ${isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                    ${isDark
                        ? "shadow-[18px_0_50px_rgba(0,0,0,0.24)]"
                        : "shadow-[12px_0_40px_rgba(0,0,0,0.055)]"
                    }
                    transition-transform duration-500
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                `}
            >
                {/* HEADER */}
                <div
                    className={`
                        flex shrink-0 items-center justify-between
                        border-b px-5 py-5
                        ${colors.border}
                    `}
                >
                    <div>
                        <p
                            className="
                                text-[10px] font-semibold
                                uppercase tracking-[0.18em]
                                text-[#E31B23]
                            "
                        >
                            Explore
                        </p>

                        <h2 className="mt-1 text-lg font-semibold tracking-[-0.035em]">
                            Sermons
                        </h2>
                    </div>

                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close sidebar"
                            className={`
                                flex h-9 w-9 items-center justify-center
                                rounded-xl
                                ${colors.muted}
                                ${colors.hover}
                                transition-colors duration-300
                            `}
                        >
                            <i
                                className={`fa-solid ${mobile
                                        ? "fa-xmark"
                                        : "fa-chevron-left"
                                    } text-sm`}
                                aria-hidden="true"
                            />
                        </button>
                    )}
                </div>

                {/* SCROLLABLE CONTENT */}
                <div
                    ref={scrollContainerRef}
                    className={`
                        sermon-sidebar-scroll
                        min-h-0 flex-1
                        overflow-x-hidden overflow-y-auto
                        overscroll-contain
                        px-4 py-6
                        ${isScrolling ? "is-scrolling" : ""}
                    `}
                >
                    {/* MAIN NAVIGATION */}
                    <section className="mb-8">
                        <p
                            className={`
                                mb-3 px-2
                                text-[10px] font-semibold
                                uppercase tracking-[0.16em]
                                ${colors.muted}
                            `}
                        >
                            Browse library
                        </p>

                        <div className="space-y-1">
                            {mainLinks.map((link, index) => {
                                const isActive = activeNav === link.id;

                                return (
                                    <motion.button
                                        key={link.id}
                                        type="button"
                                        onClick={() =>
                                            handleNavigation(link.id)
                                        }
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.55,
                                            delay: 0.08 + index * 0.1,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                        whileHover={{ x: 3 }}
                                        whileTap={{ scale: 0.985 }}
                                        aria-current={
                                            isActive ? "page" : undefined
                                        }
                                        className={`
                                            group relative flex w-full
                                            items-center gap-3
                                            overflow-hidden rounded-xl
                                            px-3 py-3 text-left
                                            transition-colors duration-300
                                            ${isActive
                                                ? `${colors.active} ${colors.activeText}`
                                                : `${colors.muted} ${colors.hover}`
                                            }
                                        `}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId={
                                                    mobile
                                                        ? "mobile-sermon-navigation"
                                                        : "desktop-sermon-navigation"
                                                }
                                                className="
                                                    absolute bottom-2.5
                                                    left-0 top-2.5
                                                    w-[3px] rounded-r-full
                                                    bg-[#E31B23]
                                                "
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 350,
                                                    damping: 30,
                                                }}
                                            />
                                        )}

                                        <span
                                            className={`
                                                flex h-9 w-9 shrink-0
                                                items-center justify-center
                                                rounded-xl
                                                transition-colors duration-300
                                                ${isActive
                                                    ? "bg-[#E31B23] text-white"
                                                    : isDark
                                                        ? "bg-white/[0.045] text-[#a1a1aa] group-hover:text-white"
                                                        : "bg-black/[0.035] text-[#737373] group-hover:text-[#171717]"
                                                }
                                            `}
                                        >
                                            <i
                                                className={`fa-solid ${link.icon} text-[13px]`}
                                                aria-hidden="true"
                                            />
                                        </span>

                                        <span className="text-[13px] font-medium">
                                            {link.label}
                                        </span>

                                        {isActive && (
                                            <motion.i
                                                initial={{
                                                    opacity: 0,
                                                    x: -3,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                className="
                                                    fa-solid
                                                    fa-chevron-right
                                                    ml-auto text-[10px]
                                                    text-[#E31B23]
                                                "
                                                aria-hidden="true"
                                            />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </section>

                    {/* CATEGORY FILTER */}
                    <section className="mb-8">
                        <button
                            type="button"
                            onClick={() =>
                                setShowCategories((current) => !current)
                            }
                            aria-expanded={showCategories}
                            className="
                                mb-4 flex w-full items-center
                                justify-between px-2 text-left
                            "
                        >
                            <span>
                                <span
                                    className={`
                                        block text-[10px] font-semibold
                                        uppercase tracking-[0.16em]
                                        ${colors.muted}
                                    `}
                                >
                                    Discover
                                </span>

                                <span className="mt-1 block text-sm font-semibold">
                                    Categories
                                </span>
                            </span>

                            <motion.span
                                animate={{
                                    rotate: showCategories ? 0 : -90,
                                }}
                                transition={{ duration: 0.3 }}
                                className={`
                                    flex h-7 w-7 items-center
                                    justify-center rounded-full
                                    ${isDark
                                        ? "bg-white/[0.05]"
                                        : "bg-black/[0.035]"
                                    }
                                    ${colors.muted}
                                `}
                            >
                                <i
                                    className="fa-solid fa-chevron-down text-[10px]"
                                    aria-hidden="true"
                                />
                            </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                            {showCategories && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        height: 0,
                                        y: -8,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        height: "auto",
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        height: 0,
                                        y: -6,
                                    }}
                                    transition={{
                                        duration: 0.42,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-2 gap-2">
                                        {categories.map(
                                            (category, index) => {
                                                const isActive =
                                                    selectedCategory ===
                                                    category.name;

                                                return (
                                                    <motion.button
                                                        key={category.name}
                                                        type="button"
                                                        onClick={() =>
                                                            handleCategoryClick(
                                                                category.name
                                                            )
                                                        }
                                                        initial={{
                                                            opacity: 0,
                                                            y: 16,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.55,
                                                            delay: index * 0.09,
                                                            ease: [
                                                                0.22,
                                                                1,
                                                                0.36,
                                                                1,
                                                            ],
                                                        }}
                                                        whileHover={{ y: -3 }}
                                                        whileTap={{
                                                            scale: 0.97,
                                                        }}
                                                        aria-pressed={isActive}
                                                        className={`
                                                            group relative flex
                                                            min-h-[96px]
                                                            flex-col items-start
                                                            justify-between
                                                            overflow-hidden
                                                            rounded-2xl border p-3
                                                            text-left
                                                            transition-colors
                                                            duration-300
                                                            ${isActive
                                                                ? isDark
                                                                    ? "border-[#E31B23]/40 bg-[#E31B23]/[0.11]"
                                                                    : "border-[#E31B23]/30 bg-[#E31B23]/[0.045]"
                                                                : isDark
                                                                    ? "border-white/[0.075] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]"
                                                                    : "border-black/[0.065] bg-[#fafafa] hover:border-black/[0.12] hover:bg-white"
                                                            }
                                                        `}
                                                    >
                                                        <span className="flex w-full items-center justify-between">
                                                            <span
                                                                className={`
                                                                    flex h-8 w-8
                                                                    items-center
                                                                    justify-center
                                                                    rounded-xl
                                                                    transition-colors
                                                                    duration-300
                                                                    ${isActive
                                                                        ? "bg-[#E31B23] text-white"
                                                                        : isDark
                                                                            ? "bg-white/[0.055] text-[#a1a1aa] group-hover:text-white"
                                                                            : "bg-white text-[#737373] shadow-sm group-hover:text-[#E31B23]"
                                                                    }
                                                                `}
                                                            >
                                                                <i
                                                                    className={`fa-solid ${category.icon} text-xs`}
                                                                    aria-hidden="true"
                                                                />
                                                            </span>

                                                            <i
                                                                className={`
                                                                    fa-solid
                                                                    fa-arrow-up-right-from-square
                                                                    text-[9px]
                                                                    transition-all
                                                                    duration-300
                                                                    ${isActive
                                                                        ? "text-[#E31B23] opacity-100"
                                                                        : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
                                                                    }
                                                                `}
                                                                aria-hidden="true"
                                                            />
                                                        </span>

                                                        <span
                                                            className={`
                                                                mt-3 text-[11px]
                                                                font-semibold
                                                                leading-tight
                                                                ${isActive
                                                                    ? colors.text
                                                                    : isDark
                                                                        ? "text-[#c4c4c8]"
                                                                        : "text-[#55555b]"
                                                                }
                                                            `}
                                                        >
                                                            {category.name}
                                                        </span>

                                                        {isActive && (
                                                            <motion.span
                                                                layoutId={
                                                                    mobile
                                                                        ? "mobile-category-indicator"
                                                                        : "desktop-category-indicator"
                                                                }
                                                                className="
                                                                    absolute bottom-0
                                                                    left-3 right-3
                                                                    h-[2px] rounded-full
                                                                    bg-[#E31B23]
                                                                "
                                                            />
                                                        )}
                                                    </motion.button>
                                                );
                                            }
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>

                    {/* MEDIA TYPE FILTER */}
                    <section
                        className={`
                            border-t pt-6
                            ${colors.border}
                        `}
                    >
                        <p
                            className={`
                                mb-4 px-2
                                text-[10px] font-semibold
                                uppercase tracking-[0.16em]
                                ${colors.muted}
                            `}
                        >
                            Filter by format
                        </p>

                        <div
                            className={`
                                grid grid-cols-3 gap-1
                                rounded-2xl p-1
                                ${isDark
                                    ? "bg-white/[0.045]"
                                    : "bg-black/[0.035]"
                                }
                            `}
                        >
                            {mediaTypes.map((type) => {
                                const isActive =
                                    selectedType === type.label;

                                return (
                                    <motion.button
                                        key={type.label}
                                        type="button"
                                        onClick={() =>
                                            handleMediaType(type.label)
                                        }
                                        whileTap={{ scale: 0.96 }}
                                        aria-pressed={isActive}
                                        className={`
                                            flex min-w-0 flex-col
                                            items-center justify-center
                                            gap-2 rounded-xl px-1 py-3
                                            text-[10px] font-medium
                                            transition-colors duration-300
                                            ${isActive
                                                ? isDark
                                                    ? "bg-[#292a2d] text-white shadow-sm"
                                                    : "bg-white text-[#171717] shadow-[0_2px_8px_rgba(0,0,0,0.07)]"
                                                : `${colors.muted} hover:text-[#E31B23]`
                                            }
                                        `}
                                    >
                                        <i
                                            className={`
                                                fa-solid ${type.icon}
                                                text-[13px]
                                                ${isActive
                                                    ? "text-[#E31B23]"
                                                    : ""
                                                }
                                            `}
                                            aria-hidden="true"
                                        />

                                        <span>{type.label}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </section>

                    {/* PUBLIC-FACING MESSAGE */}
                    <div
                        className={`
                            mt-8 rounded-2xl p-4
                            ${isDark
                                ? "bg-white/[0.035]"
                                : "bg-[#f8f8f8]"
                            }
                        `}
                    >
                        <div className="flex items-start gap-3">
                            <span
                                className="
                                    flex h-8 w-8 shrink-0
                                    items-center justify-center
                                    rounded-xl bg-[#E31B23]/10
                                    text-[#E31B23]
                                "
                            >
                                <i
                                    className="fa-solid fa-book-bible text-sm"
                                    aria-hidden="true"
                                />
                            </span>

                            <div>
                                <p className="text-xs font-semibold">
                                    Grow through the Word
                                </p>

                                <p
                                    className={`
                                        mt-1 text-[11px] leading-relaxed
                                        ${colors.muted}
                                    `}
                                >
                                    Listen, learn, and put the Word into
                                    practice.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default SermonSidebar;