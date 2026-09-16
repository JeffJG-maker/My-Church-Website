import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavSection = ({ links, title, activePage, setActivePage }) => {

    return (
        <>
            <div className="nav-section border-b-[1px] border-[#414141] px-0 py-3">
                <span className="nav-section-title text-slate-500">
                    {title}
                </span>

                {
                    links.map(link => (
                        <a
                            key={link.page}
                            className={activePage === link.page ? "bg-[var(--active-theme-color)] nav-link flex items-center gap-3 no-underline rounded-md p-[6px] text-white transition-all duration-200 hover:bg-[var(--sidebar-hover)] hover:text-white translate-x-[5px] cursor-pointer my-2" :
                                " flex items-center gap-3 no-underline rounded-md p-[6px] transition-all duration-200 hover:bg-[var(--sidebar-hover)] hover:text-white hover:translate-x-[3px] cursor-pointer my-2"}
                            data-page={link.page}
                            onClick={() => setActivePage(link.page)}
                        >
                            <FontAwesomeIcon icon={link.icon} />
                            <span>{link.name}</span>
                        </a>
                    ))
                }

            </div>
        </>
    )
}

export default NavSection;