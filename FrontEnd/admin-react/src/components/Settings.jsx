import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    faBell,
    faCheck,
    faChevronDown,
    faCircleCheck,
    faCloudArrowUp,
    faDatabase,
    faEnvelope,
    faEye,
    faEyeSlash,
    faGear,
    faGlobe,
    faLock,
    faPalette,
    faRotate,
    faShieldHalved,
    faSliders,
    faToggleOn,
    faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NAVY = "#1a1a4c";

const defaultSettings = {
    churchName: "Living Faith Church Iguosa",
    churchEmail: "info@lfcwinnersiguosa.netlify.app",
    timezone: "Africa/Lagos",
    language: "English",
    dateFormat: "DD/MM/YYYY",
    publicWebsite: "https://lfcwinnersiguosa.netlify.app/",
    emailNotifications: true,
    newMessageAlerts: true,
    weeklySummary: false,
    publicSermons: true,
    publicEvents: true,
    allowMessageReplies: true,
    twoFactor: false,
    sessionTimeout: "30",
    profileVisibility: "Administrators",
};

function Toggle({ checked, onChange, label, description, dark }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className="flex  w-full  items-center  justify-between  gap-4  py-3  text-left"
        >
            <span className="min-w-0 flex-1">
                <span className={`block text-sm font-semibold ${dark ? "text-white" : "text-slate-800"}`}>{label}</span>
                {description && <span className={`mt-1 block text-xs leading-5 ${dark ? "text-zinc-400" : "text-slate-500"}`}>{description}</span>}
            </span>
            <span
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? "" : dark ? "bg-zinc-700" : "bg-slate-300"}`}
                style={checked ? { backgroundColor: NAVY } : undefined}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
            </span>
        </button>
    );
}

function Section({ icon, title, description, dark, children }) {
    return (
        <section className={`rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] ${dark ? "bg-[#141618] text-white shadow-black/20" : "bg-white text-slate-900 hover:shadow-[0_8px_28px_rgba(15,23,42,0.07)]"}`}>
            <div className="mb-5  flex  items-start  gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${dark ? "bg-[#202126] text-indigo-200" : "bg-indigo-50 text-[#1a1a4c]"}`}>
                    <FontAwesomeIcon icon={icon} />
                </span>
                <div>
                    <h2 className={`font-bold ${dark ? "text-white" : "text-slate-900"}`}>{title}</h2>
                    <p className={`mt-1 text-sm leading-5 ${dark ? "text-zinc-400" : "text-slate-500"}`}>{description}</p>
                </div>
            </div>
            {children}
        </section>
    );
}

export default function Settings({ isDarkMode, onToggleTheme }) {
    const [settings, setSettings] = useState(() => {
        try {
            const saved = typeof window !== "undefined" ? window.localStorage.getItem("church-admin-settings") : null;
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch {
            return defaultSettings;
        }
    });
    const [activeTab, setActiveTab] = useState("General");
    const [notice, setNotice] = useState("");
    const [showEmail, setShowEmail] = useState(false);
    const [saving, setSaving] = useState(false);
    const [localDark, setLocalDark] = useState(
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark")
    );
    const reduced = useReducedMotion();
    const dark = typeof isDarkMode === "boolean" ? isDarkMode : localDark;

    // Keep local theme state synchronized with the root class used by the dashboard.
    useEffect(() => {
        if (typeof document === "undefined") return undefined;

        const root = document.documentElement;
        const syncTheme = () => setLocalDark(root.classList.contains("dark"));
        syncTheme();

        const observer = new MutationObserver(syncTheme);
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });

        return () => observer.disconnect();
    }, []);

    // Fallback theme handler for cases where App.jsx has not passed the shared props yet.
    const handleThemeChange = () => {
        if (typeof onToggleTheme === "function") {
            onToggleTheme();
            return;
        }

        const nextDark = !dark;
        setLocalDark(nextDark);

        if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", nextDark);
        }

        try {
            window.localStorage.setItem("church-admin-theme", nextDark ? "dark" : "light");
        } catch {
            // The theme still changes for this session if browser storage is unavailable.
        }
    };
    const muted = dark ? "text-zinc-400" : "text-slate-500";
    const inputClass = `mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500/20 ${dark ? "bg-[#1b1d21] text-white placeholder:text-zinc-500 shadow-inner shadow-black/10" : "bg-slate-50 text-slate-800 shadow-inner shadow-slate-200/40 focus:bg-white"}`;
    const tabs = [
        { label: "General", icon: faGear },
        { label: "Appearance", icon: faPalette },
        { label: "Notifications", icon: faBell },
        { label: "Privacy & security", icon: faShieldHalved },
    ];

    const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

    const saveSettings = () => {
        setSaving(true);
        try {
            window.localStorage.setItem("church-admin-settings", JSON.stringify(settings));
            setNotice("Your settings have been saved on this browser.");
        } catch {
            setNotice("Unable to save settings in this browser. Please check your browser storage permissions.");
        }
        window.setTimeout(() => setSaving(false), 250);
        window.setTimeout(() => setNotice(""), 3500);
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
        try {
            window.localStorage.removeItem("church-admin-settings");
            setNotice("Settings have been restored to their defaults.");
        } catch {
            setNotice("Defaults restored on screen. Browser storage could not be updated.");
        }
        window.setTimeout(() => setNotice(""), 3500);
    };

    const overview = useMemo(() => [
        { label: "Public website", value: settings.publicWebsite ? "Configured" : "Not set", icon: faGlobe, good: Boolean(settings.publicWebsite) },
        { label: "Email alerts", value: settings.emailNotifications ? "Enabled" : "Disabled", icon: faEnvelope, good: settings.emailNotifications },
        { label: "Two-factor security", value: settings.twoFactor ? "Enabled" : "Not enabled", icon: faUserShield, good: settings.twoFactor },
    ], [settings]);

    const surface = dark ? "bg-[#101112] text-white" : "bg-transparent text-slate-900";

    return (
        <div className={`min-h-full space-y-6 pb-8 ${surface}`}>
            <motion.div
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex  flex-col  justify-between  gap-4  sm:flex-row  sm:items-end"
            >
                <div>
                    <div className={`mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-indigo-300" : "text-[#1a1a4c]"}`}>
                        <FontAwesomeIcon icon={faSliders} />
                        Workspace preferences
                    </div>
                    <h1 className={`text-2xl font-bold tracking-tight sm:text-3xl ${dark ? "text-white" : "text-slate-900"}`}>Settings</h1>
                    <p className={`mt-2 max-w-2xl text-sm sm:text-base ${muted}`}>Manage your church workspace, notifications, appearance and security preferences.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={resetSettings} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${dark ? "text-zinc-300 hover:bg-[#202126]" : "text-slate-600 hover:bg-slate-100"}`}>Reset defaults</button>
                    <button type="button" onClick={saveSettings} className="inline-flex  items-center  gap-2  rounded-xl  px-4  py-2.5  text-sm  font-semibold  text-white  shadow-sm  transition  hover:opacity-90" style={{ backgroundColor: NAVY }}>
                        <FontAwesomeIcon icon={faCheck} />
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </motion.div>

            <AnimatePresence>
                {notice && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-sm ${dark ? "bg-emerald-950/40 text-emerald-200" : "bg-emerald-50 text-emerald-800"}`}>
                        <FontAwesomeIcon icon={faCircleCheck} /> {notice}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid  grid-cols-1  gap-5  xl:grid-cols-[240px_minmax(0,1fr)]">
                <aside className={`h-fit rounded-2xl p-2 shadow-[0_4px_20px_rgba(15,23,42,0.04)] ${dark ? "bg-[#141618] text-white shadow-black/20" : "bg-white text-slate-900"}`}>
                    <nav className="flex  gap-1  overflow-x-auto  xl:flex-col" aria-label="Settings sections">
                        {tabs.map((tab) => (
                            <button key={tab.label} type="button" onClick={() => setActiveTab(tab.label)} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition xl:w-full ${activeTab === tab.label ? "text-white shadow-sm" : `${muted} ${dark ? "hover:bg-[#202126] hover:text-white" : "hover:bg-slate-50 hover:text-slate-900"}`}`} style={activeTab === tab.label ? { backgroundColor: NAVY } : undefined}>
                                <FontAwesomeIcon icon={tab.icon} className="w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                    <div className={`mx-2 my-3 hidden rounded-xl p-3 xl:block ${dark ? "bg-[#1b1d21]" : "bg-slate-50"}`}>
                        <p className={`text-xs font-semibold ${dark ? "text-zinc-200" : "text-slate-700"}`}>Settings tip</p>
                        <p className={`mt-1 text-xs leading-5 ${muted}`}>Remember to save your changes before leaving this page.</p>
                    </div>
                </aside>

                <div className="min-w-0 space-y-5">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="space-y-5">
                            {activeTab === "General" && (
                                <>
                                    <Section dark={dark} icon={faGlobe} title="Church information" description="Basic details used across your admin workspace.">
                                        <div className="grid  grid-cols-1  gap-4  sm:grid-cols-2">
                                            <label className={`text-sm font-medium ${dark ? "text-zinc-300" : "text-slate-700"}`}>Church name
                                                <input className={inputClass} value={settings.churchName} onChange={(e) => update("churchName", e.target.value)} placeholder="Enter church name" />
                                            </label>
                                            <label className={`text-sm font-medium ${dark ? "text-zinc-300" : "text-slate-700"}`}>Contact email
                                                <input type="email" className={inputClass} value={settings.churchEmail} onChange={(e) => update("churchEmail", e.target.value)} placeholder="name@example.com" />
                                            </label>
                                            <label className={`text-sm font-medium ${dark ? "text-zinc-300" : "text-slate-700"}`}>Timezone
                                                <span className="relative block"><select className={`${inputClass} appearance-none pr-9`} value={settings.timezone} onChange={(e) => update("timezone", e.target.value)}><option value="Africa/Lagos">Africa/Lagos (WAT)</option><option value="UTC">UTC</option><option value="Europe/London">Europe/London</option><option value="America/New_York">America/New York</option></select><FontAwesomeIcon icon={faChevronDown} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs ${muted}`} /></span>
                                            </label>
                                            <label className={`text-sm font-medium ${dark ? "text-zinc-300" : "text-slate-700"}`}>Language
                                                <span className="relative block"><select className={`${inputClass} appearance-none pr-9`} value={settings.language} onChange={(e) => update("language", e.target.value)}><option>English</option><option>French</option><option>Portuguese</option></select><FontAwesomeIcon icon={faChevronDown} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs ${muted}`} /></span>
                                            </label>
                                            <label className={`text-sm font-medium ${dark ? "text-zinc-300" : "text-slate-700"}`}>Date format
                                                <span className="relative block"><select className={`${inputClass} appearance-none pr-9`} value={settings.dateFormat} onChange={(e) => update("dateFormat", e.target.value)}><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select><FontAwesomeIcon icon={faChevronDown} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs ${muted}`} /></span>
                                            </label>
                                            <label className={`text-sm font-medium ${dark ? "text-zinc-300" : "text-slate-700"}`}>Public website
                                                <input type="url" className={inputClass} value={settings.publicWebsite} onChange={(e) => update("publicWebsite", e.target.value)} placeholder="https://example.com" />
                                            </label>
                                        </div>
                                    </Section>
                                    <Section dark={dark} icon={faDatabase} title="Workspace status" description="A quick look at your current preferences.">
                                        <div className="grid  grid-cols-1  gap-3  sm:grid-cols-3">
                                            {overview.map((item) => (
                                                <div key={item.label} className={`rounded-xl p-3.5 ${dark ? "bg-[#1b1d21]" : "bg-slate-50"}`}>
                                                    <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${item.good ? (dark ? "bg-emerald-950/50 text-emerald-300" : "bg-emerald-100 text-emerald-700") : (dark ? "bg-[#292a30] text-zinc-400" : "bg-slate-200 text-slate-500")}`}><FontAwesomeIcon icon={item.icon} /></div>
                                                    <p className={`text-xs ${muted}`}>{item.label}</p><p className={`mt-1 text-sm font-semibold ${dark ? "text-white" : "text-slate-800"}`}>{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                </>
                            )}

                            {activeTab === "Appearance" && (
                                <Section
                                    dark={dark}
                                    icon={faPalette}
                                    title="Appearance preferences"
                                    description="Choose the theme for your admin dashboard."
                                >
                                    <div className={`flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between ${dark ? "bg-[#1b1d21]" : "bg-slate-50"}`}>
                                        <div className="flex items-start gap-3">
                                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${dark ? "bg-[#292a30] text-indigo-200" : "bg-white text-[#1a1a4c] shadow-sm"}`}>
                                                <FontAwesomeIcon icon={dark ? faEyeSlash : faEye} />
                                            </span>
                                            <div>
                                                <p className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Dashboard theme</p>
                                                <p className={`mt-1 text-sm leading-5 ${muted}`}>
                                                    Current theme: <strong className={dark ? "text-white" : "text-slate-800"}>{dark ? "Dark mode" : "Light mode"}</strong>
                                                </p>
                                                <p className={`mt-1 text-xs leading-5 ${muted}`}>This setting controls the appearance across the dashboard.</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={dark}
                                            aria-label="Toggle dark theme"
                                            onClick={handleThemeChange}
                                            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${dark ? "" : "bg-slate-300"}`}
                                            style={dark ? { backgroundColor: NAVY } : undefined}
                                        >
                                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${dark ? "translate-x-6" : "translate-x-1"}`} />
                                        </button>
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className={`rounded-xl p-4 shadow-sm transition ${dark ? "bg-[#1b1d21] ring-1 ring-indigo-400/50" : "bg-slate-50"}`}>
                                            <div className="mb-3 flex gap-2">
                                                <span className="h-7 w-7 rounded-lg bg-white shadow-sm" />
                                                <span className="h-7 w-7 rounded-lg" style={{ backgroundColor: NAVY }} />
                                                <span className="h-7 w-7 rounded-lg bg-slate-200" />
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-800"}`}>Light theme</p>
                                                {!dark && <span className="text-xs font-semibold text-emerald-600">Current theme</span>}
                                            </div>
                                            <p className={`mt-1 text-xs leading-5 ${muted}`}>Bright white cards, a navy accent, and soft shadows for a clean, airy workspace.</p>
                                        </div>
                                        <div className={`rounded-xl p-4 shadow-sm transition ${dark ? "bg-[#101112] ring-1 ring-indigo-400/50" : "bg-slate-900"}`}>
                                            <div className="mb-3 flex gap-2">
                                                <span className="h-7 w-7 rounded-lg bg-[#141618]" />
                                                <span className="h-7 w-7 rounded-lg" style={{ backgroundColor: NAVY }} />
                                                <span className="h-7 w-7 rounded-lg bg-zinc-700" />
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-sm font-semibold text-white">Dark theme</p>
                                                {dark && <span className="text-xs font-semibold text-emerald-300">Current theme</span>}
                                            </div>
                                            <p className="mt-1 text-xs leading-5 text-zinc-400">Deep charcoal surfaces, navy accents, and subtle shadows for a comfortable dark workspace.</p>
                                        </div>
                                    </div>
                                </Section>
                            )}

                            {activeTab === "Notifications" && (
                                <>
                                    <Section dark={dark} icon={faBell} title="Notification preferences" description="Choose which notifications you want this workspace to prepare for you.">
                                        <div className={`divide-y ${dark ? "divide-[#2a2c30]" : "divide-slate-100"}`}>
                                            <Toggle dark={dark} checked={settings.emailNotifications} onChange={(value) => update("emailNotifications", value)} label="Email notifications" description="Allow important admin notifications to be sent by email." />
                                            <Toggle dark={dark} checked={settings.newMessageAlerts} onChange={(value) => update("newMessageAlerts", value)} label="New message alerts" description="Receive an alert when a new message arrives." />
                                            <Toggle dark={dark} checked={settings.weeklySummary} onChange={(value) => update("weeklySummary", value)} label="Weekly summary" description="Prepare a weekly overview of platform activity." />
                                        </div>
                                    </Section>
                                    <Section dark={dark} icon={faGlobe} title="Public content" description="Choose which types of content are intended to be publicly visible.">
                                        <div className={`divide-y ${dark ? "divide-[#2a2c30]" : "divide-slate-100"}`}>
                                            <Toggle dark={dark} checked={settings.publicSermons} onChange={(value) => update("publicSermons", value)} label="Public sermons" description="Mark sermons as eligible for public display." />
                                            <Toggle dark={dark} checked={settings.publicEvents} onChange={(value) => update("publicEvents", value)} label="Public events" description="Mark events as eligible for public display." />
                                            <Toggle dark={dark} checked={settings.allowMessageReplies} onChange={(value) => update("allowMessageReplies", value)} label="Allow message replies" description="Allow staff to respond to messages from the admin inbox." />
                                        </div>
                                    </Section>
                                </>
                            )}

                            {activeTab === "Privacy & security" && (
                                <>
                                    <Section dark={dark} icon={faLock} title="Account security" description="Local preference controls for a safer admin workspace.">
                                        <div className={`divide-y ${dark ? "divide-[#2a2c30]" : "divide-slate-100"}`}>
                                            <Toggle dark={dark} checked={settings.twoFactor} onChange={(value) => update("twoFactor", value)} label="Two-factor authentication" description="Store your preference to require an additional sign-in step. Actual enforcement needs authentication-backend support." />
                                        </div>
                                        <label className={`mt-4 block text-sm font-medium ${dark ? "text-zinc-300" : "text-slate-700"}`}>Session timeout
                                            <span className="relative block"><select className={`${inputClass} appearance-none pr-9`} value={settings.sessionTimeout} onChange={(e) => update("sessionTimeout", e.target.value)}><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option><option value="120">2 hours</option></select><FontAwesomeIcon icon={faChevronDown} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs ${muted}`} /></span>
                                        </label>
                                        <label className={`mt-4 block text-sm font-medium ${dark ? "text-zinc-300" : "text-slate-700"}`}>Profile visibility
                                            <span className="relative block"><select className={`${inputClass} appearance-none pr-9`} value={settings.profileVisibility} onChange={(e) => update("profileVisibility", e.target.value)}><option>Administrators</option><option>All staff</option><option>Private</option></select><FontAwesomeIcon icon={faChevronDown} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs ${muted}`} /></span>
                                        </label>
                                    </Section>
                                    <Section dark={dark} icon={faCloudArrowUp} title="Data and storage" description="Settings in this demo are stored in your current browser.">
                                        <div className={`flex items-start gap-3 rounded-xl p-4 ${dark ? "bg-[#1b1d21]" : "bg-slate-50"}`}>
                                            <FontAwesomeIcon icon={faDatabase} className={`mt-0.5 ${muted}`} />
                                            <div><p className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-800"}`}>Browser-local storage</p><p className={`mt-1 text-sm leading-5 ${muted}`}>Saving preferences stores them in this browser only. For shared admin settings and enforced security, connect these controls to your backend.</p></div>
                                        </div>
                                    </Section>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex justify-end">
                        <button type="button" onClick={saveSettings} className="inline-flex  items-center  gap-2  rounded-xl  px-5  py-3  text-sm  font-semibold  text-white  shadow-sm  transition  hover:opacity-90" style={{ backgroundColor: NAVY }}>
                            <FontAwesomeIcon icon={faCheck} /> Save settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
