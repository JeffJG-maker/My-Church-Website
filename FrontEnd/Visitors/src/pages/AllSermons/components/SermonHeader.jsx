import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

function SermonHeader({ onSearchSelect, onMenuClick }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [sermons, setSermons] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const searchContainerRef = useRef(null);
    const searchInputRef = useRef(null);
    const notificationContainerRef = useRef(null);

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "New Sermon Available",
            message: "A new sermon has been added to the sermon library.",
            time: "2 hours ago",
            icon: "fa-solid fa-video",
            read: false,
        },
        {
            id: 2,
            title: "Sunday Service",
            message: "Join us for our upcoming Sunday worship service.",
            time: "Yesterday",
            icon: "fa-solid fa-church",
            read: false,
        },
        {
            id: 3,
            title: "Welcome to Living Faith Church",
            message: "Thank you for visiting Living Faith Church Iguosa.",
            time: "3 days ago",
            icon: "fa-solid fa-heart",
            read: true,
        },
    ]);

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    // =========================================
    // FETCH SERMONS
    // =========================================

    useEffect(() => {
        let isMounted = true;

        const fetchSermons = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;

                if (!apiUrl) {
                    console.error("VITE_API_URL is not configured.");
                    return;
                }

                const response = await fetch(`${apiUrl}/api/sermons`);

                if (!response.ok) {
                    throw new Error("Failed to fetch sermons.");
                }

                const data = await response.json();

                if (isMounted) {
                    setSermons(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Sermon header error:", error);
            }
        };

        fetchSermons();

        return () => {
            isMounted = false;
        };
    }, []);

    // =========================================
    // SEARCH
    // =========================================

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

    const searchCheck = (value) => {
        setSearchValue(value);

        const searchText = value.trim();

        if (searchText.length < 3) {
            setSearchResults([]);
            setShowSuggestions(false);
            return;
        }

        setShowNotifications(false);
        searchRenderSuggestions(searchText);
    };

    const handleClearSearch = () => {
        setSearchValue("");
        setSearchResults([]);
        setShowSuggestions(false);
        searchInputRef.current?.focus();
    };

    const handleSearchClick = (sermonId) => {
        const selectedSermon = sermons.find(
            (sermon) => String(sermon.id) === String(sermonId)
        );

        if (!selectedSermon) return;

        setSearchValue("");
        setSearchResults([]);
        setShowSuggestions(false);

        onSearchSelect?.(selectedSermon);
    };

    // =========================================
    // NOTIFICATIONS
    // =========================================

    const handleNotificationClick = (notificationId) => {
        setNotifications((currentNotifications) =>
            currentNotifications.map((notification) =>
                notification.id === notificationId
                    ? { ...notification, read: true }
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

    // =========================================
    // OUTSIDE CLICK AND KEYBOARD
    // =========================================

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }

            if (
                notificationContainerRef.current &&
                !notificationContainerRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        };

        const handleKeyboard = (event) => {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault();
                searchInputRef.current?.focus();
            }

            if (event.key === "Escape") {
                setShowSuggestions(false);
                setShowNotifications(false);
                setSearchResults([]);
                searchInputRef.current?.blur();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyboard);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyboard);
        };
    }, []);

    // =========================================
    // SHARED STYLES
    // =========================================

    const controlBase = `
    relative flex h-10 w-10 shrink-0 items-center justify-center
    rounded-xl border transition-all duration-300
    sm:h-11 sm:w-11
  `;

    const controlTheme = isDark
        ? `
      border-white/[0.09] bg-white/[0.035] text-gray-400
      hover:border-white/[0.16] hover:bg-white/[0.07]
      hover:text-gray-100
    `
        : `
      border-black/[0.07] bg-white/35 text-gray-500
      hover:border-black/[0.14] hover:bg-black/[0.035]
      hover:text-gray-800
    `;

    const dropdownTheme = isDark
        ? "border-white/[0.09] bg-[#17181b]/95 text-white"
        : "border-black/[0.07] bg-white/95 text-[#171717]";

    return (
        <header
            className={`
        sticky top-0 z-50 w-full border-b backdrop-blur-2xl
        transition-colors duration-300
        ${isDark
                    ? "border-white/[0.07] bg-[#101112]/75 text-white"
                    : "border-black/[0.055] bg-white/70 text-[#171717]"
                }
      `}
        >
            {/* Subtle neutral accent line */}
            <div
                className={`
          pointer-events-none absolute inset-x-0 top-0 h-px
          ${isDark
                        ? "bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
                        : "bg-gradient-to-r from-transparent via-black/[0.08] to-transparent"
                    }
        `}
            />

            <div
                className="
          relative mx-auto flex h-[68px] w-full items-center gap-2.5 px-3
          sm:h-[74px] sm:gap-4 sm:px-5
          lg:gap-5 lg:px-7
        "
            >
                {/* =====================================
            CHURCH BRAND — CLICK TO RETURN HOME
        ===================================== */}

                <Link
                    to="/"
                    aria-label="Return to Living Faith Church home page"
                    title="Back to Home"
                    className="
            group flex min-w-0 shrink-0 items-center gap-2.5
            rounded-xl outline-none
            focus-visible:ring-2 focus-visible:ring-gray-400/60
            sm:gap-3
          "
                >
                    {/* Church logo */}
                    <div className="relative shrink-0">
                        <div
                            className={`
                absolute -inset-1 rounded-full blur-md
                opacity-0 transition-opacity duration-300
                group-hover:opacity-100
                ${isDark ? "bg-white/[0.08]" : "bg-black/[0.06]"}
              `}
                        />

                        <img
                            src="/media/Big_Winnersogo.png"
                            alt="Living Faith Church Iguosa logo"
                            className={`
                relative h-9 w-9 rounded-full border object-cover
                transition-transform duration-300 group-hover:scale-[1.04]
                sm:h-11 sm:w-11
                ${isDark
                                    ? "border-white/[0.12]"
                                    : "border-black/[0.08]"
                                }
              `}
                        />

                        <span
                            className="
                absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full
                border-2 border-[#101112] bg-emerald-500
              "
                        />
                    </div>

                    {/* Church name */}
                    <div className="hidden min-w-0 sm:block">
                        <h1
                            className={`
                whitespace-nowrap text-sm font-bold tracking-tight
                transition-colors duration-300 md:text-[15px]
                ${isDark
                                    ? "text-white group-hover:text-gray-300"
                                    : "text-[#171717] group-hover:text-gray-600"
                                }
              `}
                        >
                            Living Faith Church
                        </h1>

                        <p
                            className={`
                mt-0.5 text-[10px] font-semibold uppercase
                tracking-[0.19em]
                ${isDark ? "text-gray-500" : "text-gray-400"}
              `}
                        >
                            Iguosa · Sermon Library
                        </p>
                    </div>
                </Link>

                {/* =====================================
            SEARCH
        ===================================== */}

                <div
                    ref={searchContainerRef}
                    className="
            sermon-search-container relative ml-auto flex
            min-w-0 flex-1 items-center
          "
                >
                    <div className="relative w-full">
                        <i
                            className={`
                fa-solid fa-magnifying-glass pointer-events-none
                absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-sm
                ${isDark ? "text-gray-500" : "text-gray-400"}
              `}
                        />

                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchValue}
                            onChange={(event) => searchCheck(event.target.value)}
                            onFocus={() => {
                                if (searchValue.trim().length >= 3) {
                                    setShowSuggestions(true);
                                }
                            }}
                            placeholder="Search sermons..."
                            aria-label="Search sermons"
                            aria-expanded={showSuggestions}
                            className={`
                h-10 w-full rounded-xl border py-2 pl-10 pr-10
                text-sm outline-none transition-all duration-300
                sm:h-11 sm:pl-11 sm:pr-12
                ${isDark
                                    ? `
                      border-white/[0.09] bg-white/[0.035]
                      text-white placeholder:text-gray-500
                      hover:border-white/[0.16]
                      focus:border-gray-500
                      focus:bg-white/[0.055]
                      focus:ring-4 focus:ring-white/[0.06]
                    `
                                    : `
                      border-black/[0.08] bg-black/[0.025]
                      text-[#171717] placeholder:text-gray-400
                      hover:border-black/[0.15]
                      focus:border-gray-400
                      focus:bg-white/75
                      focus:ring-4 focus:ring-black/[0.04]
                    `
                                }
              `}
                        />

                        {/* Clear search */}
                        {searchValue && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                aria-label="Clear search"
                                className={`
                  absolute right-2 top-1/2 flex h-7 w-7
                  -translate-y-1/2 items-center justify-center
                  rounded-lg transition-colors
                  ${isDark
                                        ? "text-gray-500 hover:bg-white/[0.07] hover:text-gray-100"
                                        : "text-gray-400 hover:bg-black/[0.045] hover:text-gray-700"
                                    }
                `}
                            >
                                <i className="fa-solid fa-xmark text-xs" />
                            </button>
                        )}

                        {/* Keyboard shortcut */}
                        {!searchValue && (
                            <span
                                className={`
                  pointer-events-none absolute right-3 top-1/2
                  hidden -translate-y-1/2 items-center gap-1
                  rounded-md border px-1.5 py-1 text-[10px]
                  font-medium md:flex
                  ${isDark
                                        ? "border-white/[0.08] bg-white/[0.025] text-gray-500"
                                        : "border-black/[0.06] bg-black/[0.02] text-gray-400"
                                    }
                `}
                            >
                                <span>Ctrl</span>
                                <span>K</span>
                            </span>
                        )}
                    </div>

                    {/* =====================================
              SEARCH SUGGESTIONS
          ===================================== */}

                    {showSuggestions && searchValue.trim().length >= 3 && (
                        <div
                            className={`
                absolute left-0 right-0 top-full z-[100] mt-3
                overflow-hidden rounded-2xl border
                shadow-[0_24px_70px_rgba(0,0,0,0.18)]
                backdrop-blur-2xl ${dropdownTheme}
              `}
                        >
                            <div
                                className={`
                  flex items-center justify-between border-b px-4 py-3
                  ${isDark
                                        ? "border-white/[0.07] bg-white/[0.02]"
                                        : "border-black/[0.045] bg-black/[0.012]"
                                    }
                `}
                            >
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-gray-500">
                                        Search results
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        {searchResults.length}{" "}
                                        {searchResults.length === 1 ? "sermon" : "sermons"} found
                                    </p>
                                </div>

                                <i className="fa-solid fa-magnifying-glass text-sm text-gray-400" />
                            </div>

                            {searchResults.length > 0 ? (
                                <div className="max-h-80 overflow-y-auto py-1">
                                    {searchResults.map((sermon) => (
                                        <button
                                            key={sermon.id}
                                            type="button"
                                            onClick={() => handleSearchClick(sermon.id)}
                                            className={`
                        group flex w-full items-center gap-3 px-3.5 py-3
                        text-left transition-colors duration-200 sm:px-4
                        ${isDark
                                                    ? "hover:bg-white/[0.06]"
                                                    : "hover:bg-black/[0.045]"
                                                }
                      `}
                                        >
                                            {/* Thumbnail */}
                                            <div
                                                className={`
                          relative h-11 w-[62px] shrink-0 overflow-hidden
                          rounded-lg border
                          ${isDark
                                                        ? "border-white/[0.08] bg-[#101112]"
                                                        : "border-black/[0.055] bg-gray-100"
                                                    }
                        `}
                                            >
                                                {sermon.thumbnail ? (
                                                    <img
                                                        src={sermon.thumbnail}
                                                        alt=""
                                                        className="
                              h-full w-full object-cover
                              transition-transform duration-300
                              group-hover:scale-105
                            "
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-gray-400">
                                                        <i className="fa-solid fa-video" />
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-black/[0.06]" />
                                            </div>

                                            {/* Sermon information */}
                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className={`
                            truncate text-sm font-semibold transition-colors
                            ${isDark
                                                            ? "text-gray-100 group-hover:text-white"
                                                            : "text-[#171717] group-hover:text-gray-600"
                                                        }
                          `}
                                                >
                                                    {sermon.title}
                                                </p>

                                                <div className="mt-1 flex min-w-0 items-center gap-2">
                                                    <span className="truncate text-xs text-gray-500">
                                                        {sermon.speaker || "Unknown speaker"}
                                                    </span>

                                                    {sermon.category && (
                                                        <>
                                                            <span
                                                                className={`
                                  h-1 w-1 shrink-0 rounded-full
                                  ${isDark ? "bg-gray-500" : "bg-gray-400"}
                                `}
                                                            />

                                                            <span className="truncate text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                                                                {sermon.category}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <i
                                                className={`
                          fa-solid fa-chevron-right shrink-0 text-[10px]
                          text-gray-400 transition-transform duration-200
                          group-hover:translate-x-0.5
                          ${isDark ? "group-hover:text-gray-200" : "group-hover:text-gray-600"}
                        `}
                                            />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-5 py-9 text-center">
                                    <div
                                        className={`
                      mx-auto flex h-11 w-11 items-center justify-center
                      rounded-xl
                      ${isDark
                                                ? "bg-white/[0.05] text-gray-400"
                                                : "bg-black/[0.035] text-gray-500"
                                            }
                    `}
                                    >
                                        <i className="fa-solid fa-magnifying-glass text-base" />
                                    </div>

                                    <p className="mt-3 text-sm font-semibold">
                                        No sermons found
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        Try another sermon title or speaker.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* =====================================
            NOTIFICATIONS
        ===================================== */}

                <div
                    ref={notificationContainerRef}
                    className="notification-container relative shrink-0"
                >
                    <button
                        type="button"
                        onClick={handleToggleNotifications}
                        aria-label="Notifications"
                        aria-expanded={showNotifications}
                        className={`
              ${controlBase}
              ${showNotifications
                                ? isDark
                                    ? "border-white/[0.18] bg-white/[0.07] text-white"
                                    : "border-black/[0.14] bg-black/[0.035] text-gray-800"
                                : controlTheme
                            }
            `}
                    >
                        <i className="fa-regular fa-bell text-base" />

                        {unreadCount > 0 && (
                            <span
                                className="
                  absolute -right-1 -top-1 flex h-[17px] min-w-[17px]
                  items-center justify-center rounded-full
                  border-2 border-[#101112] bg-[#E31B23] px-1
                  text-[9px] font-bold text-white
                "
                            >
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification dropdown */}
                    {showNotifications && (
                        <div
                            className={`
                absolute right-0 top-full z-[100] mt-3
                w-[min(360px,calc(100vw-24px))]
                overflow-hidden rounded-2xl border
                shadow-[0_24px_70px_rgba(0,0,0,0.2)]
                backdrop-blur-2xl ${dropdownTheme}
              `}
                        >
                            {/* Dropdown heading */}
                            <div
                                className={`
                  flex items-center justify-between border-b px-4 py-4
                  ${isDark
                                        ? "border-white/[0.07] bg-white/[0.02]"
                                        : "border-black/[0.05] bg-black/[0.012]"
                                    }
                `}
                            >
                                <div>
                                    <h2 className="text-sm font-bold">Notifications</h2>

                                    <p className="mt-1 text-[11px] text-gray-500">
                                        {unreadCount > 0
                                            ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""
                                            }`
                                            : "You're all caught up"}
                                    </p>
                                </div>

                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleMarkAllAsRead}
                                        className="
                      rounded-lg px-2.5 py-2 text-[10px] font-bold
                      text-gray-500 transition-colors
                      hover:bg-black/[0.045] hover:text-gray-800
                      dark:text-gray-400 dark:hover:bg-white/[0.06]
                      dark:hover:text-white
                    "
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            {/* Notification list */}
                            <div className="max-h-[360px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <button
                                            key={notification.id}
                                            type="button"
                                            onClick={() =>
                                                handleNotificationClick(notification.id)
                                            }
                                            className={`
                        flex w-full items-start gap-3 border-b
                        px-4 py-4 text-left transition-colors
                        last:border-b-0
                        ${notification.read
                                                    ? isDark
                                                        ? "border-white/[0.055] hover:bg-white/[0.035]"
                                                        : "border-black/[0.045] hover:bg-black/[0.02]"
                                                    : isDark
                                                        ? "border-white/[0.055] bg-white/[0.035] hover:bg-white/[0.06]"
                                                        : "border-black/[0.045] bg-black/[0.02] hover:bg-black/[0.04]"
                                                }
                      `}
                                        >
                                            <div
                                                className={`
                          flex h-10 w-10 shrink-0 items-center
                          justify-center rounded-xl
                          ${notification.read
                                                        ? isDark
                                                            ? "bg-white/[0.04] text-gray-500"
                                                            : "bg-black/[0.035] text-gray-400"
                                                        : isDark
                                                            ? "bg-white/[0.07] text-gray-300"
                                                            : "bg-black/[0.045] text-gray-600"
                                                    }
                        `}
                                            >
                                                <i className={`${notification.icon} text-sm`} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm font-semibold">
                                                        {notification.title}
                                                    </p>

                                                    {!notification.read && (
                                                        <span
                                                            className={`
                                mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full
                                ${isDark ? "bg-gray-300" : "bg-gray-500"}
                              `}
                                                        />
                                                    )}
                                                </div>

                                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                                    {notification.message}
                                                </p>

                                                <p className="mt-2 text-[10px] font-medium text-gray-500">
                                                    {notification.time}
                                                </p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-5 py-10 text-center">
                                        <i className="fa-regular fa-bell-slash text-xl text-gray-400" />

                                        <p className="mt-3 text-sm font-semibold">
                                            No notifications
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Dropdown footer */}
                            <div
                                className={`
                  border-t px-4 py-3 text-center
                  ${isDark
                                        ? "border-white/[0.06] bg-white/[0.015]"
                                        : "border-black/[0.045] bg-black/[0.012]"
                                    }
                `}
                            >
                                <span className="text-[10px] font-medium tracking-wide text-gray-500">
                                    LIVING FAITH CHURCH · IGUOSA
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* =====================================
            MOBILE SIDEBAR BUTTON
        ===================================== */}

                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                    className={`
            ${controlBase}
            ${controlTheme}
            lg:hidden
          `}
                >
                    <i className="fa-solid fa-bars text-base" />
                </button>
            </div>
        </header>
    );
}

export default SermonHeader;