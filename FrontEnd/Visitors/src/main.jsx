import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./index.css";

function GlobalScrollbarController() {
  useEffect(() => {
    let hideTimer;

    const handleScroll = () => {
      const html = document.documentElement;

      // Show scrollbar during scrolling
      html.classList.add("is-scrolling");

      // Restart the timer
      window.clearTimeout(hideTimer);

      // Hide scrollbar when scrolling stops
      hideTimer = window.setTimeout(() => {
        html.classList.remove("is-scrolling");
      }, 800);
    };

    // Ensure the scrollbar starts hidden
    document.documentElement.classList.remove("is-scrolling");

    // Detect page and container scrolling
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    document.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      document.removeEventListener("scroll", handleScroll, true);

      window.clearTimeout(hideTimer);
      document.documentElement.classList.remove("is-scrolling");
    };
  }, []);

  return null;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      {/* <GlobalScrollbarController /> */}
      <App />
    </ThemeProvider>
  </StrictMode>
);