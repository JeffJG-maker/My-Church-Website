import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import sermons from "../data/sermons";

function SermonHeader({ onSearchSelect, onMenuClick }) {
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".sermon-search-container")) {
                setShowSuggestions(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                handleClearSearch();
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
                <Link
                    to="/"
                    className="flex shrink-0 items-center gap-3"
                >
                    <img
                        src="/media/Big Winnersogo.png"
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
                                if (searchValue.trim().length >= 3) {
                                    setShowSuggestions(true);
                                }
                            }}
                            placeholder="Search sermons..."
                            className="w-full rounded-full border border-gray-200 bg-gray-100 py-3 pl-11 pr-11 text-sm outline-none transition focus:border-[#0d0761] focus:bg-white dark:border-[#333344] dark:bg-[#1f1f26] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 dark:focus:bg-[#1f1f26]"
                        />

                        {/* Clear Search */}
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

                        {/* Search Suggestions */}
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
                                                            src={sermon.thumbnail}
                                                            alt={sermon.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold text-[#0d0761] dark:text-white">
                                                            {sermon.title}
                                                        </p>

                                                        <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                                                            {sermon.speaker}
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
                <button
                    type="button"
                    className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#0d0761] transition hover:bg-gray-100 dark:text-white dark:hover:bg-[#2b2b46]"
                    aria-label="Notifications"
                >
                    <i className="fa-regular fa-bell text-lg"></i>

                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
                </button>

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