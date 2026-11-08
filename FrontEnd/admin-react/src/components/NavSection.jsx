import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavSection = ({
    links,
    title,
    activePage,
    setActivePage,
}) => {
    return (
        <div className="nav-section px-0 py-3">
            {/* Section heading */}
            <span className="nav-section-title mb-2 block px-3 text-[10px] font-semibold tracking-[0.13em] text-[var(--muted-text)]">
                {title}
            </span>

            {/* Navigation links */}
            <div className="space-y-1">
                {links.map((link) => {
                    const isActive = activePage === link.page;

                    return (
                        <motion.a
                            key={link.page}
                            href="#"
                            data-page={link.page}
                            aria-current={isActive ? "page" : undefined}
                            onClick={(event) => {
                                event.preventDefault();
                                setActivePage(link.page);
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={{
                                duration: 0.2,
                                ease: "easeOut",
                            }}
                            className={`
                nav-link relative flex cursor-pointer
                items-center gap-3 rounded-xl
                px-3 py-[11px] text-[13px]
                no-underline transition-colors duration-200

                ${isActive
                                    ? "bg-[#EAE8E5] font-semibold text-[#C51D27] dark:bg-[#292929] dark:text-[#E58A90]"
                                    : "text-[var(--muted-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text)]"
                                }
              `}
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <motion.span
                                    layoutId={`active-nav-${title}`}
                                    className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#C51D27]/80"
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 30,
                                    }}
                                />
                            )}

                            {/* Navigation icon */}
                            <FontAwesomeIcon
                                icon={link.icon}
                                className={`
                  w-[16px] text-[13px] transition-colors duration-200
                  ${isActive
                                        ? "text-[#C51D27] dark:text-[#E58A90]"
                                        : "text-[var(--muted-text)]"
                                    }
                `}
                            />

                            {/* Navigation label */}
                            <span className="flex-1">{link.name}</span>
                        </motion.a>
                    );
                })}
            </div>
        </div>
    );
};

export default NavSection;