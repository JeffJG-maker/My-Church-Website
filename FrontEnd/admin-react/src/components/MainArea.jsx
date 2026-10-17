
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const MainArea = ({
  children,
  title,
  description,
  isDarkMode,
  onToggleTheme,
  onToggleSidebar,
  admin,
  onLogout,
}) => {
  return (
    <main className="main-area min-h-screen border-none bg-transparent p-4 transition-all duration-300 md:p-5 lg:ml-60">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Open sidebar"
        className="mb-4 flex items-center justify-center rounded-lg p-2 text-[var(--text)] shadow-sm transition hover:bg-black/5 lg:hidden"
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>

      <Header
        title={title}
        description={description}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        admin={admin}
        onLogout={onLogout}
      />

      {children}
    </main>
  );
};

export default MainArea;
