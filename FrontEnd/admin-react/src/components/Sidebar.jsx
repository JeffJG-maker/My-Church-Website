
import NavSection from "./NavSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartPie,
    faBookOpen,
    faLayerGroup,
    faPhotoVideo,
    faCalendarAlt,
    faUsers,
    faChartLine,
    faCog,
    faChurch,
} from "@fortawesome/free-solid-svg-icons";

import { faCommentAlt } from "@fortawesome/free-regular-svg-icons"



const mainLinks = [
    {
        name: "Dashboard",
        icon: faChartPie,
        page: "dashboard"
    }
];

const manageLinks = [
    {
        name: "Sermons",
        icon: faBookOpen,
        page: "sermons"
    },
    {
        name: "Categories",
        icon: faLayerGroup,
        page: "categories"
    },
    {
        name: "Media",
        icon: faPhotoVideo,
        page: "media"
    },
    {
        name: "Events",
        icon: faCalendarAlt,
        page: "events"
    },
    {
        name: "Users",
        icon: faUsers,
        page: "users"
    },
    {
        name: "Messages",
        icon: faCommentAlt,
        page: "messages"
    }
];

const systemLinks = [
    {
        name: "Analytics",
        icon: faChartLine,
        page: "analytics"
    },
    {
        name: "Settings",
        icon: faCog,
        page: "settings"
    }
];

const Sidebar = ({ activePage, setActivePage }) => {


    return (
        <>
            <aside className="sidebar w-60 h-screen bg-transparent flex flex-col fixed left-0 top-0">

                <div className="sidebar-header flex items-center gap-3 p-3">

                    <div className="admin-logo p-3 rounded-md flex justify-center bg-[var(--active-theme-color)] text-white">
                        <FontAwesomeIcon icon={faChurch} />
                    </div>

                    <div>
                        <h2>Church Admin</h2>
                        <span className="text-xs text-slate-500">Admin Panel</span>
                    </div>

                </div>


                <nav className="sidebar-navigation flex-1 px-4  overflow-y-auto">

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


                <div className="admin-profile flex items-center gap-2 border-t-[1px] border-slate-200 p-3">
                    <div className="profile-avatar p-2 w-10 text-white rounded-full bg-blue-950 flex item-center justify-center">
                        A
                    </div>

                    <div className="profile-info flex flex-col">
                        <strong className="text-sm">Administrator</strong>
                        <span className="text-[12px] text-slate-600">Super Admin</span>
                    </div>

                </div>

            </aside>
        </>
    )
}

export default Sidebar;

// nav {
//     position: fixed;
//     top: 0;
//     left: 0;
//     height: 100vh;
//     width: 250px;
//     background-color: var(--card-background);
//     padding: 1em;
//     overflow-y: auto;
// }