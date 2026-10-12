
import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Sermons from "./components/Sermons";
import Categories from "./components/Categories";
import Media from "./components/Media";
import MainArea from "./components/MainArea";
import Events from "./components/Events";
import Users from "./components/Users";
import Messages from "./components/Messages";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import "./App.css";

const defaultCategories = [
    "Faith",
    "Prayer",
    "Teaching",
    "Worship",
    "Praise",
];

const pageConfig = {
    dashboard: {
        title: "Dashboard",
        description: "Welcome back, Admin! Here's an overview of your church.",
    },
    sermons: {
        title: "Sermons",
        description: "Manage and organize your church sermons.",
    },
    categories: {
        title: "Categories",
        description: "Organize your sermons into meaningful categories.",
    },
    media: {
        title: "Media",
        description: "Manage your church media files.",
    },
    events: {
        title: "Events",
        description: "Manage upcoming church events.",
    },
    users: {
        title: "Users",
        description: "Manage dashboard users and access.",
    },
    messages: {
        title: "Messages",
        description: "Manage church messages and communications.",
    },
    analytics: {
        title: "Analytics",
        description: "View church content statistics and performance.",
    },
    settings: {
        title: "Settings",
        description: "Manage your dashboard preferences.",
    },
};

function ComingSoonPage({ page }) {
    const title = pageConfig[page]?.title || "Page";

    return (
        <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-background)] p-8 text-center text-[var(--text)] shadow-[0_5px_24px_var(--card-shadow)]">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="mt-2 text-sm text-[var(--muted-text)]">
                This page is not available yet. Its functionality will be added next.
            </p>
        </section>
    );
}

function App() {
    const [activePage, setActivePage] = useState("dashboard");

    // Persist the selected theme.
    const [isDarkMode, setIsDarkMode] = useState(
        () => localStorage.getItem("church-admin-theme") === "dark"
    );

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);

        localStorage.setItem(
            "church-admin-theme",
            isDarkMode ? "dark" : "light"
        );
    }, [isDarkMode]);

    // Shared category list for the Categories and Sermons pages.
    const [categories, setCategories] = useState(() => {
        try {
            const savedCategories = localStorage.getItem(
                "church-sermon-categories"
            );

            if (savedCategories) {
                const parsedCategories = JSON.parse(savedCategories);

                if (
                    Array.isArray(parsedCategories) &&
                    parsedCategories.every(
                        (category) => typeof category === "string"
                    )
                ) {
                    return parsedCategories;
                }
            }
        } catch (error) {
            console.error("Unable to load saved categories:", error);
        }

        return defaultCategories;
    });

    useEffect(() => {
        localStorage.setItem(
            "church-sermon-categories",
            JSON.stringify(categories)
        );
    }, [categories]);

    const currentPage = pageConfig[activePage] || {
        title: "Dashboard",
        description: "Manage your church administration.",
    };

    const renderPage = () => {
        switch (activePage) {
            case "dashboard":
                return <Dashboard />;

            case "sermons":
                return <Sermons categories={categories} />;

            case "categories":
                return (
                    <Categories
                        categories={categories}
                        setCategories={setCategories}
                    />
                );

            case "media":
                return <Media />;

            case "events":
                return <Events />;

            case "users":
                return <Users />;

            case "messages":
                return <Messages />;

            case "analytics":
                return <Analytics />;

            case "settings":
                return <Settings />;

            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="admin-app min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors duration-300">
            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
            />

            <MainArea
                activePage={activePage}
                title={currentPage.title}
                description={currentPage.description}
                isDarkMode={isDarkMode}
                onToggleTheme={() => setIsDarkMode((previous) => !previous)}
            >
                {renderPage()}
            </MainArea>
        </div>
    );
}

export default App;
