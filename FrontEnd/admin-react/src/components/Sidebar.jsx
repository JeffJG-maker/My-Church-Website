
import NavSection from "./NavSection";



const mainLinks = [
    {
        name: "Dashboard",
        icon: "fas fa-chart-pie",
        page: "dashboard"
    }
];

const manageLinks = [
    {
        name: "Sermons",
        icon: "fas fa-book-open",
        page: "sermons"
    },
    {
        name: "Categories",
        icon: "fas fa-layer-group",
        page: "categories"
    },
    {
        name: "Media",
        icon: "fas fa-photo-video",
        page: "media"
    },
    {
        name: "Events",
        icon: "far fa-calendar-alt",
        page: "events"
    },
    {
        name: "Users",
        icon: "fas fa-users",
        page: "users"
    },
    {
        name: "Messages",
        icon: "far fa-comment-alt",
        page: "messages"
    }
];

const systemLinks = [
    {
        name: "Analytics",
        icon: "fas fa-chart-line",
        page: "analytics"
    },
    {
        name: "Settings",
        icon: "fas fa-cog",
        page: "settings"
    }
];

const Sidebar = ({ activePage, setActivePage }) => {


    return (
        <>
            <aside className="sidebar">

                <div className="sidebar-header">

                    <div className="admin-logo">
                        <i className="fas fa-church"></i>
                    </div>

                    <div>
                        <h2>Church Admin</h2>
                        <span>Admin Panel</span>
                    </div>

                </div>


                <nav className="sidebar-navigation">

                    <NavSection
                        title="MAIN"
                        links={mainLinks}
                        activePage={activePage}
                        setActivePage={setActivePage}
                    />

                    <NavSection
                        title="MANAGE"
                        links={manageLinks}
                        activePage={activePage}
                        setActivePage={setActivePage}
                    />

                    <NavSection
                        title="SYSTEM"
                        links={systemLinks}
                        activePage={activePage}
                        setActivePage={setActivePage}
                    />

                </nav>


                <div className="sidebar-bottom">

                    <div className="admin-profile-mini">

                        <div className="profile-avatar">
                            A
                        </div>

                        <div>
                            <strong>Administrator</strong>
                            <span>Super Admin</span>
                        </div>

                    </div>

                </div>

            </aside>
        </>
    )
}

export default Sidebar;