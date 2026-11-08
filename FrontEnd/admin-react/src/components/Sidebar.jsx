
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavSection from "./NavSection";

import {
  faChartPie,
  faBookOpen,
  faLayerGroup,
  faPhotoVideo,
  faCalendarAlt,
  faUsers,
  faChartLine,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

import { faCommentAlt } from "@fortawesome/free-regular-svg-icons";

// Main navigation
const mainLinks = [
  {
    name: "Dashboard",
    icon: faChartPie,
    page: "dashboard",
  },
];

// Management navigation
const manageLinks = [
  { name: "Sermons", icon: faBookOpen, page: "sermons" },
  { name: "Categories", icon: faLayerGroup, page: "categories" },
  { name: "Media", icon: faPhotoVideo, page: "media" },
  { name: "Events", icon: faCalendarAlt, page: "events" },
  { name: "Users", icon: faUsers, page: "users" },
  { name: "Messages", icon: faCommentAlt, page: "messages" },
];

// System navigation
const systemLinks = [
  { name: "Analytics", icon: faChartLine, page: "analytics" },
  { name: "Settings", icon: faCog, page: "settings" },
];

const Sidebar = ({
  activePage,
  setActivePage,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop screen size
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleScreenChange = (event) => {
      setIsDesktop(event.matches);
    };

    setIsDesktop(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
    };
  }, []);

  // Sidebar is always visible on desktop
  // Mobile visibility is controlled by isSidebarOpen
  const sidebarX = isDesktop || isSidebarOpen ? 0 : "-100%";

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isSidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsSidebarOpen(false)}
            className="
              fixed inset-0 z-30
              bg-black/30 backdrop-blur-[2px]
              lg:hidden
            "
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarX,
        }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 32,
          mass: 0.8,
        }}
        className="
          sidebar fixed left-0 top-0 z-40
          flex h-screen w-60 flex-col
          bg-[var(--sidebar-background)]
          text-[var(--text)]
        "
      >
        {/* Sidebar header */}
        <div className="sidebar-header flex items-center gap-3 px-5 py-5">
          {/* Church logo */}
          <div
            className="
              admin-logo flex h-11 w-11 shrink-0
              items-center justify-center
              overflow-hidden rounded-xl
              bg-white
            "
          >
            <img
              src="/Big_Winnerslogo.png"
              alt="Living Faith Church Iguosa logo"
              className="h-full w-full object-contain p-1"
            />
          </div>

          {/* Church identity */}
          <div className="min-w-0">
            <h2
              className="
                truncate text-sm font-bold
                tracking-[-0.02em]
                text-[var(--text)]
              "
            >
              Living Faith Church
            </h2>

            <span
              className="
                mt-0.5 block text-[11px]
                text-[var(--muted-text)]
              "
            >
              Iguosa · Administration
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="
            sidebar-navigation
            flex-1 overflow-y-auto
            px-3 pb-4
          "
        >
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
        <div className="admin-profile flex items-center gap-3 px-4 py-4">
          <div
            className="
              profile-avatar flex h-10 w-10
              shrink-0 items-center justify-center
              rounded-xl bg-[#D91620]/[0.07]
              text-sm font-semibold text-[#C51D27]
            "
          >
            A
          </div>

          <div className="profile-info flex min-w-0 flex-col">
            <strong
              className="
                text-sm font-semibold
                text-[var(--text)]
              "
            >
              Administrator
            </strong>

            <span
              className="
                mt-0.5 text-[11px]
                text-[var(--muted-text)]
              "
            >
              Super Admin
            </span>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
