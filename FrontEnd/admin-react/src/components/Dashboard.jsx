import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faMessage, faPlay, faUsers } from "@fortawesome/free-solid-svg-icons"
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip
} from "recharts";


const statistics = [
    {
        title: "Total Sermons",
        value: "128",
        icon: faBookOpen,
        iconBg: "#ede9fe",
        iconColor: "#7c3aed"
    },
    {
        title: "Total Views",
        value: "24.5K",
        icon: faPlay,
        iconBg: "#dff7eb",
        iconColor: "#16a34a"
    },
    {
        title: "Total Users",
        value: "1,842",
        icon: faUsers,
        iconBg: "#e0ecff",
        iconColor: "#2563eb"
    },
    {
        title: "Upcoming Events",
        value: "6",
        icon: faCalendarAlt,
        iconBg: "#fff0df",
        iconColor: "#f97316"
    },
    {
        title: "Total Messages",
        value: "256",
        icon: faMessage,
        iconBg: "#ffe4eb",
        iconColor: "#f43f5e"
    }
];


const viewsData = [
    { date: "May 20", views: 2300 },
    { date: "May 22", views: 3400 },
    { date: "May 24", views: 2900 },
    { date: "May 26", views: 4200 },
    { date: "May 28", views: 2200 },
    { date: "May 30", views: 3400 },
    { date: "Jun 1", views: 5600 },
    { date: "Jun 3", views: 4700 },
    { date: "Jun 5", views: 5400 },
    { date: "Jun 7", views: 3800 },
    { date: "Jun 9", views: 1800 },
    { date: "Jun 11", views: 3500 },
    { date: "Jun 13", views: 4000 },
    { date: "Jun 15", views: 3200 },
    { date: "Jun 17", views: 5000 }
];


const topSermons = [
    {
        id: 1,
        title: "Walking By Faith",
        speaker: "Pastor Tobore",
        views: "4.6K"
    },
    {
        id: 2,
        title: "The Power of Prayer",
        speaker: "Pastor Tobore",
        views: "3.2K"
    },
    {
        id: 3,
        title: "Living a Life of Purpose",
        speaker: "Pastor Paul",
        views: "2.8K"
    },
    {
        id: 4,
        title: "The Power of Consecration",
        speaker: "Pastor Paul",
        views: "2.1K"
    },
    {
        id: 5,
        title: "Purity",
        speaker: "Pastor Tobore",
        views: "1.9K"
    }
];

const recentActivities = [
    {
        id: 1,
        title: "New sermon added",
        description: '"The Power of Prayer" was added',
        time: "2m"
    },
    {
        id: 2,
        title: "New user registered",
        description: "A new member joined",
        time: "12m"
    },
    {
        id: 3,
        title: "New message",
        description: "A visitor sent a message",
        time: "25m"
    },
    {
        id: 4,
        title: "Sermon updated",
        description: '"Living a Life of Purpose"',
        time: "1h"
    }
];


const sermonCategories = [
    { id: 1, name: "Faith", percentage: "35%", color: "#8b5cf6" },
    { id: 2, name: "Prayer", percentage: "25%", color: "#60a5fa" },
    { id: 3, name: "Teaching", percentage: "20%", color: "#34d399" },
    { id: 4, name: "Worship", percentage: "10%", color: "#fbbf24" },
    { id: 5, name: "Others", percentage: "10%", color: "#f87171" }
];

const upcomingEvents = [
    {
        id: 1,
        month: "JUN",
        day: "25",
        title: "Sunday Worship Service",
        date: "June 25, 2026",
        time: "9:00 AM"
    },
    {
        id: 2,
        month: "JUN",
        day: "30",
        title: "Youth Conference",
        date: "June 30, 2026",
        time: "10:00 AM"
    },
    {
        id: 3,
        month: "JUL",
        day: "07",
        title: "Prayer & Fasting",
        date: "July 7, 2026",
        time: "6:00 AM"
    }
];

const systemOverview = [
    {
        id: 1,
        name: "Database",
        value: "Healthy",
        percentage: 98
    },
    {
        id: 2,
        name: "Storage",
        value: "45%",
        percentage: 45
    },
    {
        id: 3,
        name: "Active Users",
        value: "1,842",
        percentage: 75
    },
    {
        id: 4,
        name: "Server Usage",
        value: "35%",
        percentage: 35
    }
];

const Dashboard = () => {
    let total = 0;

    const categoryGradient = sermonCategories.map(category => {
        const percentage = parseInt(category.percentage);

        const start = total;

        total += percentage;

        return `${start}% ${total}%`;
    });

    return (
        <section >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold">
                        Dashboard
                    </h1>

                    <p className="text-sm text-slate-500">
                        Overview of your church platform
                    </p>
                </div>
                {/* 
                <div>
                    <button>Last 7 Days</button>
                    <button>Last 30 Days</button>
                    <button>Custom Range</button>
                </div> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {statistics.map(stat => (
                    <div
                        key={stat.title}
                        className="bg-[var(--card-background)] rounded-xl p-5 shadow-[0_5px_30px_0_var(--card-shadow)] transition-transform duration-300 hover:translate-y-[-3px] flex items-center gap-4"
                    >
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{
                                backgroundColor: stat.iconBg,
                                color: stat.iconColor
                            }}
                        >
                            <FontAwesomeIcon icon={stat.icon} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-[13.5px] text-slate-500">
                                {stat.title}
                            </p>

                            <h2 className="text-xl font-bold">
                                {stat.value}
                            </h2>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">

                <div className="lg:col-span-5 bg-[var(--card-background)] shadow-[0_5px_30px_0_var(--card-shadow)] rounded-xl p-5">

                    <div className="flex items-start justify-between">

                        <div>
                            <h2 className="text-md font-bold">
                                Views Overview
                            </h2>

                            <p className="text-[13px] text-slate-500">
                                Sermon views over time
                            </p>
                        </div>

                        <button className="px-4 py-2 rounded-lg cursor-pointer bg-[var(--background)] transition-transform duration-300 hover:translate-y-[-3px] hover:bg-[var(--sidebar-hover)] hover:text-[var(--card-background)] text-[12px]">
                            This Month
                        </button>

                    </div>

                    <div className="h-68 mt-5">
                        {/* Chart will come here */}
                    </div>

                </div>

                <div className="lg:col-span-3 bg-[var(--card-background)] shadow-[0_5px_30px_0_var(--card-shadow)] rounded-xl p-5 hover:cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-md font-bold">
                            Top Sermons
                        </h2>

                        <button className="text-[12px] cursor-pointer transition-transform duration-300 hover:translate-y-[-3px]">
                            View All
                        </button>
                    </div>

                    {topSermons.map(sermon => (
                        <div
                            key={sermon.id}
                            className="flex items-center gap-3 py-3"
                        >
                            <span className="text-sm">{sermon.id}</span>

                            <div
                                className="w-11 h-11 rounded-md bg-[var(--background)] flex-shrink-0"
                            >
                                {/* Thumbnail */}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-[13px] font-semibold truncate">
                                    {sermon.title}
                                </h3>

                                <p className="text-[11px] text-slate-500 mt-1">
                                    {sermon.speaker}
                                </p>
                            </div>

                            <span className="text-[#3737c5] bg-[#edebff] px-2 py-1 text-[10px] font-semibold rounded-lg flex-shrink-0">
                                {sermon.views}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-4 bg-[var(--card-background)] shadow-[0_5px_30px_0_var(--card-shadow)] transition-transform duration-300 hover:translate-y-[-3px] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-md font-bold">
                            Recent Activity
                        </h2>

                        <button className="text-[12px] cursor-pointer transition-transform duration-300 hover:translate-y-[-3px]">
                            View All
                        </button>
                    </div>

                    {recentActivities.map(activity => (
                        <div
                            key={activity.id}
                            className="flex items-center gap-3 py-3 border-b border-[var(--sidebar-hover)] last:border-b-0"
                        >
                            <div className="w-8 h-8 rounded-full bg-[var(--background)] flex items-center justify-center flex-shrink-0">
                                {/* Activity icon */}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-[13px] font-semibold">
                                    {activity.title}
                                </h3>

                                <p className="text-[11px] text-slate-500 mt-1 truncate">
                                    {activity.description}
                                </p>
                            </div>

                            <span className="text-[10px] text-slate-500 flex-shrink-0">
                                {activity.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">

                {/* Sermons by Category */}
                <div className="lg:col-span-5 bg-[var(--card-background)] shadow-[0_5px_30px_0_var(--card-shadow)] rounded-xl p-5 transition-transform duration-300 hover:translate-y-[-3px]">

                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-md font-bold">
                            Sermons by Category
                        </h2>

                        <button className="text-[12px] cursor-pointer transition-transform duration-300 hover:translate-y-[-3px]">
                            View All
                        </button>
                    </div>

                    <div className="flex  justify-between mt-10">
                        <div className="flex gap-5">
                            <div
                                className="relative w-36 h-36 rounded-full"
                                style={{
                                    background: `conic-gradient(
        ${sermonCategories[0].color} ${categoryGradient[0]},
        ${sermonCategories[1].color} ${categoryGradient[1]},
        ${sermonCategories[2].color} ${categoryGradient[2]},
        ${sermonCategories[3].color} ${categoryGradient[3]},
        ${sermonCategories[4].color} ${categoryGradient[4]}
    )`
                                }}
                            >
                                <div className="absolute inset-5 rounded-full bg-[var(--card-background)]"></div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {sermonCategories.map(category => (
                                    <div key={category.id} className="flex gap-2 items-center">
                                        <span
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ backgroundColor: category.color }}
                                        ></span>

                                        <span className="text-slate-500 text-[12px]">
                                            {category.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Category list */}
                        <div
                            className="flex flex-col gap-2 text-sm"
                        >
                            {sermonCategories.map(category => (

                                <span className="font-semibold text-[13px]">
                                    {category.percentage}
                                </span>

                            ))}
                        </div>

                    </div>

                </div>


                {/* Upcoming Events */}
                <div className="lg:col-span-3 bg-[var(--card-background)] shadow-[0_5px_30px_0_var(--card-shadow)] rounded-xl p-5 transition-transform duration-300 hover:translate-y-[-3px]">

                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-md font-bold">
                            Upcoming Events
                        </h2>

                        <button className="text-[12px] cursor-pointer transition-transform duration-300 hover:translate-y-[-3px]">
                            View All
                        </button>
                    </div>

                    <div className="flex flex-col">

                        {upcomingEvents.map(event => (
                            <div
                                key={event.id}
                                className="flex items-center gap-3 py-3 border-b border-[var(--sidebar-hover)] last:border-b-0"
                            >

                                <div className="flex flex-col items-center justify-center min-w-12 h-12 rounded-lg bg-[var(--background)]">
                                    <span className="text-[10px] font-semibold text-slate-500">
                                        {event.month}
                                    </span>

                                    <strong className="text-md font-bold">
                                        {event.day}
                                    </strong>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[13px] font-semibold truncate">
                                        {event.title}
                                    </h3>

                                    <p className="text-[10px] text-slate-500 mt-1">
                                        {event.date} · {event.time}
                                    </p>
                                </div>

                                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[var(--background)] text-slate-500">
                                    Upcoming
                                </span>

                            </div>
                        ))}

                    </div>

                </div>


                {/* System Overview */}
                <div className="lg:col-span-4 bg-[var(--card-background)] shadow-[0_5px_30px_0_var(--card-shadow)] rounded-xl p-5 transition-transform duration-300 hover:translate-y-[-3px]">

                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-md font-bold">
                            System Overview
                        </h2>
                    </div>

                    <div className="flex flex-col gap-5">

                        {systemOverview.map(system => (
                            <div key={system.id}>

                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-slate-500">
                                        {system.name}
                                    </span>

                                    <span className="text-sm font-semibold">
                                        {system.value}
                                    </span>
                                </div>

                                {/* Progress bar will come here */}
                                <div className="w-full h-2 rounded-full bg-[var(--background)] overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500 bg-purple-500"
                                        style={{ width: `${system.percentage}%` }}
                                    ></div>
                                </div>

                            </div>
                        ))}

                    </div>

                </div>

            </div>
        </section>
    );
};

export default Dashboard;