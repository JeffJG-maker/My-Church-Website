import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import sermons from "../data/sermons";

function SermonHeader({ onSearchSelect, onMenuClick }) {
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [sermons, setSermons] = useState([])

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

    useEffect(() => {
        const fetchSermons = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/sermons");
                if (!response.ok) {
                    throw new Error("Failed to fetch Sermons")
                }
                const data = await response.json();
                setSermons(data)

            } catch (error) {
                console.error(error)
            }
        }

        fetchSermons();
    }, []);


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
            const title = sermon.title.toLowerCase();
            const speaker = sermon.speaker.toLowerCase();

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
    };

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
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md dark:border-[#333344] dark:bg-[#131323]/95">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center gap-3 px-4 sm:gap-4 sm:px-5 lg:px-8">

                {/* Back Button */}
                <Link
                    to="/"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#0d0761] transition hover:bg-gray-100 dark:text-white dark:hover:bg-[#2b2b46]"
                    aria-label="Go to home"
                >
                    <i className="fa-solid fa-arrow-left text-lg"></i>
                </Link>

                {/* Church Logo */}
                <Link to="/" className="flex shrink-0 items-center gap-3">
                    <img
                        src="/media/Big_Winnersogo.png"
                        alt="Living Faith Church Iguosa"
                        className="h-11 w-11 rounded-full object-cover"
                    />

                    <div className="hidden sm:block">
                        <h1 className="text-sm font-bold text-[#0d0761] dark:text-white">
                            Living Faith Church
                        </h1>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Iguosa
                        </p>
                    </div>
                </Link>

                {/* Search */}
                <div className="sermon-search-container relative ml-auto flex max-w-xl flex-1 items-center">
                    <div className="relative w-full">

                        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>

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
                            className="w-full rounded-full border border-gray-200 bg-gray-100 py-3 pl-11 pr-11 text-sm outline-none transition focus:border-[#0d0761] focus:bg-white dark:border-[#333344] dark:bg-[#1f1f26] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 dark:focus:bg-[#1f1f26]"
                        />

                        {searchValue && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-[#333344] dark:hover:text-white"
                                aria-label="Clear search"
                            >
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        )}

                        {showSuggestions &&
                            searchValue.trim().length >= 3 && (
                                <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-[#333344] dark:bg-[#131323]">

                                    {searchResults.length > 0 ? (
                                        <div className="max-h-80 overflow-y-auto py-2">

                                            {searchResults.map((sermon) => (
                                                <button
                                                    key={sermon.id}
                                                    type="button"
                                                    onClick={() =>
                                                        handleSearchClick(
                                                            sermon.id
                                                        )
                                                    }
                                                    className="flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-gray-100 dark:hover:bg-[#2b2b46]"
                                                >
                                                    <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-[#2b2b46]">
                                                        <img
                                                            src={
                                                                sermon.thumbnail
                                                            }
                                                            alt={
                                                                sermon.title
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold text-[#0d0761] dark:text-white">
                                                            {
                                                                sermon.title
                                                            }
                                                        </p>

                                                        <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                                                            {
                                                                sermon.speaker
                                                            }
                                                        </p>
                                                    </div>

                                                    <i className="fa-solid fa-chevron-right shrink-0 text-xs text-gray-400"></i>
                                                </button>
                                            ))}

                                        </div>
                                    ) : (
                                        <div className="px-5 py-8 text-center">

                                            <i className="fa-solid fa-magnifying-glass text-xl text-gray-400"></i>

                                            <p className="mt-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                No sermons found
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                Try another sermon title or speaker.
                                            </p>

                                        </div>
                                    )}

                                </div>
                            )}

                    </div>
                </div>

                {/* Notifications */}
                <div className="notification-container relative">

                    <button
                        type="button"
                        onClick={handleToggleNotifications}
                        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#0d0761] transition hover:bg-gray-100 dark:text-white dark:hover:bg-[#2b2b46]"
                        aria-label="Notifications"
                        aria-expanded={showNotifications}
                    >
                        <i className="fa-regular fa-bell text-lg"></i>

                        {unreadCount > 0 && (
                            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-full z-50 mt-3 w-[340px] overflow-hidden rounded-2xl border-none bg-white shadow-2xl shadow-[#e0e0ff] dark:border-[#333344] dark:bg-[#131323] sm:w-[380px]">

                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-[#333344]">

                                <div>
                                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                                        Notifications
                                    </h2>

                                    <p className="mt-0.5 text-xs text-gray-400">
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
                                        className="text-xs font-semibold text-[#0d0761] transition hover:underline dark:text-gray-300"
                                    >
                                        Mark all as read
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
                                                className={`flex w-full gap-3 border-b border-gray-100 px-5 py-4 text-left transition last:border-b-0 dark:border-[#333344] ${notification.read
                                                    ? "bg-white dark:bg-[#131323]"
                                                    : "bg-[#0d0761]/[0.03] hover:bg-gray-50 dark:bg-white/[0.03] dark:hover:bg-[#1f1f26]"
                                                    }`}
                                            >

                                                {/* Icon */}
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0d0761]/10 text-[#0d0761] dark:bg-white/10 dark:text-white">
                                                    <i
                                                        className={`${notification.icon} text-sm`}
                                                    ></i>
                                                </div>

                                                {/* Content */}
                                                <div className="min-w-0 flex-1">

                                                    <div className="flex items-start justify-between gap-2">

                                                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                            {
                                                                notification.title
                                                            }
                                                        </p>

                                                        {!notification.read && (
                                                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500"></span>
                                                        )}

                                                    </div>

                                                    <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                                                        {
                                                            notification.message
                                                        }
                                                    </p>

                                                    <p className="mt-2 text-[10px] font-medium text-gray-400">
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

                                        <i className="fa-regular fa-bell-slash text-2xl text-gray-300 dark:text-gray-600"></i>

                                        <p className="mt-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                            No notifications
                                        </p>

                                    </div>
                                )}

                            </div>

                        </div>
                    )}

                </div>

                {/* Mobile Menu */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#0d0761] transition hover:bg-gray-100 dark:text-white dark:hover:bg-[#2b2b46] lg:hidden"
                    aria-label="Open menu"
                >
                    <i className="fa-solid fa-bars text-lg"></i>
                </button>

            </div>
        </header>
    );
}

export default SermonHeader;