import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faSun, faMoon, faChevronDown } from "@fortawesome/free-solid-svg-icons"

const Header = () => {
    return (
        <header className="flex items-center justify-between gap-6 mb-10">

            <div className="header-welcome">
                <h1 className="text-xl font-bold text-slate-900">Welcome back, Admin! 👋</h1>
                <p className="mt-1 text-[12px] text-slate-500 ">
                    Here's what's happening with your church platform today.
                </p>
            </div>

            <div className="header-actions flex items-center gap-5">

                <div className="theme-toggle flex items-center overflow-hidden rounded-lg ">
                    <button className="w-10 h-7 bg-blue-950 cursor-pointer text-white">
                        <FontAwesomeIcon icon={faSun} />
                    </button>

                    <button className="w-10 h-7 bg-slate-200 cursor-pointer">
                        <FontAwesomeIcon icon={faMoon} />
                    </button>
                </div>

                <div className="admin-profile flex items-center gap-2">
                    <div className="profile-avatar p-2 w-10 text-white rounded-full bg-blue-950 flex item-center justify-center">
                        A
                    </div>

                    <div className="profile-info flex flex-col">
                        <strong className="text-sm">Admin</strong>
                        <span className="text-[12px] text-slate-600">Super Admin</span>
                    </div>

                    <FontAwesomeIcon icon={faChevronDown} className="text-[10px]  p-2 rounded-full cursor-pointer hover:bg-[lightgrey]" />
                </div>

            </div>

        </header>
    );
};

export default Header;