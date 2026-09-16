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
        <section>
            <div>
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of your church platform</p>
                </div>

                <div>
                    <button>Last 7 Days</button>
                    <button>Last 30 Days</button>
                    <button>Custom Range</button>
                </div>
            </div>

            <div>
                {statistics.map(stat => (
                    <div key={stat.title}>
                        <div>
                            <FontAwesomeIcon icon={stat.icon} />
                        </div>

                        <div>
                            <p>{stat.title}</p>
                            <h2>{stat.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <div>
                    <h2>Views Overview</h2>
                    <p>Sermon views over time</p>

                    {/* Chart will come here */}
                </div>

                <div>
                    <h2>Top Sermons</h2>

                    {topSermons.map(sermon => (
                        <div key={sermon.id}>
                            <span>{sermon.id}</span>

                            <div>
                                {/* Thumbnail will come here */}
                            </div>

                            <div>
                                <h3>{sermon.title}</h3>
                                <p>{sermon.speaker}</p>
                            </div>

                            <span>{sermon.views}</span>
                        </div>
                    ))}
                </div>

                <div>
                    <h2>Recent Activity</h2>

                    {recentActivities.map(activity => (
                        <div key={activity.id}>
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
            <div>
                <div>
                    <h2>Sermons by Category</h2>

                    <div>
                        {/* Donut chart will come here */}

                        <div>
                            {sermonCategories.map(category => (
                                <div key={category.id}>
                                    <span>{category.name}</span>
                                    <span>{category.percentage}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h2>Upcoming Events</h2>

                    {upcomingEvents.map(event => (
                        <div key={event.id}>
                            <div>
                                <span>{event.month}</span>
                                <strong>{event.day}</strong>
                            </div>

                            <div>
                                <h3>{event.title}</h3>
                                <p>
                                    {event.date} · {event.time}
                                </p>
                            </div>

                            <span>Upcoming</span>
                        </div>
                    ))}
                </div>

                <div>
                    <h2>System Overview</h2>

                    {systemOverview.map(system => (
                        <div key={system.id}>
                            <div>
                                <span>{system.name}</span>
                                <span>{system.value}</span>
                            </div>

                            <div>
                                {/* Progress bar will come here */}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Dashboard;