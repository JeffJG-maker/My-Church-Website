import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SermonHeader({ onSearchSelect, onMenuClick }) {
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [sermons, setSermons] = useState([]);

    const [showNotifications, setShowNotifications] = useState(false);

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
        <header className="sticky top-0 z-50 border-b border-[#27292d]/80 bg-[#101112]/90 text-white shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <div className="mx-auto flex h-[76px] max-w-[1700px] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">

                {/* =========================
                    HOME BUTTON
                ========================= */}

                <Link
                    to="/"
                    aria-label="Go to home"
                    className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#27292d] bg-[#181a1d] text-gray-400 transition-all duration-300 hover:border-[#7c6cff]/40 hover:bg-[#7c6cff]/10 hover:text-[#9188ff] sm:h-11 sm:w-11"
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
                        <div className="absolute -inset-1 rounded-full bg-[#7c6cff]/10 opacity-0 blur-md transition duration-300 group-hover:opacity-100" />

                        <img
                            src="/media/Big_Winnersogo.png"
                            alt="Living Faith Church Iguosa"
                            className="relative h-10 w-10 rounded-full border border-[#27292d] object-cover sm:h-11 sm:w-11"
                        />
                    </div>

                    <div className="hidden sm:block">
                        <h1 className="text-sm font-bold tracking-tight text-white">
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

                        <div className="pointer-events-none absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center text-gray-500">
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
                            className="h-11 w-full rounded-xl border border-[#27292d] bg-[#181a1d] py-2.5 pl-11 pr-11 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-600 hover:border-[#34373c] focus:border-[#7c6cff]/60 focus:bg-[#1a1c20] focus:ring-4 focus:ring-[#7c6cff]/10 sm:h-12"
                        />

                        {/* Search keyboard hint */}

                        {!searchValue && (
                            <span className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-[#27292d] bg-[#141618] px-2 py-1 text-[10px] font-medium text-gray-600 md:flex">
                                <span>⌘</span>
                                <span>K</span>
                            </span>
                        )}

                        {/* Clear button */}

                        {searchValue && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition-all duration-200 hover:bg-white/5 hover:text-white"
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
                                <div className="absolute left-0 right-0 top-full z-[100] mt-3 overflow-hidden rounded-2xl border border-[#27292d] bg-[#181a1d] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">

                                    {/* Suggestion header */}

                                    <div className="flex items-center justify-between border-b border-[#27292d] px-4 py-3">
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                                                Search results
                                            </p>

                                            <p className="mt-0.5 text-xs text-gray-600">
                                                {searchResults.length}{" "}
                                                {searchResults.length === 1
                                                    ? "sermon"
                                                    : "sermons"}{" "}
                                                found
                                            </p>
                                        </div>

                                        <i className="fa-solid fa-arrow-up-right-from-square text-xs text-[#7c6cff]" />
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
                                                        className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-[#7c6cff]/[0.06]"
                                                    >
                                                        {/* Thumbnail */}

                                                        <div className="relative h-12 w-[68px] shrink-0 overflow-hidden rounded-lg border border-[#27292d] bg-[#101112]">
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

                                                            <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#7c6cff] text-[8px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                                <i className="fa-solid fa-play" />
                                                            </div>
                                                        </div>

                                                        {/* Content */}

                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-semibold text-white transition-colors group-hover:text-[#9188ff]">
                                                                {
                                                                    sermon.title
                                                                }
                                                            </p>

                                                            <div className="mt-1 flex items-center gap-2">
                                                                <span className="truncate text-xs text-gray-500">
                                                                    {
                                                                        sermon.speaker
                                                                    }
                                                                </span>

                                                                {sermon.category && (
                                                                    <>
                                                                        <span className="h-1 w-1 rounded-full bg-[#7c6cff]" />

                                                                        <span className="truncate text-[10px] font-medium uppercase tracking-wide text-gray-600">
                                                                            {
                                                                                sermon.category
                                                                            }
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Arrow */}

                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-600 transition-all duration-200 group-hover:bg-[#7c6cff]/10 group-hover:text-[#9188ff]">
                                                            <i className="fa-solid fa-chevron-right text-[10px]" />
                                                        </div>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="px-5 py-10 text-center">

                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#7c6cff]/10 text-[#9188ff]">
                                                <i className="fa-solid fa-magnifying-glass text-lg" />
                                            </div>

                                            <p className="mt-4 text-sm font-semibold text-gray-200">
                                                No sermons found
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-gray-600">
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
                        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 sm:h-11 sm:w-11 ${showNotifications
                                ? "border-[#7c6cff]/40 bg-[#7c6cff]/10 text-[#9188ff]"
                                : "border-[#27292d] bg-[#181a1d] text-gray-400 hover:border-[#34373c] hover:bg-[#1c1e21] hover:text-white"
                            }`}
                        aria-label="Notifications"
                        aria-expanded={showNotifications}
                    >
                        <i className="fa-regular fa-bell text-base" />

                        {unreadCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-[#101112] bg-[#7c6cff] px-1 text-[8px] font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification dropdown */}

                    {showNotifications && (
                        <div className="absolute right-0 top-full z-[100] mt-3 w-[calc(100vw-32px)] max-w-[380px] overflow-hidden rounded-2xl border border-[#27292d] bg-[#181a1d] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">

                            {/* Header */}

                            <div className="flex items-center justify-between border-b border-[#27292d] px-5 py-4">
                                <div>
                                    <h2 className="text-sm font-bold text-white">
                                        Notifications
                                    </h2>

                                    <p className="mt-1 text-[11px] text-gray-500">
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
                                        onClick={
                                            handleMarkAllAsRead
                                        }
                                        className="rounded-lg px-2 py-1.5 text-[11px] font-semibold text-[#9188ff] transition-colors hover:bg-[#7c6cff]/10"
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
                                                className={`group flex w-full gap-3 border-b border-[#27292d] px-5 py-4 text-left transition-all duration-200 last:border-b-0 ${notification.read
                                                        ? "bg-transparent hover:bg-white/[0.025]"
                                                        : "bg-[#7c6cff]/[0.045] hover:bg-[#7c6cff]/[0.08]"
                                                    }`}
                                            >
                                                {/* Icon */}

                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${notification.read
                                                            ? "bg-[#101112] text-gray-500"
                                                            : "bg-[#7c6cff]/10 text-[#9188ff]"
                                                        }`}
                                                >
                                                    <i
                                                        className={`${notification.icon} text-sm`}
                                                    />
                                                </div>

                                                {/* Content */}

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm font-semibold text-gray-200">
                                                            {
                                                                notification.title
                                                            }
                                                        </p>

                                                        {!notification.read && (
                                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7c6cff]" />
                                                        )}
                                                    </div>

                                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                                        {
                                                            notification.message
                                                        }
                                                    </p>

                                                    <p className="mt-2 text-[10px] font-medium text-gray-600">
                                                        {
                                                            notification.time
                                                        }
                                                    </p>
                                                </div>
                                            </button>
                                        )
                                    )
                                ) : (
                                    <div className="px-5 py-10 text-center">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#101112] text-gray-600">
                                            <i className="fa-regular fa-bell-slash text-lg" />
                                        </div>

                                        <p className="mt-4 text-sm font-semibold text-gray-300">
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
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#27292d] bg-[#181a1d] text-gray-400 transition-all duration-300 hover:border-[#7c6cff]/40 hover:bg-[#7c6cff]/10 hover:text-[#9188ff] lg:hidden sm:h-11 sm:w-11"
                    aria-label="Open menu"
                >
                    <i className="fa-solid fa-bars text-base" />
                </button>
            </div>
        </header>
    );
}

export default SermonHeader;