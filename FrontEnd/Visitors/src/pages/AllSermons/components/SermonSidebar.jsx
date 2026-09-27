import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

function SermonSidebar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="fixed left-0 top-20 z-40 hidden h-[calc(100vh-5rem)] w-64 border-r border-gray-200 bg-white p-5 dark:border-[#333344] dark:bg-[#131323] lg:block">

            {/* Navigation */}
            <nav className="space-y-2">

                <Link
                    to="/"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-[#0d0761] dark:text-gray-300 dark:hover:bg-[#2b2b46] dark:hover:text-white"
                >
                    <i className="fa-solid fa-house w-5 text-center"></i>
                    <span>Home</span>
                </Link>

                <Link
                    to="/about"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-[#0d0761] dark:text-gray-300 dark:hover:bg-[#2b2b46] dark:hover:text-white"
                >
                    <i className="fa-solid fa-circle-info w-5 text-center"></i>
                    <span>About Us</span>
                </Link>

                <Link
                    to="/contact"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-[#0d0761] dark:text-gray-300 dark:hover:bg-[#2b2b46] dark:hover:text-white"
                >
                    <i className="fa-solid fa-envelope w-5 text-center"></i>
                    <span>Contact Us</span>
                </Link>

            </nav>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200 dark:border-[#333344]"></div>

            {/* Account */}
            <div className="space-y-2">

                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                    <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
                    <span>Sign Out</span>
                </button>

            </div>

        </aside>
    );
}

export default SermonSidebar;