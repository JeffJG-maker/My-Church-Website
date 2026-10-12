import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    faArrowDown,
    faArrowUp,
    faCalendarDays,
    faChartLine,
    faChevronDown,
    faCirclePlay,
    faClock,
    faDownload,
    faEye,
    faFilter,
    faHandHoldingHeart,
    faHeadphones,
    faMagnifyingGlass,
    faMessage,
    faPeopleGroup,
    faShareNodes,
    faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NAVY = "#1a1a4c";

const initialActivity = [
    { day: "Mon", views: 340, listens: 180 },
    { day: "Tue", views: 460, listens: 240 },
    { day: "Wed", views: 390, listens: 210 },
    { day: "Thu", views: 590, listens: 310 },
    { day: "Fri", views: 510, listens: 275 },
    { day: "Sat", views: 760, listens: 420 },
    { day: "Sun", views: 920, listens: 510 },
];

const initialContent = [
    { title: "Walking by Faith", speaker: "Pastor Samuel", type: "Sermon", views: 2840, engagement: 78, icon: faVideo },
    { title: "The Power of Prayer", speaker: "Pastor Grace", type: "Sermon", views: 2310, engagement: 72, icon: faCirclePlay },
    { title: "Sunday Worship Session", speaker: "Worship Team", type: "Media", views: 1960, engagement: 66, icon: faHeadphones },
    { title: "Living a Life of Purpose", speaker: "Pastor Samuel", type: "Sermon", views: 1740, engagement: 61, icon: faVideo },
    { title: "Midweek Service Highlights", speaker: "Media Unit", type: "Media", views: 1280, engagement: 54, icon: faCirclePlay },
];

const ranges = [
    { label: "7 days", value: "7" },
    { label: "30 days", value: "30" },
    { label: "90 days", value: "90" },
];

function formatNumber(number) {
    return new Intl.NumberFormat("en-NG").format(number);
}

function MetricCard({ icon, label, value, change, positive = true, hint, dark }) {
    const reduced = useReducedMotion();
    return (
        <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={`rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-shadow ${dark ? "bg-[#141618] shadow-black/20" : "bg-white hover:shadow-[0_8px_28px_rgba(15,23,42,0.07)]"}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${dark ? "bg-[#202126] text-indigo-200" : "bg-indigo-50 text-[#1a1a4c]"}`}>
                    <FontAwesomeIcon icon={icon} />
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${positive ? (dark ? "bg-emerald-950/60 text-emerald-300" : "bg-emerald-50 text-emerald-700") : (dark ? "bg-rose-950/60 text-rose-300" : "bg-rose-50 text-rose-700")}`}>
                    <FontAwesomeIcon icon={positive ? faArrowUp : faArrowDown} className="text-[10px]" />
                    {change}
                </span>
            </div>
            <p className={`mt-4 text-sm ${dark ? "text-zinc-400" : "text-slate-500"}`}>{label}</p>
            <div className="mt-1 flex items-baseline gap-2">
                <h3 className={`text-2xl font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>{value}</h3>
            </div>
            <p className={`mt-1 text-xs ${dark ? "text-zinc-500" : "text-slate-400"}`}>{hint}</p>
        </motion.div>
    );
}

function Panel({ title, subtitle, action, children, dark, className = "" }) {
    return (
        <section className={`rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-shadow ${dark ? "bg-[#141618] shadow-black/20" : "bg-white hover:shadow-[0_8px_28px_rgba(15,23,42,0.07)]"} ${className}`}>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className={`text-base font-bold ${dark ? "text-white" : "text-slate-900"}`}>{title}</h2>
                    {subtitle && <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-slate-500"}`}>{subtitle}</p>}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

export default function Analytics() {
    const [range, setRange] = useState("7");
    const [contentType, setContentType] = useState("All content");
    const [search, setSearch] = useState("");
    const [notice, setNotice] = useState("");
    const [dark, setDark] = useState(
        typeof document !== "undefined" && document.documentElement.classList.contains("dark")
    );
    const reduced = useReducedMotion();

    // Follow the same root .dark class used by the app-wide theme toggle.
    useEffect(() => {
        if (typeof document === "undefined") return undefined;
        const root = document.documentElement;
        const syncTheme = () => setDark(root.classList.contains("dark"));
        syncTheme();
        const observer = new MutationObserver(syncTheme);
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    const multiplier = range === "7" ? 1 : range === "30" ? 3.8 : 10.5;
    const metrics = useMemo(() => ({
        views: Math.round(12840 * multiplier),
        visitors: Math.round(3260 * multiplier * 0.88),
        plays: Math.round(7840 * multiplier * 0.93),
        engagement: range === "7" ? "64.8%" : range === "30" ? "61.2%" : "59.7%",
    }), [multiplier, range]);

    const chartData = useMemo(() => initialActivity.map((item, index) => {
        const dayFactor = range === "7" ? 1 : range === "30" ? 1.5 + (index % 3) * 0.15 : 2.2 + (index % 2) * 0.2;
        return { ...item, views: Math.round(item.views * dayFactor), listens: Math.round(item.listens * dayFactor) };
    }), [range]);

    const content = useMemo(() => initialContent
        .filter((item) => contentType === "All content" || item.type === contentType)
        .filter((item) => `${item.title} ${item.speaker}`.toLowerCase().includes(search.toLowerCase().trim()))
        .sort((a, b) => b.views - a.views), [contentType, search]);

    const maxViews = Math.max(...chartData.map((item) => item.views));
    const totalContentViews = initialContent.reduce((sum, item) => sum + item.views, 0);

    const exportReport = () => {
        const rows = [
            ["Content", "Speaker/Owner", "Type", "Views", "Engagement (%)"],
            ...content.map((item) => [item.title, item.speaker, item.type, item.views, item.engagement]),
        ];
        const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "church-analytics-report.csv";
        link.click();
        URL.revokeObjectURL(url);
        setNotice("Report exported as a CSV file.");
        window.setTimeout(() => setNotice(""), 3000);
    };

    const surface = dark ? "bg-[#101112] text-white" : "bg-transparent text-slate-900";
    const muted = dark ? "text-zinc-400" : "text-slate-500";
    const inputClass = `rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500/20 ${dark ? "border-[#2a2c30] bg-[#181a1d] text-white placeholder:text-zinc-500" : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"}`;

    return (
        <div className={`min-h-full space-y-6 pb-8 ${surface}`}>
            <motion.div
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
            >
                <div>
                    <div className={`mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-indigo-300" : "text-[#1a1a4c]"}`}>
                        <FontAwesomeIcon icon={faChartLine} />
                        Insights & reports
                    </div>
                    <h1 className={`text-2xl font-bold tracking-tight sm:text-3xl ${dark ? "text-white" : "text-slate-900"}`}>Analytics</h1>
                    <p className={`mt-2 max-w-2xl text-sm sm:text-base ${muted}`}>Understand how people engage with sermons, media and church updates.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <div className={`flex items-center gap-2 rounded-xl p-1 shadow-sm ${dark ? "bg-[#141618] shadow-black/20" : "bg-white shadow-[0_2px_12px_rgba(15,23,42,0.06)]"}`}>
                        {ranges.map((item) => (
                            <button
                                key={item.value}
                                onClick={() => setRange(item.value)}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${range === item.value ? "text-white shadow-sm" : `${muted} ${dark ? "hover:text-white" : "hover:text-slate-900"}`}`}
                                style={range === item.value ? { backgroundColor: NAVY } : undefined}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={exportReport} className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90" style={{ backgroundColor: NAVY }}>
                        <FontAwesomeIcon icon={faDownload} /> Export report
                    </button>
                </div>
            </motion.div>

            <AnimatePresence>
                {notice && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className={`rounded-xl border px-4 py-3 text-sm ${dark ? "border-emerald-900 bg-emerald-950/40 text-emerald-200" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
                        {notice}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard dark={dark} icon={faEye} label="Total content views" value={formatNumber(metrics.views)} change="+12.8%" hint="Compared with previous period" />
                <MetricCard dark={dark} icon={faPeopleGroup} label="Unique visitors" value={formatNumber(metrics.visitors)} change="+8.4%" hint="People who visited your platform" />
                <MetricCard dark={dark} icon={faCirclePlay} label="Sermon & media plays" value={formatNumber(metrics.plays)} change="+16.2%" hint="Video and audio plays combined" />
                <MetricCard dark={dark} icon={faHandHoldingHeart} label="Engagement rate" value={metrics.engagement} change="+4.6%" hint="Average engagement this period" />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
                <Panel dark={dark} title="Audience activity" subtitle={`Daily views and audio listens · last ${range} days`} action={
                    <span className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${dark ? "bg-[#202126] text-zinc-300" : "bg-slate-50 text-slate-600"}`}>
                        <FontAwesomeIcon icon={faCalendarDays} /> Recent activity
                    </span>
                }>
                    <div className="mb-4 flex flex-wrap gap-4 text-xs">
                        <span className={`inline-flex items-center gap-2 ${muted}`}><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: NAVY }} /> Views</span>
                        <span className={`inline-flex items-center gap-2 ${muted}`}><span className="h-2.5 w-2.5 rounded-full bg-violet-400" /> Audio listens</span>
                    </div>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-7 pt-1">
                            {[100, 75, 50, 25, 0].map((line) => <div key={line} className={`border-t border-dashed ${dark ? "border-[#2a2c30]" : "border-slate-200"}`} />)}
                        </div>
                        <div className="relative grid h-56 grid-cols-7 items-end gap-2 sm:gap-4">
                            {chartData.map((item, index) => (
                                <div key={item.day} className="flex h-full flex-col items-center justify-end gap-2">
                                    <div className="flex h-[calc(100%-1.5rem)] w-full items-end justify-center gap-1 sm:gap-2">
                                        <motion.div
                                            initial={reduced ? false : { height: 0 }}
                                            animate={{ height: `${Math.max(5, (item.views / maxViews) * 100)}%` }}
                                            transition={{ duration: 0.55, delay: index * 0.04 }}
                                            title={`${formatNumber(item.views)} views`}
                                            className="w-[42%] max-w-7 rounded-t-md"
                                            style={{ backgroundColor: NAVY }}
                                        />
                                        <motion.div
                                            initial={reduced ? false : { height: 0 }}
                                            animate={{ height: `${Math.max(5, (item.listens / maxViews) * 100)}%` }}
                                            transition={{ duration: 0.55, delay: index * 0.04 + 0.05 }}
                                            title={`${formatNumber(item.listens)} listens`}
                                            className="w-[42%] max-w-7 rounded-t-md bg-violet-400"
                                        />
                                    </div>
                                    <span className={`text-xs ${muted}`}>{item.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={`mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-sm ${dark ? "border-[#2a2c30]" : "border-slate-100"}`}>
                        <span className={muted}>Peak activity is typically around the weekend.</span>
                        <span className={`font-semibold ${dark ? "text-white" : "text-slate-800"}`}>{formatNumber(chartData.reduce((sum, item) => sum + item.views, 0))} views shown</span>
                    </div>
                </Panel>

                <Panel dark={dark} title="Engagement snapshot" subtitle="How visitors interact with your content">
                    <div className="flex items-center gap-5">
                        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(${NAVY} 0% 64.8%, ${dark ? "#30313a" : "#e9eaf2"} 64.8% 100%)` }}>
                            <div className={`flex h-24 w-24 flex-col items-center justify-center rounded-full ${dark ? "bg-[#141618]" : "bg-white"}`}>
                                <span className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>{metrics.engagement}</span>
                                <span className={`text-[10px] ${muted}`}>Engagement</span>
                            </div>
                        </div>
                        <div className="min-w-0 flex-1 space-y-4">
                            <div>
                                <div className="mb-1 flex justify-between gap-2 text-xs"><span className={muted}>Video completion</span><strong className={dark ? "text-white" : "text-slate-800"}>72%</strong></div>
                                <div className={`h-2 overflow-hidden rounded-full ${dark ? "bg-[#2a2c30]" : "bg-slate-100"}`}><motion.div initial={{ width: 0 }} animate={{ width: "72%" }} className="h-full rounded-full" style={{ backgroundColor: NAVY }} /></div>
                            </div>
                            <div>
                                <div className="mb-1 flex justify-between gap-2 text-xs"><span className={muted}>Audio completion</span><strong className={dark ? "text-white" : "text-slate-800"}>58%</strong></div>
                                <div className={`h-2 overflow-hidden rounded-full ${dark ? "bg-[#2a2c30]" : "bg-slate-100"}`}><motion.div initial={{ width: 0 }} animate={{ width: "58%" }} transition={{ delay: 0.1 }} className="h-full rounded-full bg-violet-400" /></div>
                            </div>
                            <div>
                                <div className="mb-1 flex justify-between gap-2 text-xs"><span className={muted}>Shares & forwards</span><strong className={dark ? "text-white" : "text-slate-800"}>34%</strong></div>
                                <div className={`h-2 overflow-hidden rounded-full ${dark ? "bg-[#2a2c30]" : "bg-slate-100"}`}><motion.div initial={{ width: 0 }} animate={{ width: "34%" }} transition={{ delay: 0.2 }} className="h-full rounded-full bg-amber-400" /></div>
                            </div>
                        </div>
                    </div>
                    <div className={`mt-5 rounded-xl p-3 ${dark ? "bg-[#1b1d21]" : "bg-indigo-50/70"}`}>
                        <div className={`flex items-start gap-3 text-sm ${dark ? "text-zinc-300" : "text-slate-700"}`}>
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#1a1a4c]"><FontAwesomeIcon icon={faChartLine} /></span>
                            <p><strong className={dark ? "text-white" : "text-slate-900"}>Insight:</strong> Sermons and worship content are driving the strongest engagement in this sample report.</p>
                        </div>
                    </div>
                </Panel>
            </div>

            <Panel dark={dark} title="Top-performing content" subtitle="Ranked by views for the selected reporting period" action={
                <div className="flex flex-wrap gap-2">
                    <div className="relative">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs ${muted}`} />
                        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search content..." className={`${inputClass} w-full pl-8 sm:w-44`} />
                    </div>
                    <div className="relative">
                        <FontAwesomeIcon icon={faFilter} className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs ${muted}`} />
                        <select value={contentType} onChange={(event) => setContentType(event.target.value)} className={`${inputClass} appearance-none pl-8 pr-8`}>
                            <option>All content</option>
                            <option>Sermon</option>
                            <option>Media</option>
                        </select>
                        <FontAwesomeIcon icon={faChevronDown} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] ${muted}`} />
                    </div>
                </div>
            }>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[620px] text-left">
                        <thead>
                            <tr className={`border-b text-xs uppercase tracking-wider ${dark ? "border-[#2a2c30] text-zinc-500" : "border-slate-100 text-slate-400"}`}>
                                <th className="pb-3 pr-4 font-semibold">Content</th>
                                <th className="pb-3 pr-4 font-semibold">Type</th>
                                <th className="pb-3 pr-4 font-semibold">Views</th>
                                <th className="pb-3 pr-4 font-semibold">Engagement</th>
                                <th className="pb-3 font-semibold">Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {content.map((item, index) => (
                                <motion.tr key={item.title} initial={reduced ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }} className={`border-b last:border-0 ${dark ? "border-[#25272b]" : "border-slate-50"}`}>
                                    <td className="py-4 pr-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${dark ? "bg-[#202126] text-indigo-200" : "bg-indigo-50 text-[#1a1a4c]"}`}><FontAwesomeIcon icon={item.icon} /></span>
                                            <div>
                                                <p className={`font-semibold ${dark ? "text-white" : "text-slate-800"}`}>{item.title}</p>
                                                <p className={`mt-0.5 text-xs ${muted}`}>{item.speaker}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${dark ? "bg-[#202126] text-zinc-300" : "bg-slate-100 text-slate-600"}`}>{item.type}</span></td>
                                    <td className={`py-4 pr-4 text-sm font-semibold ${dark ? "text-zinc-200" : "text-slate-700"}`}>{formatNumber(Math.round(item.views * multiplier))}</td>
                                    <td className="py-4 pr-4">
                                        <span className={`text-sm font-semibold ${dark ? "text-zinc-200" : "text-slate-700"}`}>{item.engagement}%</span>
                                        <div className={`mt-1 h-1.5 w-20 overflow-hidden rounded-full ${dark ? "bg-[#2a2c30]" : "bg-slate-100"}`}><div className="h-full rounded-full" style={{ width: `${item.engagement}%`, backgroundColor: NAVY }} /></div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-20 overflow-hidden rounded-full ${dark ? "bg-[#2a2c30]" : "bg-slate-100"}`}><div className="h-full rounded-full" style={{ width: `${Math.min(100, (item.views / initialContent[0].views) * 100)}%`, backgroundColor: NAVY }} /></div>
                                            <span className={`text-xs ${muted}`}>{index === 0 ? "Top" : index < 3 ? "Strong" : "Growing"}</span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {content.length === 0 && <tr><td colSpan="5" className={`py-10 text-center text-sm ${muted}`}>No content matches your search.</td></tr>}
                        </tbody>
                    </table>
                </div>
                <div className={`mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs ${dark ? "border-[#2a2c30] text-zinc-500" : "border-slate-100 text-slate-400"}`}>
                    <span>Showing {content.length} of {initialContent.length} sample items</span>
                    <span>Total sample views: {formatNumber(totalContentViews)}</span>
                </div>
            </Panel>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className={`flex items-start gap-3 rounded-2xl p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-shadow ${dark ? "bg-[#141618] shadow-black/20" : "bg-white hover:shadow-[0_8px_28px_rgba(15,23,42,0.07)]"}`}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><FontAwesomeIcon icon={faShareNodes} /></span>
                    <div><p className={`font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Sharing activity</p><p className={`mt-1 text-sm ${muted}`}>Shares can help extend the reach of sermons beyond regular visitors.</p></div>
                </div>
                <div className={`flex items-start gap-3 rounded-2xl p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-shadow ${dark ? "bg-[#141618] shadow-black/20" : "bg-white hover:shadow-[0_8px_28px_rgba(15,23,42,0.07)]"}`}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><FontAwesomeIcon icon={faMessage} /></span>
                    <div><p className={`font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Audience response</p><p className={`mt-1 text-sm ${muted}`}>Review messages and feedback alongside content performance.</p></div>
                </div>
                <div className={`flex items-start gap-3 rounded-2xl p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-shadow ${dark ? "bg-[#141618] shadow-black/20" : "bg-white hover:shadow-[0_8px_28px_rgba(15,23,42,0.07)]"}`}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><FontAwesomeIcon icon={faClock} /></span>
                    <div><p className={`font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Publishing rhythm</p><p className={`mt-1 text-sm ${muted}`}>Consistent uploads make it easier for members to find fresh content.</p></div>
                </div>
            </div>
            <p className={`text-xs ${muted}`}>Note: These figures are sample interface data. Connect the page to your backend or analytics provider to display real church statistics.</p>
        </div>
    );
}
