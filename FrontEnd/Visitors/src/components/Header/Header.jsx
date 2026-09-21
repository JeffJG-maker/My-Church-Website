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
      after:bg-[#f7b731]
      after:transition-all
      after:duration-300

      ${isActive
            ? "font-bold italic tracking-wide after:w-full"
            : "after:w-0 hover:after:w-full"
        }

      text-white
    `;

    return (
        <header
            className="
        fixed
        left-0
        top-0
        z-50
        w-full

        border-b
        border-white/10

        bg-[#0b0b25]/50
        backdrop-blur-md

        text-white

        transition-all
        duration-500
      "
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
                        src="/media/Big Winnersogo.png"
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
                            className="
                text-sm
                font-bold
                leading-tight
                sm:text-base
                md:text-lg
              "
                        >
                            LIVING FAITH CHURCH IGUOSA
                        </h2>

                        <p
                            className="
                mt-0.5
                text-[10px]
                text-white/70
                sm:text-xs
              "
                        >
                            Building Lives, Raising Champions
                        </p>
                    </div>
                </NavLink>

                {/* DESKTOP NAVIGATION */}
                <nav className="hidden items-center gap-7 md:flex">

                    <NavLink
                        to="/"
                        className={navLinkClass}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/login"
                        className={navLinkClass}
                    >
                        Login
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={navLinkClass}
                    >
                        About
                    </NavLink>

                    <NavLink
                        to="/contact"
                        className={navLinkClass}
                    >
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
                bg-[#f7b731]
                px-4
                py-2
                text-xs
                font-semibold
                text-[#0b0b25]

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:bg-[#ffd166]
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
                                className="
                  absolute
                  right-0
                  top-[calc(100%+10px)]
                  min-w-[130px]
                  overflow-hidden
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  py-1
                  text-sm
                  text-slate-700
                  shadow-xl

                  dark:border-white/10
                  dark:bg-[#181a38]
                  dark:text-white
                "
                            >
                                <button
                                    type="button"
                                    onClick={() => changeTheme("light")}
                                    className="
                    block
                    w-full
                    px-4
                    py-2.5
                    text-left
                    transition
                    hover:bg-slate-100
                    dark:hover:bg-white/10
                  "
                                >
                                    Light
                                </button>

                                <button
                                    type="button"
                                    onClick={() => changeTheme("dark")}
                                    className="
                    block
                    w-full
                    px-4
                    py-2.5
                    text-left
                    transition
                    hover:bg-slate-100
                    dark:hover:bg-white/10
                  "
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
              bg-white
              transition-all
              duration-300
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
              bg-white
              transition-all
              duration-300
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
              bg-white
              transition-all
              duration-300
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
          bg-white
          shadow-2xl
          transition-all
          duration-500
          md:hidden

          dark:bg-[#10122d]

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
              border-slate-200
              px-2
              py-4
              text-sm
              font-medium
              text-[#030e5c]
              transition
              dark:border-white/10
              dark:text-white

              ${isActive
                                ? "font-bold text-[#bd1717] dark:text-[#f7b731]"
                                : ""
                            }
            `}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/login"
                        onClick={closeMenu}
                        className="
              border-b
              border-slate-200
              px-2
              py-4
              text-sm
              font-medium
              text-[#030e5c]
              dark:border-white/10
              dark:text-white
            "
                    >
                        Login
                    </NavLink>

                    <NavLink
                        to="/about"
                        onClick={closeMenu}
                        className={({ isActive }) => `
              border-b
              border-slate-200
              px-2
              py-4
              text-sm
              font-medium
              text-[#030e5c]
              transition
              dark:border-white/10
              dark:text-white

              ${isActive
                                ? "font-bold text-[#bd1717] dark:text-[#f7b731]"
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
              border-slate-200
              px-2
              py-4
              text-sm
              font-medium
              text-[#030e5c]
              transition
              dark:border-white/10
              dark:text-white

              ${isActive
                                ? "font-bold text-[#bd1717] dark:text-[#f7b731]"
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
                            className="
                flex-1
                rounded-md
                border
                border-slate-300
                px-4
                py-2.5
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-100

                dark:border-white/20
                dark:text-white
                dark:hover:bg-white/10
              "
                        >
                            Light
                        </button>

                        <button
                            type="button"
                            onClick={() => changeTheme("dark")}
                            className="
                flex-1
                rounded-md
                bg-[#0b0b25]
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#19194a]
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