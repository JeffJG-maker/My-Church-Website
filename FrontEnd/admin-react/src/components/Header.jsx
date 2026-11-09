import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const Header = ({
    title = "Dashboard",
    description = "Here's what's happening with your church platform today.",
    admin,
    onLogout,
}) => {
    const adminName = admin?.name || "Administrator";

    return (
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            {/* Page heading */}
            <div className="header-welcome min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">
                    {title === "Dashboard"
                        ? `Welcome back, ${adminName}!`
                        : title}
                </h1>

                <p className="mt-1 text-sm text-[var(--muted-text)]">
                    {description}
                </p>
            </div>

            {/* Admin profile and logout */}
            <div className="admin-profile flex shrink-0 items-center gap-4">
                <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold text-[var(--text)]">
                        {adminName}
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--muted-text)]">
                        {admin?.email || "Administrator"}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onLogout}
                    title="Log out"
                    aria-label="Log out"
                    className="inline-flex items-center gap-2 rounded-md bg-[var(--card-background)] px-3.5 py-2.5 text-xs font-semibold text-[var(--text)] shadow-sm transition-all duration-200 hover:bg-[var(--hover)] hover:shadow-md"
                >
                    <FontAwesomeIcon
                        icon={faRightFromBracket}
                        className="text-[var(--muted-text)]"
                    />

                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Header;