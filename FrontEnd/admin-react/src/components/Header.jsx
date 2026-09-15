

const Header = () => {
    return (
        <header className="flex items-center justify-between gap-6 p-5">

            <div className="header-welcome">
                <h1 className="text-2xl font-bold text-slate-900 mb-3">Welcome back, Admin! 👋</h1>
                <p>
                    Here's what's happening with your church platform today.
                </p>
            </div>

            <div className="header-actions">

                <div className="theme-toggle">
                    <button>
                        <i className="fas fa-cog"></i>
                    </button>

                    <button>
                        <i className="fas fa-moon"></i>
                    </button>
                </div>

                <div className="admin-profile">
                    <div className="profile-avatar">
                        A
                    </div>

                    <div className="profile-info">
                        <strong>Admin</strong>
                        <span>Super Admin</span>
                    </div>

                    <i className="fas fa-chevron-down"></i>
                </div>

            </div>

        </header>
    );
};

export default Header;