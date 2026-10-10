import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

function SermonHeader({ onSearchSelect, onMenuClick }) {
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [sermons, setSermons] = useState([]);

    const [showNotifications, setShowNotifications] = useState(false);

    const { theme } = useTheme();

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "New Sermon Available",
            message:
                "A new sermon has been added to the sermon library.",
            time: "2 hours ago",
            icon: "fa-solid fa-video",
            read: false,
        },
        {
            id: 2,
            title: "Sunday Service",
            message:
                "Join us for our upcoming Sunday worship service.",
            time: "Yesterday",
            icon: "fa-solid fa-church",
            read: false,
        },
        {
            id: 3,
            title: "Welcome to Living Faith Church",
            message:
                "Thank you for visiting Living Faith Church Iguosa.",
            time: "3 days ago",
            icon: "fa-solid fa-heart",
            read: true,
        },
    ]);

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    /* =========================
       FETCH SERMONS
    ========================= */

    useEffect(() => {
        const fetchSermons = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/sermons`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch sermons");
                }

                const data = await response.json();
                setSermons(data);
            } catch (error) {
                console.error("Sermon header error:", error);
            }
        };

        fetchSermons();
    }, []);

    /* =========================
       SEARCH
    ========================= */

    const searchCheck = (value) => {
        const searchText = value.trim();

        setSearchValue(value);

        if (searchText.length < 3) {
            setSearchResults([]);
            setShowSuggestions(false);
            return;
        }

        searchRenderSuggestions(searchText);
    };

    const searchRenderSuggestions = (searchText) => {
        const normalizedSearch = searchText.toLowerCase();

        const results = sermons.filter((sermon) => {
            const title = sermon.title?.toLowerCase() || "";
            const speaker = sermon.speaker?.toLowerCase() || "";

            return (
                title.includes(normalizedSearch) ||
                speaker.includes(normalizedSearch)
            );
        });

        setSearchResults(results);
        setShowSuggestions(true);
    };

    const handleSearchClick = (sermonId) => {
        const selectedSermon = sermons.find(
            (sermon) => sermon.id === sermonId
        );

        if (!selectedSermon) {
            return;
        }

        setSearchValue("");
        setSearchResults([]);
        setShowSuggestions(false);

        onSearchSelect(selectedSermon);
    };

    const handleClearSearch = () => {
        setSearchValue("");
        setSearchResults([]);
        setShowSuggestions(false);
    };

    /* =========================
       NOTIFICATIONS
    ========================= */

    const handleNotificationClick = (notificationId) => {
        setNotifications((currentNotifications) =>
            currentNotifications.map((notification) =>
                notification.id === notificationId
                    ? {
                        ...notification,
                        read: true,
                    }
                    : notification
            )
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications((currentNotifications) =>
            currentNotifications.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
    };

    const handleToggleNotifications = () => {
        setShowNotifications((current) => !current);
        setShowSuggestions(false);
    };

    /* =========================
       OUTSIDE CLICK + ESCAPE
    ========================= */

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                !event.target.closest(".sermon-search-container") &&
                !event.target.closest(".notification-container")
            ) {
                setShowSuggestions(false);
                setShowNotifications(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                handleClearSearch();
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, []);

    return (
        <header
            className={`
                sticky top-0 z-50 border-b
                backdrop-blur-xl
                shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                transition-all duration-500
                ${theme === "dark"
                    ? "border-[#27292d]/70 bg-[#101112]/75 text-white"
                    : "border-black/5 bg-white/70 text-[#171717]"
                }
            `}
        >
            <div className="mx-auto flex h-[76px] max-w-[1700px] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
                {/* =========================
                    HOME BUTTON
                ========================= */}

                <Link
                    to="/"
                    aria-label="Go to home"
                    className={`
                        group flex h-10 w-10 shrink-0 items-center
                        justify-center rounded-xl border
                        transition-all duration-300
                        sm:h-11 sm:w-11
                        ${theme === "dark"
                            ? "border-[#27292d]/80 bg-white/[0.03] text-gray-400 hover:border-[#E31B23]/50 hover:bg-[#E31B23]/10 hover:text-[#F7941D]"
                            : "border-black/[0.06] bg-black/[0.025] text-gray-500 hover:border-[#E31B23]/30 hover:bg-[#E31B23]/[0.06] hover:text-[#E31B23]"
                        }
                    `}
                >
                    <i className="fa-solid fa-arrow-left text-sm transition-transform duration-300 group-hover:-translate-x-0.5" />
                </Link>

                {/* =========================
                    CHURCH BRAND
                ========================= */}

                <Link
                    to="/"
                    className="group flex shrink-0 items-center gap-3"
                >
                    <div className="relative">
                        <div
                            className={`
                                absolute -inset-1 rounded-full
                                opacity-0 blur-md transition duration-300
                                group-hover:opacity-100
                                ${theme === "dark"
                                    ? "bg-[#E31B23]/15"
                                    : "bg-[#E31B23]/10"
                                }
                            `}
                        />

                        <img
                            src="/media/Big_Winnersogo.png"
                            alt="Living Faith Church Iguosa"
                            className={`
                                relative h-10 w-10 rounded-full border
                                object-cover sm:h-11 sm:w-11
                                ${theme === "dark"
                                    ? "border-[#27292d]"
                                    : "border-black/[0.08]"
                                }
                            `}
                        />
                    </div>

                    <div className="hidden sm:block">
                        <h1
                            className={`text-sm font-bold tracking-tight ${theme === "dark"
                                    ? "text-white"
                                    : "text-[#171717]"
                                }`}
                        >
                            Living Faith Church
                        </h1>

                        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500">
                            Iguosa
                        </p>
                    </div>
                </Link>

                {/* =========================
                    SEARCH
                ========================= */}

                <div className="sermon-search-container relative ml-auto flex max-w-2xl flex-1 items-center">
                    <div className="relative w-full">
                        {/* Search icon */}

                        <div
                            className={`
                                pointer-events-none absolute left-4 top-1/2
                                z-10 flex -translate-y-1/2 items-center
                                justify-center
                                ${theme === "dark"
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }
                            `}
                        >
                            <i className="fa-solid fa-magnifying-glass text-sm" />
                        </div>

                        <input
                            type="text"
                            value={searchValue}
                            onChange={(event) =>
                                searchCheck(event.target.value)
                            }
                            onFocus={() => {
                                if (
                                    searchValue.trim().length >= 3
                                ) {
                                    setShowSuggestions(true);
                                }
                            }}
                            placeholder="Search sermons..."
                            className={`
                                h-11 w-full rounded-xl border py-2.5
                                pl-11 pr-11 text-sm outline-none
                                transition-all duration-300
                                sm:h-12
                                ${theme === "dark"
                                    ? "border-[#27292d]/80 bg-[#181a1d]/70 text-white placeholder:text-gray-600 hover:border-[#34373c] focus:border-[#E31B23]/60 focus:bg-[#1a1c20]/80 focus:ring-4 focus:ring-[#E31B23]/10"
                                    : "border-black/[0.06] bg-black/[0.025] text-[#171717] placeholder:text-gray-400 hover:border-black/[0.1] focus:border-[#E31B23]/50 focus:bg-white/60 focus:ring-4 focus:ring-[#E31B23]/10"
                                }
                            `}
                        />

                        {/* Search keyboard hint */}

                        {!searchValue && (
                            <span
                                className={`
                                    pointer-events-none absolute right-4 top-1/2
                                    hidden -translate-y-1/2 items-center gap-1
                                    rounded-md border px-2 py-1 text-[10px]
                                    font-medium md:flex
                                    ${theme === "dark"
                                        ? "border-[#27292d]/80 bg-white/[0.03] text-gray-600"
                                        : "border-black/[0.06] bg-black/[0.025] text-gray-400"
                                    }
                                `}
                            >
                                <span>⌘</span>
                                <span>K</span>
                            </span>
                        )}

                        {/* Clear button */}

                        {searchValue && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className={`
                                    absolute right-3 top-1/2 flex h-7 w-7
                                    -translate-y-1/2 items-center justify-center
                                    rounded-lg transition-all duration-200
                                    ${theme === "dark"
                                        ? "text-gray-500 hover:bg-white/5 hover:text-white"
                                        : "text-gray-400 hover:bg-black/[0.04] hover:text-[#E31B23]"
                                    }
                                `}
                                aria-label="Clear search"
                            >
                                <i className="fa-solid fa-xmark text-xs" />
                            </button>
                        )}

                        {/* =========================
                            SEARCH SUGGESTIONS
                        ========================= */}

                        {showSuggestions &&
                            searchValue.trim().length >= 3 && (
                                <div
                                    className={`
                                        absolute left-0 right-0 top-full z-[100]
                                        mt-3 overflow-hidden rounded-2xl border
                                        shadow-[0_20px_60px_rgba(0,0,0,0.16)]
                                        ${theme === "dark"
                                            ? "border-[#27292d] bg-[#181a1d]"
                                            : "border-black/[0.06] bg-white/90 backdrop-blur-xl"
                                        }
                                    `}
                                >
                                    {/* Suggestion header */}

                                    <div
                                        className={`
                                            flex items-center justify-between
                                            border-b px-4 py-3
                                            ${theme === "dark"
                                                ? "border-[#27292d]"
                                                : "border-black/[0.05]"
                                            }
                                        `}
                                    >
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                                                Search results
                                            </p>

                                            <p
                                                className={`mt-0.5 text-xs ${theme === "dark"
                                                        ? "text-gray-600"
                                                        : "text-gray-400"
                                                    }`}
                                            >
                                                {searchResults.length}{" "}
                                                {searchResults.length === 1
                                                    ? "sermon"
                                                    : "sermons"}{" "}
                                                found
                                            </p>
                                        </div>

                                        <i className="fa-solid fa-arrow-up-right-from-square text-xs text-[#E31B23] dark:text-[#F7941D]" />
                                    </div>

                                    {searchResults.length > 0 ? (
                                        <div className="max-h-80 overflow-y-auto py-2">
                                            {searchResults.map(
                                                (sermon) => (
                                                    <button
                                                        key={sermon.id}
                                                        type="button"
                                                        onClick={() =>
                                                            handleSearchClick(
                                                                sermon.id
                                                            )
                                                        }
                                                        className={`
                                                            group flex w-full
                                                            items-center gap-3 px-4
                                                            py-3 text-left
                                                            transition-all duration-200
                                                            ${theme === "dark"
                                                                ? "hover:bg-[#E31B23]/[0.06]"
                                                                : "hover:bg-[#E31B23]/[0.045]"
                                                            }
                                                        `}
                                                    >
                                                        {/* Thumbnail */}

                                                        <div
                                                            className={`
                                                                relative h-12 w-[68px]
                                                                shrink-0 overflow-hidden
                                                                rounded-lg border
                                                                ${theme === "dark"
                                                                    ? "border-[#27292d] bg-[#101112]"
                                                                    : "border-black/[0.06] bg-gray-100"
                                                                }
                                                            `}
                                                        >
                                                            <img
                                                                src={
                                                                    sermon.thumbnail
                                                                }
                                                                alt={
                                                                    sermon.title
                                                                }
                                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />

                                                            <div className="absolute inset-0 bg-black/20" />

                                                            <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E31B23] text-[8px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                                <i className="fa-solid fa-play" />
                                                            </div>
                                                        </div>

                                                        {/* Content */}

                                                        <div className="min-w-0 flex-1">
                                                            <p
                                                                className={`
                                                                    truncate text-sm
                                                                    font-semibold transition-colors
                                                                    ${theme === "dark"
                                                                        ? "text-white group-hover:text-[#F7941D]"
                                                                        : "text-[#171717] group-hover:text-[#E31B23]"
                                                                    }
                                                                `}
                                                            >
                                                                {sermon.title}
                                                            </p>

                                                            <div className="mt-1 flex items-center gap-2">
                                                                <span className="truncate text-xs text-gray-500">
                                                                    {
                                                                        sermon.speaker
                                                                    }
                                                                </span>

                                                                {sermon.category && (
                                                                    <>
                                                                        <span className="h-1 w-1 rounded-full bg-[#E31B23] dark:bg-[#F7941D]" />

                                                                        <span
                                                                            className={`truncate text-[10px] font-medium uppercase tracking-wide ${theme === "dark"
                                                                                    ? "text-gray-600"
                                                                                    : "text-gray-400"
                                                                                }`}
                                                                        >
                                                                            {
                                                                                sermon.category
                                                                            }
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Arrow */}

                                                        <div
                                                            className={`
                                                                flex h-8 w-8 shrink-0
                                                                items-center justify-center
                                                                rounded-lg transition-all
                                                                duration-200
                                                                ${theme === "dark"
                                                                    ? "text-gray-600 group-hover:bg-[#E31B23]/10 group-hover:text-[#F7941D]"
                                                                    : "text-gray-400 group-hover:bg-[#E31B23]/[0.06] group-hover:text-[#E31B23]"
                                                                }
                                                            `}
                                                        >
                                                            <i className="fa-solid fa-chevron-right text-[10px]" />
                                                        </div>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="px-5 py-10 text-center">
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#E31B23]/10 text-[#E31B23] dark:bg-[#F7941D]/10 dark:text-[#F7941D]">
                                                <i className="fa-solid fa-magnifying-glass text-lg" />
                                            </div>

                                            <p
                                                className={`mt-4 text-sm font-semibold ${theme === "dark"
                                                        ? "text-gray-200"
                                                        : "text-[#171717]"
                                                    }`}
                                            >
                                                No sermons found
                                            </p>

                                            <p
                                                className={`mt-1 text-xs leading-5 ${theme === "dark"
                                                        ? "text-gray-600"
                                                        : "text-gray-400"
                                                    }`}
                                            >
                                                Try another sermon title
                                                or speaker.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                </div>

                {/* =========================
                    NOTIFICATIONS
                ========================= */}

                <div className="notification-container relative">
                    <button
                        type="button"
                        onClick={handleToggleNotifications}
                        className={`
                            relative flex h-10 w-10 shrink-0
                            items-center justify-center rounded-xl border
                            transition-all duration-300 sm:h-11 sm:w-11
                            ${showNotifications
                                ? theme === "dark"
                                    ? "border-[#E31B23]/40 bg-[#E31B23]/10 text-[#F7941D]"
                                    : "border-[#E31B23]/25 bg-[#E31B23]/[0.06] text-[#E31B23]"
                                : theme === "dark"
                                    ? "border-[#27292d]/80 bg-white/[0.03] text-gray-400 hover:border-[#34373c] hover:bg-white/[0.05] hover:text-white"
                                    : "border-black/[0.06] bg-black/[0.025] text-gray-500 hover:border-[#E31B23]/25 hover:bg-[#E31B23]/[0.05] hover:text-[#E31B23]"
                            }
                        `}
                        aria-label="Notifications"
                        aria-expanded={showNotifications}
                    >
                        <i className="fa-regular fa-bell text-base" />

                        {unreadCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white/80 bg-[#E31B23] px-1 text-[8px] font-bold text-white dark:border-[#101112]">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification dropdown */}

                    {showNotifications && (
                        <div
                            className={`
                                absolute right-0 top-full z-[100] mt-3
                                w-[calc(100vw-32px)] max-w-[380px]
                                overflow-hidden rounded-2xl border
                                shadow-[0_20px_60px_rgba(0,0,0,0.16)]
                                ${theme === "dark"
                                    ? "border-[#27292d] bg-[#181a1d]"
                                    : "border-black/[0.06] bg-white/90 backdrop-blur-xl"
                                }
                            `}
                        >
                            {/* Header */}

                            <div
                                className={`
                                    flex items-center justify-between
                                    border-b px-5 py-4
                                    ${theme === "dark"
                                        ? "border-[#27292d]"
                                        : "border-black/[0.05]"
                                    }
                                `}
                            >
                                <div>
                                    <h2
                                        className={`text-sm font-bold ${theme === "dark"
                                                ? "text-white"
                                                : "text-[#171717]"
                                            }`}
                                    >
                                        Notifications
                                    </h2>

                                    <p
                                        className={`mt-1 text-[11px] ${theme === "dark"
                                                ? "text-gray-500"
                                                : "text-gray-400"
                                            }`}
                                    >
                                        {unreadCount > 0
                                            ? `${unreadCount} unread notification${unreadCount > 1
                                                ? "s"
                                                : ""
                                            }`
                                            : "You're all caught up"}
                                    </p>
                                </div>

                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleMarkAllAsRead}
                                        className="rounded-lg px-2 py-1.5 text-[11px] font-semibold text-[#E31B23] transition-colors hover:bg-[#E31B23]/[0.06] dark:text-[#F7941D] dark:hover:bg-[#F7941D]/10"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            {/* Notifications */}

                            <div className="max-h-[380px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(
                                        (notification) => (
                                            <button
                                                key={notification.id}
                                                type="button"
                                                onClick={() =>
                                                    handleNotificationClick(
                                                        notification.id
                                                    )
                                                }
                                                className={`
                                                    group flex w-full gap-3
                                                    border-b px-5 py-4 text-left
                                                    transition-all duration-200
                                                    last:border-b-0
                                                    ${notification.read
                                                        ? theme === "dark"
                                                            ? "border-[#27292d] bg-transparent hover:bg-white/[0.025]"
                                                            : "border-black/[0.05] bg-transparent hover:bg-black/[0.015]"
                                                        : theme === "dark"
                                                            ? "border-[#27292d] bg-[#E31B23]/[0.045] hover:bg-[#E31B23]/[0.08]"
                                                            : "border-black/[0.05] bg-[#E31B23]/[0.025] hover:bg-[#E31B23]/[0.05]"
                                                    }
                                                `}
                                            >
                                                {/* Icon */}

                                                <div
                                                    className={`
                                                        flex h-10 w-10 shrink-0
                                                        items-center justify-center
                                                        rounded-xl transition-colors
                                                        ${notification.read
                                                            ? theme === "dark"
                                                                ? "bg-[#101112] text-gray-500"
                                                                : "bg-black/[0.03] text-gray-400"
                                                            : "bg-[#E31B23]/10 text-[#E31B23] dark:bg-[#F7941D]/10 dark:text-[#F7941D]"
                                                        }
                                                    `}
                                                >
                                                    <i
                                                        className={`${notification.icon} text-sm`}
                                                    />
                                                </div>

                                                {/* Content */}

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p
                                                            className={`text-sm font-semibold ${theme === "dark"
                                                                    ? "text-gray-200"
                                                                    : "text-[#171717]"
                                                                }`}
                                                        >
                                                            {
                                                                notification.title
                                                            }
                                                        </p>

                                                        {!notification.read && (
                                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E31B23] dark:bg-[#F7941D]" />
                                                        )}
                                                    </div>

                                                    <p
                                                        className={`mt-1 text-xs leading-5 ${theme === "dark"
                                                                ? "text-gray-500"
                                                                : "text-gray-500"
                                                            }`}
                                                    >
                                                        {
                                                            notification.message
                                                        }
                                                    </p>

                                                    <p
                                                        className={`mt-2 text-[10px] font-medium ${theme === "dark"
                                                                ? "text-gray-600"
                                                                : "text-gray-400"
                                                            }`}
                                                    >
                                                        {notification.time}
                                                    </p>
                                                </div>
                                            </button>
                                        )
                                    )
                                ) : (
                                    <div className="px-5 py-10 text-center">
                                        <div
                                            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${theme === "dark"
                                                    ? "bg-[#101112] text-gray-600"
                                                    : "bg-black/[0.03] text-gray-400"
                                                }`}
                                        >
                                            <i className="fa-regular fa-bell-slash text-lg" />
                                        </div>

                                        <p
                                            className={`mt-4 text-sm font-semibold ${theme === "dark"
                                                    ? "text-gray-300"
                                                    : "text-gray-600"
                                                }`}
                                        >
                                            No notifications
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* =========================
                    MOBILE MENU
                ========================= */}

                <button
                    type="button"
                    onClick={onMenuClick}
                    className={`
                        flex h-10 w-10 shrink-0 items-center
                        justify-center rounded-xl border
                        transition-all duration-300
                        lg:hidden sm:h-11 sm:w-11
                        ${theme === "dark"
                            ? "border-[#27292d]/80 bg-white/[0.03] text-gray-400 hover:border-[#E31B23]/40 hover:bg-[#E31B23]/10 hover:text-[#F7941D]"
                            : "border-black/[0.06] bg-black/[0.025] text-gray-500 hover:border-[#E31B23]/25 hover:bg-[#E31B23]/[0.06] hover:text-[#E31B23]"
                        }
                    `}
                    aria-label="Open menu"
                >
                    <i className="fa-solid fa-bars text-base" />
                </button>
            </div>
        </header>
    );
}

export default SermonHeader;