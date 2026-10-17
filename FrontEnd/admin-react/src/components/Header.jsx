
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const Header = ({
    title = "Dashboard",
    description = "Here's what's happening with your church platform today.",
    admin,
    onLogout,
}) => {
    const adminName = admin?.name || "Administrator";

    const initials = adminName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

    return (
        <header className="mb-10 flex flex-wrap items-center justify-between gap-5">
            <div className="header-welcome min-w-0">
                <h1 className="text-xl font-bold text-[var(--text)]">
                    {title === "Dashboard"
                        ? `Welcome back, ${adminName}! 👋`
                        : title}
                </h1>

                <p className="mt-1 text-[12px] text-[var(--muted-text)]">
                    {description}
                </p>
            </div>

            <div className="admin-profile flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-950 p-2 font-semibold text-white">
                    {initials || "A"}
                </div>

                <div className="flex min-w-0 flex-col">
                    <strong className="max-w-40 truncate text-sm text-[var(--text)]">
                        {adminName}
                    </strong>

                    <span className="max-w-48 truncate text-[12px] text-[var(--muted-text)]">
                        {admin?.email || "Administrator"}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onLogout}
                    className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--hover)]"
                    title="Log out of the admin dashboard"
                    aria-label="Log out"
                >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
