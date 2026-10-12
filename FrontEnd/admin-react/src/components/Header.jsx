
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSun,
    faMoon,
    faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

const Header = ({
    title = "Dashboard",
    description = "Here's what's happening with your church platform today.",
    isDarkMode,
    onToggleTheme,
}) => {
    return (
        <header className="flex items-center justify-between gap-6 mb-10">
            {/* Welcome message */}
            <div className="header-welcome min-w-0">
                <h1 className="text-xl font-bold text-[var(--text)]">
                    {title === "Dashboard" ? "Welcome back, Admin! 👋" : title}
                </h1>

                <p className="mt-1 text-[12px] text-[var(--muted-text)]">
                    {description}
                </p>
            </div>

            {/* Header actions */}
            <div className="header-actions flex items-center gap-5 shrink-0">
                {/* Theme toggle */}
                <div
                    className="theme-toggle flex items-center overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--card-background)]"
                    aria-label="Choose dashboard theme"
                    role="group"
                >
                    <button
                        type="button"
                        onClick={() => {
                            if (isDarkMode) onToggleTheme();
                        }}
                        aria-label="Switch to light theme"
                        aria-pressed={!isDarkMode}
                        className={`flex h-8 w-10 items-center justify-center cursor-pointer transition-colors duration-200 ${!isDarkMode
                                ? "bg-blue-950 text-white"
                                : "bg-[var(--card-background)] text-[var(--text)] hover:bg-[var(--hover)]"
                            }`}
                    >
                        <FontAwesomeIcon icon={faSun} />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            if (!isDarkMode) onToggleTheme();
                        }}
                        aria-label="Switch to dark theme"
                        aria-pressed={isDarkMode}
                        className={`flex h-8 w-10 items-center justify-center cursor-pointer transition-colors duration-200 ${isDarkMode
                                ? "bg-blue-950 text-white"
                                : "bg-[var(--card-background)] text-[var(--text)] hover:bg-[var(--hover)]"
                            }`}
                    >
                        <FontAwesomeIcon icon={faMoon} />
                    </button>
                </div>

                {/* Administrator profile */}
                <div className="admin-profile flex items-center gap-2">
                    <div className="profile-avatar flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 p-2 text-white">
                        A
                    </div>

                    <div className="profile-info flex flex-col">
                        <strong className="text-sm text-[var(--text)]">
                            Admin
                        </strong>

                        <span className="text-[12px] text-[var(--muted-text)]">
                            Super Admin
                        </span>
                    </div>

                    <button
                        type="button"
                        aria-label="Administrator menu"
                        className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer text-[var(--muted-text)] transition-colors hover:bg-[var(--hover)]"
                    >
                        <FontAwesomeIcon icon={faChevronDown} className="text-[10px]" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
