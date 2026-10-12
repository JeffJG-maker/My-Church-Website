
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavSection = ({
    links,
    title,
    activePage,
    setActivePage,
}) => {
    return (
        <div className="nav-section px-0 py-1">
            {/* Section heading */}
            <span className="nav-section-title text-[var(--muted-text)] text-[12px] font-bold">
                {title}
            </span>

            {/* Navigation links */}
            {links.map((link) => {
                const isActive = activePage === link.page;

                return (
                    <a
                        key={link.page}
                        href="#"
                        className={`
              nav-link my-2 flex cursor-pointer items-center gap-3
              rounded-lg p-2 text-[13px] no-underline
              transition-all duration-200
              ${isActive
                                ? "active translate-x-[3px] rounded-xl bg-[#1a1a4c] text-white font-semibold shadow-sm"
                                : "text-[var(--text)] hover:translate-x-[2px] hover:bg-[var(--sidebar-hover)]"
                            }
            `}
                        data-page={link.page}
                        aria-current={isActive ? "page" : undefined}
                        onClick={(event) => {
                            event.preventDefault();
                            setActivePage(link.page);
                        }}
                    >
                        <FontAwesomeIcon
                            icon={link.icon}
                            className={isActive ? "text-white" : ""}
                        />

                        <span>{link.name}</span>
                    </a>
                );
            })}
        </div>
    );
};

export default NavSection;
