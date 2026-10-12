
import Header from "./Header";

const MainArea = ({
  children,
  title,
  description,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <main className="main-area ml-65 min-h-screen border-none bg-transparent p-5">
      <Header
        title={title}
        description={description}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />

      {children}
    </main>
  );
};

export default MainArea;
