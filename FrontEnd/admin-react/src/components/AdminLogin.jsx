import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faLock,
    faEye,
    faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/admin-auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok || !data.success || !data.token) {
                throw new Error(data.message || "Unable to sign in. Please try again.");
            }

            onLogin({
                token: data.token,
                admin: data.admin,
            });
        } catch (requestError) {
            setError(
                requestError.message ||
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#E3E1DE] px-4 py-8 transition-colors dark:bg-[#101112] sm:px-6">

            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="grid w-full max-w-6xl overflow-hidden rounded-[8px] bg-white shadow-[0_15px_50px_rgba(0,0,0,0.10)] dark:bg-[#191B1D] dark:shadow-[0_15px_50px_rgba(0,0,0,0.25)] lg:min-h-[650px] lg:grid-cols-2"
            >

                {/* LEFT PANEL */}
                <div className="relative hidden flex-col justify-between overflow-hidden bg-[#171717] p-10 text-white lg:flex xl:p-12">

                    {/* Minimal church branding */}
                    <div className="relative z-10">
                        <p className="text-sm font-semibold tracking-[0.12em]">
                            LIVING FAITH
                            <span className="ml-1 text-[#D91620]">CHURCH</span>
                        </p>

                        <p className="mt-1 text-xs tracking-wide text-white/45">
                            Iguosa
                        </p>
                    </div>

                    {/* Simple bottom message */}
                    <div className="relative z-10 max-w-md">

                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[#D91620]">
                            Church Administration
                        </p>

                        <h2 className="text-4xl font-semibold leading-tight tracking-tight">
                            Manage your
                            <br />
                            church website.
                        </h2>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
                            Keep sermons, events, and church information up to date.
                        </p>

                    </div>

                </div>

                {/* RIGHT PANEL */}
                <div className="flex items-center justify-center bg-[#E3E1DE] px-6 py-12 transition-colors dark:bg-[#191B1D] sm:px-10 lg:px-12 xl:px-16">

                    <div className="w-full max-w-[390px]">

                        {/* Mobile branding */}
                        <div className="mb-10 lg:hidden">
                            <p className="text-sm font-semibold tracking-wide text-gray-900 dark:text-white">
                                LIVING FAITH
                                <span className="ml-1 text-[#D91620]">CHURCH</span>
                            </p>

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Iguosa
                            </p>
                        </div>

                        {/* Login heading */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-semibold tracking-tight text-[#171717] dark:text-white">
                                Welcome back
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                Enter your email and password to access the administration portal.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="admin-email"
                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Email
                                </label>

                                <div className="relative">
                                    <FontAwesomeIcon
                                        icon={faEnvelope}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        id="admin-email"
                                        type="email"
                                        autoComplete="username"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full rounded-lg bg-[#F4F3F1] py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#D91620]/20 dark:bg-[#101112] dark:text-white dark:placeholder:text-gray-500 dark:focus:bg-[#151617]"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="admin-password"
                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        id="admin-password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full rounded-lg bg-[#F4F3F1] py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#D91620]/20 dark:bg-[#101112] dark:text-white dark:placeholder:text-gray-500 dark:focus:bg-[#151617]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#D91620]"
                                    >
                                        <FontAwesomeIcon
                                            icon={showPassword ? faEyeSlash : faEye}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    role="alert"
                                    className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Sign in */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-lg bg-[#D91620] py-3.5 text-sm font-semibold text-white shadow-[0_5px_15px_rgba(217,22,32,0.15)] transition-all duration-200 hover:bg-[#B9121B] hover:shadow-[0_8px_20px_rgba(217,22,32,0.20)] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? "Signing in..." : "Sign in"}
                            </button>

                        </form>

                        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
                            Authorized church administrators only.
                        </p>

                    </div>

                </div>

            </motion.div>
        </div>
    );
}

export default AdminLogin;