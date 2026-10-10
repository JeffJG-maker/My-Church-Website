import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";

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

    const isDark = theme === "dark";

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedType("All");

        if (mobile && onClose) {
            onClose();
        }
    };

    const handleAllSermons = () => {
        setSelectedCategory("All");
        setSelectedType("All");

        if (mobile && onClose) {
            onClose();
        }
    };

    const handleLatest = () => {
        if (onLatestClick) {
            onLatestClick();
        }

        if (mobile && onClose) {
            onClose();
        }
    };

    const handlePopular = () => {
        if (onPopularClick) {
            onPopularClick();
        }

        if (mobile && onClose) {
            onClose();
        }
    };

    const categories = [
        "Prayer",
        "Faith",
        "Wisdom",
        "Consecration",
    ];

    return (
        <aside
            className={`
                fixed
                left-0
                top-[76px]
                z-50
                flex
                h-[calc(100vh-76px)]
                flex-col
                border-r
                shadow-2xl
                transition-transform
                duration-500
                ease-[cubic-bezier(0.22,1,0.36,1)]
                backdrop-blur-xl
                ${isDark
                    ? "border-[#27292d] bg-[#141618]/95 text-white"
                    : "border-black/5 bg-white/75 text-[#171717]"
                }
                ${mobile ? "w-72" : "w-64"}
                ${isOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                }
                ${mobile ? "lg:hidden" : "hidden lg:flex"}
            `}
        >
            {/* HEADER */}

            <div
                className={`
                    flex items-center justify-between
                    border-b px-4 py-4
                    ${isDark
                        ? "border-[#27292d]"
                        : "border-black/5"
                    }
                `}
            >
                <div>
                    <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.2em]
                            text-[#E31B23]
                        "
                    >
                        Sermon Library
                    </p>

                    <h2
                        className={`
                            mt-1 text-sm font-semibold
                            ${isDark
                                ? "text-white"
                                : "text-[#171717]"
                            }
                        `}
                    >
                        Navigation
                    </h2>
                </div>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className={`
                            flex h-8 w-8
                            items-center justify-center
                            rounded-lg border
                            transition-all duration-300
                            ${isDark
                                ? "border-[#27292d] bg-[#181a1d] text-[#9ca3af] hover:border-[#E31B23]/30 hover:bg-[#E31B23]/10 hover:text-[#F7941D]"
                                : "border-black/10 bg-black/[0.025] text-gray-500 hover:border-[#E31B23]/20 hover:bg-[#E31B23]/8 hover:text-[#E31B23]"
                            }
                        `}
                        aria-label="Close sidebar"
                    >
                        <i
                            className={`fa-solid ${mobile
                                    ? "fa-xmark"
                                    : "fa-chevron-left"
                                } text-xs`}
                        />
                    </button>
                )}
            </div>

            {/* NAVIGATION */}

            <div className="flex-1 overflow-y-auto px-3 py-4">

                {/* MAIN LINKS */}

                <div className="space-y-1">

                    {/* ALL SERMONS */}

                    <button
                        type="button"
                        onClick={handleAllSermons}
                        className={`
                            flex w-full items-center gap-3
                            rounded-lg px-3 py-2.5
                            text-left text-sm
                            transition-all duration-300
                            ${selectedCategory === "All" &&
                                selectedType === "All"
                                ? isDark
                                    ? "bg-[#E31B23]/10 text-[#F7941D]"
                                    : "bg-[#E31B23]/8 text-[#C9151C]"
                                : isDark
                                    ? "text-[#9ca3af] hover:bg-[#181a1d] hover:text-white"
                                    : "text-gray-600 hover:bg-black/[0.035] hover:text-[#171717]"
                            }
                        `}
                    >
                        <i
                            className={`
                                fa-solid fa-house w-4 text-xs
                                ${selectedCategory === "All" &&
                                    selectedType === "All"
                                    ? "text-[#E31B23]"
                                    : ""
                                }
                            `}
                        />

                        <span>All Sermons</span>
                    </button>

                    {/* LATEST SERMONS */}

                    <button
                        type="button"
                        onClick={handleLatest}
                        className={`
                            flex w-full items-center gap-3
                            rounded-lg px-3 py-2.5
                            text-left text-sm
                            transition-all duration-300
                            ${isDark
                                ? "text-[#9ca3af] hover:bg-[#181a1d] hover:text-white"
                                : "text-gray-600 hover:bg-black/[0.035] hover:text-[#171717]"
                            }
                        `}
                    >
                        <i className="fa-solid fa-clock w-4 text-xs" />

                        <span>Latest Sermons</span>
                    </button>

                    {/* POPULAR SERMONS */}

                    <button
                        type="button"
                        onClick={handlePopular}
                        className={`
                            flex w-full items-center gap-3
                            rounded-lg px-3 py-2.5
                            text-left text-sm
                            transition-all duration-300
                            ${isDark
                                ? "text-[#9ca3af] hover:bg-[#181a1d] hover:text-white"
                                : "text-gray-600 hover:bg-black/[0.035] hover:text-[#171717]"
                            }
                        `}
                    >
                        <i className="fa-solid fa-fire w-4 text-xs" />

                        <span>Popular Sermons</span>
                    </button>
                </div>

                {/* DIVIDER */}

                <div
                    className={`
                        my-4 border-t
                        ${isDark
                            ? "border-[#27292d]"
                            : "border-black/5"
                        }
                    `}
                />

                {/* CATEGORIES */}

                <div>
                    <button
                        type="button"
                        onClick={() =>
                            setShowCategories(
                                (current) => !current
                            )
                        }
                        className="flex w-full items-center justify-between px-3 py-2"
                    >
                        <span
                            className={`
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.18em]
                                ${isDark
                                    ? "text-[#9ca3af]"
                                    : "text-gray-500"
                                }
                            `}
                        >
                            Categories
                        </span>

                        <i
                            className={`
                                fa-solid
                                fa-chevron-down
                                text-[10px]
                                transition-transform
                                duration-300
                                ${isDark
                                    ? "text-[#9ca3af]"
                                    : "text-gray-500"
                                }
                                ${showCategories
                                    ? "rotate-0"
                                    : "-rotate-90"
                                }
                            `}
                        />
                    </button>

                    <div
                        className={`
                            overflow-hidden
                            transition-all
                            duration-300
                            ${showCategories
                                ? "max-h-96 opacity-100"
                                : "max-h-0 opacity-0"
                            }
                        `}
                    >
                        <div className="mt-1 space-y-1">
                            {categories.map((category) => {
                                const isActive =
                                    selectedCategory === category;

                                return (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() =>
                                            handleCategoryClick(
                                                category
                                            )
                                        }
                                        className={`
                                            flex w-full
                                            items-center gap-3
                                            rounded-lg px-3 py-2.5
                                            text-left text-sm
                                            transition-all duration-300
                                            ${isActive
                                                ? isDark
                                                    ? "bg-[#E31B23]/10 text-[#F7941D]"
                                                    : "bg-[#E31B23]/8 text-[#C9151C]"
                                                : isDark
                                                    ? "text-[#9ca3af] hover:bg-[#181a1d] hover:text-white"
                                                    : "text-gray-600 hover:bg-black/[0.035] hover:text-[#171717]"
                                            }
                                        `}
                                    >
                                        <span
                                            className={`
                                                h-1.5
                                                w-1.5
                                                rounded-full
                                                ${isActive
                                                    ? "bg-[#E31B23]"
                                                    : isDark
                                                        ? "bg-[#4b4e54]"
                                                        : "bg-gray-300"
                                                }
                                            `}
                                        />

                                        <span>{category}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* DIVIDER */}

                <div
                    className={`
                        my-4 border-t
                        ${isDark
                            ? "border-[#27292d]"
                            : "border-black/5"
                        }
                    `}
                />

                {/* MEDIA TYPE */}

                <div>
                    <p
                        className={`
                            px-3 py-2
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.18em]
                            ${isDark
                                ? "text-[#9ca3af]"
                                : "text-gray-500"
                            }
                        `}
                    >
                        Media Type
                    </p>

                    <div className="mt-1 space-y-1">
                        {["All", "Video", "Audio"].map((type) => {
                            const isActive =
                                selectedType === type;

                            return (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => {
                                        setSelectedType(type);

                                        if (
                                            mobile &&
                                            onClose
                                        ) {
                                            onClose();
                                        }
                                    }}
                                    className={`
                                        flex w-full
                                        items-center gap-3
                                        rounded-lg px-3 py-2.5
                                        text-left text-sm
                                        transition-all duration-300
                                        ${isActive
                                            ? isDark
                                                ? "bg-[#E31B23]/10 text-[#F7941D]"
                                                : "bg-[#E31B23]/8 text-[#C9151C]"
                                            : isDark
                                                ? "text-[#9ca3af] hover:bg-[#181a1d] hover:text-white"
                                                : "text-gray-600 hover:bg-black/[0.035] hover:text-[#171717]"
                                        }
                                    `}
                                >
                                    <i
                                        className={`
                                            fa-solid
                                            ${type === "Video"
                                                ? "fa-video"
                                                : type ===
                                                    "Audio"
                                                    ? "fa-headphones"
                                                    : "fa-layer-group"
                                            }
                                            w-4 text-xs
                                        `}
                                    />

                                    <span>{type}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* FOOTER */}

            <div
                className={`
                    border-t p-3
                    ${isDark
                        ? "border-[#27292d]"
                        : "border-black/5"
                    }
                `}
            >
                <button
                    type="button"
                    onClick={() => {
                        if (mobile && onClose) {
                            onClose();
                        }
                    }}
                    className={`
                        flex w-full items-center gap-3
                        rounded-lg px-3 py-2.5
                        text-sm
                        transition-all duration-300
                        ${isDark
                            ? "text-[#9ca3af] hover:bg-[#E31B23]/8 hover:text-[#F7941D]"
                            : "text-gray-600 hover:bg-[#E31B23]/6 hover:text-[#E31B23]"
                        }
                    `}
                >
                    <i className="fa-solid fa-arrow-right-from-bracket w-4 text-xs" />

                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

export default SermonSidebar;