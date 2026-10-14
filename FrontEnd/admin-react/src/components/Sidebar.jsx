
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

import { faCommentAlt } from "@fortawesome/free-regular-svg-icons";

const mainLinks = [
  {
    name: "Dashboard",
    icon: faChartPie,
    page: "dashboard",
  },
];

const manageLinks = [
  { name: "Sermons", icon: faBookOpen, page: "sermons" },
  { name: "Categories", icon: faLayerGroup, page: "categories" },
  { name: "Media", icon: faPhotoVideo, page: "media" },
  { name: "Events", icon: faCalendarAlt, page: "events" },
  { name: "Users", icon: faUsers, page: "users" },
  { name: "Messages", icon: faCommentAlt, page: "messages" },
];

const systemLinks = [
  { name: "Analytics", icon: faChartLine, page: "analytics" },
  { name: "Settings", icon: faCog, page: "settings" },
];

const Sidebar = ({ activePage, setActivePage, isSidebarOpen,
  setIsSidebarOpen }) => {
  return (
    <aside
      className={`sidebar fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-none bg-transparent text-[var(--text)] transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
    >
      {/* Sidebar header */}
      <div className="sidebar-header flex items-center gap-3 p-3">
        <div
          className="
    admin-logo flex h-12 w-12 shrink-0
    items-center justify-center rounded-xl
    bg-[#1a1a4c] text-white
  "
        >
          <FontAwesomeIcon icon={faChurch} className="text-xl" />
        </div>
        <div>
          <h2 className="font-bold text-[var(--text)]">
            Church Admin
          </h2>

          <span className="text-xs text-[var(--muted-text)]">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-navigation flex-1 overflow-y-auto px-4">
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

      {/* Administrator profile */}
      <div
        className="
          admin-profile flex items-center gap-2 border-t
          border-[var(--border-color)] p-3
        "
      >
        <div
          className="
            profile-avatar flex h-10 w-10 items-center
            justify-center rounded-full
            bg-[var(--active-theme-color)] p-2 text-white
          "
        >
          A
        </div>

        <div className="profile-info flex flex-col">
          <strong className="text-sm text-[var(--text)]">
            Administrator
          </strong>

          <span className="text-[12px] text-[var(--muted-text)]">
            Super Admin
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
