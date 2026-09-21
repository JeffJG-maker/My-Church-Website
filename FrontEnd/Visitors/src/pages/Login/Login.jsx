import { useState } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";

function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main
            className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-white
        px-5
        pb-16
        pt-28
        text-[#030e5c]
        transition-colors
        duration-500
        dark:bg-[#0f1026]
        dark:text-white
      "
        >
            <div
                className="
          grid
          w-full
          max-w-6xl
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-[0_15px_50px_rgba(3,14,92,0.12)]
          dark:bg-[#181a38]
          dark:shadow-black/30
          lg:grid-cols-2
        "
            >
                {/* LEFT SIDE */}
                <div
                    className="
            relative
            hidden
            min-h-[650px]
            overflow-hidden
            lg:block
          "
                >
                    <img
                        src="/media/welcomePhoto.png"
                        alt="Living Faith Church"
                        className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
                    />

                    <div
                        className="
              absolute
              inset-0
              bg-gradient-to-br
              from-[#0b0b25]/95
              via-[#0b0b25]/65
              to-[#0b0b25]/30
            "
                    ></div>

                    <ScrollReveal>
                        <div
                            className="
                relative
                z-10
                flex
                h-full
                min-h-[650px]
                flex-col
                justify-between
                p-10
                text-white
              "
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src="/media/Big Winnersogo.png"
                                    alt="Living Faith Church Iguosa"
                                    className="h-14 w-16 object-contain"
                                />

                                <div>
                                    <h2 className="text-sm font-bold tracking-wide">
                                        LIVING FAITH CHURCH IGUOSA
                                    </h2>

                                    <p className="mt-1 text-xs text-white/70">
                                        Building Lives, Raising Champions
                                    </p>
                                </div>
                            </div>

                            <div className="max-w-md">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f7b731]">
                                    Welcome Back
                                </span>

                                <h1 className="mt-4 text-4xl font-semibold leading-tight">
                                    Building Lives,
                                    <br />
                                    <span className="text-[#f7b731]">
                                        Raising Champions
                                    </span>
                                </h1>

                                <p className="mt-5 text-sm leading-7 text-white/75">
                                    Sign in to access your church account and stay
                                    connected with the work God is doing through our
                                    family.
                                </p>
                            </div>

                            <p className="text-xs text-white/50">
                                Building Lives, Raising Champions
                            </p>
                        </div>
                    </ScrollReveal>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center justify-center p-7 sm:p-10 lg:p-12">
                    <ScrollReveal delay={150}>
                        <div className="w-full max-w-md">
                            {/* MOBILE BRAND */}
                            <div className="mb-8 flex items-center gap-3 lg:hidden">
                                <img
                                    src="/media/Big Winnersogo.png"
                                    alt="Living Faith Church Iguosa"
                                    className="h-12 w-14 object-contain"
                                />

                                <div>
                                    <h2 className="text-xs font-bold tracking-wide">
                                        LIVING FAITH CHURCH IGUOSA
                                    </h2>

                                    <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                                        Building Lives, Raising Champions
                                    </p>
                                </div>
                            </div>

                            {/* TITLE */}
                            <div>
                                <span
                                    className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-[#bd1717]
                    dark:text-[#f7b731]
                  "
                                >
                                    Member Portal
                                </span>

                                <h1 className="mt-3 text-3xl font-semibold">
                                    Welcome Back
                                </h1>

                                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                                    Sign in to continue to your account.
                                </p>
                            </div>

                            {/* FORM */}
                            <form
                                onSubmit={(event) => event.preventDefault()}
                                className="mt-8"
                            >
                                {/* EMAIL */}
                                <div>
                                    <label
                                        htmlFor="login-email"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Email Address
                                    </label>

                                    <div className="relative">
                                        <i
                                            className="
                        fas
                        fa-envelope
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-sm
                        text-gray-400
                      "
                                        ></i>

                                        <input
                                            id="login-email"
                                            type="email"
                                            placeholder="Enter your email"
                                            required
                                            className="
                        w-full
                        rounded-md
                        border
                        border-gray-200
                        bg-gray-50
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        outline-none
                        transition-all
                        duration-300
                        focus:border-[#f7b731]
                        focus:ring-2
                        focus:ring-[#f7b731]/20
                        dark:border-white/10
                        dark:bg-white/5
                        dark:text-white
                        dark:placeholder:text-gray-500
                      "
                                        />
                                    </div>
                                </div>

                                {/* PASSWORD */}
                                <div className="mt-5">
                                    <div className="mb-2 flex items-center justify-between">
                                        <label
                                            htmlFor="login-password"
                                            className="text-sm font-medium"
                                        >
                                            Password
                                        </label>

                                        <button
                                            type="button"
                                            className="
                        text-xs
                        font-medium
                        text-[#bd1717]
                        transition-colors
                        hover:text-[#a31313]
                        dark:text-[#f7b731]
                      "
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <i
                                            className="
                        fas
                        fa-lock
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-sm
                        text-gray-400
                      "
                                        ></i>

                                        <input
                                            id="login-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            required
                                            className="
                        w-full
                        rounded-md
                        border
                        border-gray-200
                        bg-gray-50
                        py-3
                        pl-11
                        pr-11
                        text-sm
                        outline-none
                        transition-all
                        duration-300
                        focus:border-[#f7b731]
                        focus:ring-2
                        focus:ring-[#f7b731]/20
                        dark:border-white/10
                        dark:bg-white/5
                        dark:text-white
                        dark:placeholder:text-gray-500
                      "
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((current) => !current)}
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        transition-colors
                        hover:text-[#bd1717]
                        dark:hover:text-[#f7b731]
                      "
                                        >
                                            <i
                                                className={
                                                    showPassword
                                                        ? "fas fa-eye-slash"
                                                        : "fas fa-eye"
                                                }
                                            ></i>
                                        </button>
                                    </div>
                                </div>

                                {/* REMEMBER ME */}
                                <label
                                    htmlFor="remember"
                                    className="
                    mt-5
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                    text-sm
                    text-gray-600
                    dark:text-gray-300
                  "
                                >
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        className="h-4 w-4 accent-[#f7b731]"
                                    />

                                    <span>Remember me</span>
                                </label>

                                {/* LOGIN BUTTON */}
                                <button
                                    type="submit"
                                    className="
                    mt-7
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-md
                    bg-[#bd1717]
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-[#a31313]
                    hover:shadow-lg
                    dark:bg-[#f7b731]
                    dark:text-[#0b0b25]
                    dark:hover:bg-[#e5a91f]
                  "
                                >
                                    Sign In
                                    <i className="fas fa-arrow-right"></i>
                                </button>
                            </form>

                            {/* DIVIDER */}
                            <div className="my-7 flex items-center gap-4">
                                <div className="h-px flex-1 bg-gray-200 dark:bg-white/10"></div>

                                <span className="text-xs text-gray-400">
                                    OR
                                </span>

                                <div className="h-px flex-1 bg-gray-200 dark:bg-white/10"></div>
                            </div>

                            {/* BACK TO WEBSITE */}
                            <Link
                                to="/"
                                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  border
                  border-gray-200
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-[#030e5c]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#f7b731]
                  hover:bg-[#f7b731]/10
                  dark:border-white/10
                  dark:text-white
                  dark:hover:border-[#f7b731]
                  dark:hover:bg-[#f7b731]/10
                "
                            >
                                <i className="fas fa-arrow-left"></i>
                                Back to Website
                            </Link>

                            {/* FOOTNOTE */}
                            <p className="mt-8 text-center text-xs text-gray-400">
                                Living Faith Church Iguosa
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </main>
    );
}

export default Login;