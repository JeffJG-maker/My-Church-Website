import { Link } from "react-router-dom";

function SermonHeader() {
    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md dark:border-[#333344] dark:bg-[#131323]/95">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center gap-4 px-5 lg:px-8">

                {/* Home / Back */}
                <Link
                    to="/"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#0d0761] transition hover:bg-gray-100 dark:text-white dark:hover:bg-[#2b2b46]"
                    aria-label="Go to home"
                >
                    <i className="fa-solid fa-arrow-left text-lg"></i>
                </Link>

                {/* Logo */}
                <Link to="/" className="flex shrink-0 items-center gap-3">
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
                <div className="ml-auto flex max-w-xl flex-1 items-center">
                    <div className="relative w-full">
                        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>

                        <input
                            type="text"
                            placeholder="Search sermons..."
                            className="w-full rounded-full border border-gray-200 bg-gray-100 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#0d0761] focus:bg-white dark:border-[#333344] dark:bg-[#1f1f26] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 dark:focus:bg-[#1f1f26]"
                        />
                    </div>
                </div>

                {/* Notification */}
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