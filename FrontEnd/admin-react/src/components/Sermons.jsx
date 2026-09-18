import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBookOpen,
    faLayerGroup,
    faPlayCircle
} from "@fortawesome/free-solid-svg-icons";

const sermonSummary = [
    {
        title: "Total Sermons",
        value: "128",
        icon: faBookOpen
    },
    {
        title: "Categories",
        value: "8",
        icon: faLayerGroup
    },
    {
        title: "Total Views",
        value: "24.5K",
        icon: faPlayCircle
    }
];

const Sermons = () => {
    return (
        <section className="sermons-page">

            <main className="dashboard-content">

                {/* Page heading */}
                <div className="page-heading">
                    <div>
                        <h2 className="text-2xl font-bold">
                            Sermons
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Manage, update and organize your sermons.
                        </p>
                    </div>
                </div>

                {/* Summary cards */}
                <section className="sermon-summary grid grid-cols-3 gap-5 mt-6">

                    {sermonSummary.map((summary) => (
                        <div
                            key={summary.title}
                            className="summary-card bg-[var(--card-background)] rounded-xl p-5 flex items-center gap-4 shadow-[0_5px_30px_0_var(--card-shadow)]"
                        >

                            <div className="summary-icon w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
                                <FontAwesomeIcon icon={summary.icon} />
                            </div>

                            <div>
                                <span className="text-sm text-slate-500">
                                    {summary.title}
                                </span>

                                <h3 className="text-2xl font-bold mt-1">
                                    {summary.value}
                                </h3>
                            </div>

                        </div>
                    ))}

                </section>

            </main>

        </section>
    );
};

export default Sermons;