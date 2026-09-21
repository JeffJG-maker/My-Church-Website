import { useState } from "react";
import ScrollReveal from "../ScrollReveal/ScrollReveal";

const sermons = [
    {
        id: 1,
        title: "Walking By Faith And Not By Sight",
        speaker: "Pastor",
        date: "June 1, 2025",
        category: "Faith",
        image: "/media/FirstHomeImage.png",
        description:
            "Discover how to trust God completely and walk confidently according to His Word, even when circumstances appear uncertain.",
    },
    {
        id: 2,
        title: "The Power of Prayer",
        speaker: "Pastor",
        date: "May 25, 2025",
        category: "Prayer",
        image: "/media/A Prayer gathering.jpg",
        description:
            "Learn how consistent and fervent prayer strengthens your relationship with God and produces supernatural results.",
    },
    {
        id: 3,
        title: "Living A Life Of Purpose",
        speaker: "Pastor",
        date: "May 18, 2025",
        category: "Purpose",
        image: "/media/welcomePhoto.png",
        description:
            "Understand God's purpose for your life and discover how to live intentionally for His kingdom.",
    },
    {
        id: 4,
        title: "The Power Of Consecration",
        speaker: "Pastor",
        date: "May 11, 2025",
        category: "Consecration",
        image: "/media/theCross.png",
        description:
            "A message on separation unto God, spiritual discipline, and the power of living a consecrated life.",
    },
    {
        id: 5,
        title: "Treasuring Christ",
        speaker: "Pastor",
        date: "May 4, 2025",
        category: "Christian Living",
        image: "/media/Treasuring Christ.png",
        description:
            "Discover the value of making Christ the center of your life and treasuring your relationship with Him above all else.",
    },
];

function FeaturedSermons() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentSermon = sermons[currentIndex];

    const previousSermon = () => {
        setCurrentIndex((current) =>
            current === 0 ? sermons.length - 1 : current - 1
        );
    };

    const nextSermon = () => {
        setCurrentIndex((current) =>
            current === sermons.length - 1 ? 0 : current + 1
        );
    };

    return (
        <section
            className="
        relative
        z-10
        w-full
        overflow-hidden
        bg-[#f1f1f1]
        px-[5%]
        py-20
        text-[#030e5c]

        transition-colors
        duration-500

        dark:bg-[#17182f]
        dark:text-white
      "
        >
            {/* SECTION TITLE */}
            <ScrollReveal>
                <div className="mx-auto mb-12 max-w-6xl">
                    <div className="flex items-center gap-4">
                        <h2
                            className="
                whitespace-nowrap
                text-2xl
                font-semibold
                sm:text-3xl
                lg:text-4xl
              "
                        >
                            Featured Sermons
                        </h2>

                        <div className="h-px flex-1 bg-[#030e5c]/20 dark:bg-white/20"></div>
                    </div>

                    <p
                        className="
              mt-3
              max-w-2xl
              text-sm
              leading-6
              text-gray-600

              dark:text-gray-300
            "
                    >
                        Listen to messages that strengthen your faith, build your
                        spiritual life and help you fulfill God's purpose.
                    </p>
                </div>
            </ScrollReveal>

            {/* SERMON AREA */}
            <div className="mx-auto max-w-6xl">
                <ScrollReveal>
                    <div
                        className="
              grid
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-[0_10px_35px_rgba(3,14,92,0.12)]

              dark:bg-[#181a38]
              dark:shadow-black/30

              lg:grid-cols-[1.25fr_1fr]
            "
                    >
                        {/* IMAGE */}
                        <div className="relative min-h-[280px] overflow-hidden sm:min-h-[380px] lg:min-h-[430px]">
                            <img
                                src={currentSermon.image}
                                alt={currentSermon.title}
                                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  transition-all
                  duration-700
                "
                            />

                            {/* IMAGE OVERLAY */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

                            {/* CATEGORY */}
                            <span
                                className="
                  absolute
                  left-5
                  top-5
                  rounded-full
                  bg-[#f7b731]
                  px-3
                  py-1
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-[#0b0b25]
                "
                            >
                                {currentSermon.category}
                            </span>

                            {/* IMAGE TEXT */}
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/75">
                                    Featured Message
                                </p>

                                <h3 className="max-w-xl text-2xl font-semibold leading-tight sm:text-3xl">
                                    {currentSermon.title}
                                </h3>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-10">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#bd1717] dark:text-[#f7b731]">
                                {currentSermon.category}
                            </span>

                            <h3 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">
                                {currentSermon.title}
                            </h3>

                            <div className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center gap-3">
                                    <i className="fas fa-user text-[#bd1717] dark:text-[#f7b731]"></i>

                                    <span>{currentSermon.speaker}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <i className="far fa-calendar text-[#bd1717] dark:text-[#f7b731]"></i>

                                    <span>{currentSermon.date}</span>
                                </div>
                            </div>

                            <p className="mt-6 text-sm leading-7 text-gray-600 dark:text-gray-300">
                                {currentSermon.description}
                            </p>

                            {/* ACTION */}
                            <button
                                type="button"
                                className="
                  mt-7
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-md
                  bg-[#030e5c]
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#020a43]

                  dark:bg-[#f7b731]
                  dark:text-[#0b0b25]
                  dark:hover:bg-[#e5a91f]
                "
                            >
                                Watch Sermon

                                <i className="far fa-play-circle text-lg"></i>
                            </button>

                            {/* CONTROLS */}
                            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-5 dark:border-white/10">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {String(currentIndex + 1).padStart(2, "0")} /{" "}
                                    {String(sermons.length).padStart(2, "0")}
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={previousSermon}
                                        aria-label="Previous sermon"
                                        className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-gray-200
                      text-[#030e5c]
                      transition-all
                      duration-300
                      hover:bg-[#030e5c]
                      hover:text-white

                      dark:border-white/10
                      dark:text-white
                      dark:hover:bg-[#f7b731]
                      dark:hover:text-[#0b0b25]
                    "
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={nextSermon}
                                        aria-label="Next sermon"
                                        className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-gray-200
                      text-[#030e5c]
                      transition-all
                      duration-300
                      hover:bg-[#030e5c]
                      hover:text-white

                      dark:border-white/10
                      dark:text-white
                      dark:hover:bg-[#f7b731]
                      dark:hover:text-[#0b0b25]
                    "
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* SERMON PREVIEWS */}
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {sermons.map((sermon, index) => (
                        <button
                            key={sermon.id}
                            type="button"
                            onClick={() => setCurrentIndex(index)}
                            className={`
                group
                overflow-hidden
                rounded-xl
                text-left
                transition-all
                duration-300
                ${currentIndex === index
                                    ? "ring-2 ring-[#f7b731]"
                                    : "opacity-75 hover:-translate-y-1 hover:opacity-100"
                                }
              `}
                        >
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src={sermon.image}
                                    alt={sermon.title}
                                    className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                                />

                                <div className="absolute inset-0 bg-black/25"></div>

                                {currentIndex === index && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7b731] text-[#0b0b25]">
                                            <i className="fas fa-play text-xs"></i>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white p-3 dark:bg-[#181a38]">
                                <p className="line-clamp-2 text-xs font-semibold leading-5">
                                    {sermon.title}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeaturedSermons;