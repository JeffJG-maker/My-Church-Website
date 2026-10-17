
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faLock,
    faEye,
    faEyeSlash,
    faShieldHalved,
    faArrowRight,
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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok || !data.success || !data.token) {
                throw new Error(
                    data.message || "Unable to sign in. Please try again."
                );
            }

            onLogin({
                token: data.token,
                admin: data.admin,
            });
        } catch (requestError) {
            setError(
                requestError.message ||
                "Unable to connect to the server. Check that your backend is running."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl lg:grid-cols-2"
            >
                <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-10 text-white lg:flex">
                    <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

                    <div className="relative flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                            <FontAwesomeIcon
                                icon={faShieldHalved}
                                className="text-xl"
                            />
                        </div>
                        <div>
                            <p className="font-bold tracking-wide">
                                CHURCH ADMIN
                            </p>
                            <p className="text-xs text-blue-200">
                                Administration portal
                            </p>
                        </div>
                    </div>

                    <div className="relative my-12">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
                            Welcome back
                        </p>
                        <h1 className="max-w-md text-4xl font-bold leading-tight">
                            Manage your church platform with confidence.
                        </h1>
                        <p className="mt-5 max-w-md leading-7 text-slate-300">
                            Access your administration tools to manage sermons,
                            events, media and messages from one place.
                        </p>
                    </div>

                    <p className="relative text-xs text-slate-400">
                        Authorized administrators only.
                    </p>
                </div>

                <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-12">
                    <div className="w-full max-w-md">
                        <div className="mb-8 lg:hidden">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-950 text-white">
                                <FontAwesomeIcon icon={faShieldHalved} />
                            </div>
                            <p className="text-sm font-bold tracking-wide text-slate-900">
                                CHURCH ADMIN
                            </p>
                        </div>

                        <p className="text-sm font-semibold text-blue-700">
                            ADMINISTRATOR ACCESS
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                            Sign in to your account
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            Enter the administrator credentials you created
                            on your backend.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-8 space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="admin-email"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Email address
                                </label>
                                <div className="relative">
                                    <FontAwesomeIcon
                                        icon={faEnvelope}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        id="admin-email"
                                        type="email"
                                        autoComplete="username"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        placeholder="admin@example.com"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="admin-password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        id="admin-password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="Enter your password"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((previous) => !previous)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                showPassword
                                                    ? faEyeSlash
                                                    : faEye
                                            }
                                        />
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div
                                    role="alert"
                                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                                >
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/15 transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading
                                    ? "Signing in..."
                                    : "Sign in securely"}
                                {!isLoading && (
                                    <FontAwesomeIcon icon={faArrowRight} />
                                )}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-xs leading-5 text-slate-400">
                            This portal is restricted to authorized church
                            administrators.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default AdminLogin;
