import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faMessage, faPlay, faUsers } from "@fortawesome/free-solid-svg-icons"
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons"


const statistics = [
    {
        title: "Total Sermons",
        value: "76",
        icon: faBookOpen
    },
    {
        title: "Total Views",
        value: "12,450",
        icon: faPlay
    },

    {
        title: "Users",
        value: "56",
        icon: faUsers
    },

    {
        title: "UpComing Events",
        value: "7",
        icon: faCalendarAlt
    },
    {
        title: "Total Messages",
        value: "8",
        icon: faMessage
    }
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
    {
        id: 1,
        name: "Faith",
        percentage: "35%"
    },
    {
        id: 2,
        name: "Prayer",
        percentage: "25%"
    },
    {
        id: 3,
        name: "Teaching",
        percentage: "20%"
    },
    {
        id: 4,
        name: "Worship",
        percentage: "10%"
    },
    {
        id: 5,
        name: "Others",
        percentage: "10%"
    }
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
        value: "Healthy"
    },
    {
        id: 2,
        name: "Storage",
        value: "45%"
    },
    {
        id: 3,
        name: "Active Users",
        value: "1,842"
    },
    {
        id: 4,
        name: "Server Usage",
        value: "35%"
    }
];

const Dashboard = () => {
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

                <div>
                    <button>Last 7 Days</button>
                    <button>Last 30 Days</button>
                    <button>Custom Range</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {statistics.map(stat => (
                    <div
                        key={stat.title}
                        className="bg-[var(--card-background)] rounded-xl p-5 shadow-[0_5px_30px_0_var(--card-shadow)] transition-transform duration-300 hover:translate-y-[-3px] hover:cursor-pointer"
                    >
                        <div>
                            <FontAwesomeIcon icon={stat.icon} />
                        </div>

                        <div className="flex items-center gap-4">
                            <p>{stat.title}</p>
                            <h2>{stat.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">

                <div className="lg:col-span-5 bg-[var(--card-background)] shadow-[0_5px_30px_0_var(--card-shadow)] rounded-xl p-5 hover:cursor-pointer">

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

                    <div>

                    </div>

                </div>

                <div className="lg:col-span-3 bg-[var(--card-background)] shadow-[0_5px_30px_0_var(--card-shadow)] rounded-xl p-5 hover:cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-md font-bold">
                            Top Sermons
                        </h2>

                        <button className="text-sm cursor-pointer transition-transform duration-300 hover:translate-y-[-3px]">
                            View All
                        </button>
                    </div>

                    {topSermons.map(sermon => (
                        <div
                            key={sermon.id}
                            className="flex items-center gap-3"
                        >
                            <span>{sermon.id}</span>

                            <div>
                                {/* Thumbnail will come here */}
                            </div>

                            <div>
                                <h3 className="">{sermon.title}</h3>
                                <p className="text-[12px]">{sermon.speaker}</p>
                            </div>

                            <span className="text-[#3737c5] bg-[#c0bbf4] px-1 text-[11px] rounded-lg">{sermon.views}</span>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-4 bg-[var(--card-background)] shadow-[0_5px_30px_0_var(--card-shadow)] transition-transform duration-300 hover:translate-y-[-3px] rounded-xl p-5 hover:cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-md font-bold">
                            Recent Activity
                        </h2>

                        <button className="text-sm cursor-pointer transition-transform duration-300 hover:translate-y-[-3px]">
                            View All
                        </button>
                    </div>

                    {recentActivities.map(activity => (
                        <div key={activity.id}
                            className="flex items-center gap-3"
                        >
                            <div>
                                {/* Activity icon will come here */}
                            </div>

                            <div>
                                <h3>{activity.title}</h3>
                                <p>{activity.description}</p>
                            </div>

                            <span>{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">

                {/* Sermons by Category */}
                <div className="lg:col-span-5 bg-[var(--card-background)] shadow-[0_5px_30px_0_var(--card-shadow)] rounded-xl p-5 transition-transform duration-300 hover:translate-y-[-3px] hover:cursor-pointer">

                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-md font-bold">
                            Sermons by Category
                        </h2>

                        <button className="text-sm cursor-pointer transition-transform duration-300 hover:translate-y-[-3px]">
                            View All
                        </button>
                    </div>

                    <div className="flex items-center justify-between">

                        {/* Donut chart will come here */}
                        <div>
                        </div>

                        {/* Category list */}
                        <div className="flex flex-col gap-3">
                            {sermonCategories.map(category => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between gap-5"
                                >
                                    <span>{category.name}</span>
                                    <span>{category.percentage}</span>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>


                {/* Upcoming Events */}
                <div className="lg:col-span-3 bg-[var(--card-background)] shadow-[0_5px_30px_0_var(--card-shadow)] rounded-xl p-5 transition-transform duration-300 hover:translate-y-[-3px] hover:cursor-pointer">

                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-md font-bold">
                            Upcoming Events
                        </h2>

                        <button className="text-sm cursor-pointer transition-transform duration-300 hover:translate-y-[-3px]">
                            View All
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">

                        {upcomingEvents.map(event => (
                            <div
                                key={event.id}
                                className="flex items-center gap-3"
                            >

                                <div className="flex flex-col items-center">
                                    <span>{event.month}</span>
                                    <strong>{event.day}</strong>
                                </div>

                                <div>
                                    <h3>{event.title}</h3>
                                    <p>
                                        {event.date} - {event.time}
                                    </p>
                                </div>

                                <span>Upcoming</span>

                            </div>
                        ))}

                    </div>

                </div>


                {/* System Overview */}
                <div className="lg:col-span-4 bg-[var(--card-background)] shadow-[0_5px_30px_0_var(--card-shadow)] rounded-xl p-5 transition-transform duration-300 hover:translate-y-[-3px] hover:cursor-pointer">

                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-md font-bold">
                            System Overview
                        </h2>
                    </div>

                    <div className="flex flex-col gap-5">

                        {systemOverview.map(system => (
                            <div key={system.id}>

                                <div className="flex items-center justify-between mb-2">
                                    <span>{system.name}</span>
                                    <span>{system.value}</span>
                                </div>

                                {/* Progress bar will come here */}
                                <div>
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