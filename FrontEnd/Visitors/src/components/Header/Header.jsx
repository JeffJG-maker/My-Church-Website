import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [themeOpen, setThemeOpen] = useState(false);

    const { theme, setTheme } = useTheme();

    const location = useLocation();
    const navigate = useNavigate();

    const closeMenu = () => {
        setMenuOpen(false);
        setThemeOpen(false);
    };

    const changeTheme = (selectedTheme) => {
        setTheme(selectedTheme);
        setThemeOpen(false);
    };

    // Close mobile menu when navigating to another route
    useEffect(() => {
        closeMenu();
    }, [location.pathname]);

    // Navigation links
    const navItems = [
        { to: "/", label: "Home", end: true },
        { to: "/about", label: "About Us" },
        { to: "/sermons", label: "Sermons" },
        { to: "/events", label: "Events" },
        { to: "/contact", label: "Contact" },
    ];

    // Desktop navigation styling
    const navLinkClass = ({ isActive }) => `
        relative whitespace-nowrap py-2 text-sm
        transition-colors duration-200
        ${isActive
            ? "font-semibold text-white"
            : "font-medium text-white/75 hover:text-white"
        }

        after:absolute after:bottom-0 after:left-0
        after:h-[2px] after:rounded-full
        after:bg-[#E31B23]
        after:transition-all after:duration-200

        ${isActive
            ? "after:w-full"
            : "after:w-0 hover:after:w-full"
        }
    `;

    // Change theme and close dropdown
    const handleThemeChange = (selectedTheme) => {
        changeTheme(selectedTheme);
    };

    // Render navigation links
    const renderNavItem = (item, index = 0, mobile = false) => {
        return (
            <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={mobile ? closeMenu : undefined}
                tabIndex={mobile && !menuOpen ? -1 : 0}
                className={
                    mobile
                        ? ({ isActive }) => `
                            flex items-center justify-between
                            border-b border-white/[0.07]
                            py-4 text-sm
                            transition-colors duration-200
                            ${isActive
                                ? "font-semibold text-white"
                                : "font-medium text-white/70 hover:text-white"
                            }
                        `
                        : navLinkClass
                }
                style={
                    mobile
                        ? {
                            transitionDelay: menuOpen
                                ? `${index * 35}ms`
                                : "0ms",
                        }
                        : undefined
                }
            >
                {item.label}

                {mobile && (
                    <span
                        className="text-sm text-white/35"
                        aria-hidden="true"
                    >
                        →
                    </span>
                )}
            </NavLink>
        );
    };

    // Theme selector shared between desktop and mobile
    const ThemeOptions = ({ mobile = false }) => (
        <div
            className={
                mobile
                    ? "mt-5"
                    : "absolute right-0 top-[calc(100%+10px)] z-50 w-48"
            }
        >
            <div
                className="
                    overflow-hidden rounded-xl
                    border border-white/[0.09]
                    bg-[#18181D]/95
                    p-1.5 text-white
                    shadow-lg shadow-black/10
                    backdrop-blur-xl
                "
            >
                <p className="px-3 pb-2 pt-2 text-[10px] font-medium uppercase tracking-wider text-white/45">
                    Appearance
                </p>

                {["light", "dark"].map((option) => (
                    <button
                        key={option}
                        type="button"
                        role="menuitemradio"
                        aria-checked={theme === option}
                        onClick={() => handleThemeChange(option)}
                        className={`
                            flex w-full items-center justify-between
                            rounded-lg px-3 py-2.5
                            text-sm capitalize
                            transition-colors duration-200
                            ${theme === option
                                ? "bg-white/[0.08] text-white"
                                : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                            }
                        `}
                    >
                        <span>{option} mode</span>

                        {theme === option && (
                            <span
                                className="text-[#E31B23]"
                                aria-hidden="true"
                            >
                                ✓
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <header
            className="
                fixed inset-x-0 top-0 z-50 w-full
                border-b border-white/[0.06]
                bg-[#101014]/30 text-white
                backdrop-blur-md
                transition-colors duration-300
            "
        >
            {/* Main Header */}
            <div
                className="
                    mx-auto flex min-h-[76px]
                    max-w-[1440px] items-center
                    justify-between gap-4
                    px-4 py-3
                    sm:px-6 md:gap-6 md:px-8
                    lg:px-12
                "
            >
                {/* Church Brand */}
                <NavLink
                    to="/"
                    onClick={closeMenu}
                    className="
                        group flex min-w-0 shrink-0
                        items-center gap-3
                    "
                    aria-label="Living Faith Church Iguosa home"
                >
                    {/* Logo */}
                    <div
                        className="
                            flex h-11 w-11 shrink-0
                            items-center justify-center
                            rounded-full
                            bg-white/[0.04] p-1
                            sm:h-12 sm:w-12
                        "
                    >
                        <img
                            src="/Big_Winnerslogo.png"
                            alt="Living Faith Church Iguosa logo"
                            className="h-full w-full object-contain"
                        />
                    </div>

                    {/* Church Name */}
                    <div className="min-w-0">
                        <h2
                            className="
                                whitespace-nowrap
                                text-[10px] font-bold
                                leading-tight tracking-wide
                                text-white
                                sm:text-xs md:text-sm
                                lg:text-base
                            "
                        >
                            LIVING FAITH CHURCH
                            <span className="text-[#E31B23]">
                                {" "}IGUOSA
                            </span>
                        </h2>

                        <p
                            className="
                                mt-1 whitespace-nowrap
                                text-[9px] font-medium
                                text-white/60
                                sm:text-[10px] md:text-xs
                            "
                        >
                            Building Lives, Raising Champions
                        </p>
                    </div>
                </NavLink>

                {/* Desktop Navigation */}
                <nav
                    className="
                        hidden items-center gap-6
                        md:flex lg:gap-8
                    "
                    aria-label="Main navigation"
                >
                    {navItems.map((item, index) =>
                        renderNavItem(item, index)
                    )}

                    {/* Theme Selector */}
                    <div className="relative ml-1">
                        <button
                            type="button"
                            onClick={() => setThemeOpen(!themeOpen)}
                            aria-expanded={themeOpen}
                            aria-haspopup="menu"
                            className="
                                flex items-center gap-2
                                rounded-full
                                border border-white/[0.12]
                                bg-white/[0.04]
                                px-4 py-2.5
                                text-xs font-medium
                                text-white/90
                                transition-colors duration-200
                                hover:bg-white/[0.09]
                            "
                        >
                            <span>
                                {theme === "dark"
                                    ? "Dark"
                                    : "Light"}
                            </span>

                            <span className="text-white/45">
                                mode
                            </span>

                            <svg
                                viewBox="0 0 20 20"
                                fill="none"
                                className={`
                                    h-3.5 w-3.5
                                    text-white/60
                                    transition-transform duration-200
                                    ${themeOpen ? "rotate-180" : ""}
                                `}
                                aria-hidden="true"
                            >
                                <path
                                    d="m5 7.5 5 5 5-5"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        {themeOpen && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Close theme selector"
                                    className="fixed inset-0 z-40 cursor-default"
                                    onClick={() => setThemeOpen(false)}
                                />

                                <div
                                    role="menu"
                                    className="relative z-50"
                                >
                                    <ThemeOptions />
                                </div>
                            </>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    onClick={() => {
                        setMenuOpen(!menuOpen);
                        setThemeOpen(false);
                    }}
                    aria-label={
                        menuOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={menuOpen}
                    className="
                        relative z-[60]
                        flex h-10 w-10 shrink-0
                        flex-col items-center justify-center
                        gap-[5px] rounded-lg
                        border border-white/[0.12]
                        bg-white/[0.04]
                        transition-colors duration-200
                        hover:bg-white/[0.08]
                        md:hidden
                    "
                >
                    <span
                        className={`
                            h-[2px] w-5 rounded-full
                            bg-white
                            transition-all duration-300
                            ${menuOpen
                                ? "translate-y-[7px] rotate-45"
                                : ""
                            }
                        `}
                    />

                    <span
                        className={`
                            h-[2px] w-5 rounded-full
                            bg-white
                            transition-all duration-300
                            ${menuOpen
                                ? "opacity-0"
                                : "opacity-100"
                            }
                        `}
                    />

                    <span
                        className={`
                            h-[2px] w-5 rounded-full
                            bg-white
                            transition-all duration-300
                            ${menuOpen
                                ? "-translate-y-[7px] -rotate-45"
                                : ""
                            }
                        `}
                    />
                </button>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`
                    absolute inset-x-0 top-full
                    overflow-hidden
                    border-b border-white/[0.07]
                    bg-[#101014]/95
                    text-white backdrop-blur-xl
                    transition-all duration-300
                    ease-in-out md:hidden
                    ${menuOpen
                        ? "visible max-h-[520px] translate-y-0 opacity-100"
                        : "invisible max-h-0 -translate-y-2 opacity-0"
                    }
                `}
                aria-hidden={!menuOpen}
            >
                <nav
                    className="
                        mx-auto flex max-w-[1440px]
                        flex-col px-5 pb-5 pt-3
                        sm:px-8
                    "
                    aria-label="Mobile navigation"
                >
                    {navItems.map((item, index) =>
                        renderNavItem(item, index, true)
                    )}

                    {/* Mobile Theme Selector */}
                    <div className="mt-5">
                        <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-white/45">
                            Appearance
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                            {["light", "dark"].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => changeTheme(option)}
                                    aria-pressed={theme === option}
                                    className={`
                                        rounded-lg border
                                        px-3 py-3
                                        text-sm font-medium capitalize
                                        transition-colors duration-200
                                        ${theme === option
                                            ? "border-[#E31B23]/40 bg-white/[0.06] text-white"
                                            : "border-white/[0.08] text-white/65 hover:bg-white/[0.04]"
                                        }
                                    `}
                                >
                                    {option} mode
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="mt-5 text-center text-[10px] text-white/40">
                        Building Lives, Raising Champions
                    </p>
                </nav>
            </div>
        </header>
    );
}

export default Header;