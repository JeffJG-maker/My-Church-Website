import { useState } from "react";
import sermons from "./data/sermon";
import SermonHeader from "./components/SermonHeader";
import SermonSidebar from "./components/SermonSidebar";


function AllSermons() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredSermons =
        selectedCategory === "All"
            ? sermons
            : sermons.filter((sermon) => sermon.category === selectedCategory);

    const categories = [
        "All",
        ...new Set(sermons.map((sermon) => sermon.category)),
    ];


    return (
        <div className="min-h-screen bg-[#f5f5f5] text-[#0d0761] dark:bg-[#1f1f26] dark:text-white">

            <SermonHeader />
            <SermonSidebar />

            {/* Page Header */}
            <section className="px-6 py-10">
                <div className="mx-auto max-w-7xl">
                    <h1 className="text-3xl font-bold">
                        All Sermons
                    </h1>

                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Listen to and watch sermons from Living Faith Church Iguosa.
                    </p>
                </div>
            </section>

            {/* Sermons Content */}
            <main className="mx-auto max-w-7xl px-6 pb-16">

                {/* Categories */}
                <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${selectedCategory === category
                                    ? "bg-[#0d0761] text-white"
                                    : "bg-white text-gray-700 shadow-sm dark:bg-[#131323] dark:text-gray-300"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Sermon Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {filteredSermons.map((sermon) => (
                        <article
                            key={sermon.id}
                            className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-[#131323]"
                        >

                            {/* Thumbnail */}
                            <div className="aspect-video overflow-hidden bg-gray-200 dark:bg-[#2b2b46]">
                                <img
                                    src={sermon.thumbnail}
                                    alt={sermon.title}
                                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#0d0761] dark:text-gray-300">
                                    {sermon.category}
                                </span>

                                <h2 className="mt-2 line-clamp-2 text-lg font-bold">
                                    {sermon.title}
                                </h2>

                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                    {sermon.speaker}
                                </p>
                            </div>

                        </article>
                    ))}

                </div>
            </main>
        </div>
    );
}

export default AllSermons;