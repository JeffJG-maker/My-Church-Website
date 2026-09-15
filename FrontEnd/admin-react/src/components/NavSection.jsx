import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavSection = ({ links, title, activePage, setActivePage }) => {

    return (
        <>
            <div className="nav-section">
                <span className="nav-section-title">
                    {title}
                </span>

                {
                    links.map(link => (
                        <a
                            key={link.page}
                            className={activePage === link.page ? "nav-link active" : "nav-link"}
                            data-page={link.page}
                            onClick={() => setActivePage(link.page)}
                        >
                            <FontAwesomeIcon icon={link.icon}/>
                            <span>{link.name}</span>
                        </a>
                    ))
                }

            </div>
        </>
    )
}

export default NavSection;