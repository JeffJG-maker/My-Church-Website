import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

function SermonSidebar({
    mobile = false,
    onClose = () => {},
}) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        onClose();
        navigate("/login");
    };

    const handleNavigation = () => {
        onClose();
    };

    return (
        <aside
            className={
                mobile
                    ? "h-full w-72 border-r border-gray-200 bg-white p-5 shadow-2xl dark:border-[#333344] dark:bg-[#131323]"
                    : "fixed left-0 top-20 z-40 hidden h-[calc(100vh-5rem)] w-64 border-r border-gray-200 bg-white p-5 dark:border-[#333344] dark:bg-[#131323] lg:block"
            }
        >
            {/* Mobile Header */}
            {mobile && (
                <div className="mb-8 flex items-center justify-between">
                    <Link
                        to="/"
                        onClick={handleNavigation}
                        className="flex items-center gap-3"
                    >
                        <img
                            src="/media/Big Winnersogo.png"
                            alt="Living Faith Church Iguosa"
                            className="h-10 w-10 rounded-full object-cover"
                        />

                        <div>
                            <h2 className="text-sm font-bold text-[#0d0761] dark:text-white">
                                Living Faith Church
                            </h2>

                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Iguosa
                            </p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-[#2b2b46] dark:hover:text-white"
                        aria-label="Close menu"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            )}

            {/* Navigation */}
            <nav className="space-y-2">
                <Link
                    to="/"
                    onClick={handleNavigation}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-[#0d0761] dark:text-gray-300 dark:hover:bg-[#2b2b46] dark:hover:text-white"
                >
                    <i className="fa-solid fa-house w-5 text-center"></i>
                    <span>Home</span>
                </Link>

                <Link
                    to="/about"
                    onClick={handleNavigation}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-[#0d0761] dark:text-gray-300 dark:hover:bg-[#2b2b46] dark:hover:text-white"
                >
                    <i className="fa-solid fa-circle-info w-5 text-center"></i>
                    <span>About Us</span>
                </Link>

                <Link
                    to="/contact"
                    onClick={handleNavigation}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-[#0d0761] dark:text-gray-300 dark:hover:bg-[#2b2b46] dark:hover:text-white"
                >
                    <i className="fa-solid fa-envelope w-5 text-center"></i>
                    <span>Contact Us</span>
                </Link>
            </nav>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200 dark:border-[#333344]"></div>

            {/* Sign Out */}
            <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/20"
            >
                <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
                <span>Sign Out</span>
            </button>
        </aside>
    );
}

export default SermonSidebar;