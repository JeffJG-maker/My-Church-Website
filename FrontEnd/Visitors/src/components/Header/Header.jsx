
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

    const navLinkClass = ({ isActive }) => `
    relative
    cursor-pointer
    text-sm
    font-medium
    text-white
    transition-all
    duration-300
    after:absolute
    after:-bottom-2
    after:left-0
    after:h-[2px]
    after:bg-[#F7941D]
    after:transition-all
    after:duration-300
    ${isActive
            ? "font-bold tracking-wide text-[#F7941D] after:w-full"
            : "after:w-0 hover:text-[#F7941D] hover:after:w-full"
        }
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
        bg-[#080B1C]/75
        text-white
        shadow-sm
        backdrop-blur-md
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
          gap-4
          px-4
          py-3
          sm:px-5
          md:gap-6
          md:px-8
          lg:px-10
        "
            >
                {/* BRAND */}
                <NavLink
                    to="/"
                    onClick={closeMenu}
                    className="flex min-w-0 shrink-0 items-center gap-3 sm:gap-4"
                >
                    <img
                        src="/Big_Winnerslogo.png"
                        alt="Living Faith Church Iguosa logo"
                        className="
              h-10
              w-10
              shrink-0
              object-contain
              sm:h-12
              sm:w-12
              md:h-[52px]
              md:w-[52px]
            "
                    />

                    <div className="min-w-0">
                        <h2
                            className="
                whitespace-nowrap
                text-[11px]
                font-extrabold
                leading-tight
                tracking-tight
                text-white
                sm:text-sm
                md:text-base
                lg:text-lg
              "
                        >
                            LIVING FAITH CHURCH IGUOSA
                        </h2>

                        <p
                            className="
                mt-1
                text-[9px]
                leading-tight
                text-white/75
                sm:text-xs
              "
                        >
                            Building Lives, Raising Champions
                        </p>
                    </div>
                </NavLink>

                {/* DESKTOP NAVIGATION */}
                <nav className="hidden items-center gap-5 lg:gap-7 md:flex">
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

                    {/* THEME DROPDOWN */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setThemeOpen(!themeOpen)}
                            aria-expanded={themeOpen}
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
                            <span>{theme === "dark" ? "Dark" : "Light"}</span>

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
                  border-white/10
                  bg-[#080B1C]/95
                  py-1
                  text-sm
                  text-white
                  shadow-xl
                  backdrop-blur-xl
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
                    hover:bg-white/10
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
                    hover:bg-white/10
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
            shrink-0
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
              ${menuOpen ? "translate-y-[9px] rotate-45" : ""}
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
              ${menuOpen ? "opacity-0" : "opacity-100"}
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
              ${menuOpen ? "-translate-y-[9px] -rotate-45" : ""}
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
          border-white/10
          bg-[#080B1C]/95
          text-white
          shadow-2xl
          backdrop-blur-xl
          transition-all
          duration-500
          md:hidden
          ${menuOpen
                        ? "max-h-[500px] translate-x-0 opacity-100"
                        : "pointer-events-none max-h-0 translate-x-full opacity-0"
                    }
        `}
            >
                <nav className="flex flex-col px-6 py-5">
                    {[
                        { to: "/", label: "Home" },
                        { to: "/login", label: "Login" },
                        { to: "/about", label: "About" },
                        { to: "/contact", label: "Contact" },
                    ].map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={closeMenu}
                            className={({ isActive }) => `
                border-b
                border-white/10
                px-2
                py-4
                text-sm
                font-medium
                text-white/90
                transition
                hover:text-[#F7941D]
                ${isActive
                                    ? "font-bold !text-[#F7941D]"
                                    : ""
                                }
              `}
                        >
                            {item.label}
                        </NavLink>
                    ))}

                    {/* MOBILE THEME OPTIONS */}
                    <div className="flex gap-3 px-2 py-5">
                        <button
                            type="button"
                            onClick={() => changeTheme("light")}
                            className="
                flex-1
                rounded-md
                border
                border-white/20
                bg-white/10
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-white/20
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
