import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [themeOpen, setThemeOpen] = useState(false);

    const { theme, setTheme } = useTheme();

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const changeTheme = (selectedTheme) => {
        setTheme(selectedTheme);
        setThemeOpen(false);
    };

    const navLinkClass = ({ isActive }) =>
        `
        relative
        cursor-pointer
        text-sm
        font-medium
        transition-all
        duration-300

        after:absolute
        after:-bottom-2
        after:left-0
        after:h-[2px]
        after:bg-[#E31B23]
        after:transition-all
        after:duration-300

        ${isActive
            ? "font-bold tracking-wide after:w-full text-[#E31B23]"
            : `after:w-0 hover:after:w-full ${theme === "dark"
                ? "text-white hover:text-[#F7941D]"
                : "text-[#171717] hover:text-[#E31B23]"
            }`
        }
        ${isActive
            ? ""
            : ""
        }
        ${theme === "dark"
            ? isActive
                ? "text-[#F7941D]"
                : ""
            : ""
        }
    `;

    return (
        <header
            className={`
                fixed
                left-0
                top-0
                z-50
                w-full
                border-b
                backdrop-blur-md
                transition-all
                duration-500
                ${theme === "dark"
                    ? "border-white/10 bg-[#101112]/70 text-white"
                    : "border-gray-200/80 bg-white/90 text-[#171717]"
                }
            `}
        >
            <div
                className="
                    mx-auto
                    flex
                    min-h-[76px]
                    max-w-[1400px]
                    items-center
                    justify-between
                    gap-6
                    px-5
                    py-3
                    md:px-8
                    lg:px-10
                "
            >
                {/* BRAND */}
                <NavLink
                    to="/"
                    onClick={closeMenu}
                    className="flex items-center gap-3"
                >
                    <img
                        src="/media/Big_Winnersogo.png"
                        alt="Living Faith Church Iguosa"
                        className="
                            h-[52px]
                            w-[64px]
                            object-contain
                            sm:h-[58px]
                            sm:w-[70px]
                        "
                    />

                    <div className="hidden sm:block">
                        <h2
                            className={`
                                text-sm
                                font-bold
                                leading-tight
                                sm:text-base
                                md:text-lg
                                ${theme === "dark"
                                    ? "text-white"
                                    : "text-[#171717]"
                                }
                            `}
                        >
                            LIVING FAITH CHURCH IGUOSA
                        </h2>

                        <p
                            className={`
                                mt-0.5
                                text-[10px]
                                sm:text-xs
                                ${theme === "dark"
                                    ? "text-white/60"
                                    : "text-gray-500"
                                }
                            `}
                        >
                            Building Lives, Raising Champions
                        </p>
                    </div>
                </NavLink>

                {/* DESKTOP NAVIGATION */}
                <nav className="hidden items-center gap-7 md:flex">
                    <NavLink to="/" className={navLinkClass}>
                        Home
                    </NavLink>

                    <NavLink to="/login" className={navLinkClass}>
                        Login
                    </NavLink>

                    <NavLink to="/about" className={navLinkClass}>
                        About
                    </NavLink>

                    <NavLink to="/contact" className={navLinkClass}>
                        Contact
                    </NavLink>

                    {/* THEME */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setThemeOpen(!themeOpen)}
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-md
                                bg-[#E31B23]
                                px-4
                                py-2
                                text-xs
                                font-semibold
                                text-white
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:bg-[#C9151C]
                            "
                        >
                            <span>
                                {theme === "dark" ? "Dark" : "Light"}
                            </span>

                            <span
                                className={`transition-transform duration-300 ${themeOpen ? "rotate-180" : ""
                                    }`}
                            >
                                ↓
                            </span>
                        </button>

                        {themeOpen && (
                            <div
                                className={`
                                    absolute
                                    right-0
                                    top-[calc(100%+10px)]
                                    min-w-[130px]
                                    overflow-hidden
                                    rounded-lg
                                    border
                                    py-1
                                    text-sm
                                    shadow-xl
                                    ${theme === "dark"
                                        ? "border-[#27292d] bg-[#181a1d] text-white"
                                        : "border-gray-200 bg-white text-[#171717]"
                                    }
                                `}
                            >
                                <button
                                    type="button"
                                    onClick={() => changeTheme("light")}
                                    className={`
                                        block
                                        w-full
                                        px-4
                                        py-2.5
                                        text-left
                                        transition
                                        ${theme === "dark"
                                            ? "hover:bg-[#27292d]"
                                            : "hover:bg-[#FFF1E6]"
                                        }
                                    `}
                                >
                                    Light
                                </button>

                                <button
                                    type="button"
                                    onClick={() => changeTheme("dark")}
                                    className={`
                                        block
                                        w-full
                                        px-4
                                        py-2.5
                                        text-left
                                        transition
                                        ${theme === "dark"
                                            ? "hover:bg-[#27292d]"
                                            : "hover:bg-[#FFF1E6]"
                                        }
                                    `}
                                >
                                    Dark
                                </button>
                            </div>
                        )}
                    </div>
                </nav>

                {/* MOBILE MENU BUTTON */}
                <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                    className="
                        relative
                        z-[60]
                        flex
                        h-10
                        w-10
                        flex-col
                        items-center
                        justify-center
                        gap-1.5
                        md:hidden
                    "
                >
                    <span
                        className={`
                            h-[3px]
                            w-7
                            rounded-full
                            transition-all
                            duration-300
                            ${theme === "dark"
                                ? "bg-white"
                                : "bg-[#171717]"
                            }
                            ${menuOpen
                                ? "translate-y-[9px] rotate-45"
                                : ""
                            }
                        `}
                    />

                    <span
                        className={`
                            h-[3px]
                            w-7
                            rounded-full
                            transition-all
                            duration-300
                            ${theme === "dark"
                                ? "bg-white"
                                : "bg-[#171717]"
                            }
                            ${menuOpen
                                ? "opacity-0"
                                : "opacity-100"
                            }
                        `}
                    />

                    <span
                        className={`
                            h-[3px]
                            w-7
                            rounded-full
                            transition-all
                            duration-300
                            ${theme === "dark"
                                ? "bg-white"
                                : "bg-[#171717]"
                            }
                            ${menuOpen
                                ? "-translate-y-[9px] -rotate-45"
                                : ""
                            }
                        `}
                    />
                </button>
            </div>

            {/* MOBILE NAVIGATION */}
            <div
                className={`
                    absolute
                    right-0
                    top-full
                    w-full
                    overflow-hidden
                    border-t
                    shadow-2xl
                    transition-all
                    duration-500
                    md:hidden
                    ${theme === "dark"
                        ? "border-[#27292d] bg-[#141618]"
                        : "border-gray-200 bg-white"
                    }

                    ${menuOpen
                        ? "max-h-[500px] translate-x-0 opacity-100"
                        : "pointer-events-none max-h-0 translate-x-full opacity-0"
                    }
                `}
            >
                <nav className="flex flex-col px-6 py-5">
                    <NavLink
                        to="/"
                        onClick={closeMenu}
                        className={({ isActive }) => `
                            border-b
                            px-2
                            py-4
                            text-sm
                            font-medium
                            transition
                            ${theme === "dark"
                                ? "border-[#27292d] text-gray-300 hover:text-[#F7941D]"
                                : "border-gray-200 text-gray-700 hover:text-[#E31B23]"
                            }
                            ${isActive
                                ? "font-bold !text-[#E31B23]"
                                : ""
                            }
                        `}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/login"
                        onClick={closeMenu}
                        className={({ isActive }) => `
                            border-b
                            px-2
                            py-4
                            text-sm
                            font-medium
                            transition
                            ${theme === "dark"
                                ? "border-[#27292d] text-gray-300 hover:text-[#F7941D]"
                                : "border-gray-200 text-gray-700 hover:text-[#E31B23]"
                            }
                            ${isActive
                                ? "font-bold !text-[#E31B23]"
                                : ""
                            }
                        `}
                    >
                        Login
                    </NavLink>

                    <NavLink
                        to="/about"
                        onClick={closeMenu}
                        className={({ isActive }) => `
                            border-b
                            px-2
                            py-4
                            text-sm
                            font-medium
                            transition
                            ${theme === "dark"
                                ? "border-[#27292d] text-gray-300 hover:text-[#F7941D]"
                                : "border-gray-200 text-gray-700 hover:text-[#E31B23]"
                            }
                            ${isActive
                                ? "font-bold !text-[#E31B23]"
                                : ""
                            }
                        `}
                    >
                        About
                    </NavLink>

                    <NavLink
                        to="/contact"
                        onClick={closeMenu}
                        className={({ isActive }) => `
                            border-b
                            px-2
                            py-4
                            text-sm
                            font-medium
                            transition
                            ${theme === "dark"
                                ? "border-[#27292d] text-gray-300 hover:text-[#F7941D]"
                                : "border-gray-200 text-gray-700 hover:text-[#E31B23]"
                            }
                            ${isActive
                                ? "font-bold !text-[#E31B23]"
                                : ""
                            }
                        `}
                    >
                        Contact
                    </NavLink>

                    {/* MOBILE THEME */}
                    <div className="flex gap-3 px-2 py-5">
                        <button
                            type="button"
                            onClick={() => changeTheme("light")}
                            className={`
                                flex-1
                                rounded-md
                                border
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                transition
                                ${theme === "dark"
                                    ? "border-[#27292d] bg-[#181a1d] text-gray-300 hover:bg-[#27292d] hover:text-white"
                                    : "border-[#E31B23] bg-[#FFF1E6] text-[#E31B23] hover:bg-[#E31B23] hover:text-white"
                                }
                            `}
                        >
                            Light
                        </button>

                        <button
                            type="button"
                            onClick={() => changeTheme("dark")}
                            className="
                                flex-1
                                rounded-md
                                bg-[#E31B23]
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-[#C9151C]
                            "
                        >
                            Dark
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;