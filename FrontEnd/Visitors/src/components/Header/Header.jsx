
import { useState } from "react";
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

    const navItems = [
        { to: "/", label: "Home", end: true },
        { to: "/about", label: "About Us" },
        { to: "/sermons", label: "Sermons" },
        { to: "/events", label: "Events" },
        { to: "/contact", label: "Contact" },
    ];

    const navLinkClass = ({ isActive }) => `
        relative whitespace-nowrap py-2 text-sm font-medium
        text-white/80 transition-colors duration-300
        after:absolute after:bottom-0 after:left-0 after:h-[2px]
        after:rounded-full after:bg-[#E31B23]
        after:transition-all after:duration-300
        ${isActive
            ? "font-semibold !text-white after:w-full"
            : "after:w-0 hover:text-white hover:after:w-full"
        }
    `;

    const isCurrentRoute = (item) => {
        return item.end
            ? location.pathname === "/" && !location.hash
            : location.pathname === item.to ||
            location.pathname.startsWith(`${item.to}/`);
    };

    const renderNavItem = (item, index = 0, mobile = false) => (
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
                        border-b border-white/[0.08]
                        py-4 text-sm font-medium
                        transition-colors duration-200
                        ${isActive
                            ? "font-semibold text-white"
                            : "text-white/75 hover:text-white"
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
                    className={`text-lg ${isCurrentRoute(item)
                            ? "text-[#E31B23]"
                            : "text-white/40"
                        }`}
                    aria-hidden="true"
                >
                    →
                </span>
            )}
        </NavLink>
    );

    return (
        <header
            className="
                fixed inset-x-0 top-0 z-50 w-full
                border-b border-white/[0.08]
                bg-[#101014]/25 text-white
                backdrop-blur-[10px]
                transition-colors duration-300
            "
        >
            <div
                className="
                    mx-auto flex min-h-[78px] max-w-[1440px]
                    items-center justify-between gap-4
                    px-4 py-3 sm:px-6 md:gap-6 md:px-8 lg:px-12
                "
            >
                {/* BRAND */}
                <NavLink
                    to="/"
                    onClick={closeMenu}
                    className="group flex min-w-0 shrink-0 items-center gap-3 sm:gap-3.5"
                    aria-label="Living Faith Church Iguosa home"
                >
                    <div
                        className="
                            flex h-11 w-11 shrink-0 items-center
                            justify-center rounded-full border
                            border-white/10 bg-white/[0.03] p-1
                            transition-transform duration-300
                            group-hover:scale-[1.04]
                            sm:h-12 sm:w-12 md:h-[54px] md:w-[54px]
                        "
                    >
                        <img
                            src="/Big_Winnerslogo.png"
                            alt="Living Faith Church Iguosa logo"
                            className="h-full w-full object-contain"
                        />
                    </div>

                    <div className="min-w-0">
                        <h2
                            className="
                                whitespace-nowrap text-[10px] font-extrabold
                                leading-tight tracking-[0.035em] text-white
                                sm:text-xs md:text-sm lg:text-base
                            "
                        >
                            LIVING FAITH CHURCH
                            <span className="text-[#E31B23]"> IGUOSA</span>
                        </h2>

                        <div className="mt-1.5 flex items-center gap-2">
                            <span className="h-[2px] w-5 rounded-full bg-[#E31B23]" />
                            <p className="whitespace-nowrap text-[9px] font-medium tracking-wide text-white/65 sm:text-[10px] md:text-xs">
                                Building Lives, Raising Champions
                            </p>
                        </div>
                    </div>
                </NavLink>

                {/* DESKTOP NAVIGATION */}
                <nav
                    className="hidden items-center gap-6 md:flex lg:gap-8"
                    aria-label="Main navigation"
                >
                    {navItems.map((item, index) =>
                        renderNavItem(item, index)
                    )}

                    {/* THEME SELECTOR */}
                    <div className="relative ml-1">
                        <button
                            type="button"
                            onClick={() => setThemeOpen(!themeOpen)}
                            aria-expanded={themeOpen}
                            aria-haspopup="menu"
                            className="
                                flex items-center gap-2.5 rounded-full
                                border border-white/15 bg-white/[0.04]
                                px-4 py-2.5 text-xs font-semibold text-white
                                transition-all duration-300
                                hover:-translate-y-0.5 hover:bg-white/[0.09]
                            "
                        >
                            <span
                                className={`h-2 w-2 rounded-full ${theme === "dark"
                                        ? "bg-[#E31B23]"
                                        : "bg-amber-400"
                                    }`}
                            />

                            {theme === "dark" ? "Dark mode" : "Light mode"}

                            <svg
                                viewBox="0 0 20 20"
                                fill="none"
                                className={`h-3.5 w-3.5 transition-transform duration-300 ${themeOpen ? "rotate-180" : ""
                                    }`}
                                aria-hidden="true"
                            >
                                <path
                                    d="m5 7.5 5 5 5-5"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
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
                                    className="
                                        absolute right-0 top-[calc(100%+14px)]
                                        z-50 w-48 rounded-2xl border
                                        border-white/10 bg-[#18181D]/90
                                        p-2 text-white shadow-xl
                                        backdrop-blur-md
                                    "
                                >
                                    <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                                        Appearance
                                    </p>

                                    {["light", "dark"].map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            role="menuitemradio"
                                            aria-checked={theme === option}
                                            onClick={() =>
                                                changeTheme(option)
                                            }
                                            className={`
                                                flex w-full items-center
                                                justify-between rounded-xl
                                                px-4 py-3 text-sm capitalize
                                                transition-colors
                                                ${theme === option
                                                    ? "bg-white/[0.08] text-white"
                                                    : "text-white/75 hover:bg-white/[0.06] hover:text-white"
                                                }
                                            `}
                                        >
                                            {option} mode

                                            {theme === option && (
                                                <span className="text-[#E31B23]">
                                                    ✓
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </nav>

                {/* MOBILE MENU BUTTON */}
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
                        relative z-[60] flex h-11 w-11 shrink-0
                        flex-col items-center justify-center gap-[5px]
                        rounded-xl border border-white/10
                        bg-white/[0.03] transition-all duration-300
                        hover:bg-white/[0.08] md:hidden
                    "
                >
                    <span
                        className={`h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""
                            }`}
                    />
                    <span
                        className={`h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : "opacity-100"
                            }`}
                    />
                    <span
                        className={`h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${menuOpen
                                ? "-translate-y-[7px] -rotate-45"
                                : ""
                            }`}
                    />
                </button>
            </div>

            {/* MOBILE NAVIGATION */}
            <div
                className={`
                    absolute inset-x-0 top-full overflow-hidden
                    border-b border-white/[0.08]
                    bg-[#101014]/40 text-white
                    backdrop-blur-[6px]
                    transition-all duration-300 ease-in-out md:hidden
                    ${menuOpen
                        ? "visible max-h-[520px] translate-y-0 opacity-100"
                        : "invisible max-h-0 -translate-y-2 opacity-0"
                    }
                `}
                aria-hidden={!menuOpen}
            >
                <nav
                    className="mx-auto flex max-w-[1440px] flex-col px-5 pb-5 pt-3 sm:px-8"
                    aria-label="Mobile navigation"
                >
                    {navItems.map((item, index) =>
                        renderNavItem(item, index, true)
                    )}

                    {/* MOBILE THEME SELECTOR */}
                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                        <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/45">
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
                                        rounded-xl border px-3 py-3
                                        text-sm font-semibold capitalize
                                        transition-all duration-200
                                        ${theme === option
                                            ? "border-[#E31B23]/40 bg-white/[0.04] text-white"
                                            : "border-white/[0.08] text-white/65 hover:bg-white/[0.04]"
                                        }
                                    `}
                                >
                                    {option} mode
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="mt-5 text-center text-[10px] tracking-wide text-white/40">
                        Building Lives, Raising Champions
                    </p>
                </nav>
            </div>
        </header>
    );
}

export default Header;
