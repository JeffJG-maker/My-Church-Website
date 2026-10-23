import { useState } from "react";
import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";

function About() {
    const [showAllPillars, setShowAllPillars] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const reveal = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 36,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: shouldReduceMotion ? 0.01 : 1.05,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const stagger = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.12,
                delayChildren: shouldReduceMotion ? 0 : 0.05,
            },
        },
    };

    const pillars = [
        {
            title: "Faith",
            scripture: "1 John 5:4",
            description: "Overcoming the world through faith in God.",
        },
        {
            title: "The Word",
            scripture: "Hebrews 1:3",
            description:
                "Upholding all things and serving as a custodian of supernatural manifestations.",
        },
        {
            title: "The Supernatural",
            scripture: "John 3:8",
            description:
                "Working miracles through obedience and divine order.",
        },
        {
            title: "The Holy Spirit",
            scripture: "Isaiah 10:27",
            description:
                "Empowering believers and destroying yokes.",
        },
        {
            title: "Prosperity",
            scripture: "3 John 2",
            description:
                "Exemption from economic hardship rooted in a heart for God.",
        },
        {
            title: "Prayer",
            scripture: "1 John 5:14",
            description:
                "A platform for divine intervention and communion with God.",
        },
        {
            title: "Healing",
            scripture: "Matthew 8:17",
            description:
                "Total health and long life as a covenant right.",
        },
        {
            title: "Wisdom",
            scripture: "Isaiah 33:6",
            description:
                "The principal thing and the stability of times.",
        },
        {
            title: "Success",
            scripture: "Joshua 1:8",
            description:
                "Unending, covenant-based progress.",
        },
        {
            title: "Vision",
            scripture: "Proverbs 29:18",
            description:
                "Locating God's plan for destiny and avoiding destruction.",
        },
        {
            title: "Consecration",
            scripture: "2 Timothy 2:19",
            description:
                "Separation unto God and reverence.",
        },
        {
            title: "Praise",
            scripture: "2 Chronicles 20:22",
            description:
                "A weapon to invoke God's presence and provoke victory.",
        },
    ];

    const values = [
        {
            title: "The Word",
            text: "God's Word is the foundation of our faith and the guide for our lives.",
        },
        {
            title: "Prayer",
            text: "We depend on prayer and fellowship with God in every season.",
        },
        {
            title: "Fellowship",
            text: "We value a welcoming community where believers can grow together.",
        },
        {
            title: "Service",
            text: "We seek to demonstrate the love of Christ through practical service.",
        },
    ];

    const visiblePillars = showAllPillars ? pillars : pillars.slice(0, 4);

    return (
        <main className="min-h-screen overflow-hidden bg-white text-[#171717] transition-colors duration-500 dark:bg-[#101112] dark:text-white">
            {/* PAGE INTRODUCTION */}
            <section className="px-[6%] pb-16 pt-28 sm:pb-20 sm:pt-36">
                <motion.div
                    className="mx-auto max-w-7xl"
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                >
                    <motion.p
                        variants={reveal}
                        className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E31B23]"
                    >
                        About Our Church
                    </motion.p>

                    <motion.h1
                        variants={reveal}
                        className="mt-5 max-w-4xl text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
                    >
                        A place to grow in faith.
                        <span className="block text-black/45 dark:text-white/45">
                            A community with purpose.
                        </span>
                    </motion.h1>

                    <motion.div
                        variants={reveal}
                        className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
                    >
                        <p className="max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-400">
                            Living Faith Church Iguosa is a local congregation
                            within Living Faith Church Worldwide, committed to
                            worship, spiritual growth, fellowship, and serving
                            our community through the love of Christ.
                        </p>

                        <div className="w-fit shrink-0 border-l-2 border-[#E31B23] py-1 pl-4 text-sm font-medium">
                            Living Faith Church Worldwide
                            <span className="mt-1 block text-gray-500 dark:text-gray-400">
                                Iguosa, Edo State, Nigeria
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* OUR STORY */}
            <section className="px-[6%] pb-20 sm:pb-24">
                <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    <motion.div
                        variants={reveal}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.18 }}
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E31B23]">
                            Our Story
                        </p>

                        <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                            Building lives.
                            <br />
                            Raising champions.
                        </h2>

                        <div className="mt-7 space-y-5 text-sm leading-8 text-gray-600 dark:text-gray-400 sm:text-base">
                            <p>
                                Living Faith Church Iguosa is a family of
                                believers united by faith in Jesus Christ and
                                committed to advancing the Kingdom of God as
                                part of Living Faith Church Worldwide, also
                                known as Winners' Chapel.
                            </p>

                            <p>
                                We believe that every believer has a purpose.
                                Through the teaching of God's Word, prayer,
                                worship, and fellowship, we seek to help people
                                grow in faith, discover their gifts, and develop
                                a deeper walk with God.
                            </p>

                            <p>
                                Our desire is to nurture a community where
                                people can encounter God, strengthen their
                                faith, build meaningful relationships, and
                                make a positive difference in the lives of
                                others.
                            </p>
                        </div>

                        <div className="mt-9">
                            <p className="text-sm font-semibold">
                                Living Faith Church Iguosa
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                A local expression of a worldwide ministry.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={reveal}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.18 }}
                        transition={{
                            delay: shouldReduceMotion ? 0 : 0.18,
                        }}
                    >
                        <div className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-[#181a1d]">
                            <img
                                src="/media/AboutUsImage.png"
                                alt="Living Faith Church Iguosa"
                                loading="lazy"
                                className="h-[380px] w-full object-cover transition-transform duration-700 hover:scale-[1.03] sm:h-[480px] lg:h-[540px]"
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Our church community</span>
                            <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
                            <span>Iguosa, Edo State</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* WORLDWIDE MANDATE */}
            <section className="bg-[#FAFAFA] px-[6%] py-20 dark:bg-[#141516] sm:py-24">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                    <motion.div
                        variants={reveal}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.18 }}
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E31B23]">
                            The Worldwide Vision
                        </p>

                        <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                            The Liberation Mandate
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400">
                            The founding vision associated with Bishop David
                            O. Oyedepo and Living Faith Church Worldwide.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={reveal}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.18 }}
                        transition={{
                            delay: shouldReduceMotion ? 0 : 0.15,
                        }}
                    >
                        <blockquote className="border-l-2 border-[#E31B23] pl-6 text-lg font-medium leading-8 tracking-tight sm:text-xl">
                            “The hour has come to liberate the world from all
                            oppressions of the devil through the preaching of
                            the word of faith, and I am sending you to
                            undertake this task.”
                        </blockquote>

                        <p className="mt-5 text-sm font-semibold">
                            — The mandate associated with Bishop David O. Oyedepo
                        </p>

                        <div className="mt-8 space-y-5 text-sm leading-8 text-gray-600 dark:text-gray-400">
                            <p>
                                Living Faith Church Worldwide traces its
                                founding vision to an 18-hour encounter
                                received by Bishop David O. Oyedepo in 1981.
                                The commission centres on liberating people
                                through the preaching of the Word of Faith.
                            </p>

                            <p>
                                The ministry's Twelve Pillars set out twelve
                                areas of emphasis within this Word of Faith
                                commission. They provide a reference for
                                understanding the spiritual foundations and
                                teachings associated with Winners' Chapel.
                            </p>

                            <p>
                                As a local congregation within this worldwide
                                ministry, Living Faith Church Iguosa seeks to
                                live out these principles through teaching,
                                prayer, worship, fellowship, spiritual growth,
                                and service to the community.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* THE TWELVE PILLARS */}
            <section id="twelve-pillars" className="px-[6%] py-20 sm:py-24">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        variants={reveal}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="max-w-3xl"
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E31B23]">
                            The Foundation of the Commission
                        </p>

                        <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                            The Twelve Pillars of the Ministry
                        </h2>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
                            Explore the twelve foundational areas of emphasis
                            associated with Living Faith Church Worldwide and
                            the ministry's Word of Faith commission.
                        </p>
                    </motion.div>

                    <motion.div
                        layout
                        className="mt-9"
                    >
                        <motion.div
                            layout
                            variants={stagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.06 }}
                            id="pillar-list"
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
                        >
                            <AnimatePresence initial={false}>
                                {visiblePillars.map((pillar, index) => (
                                    <motion.article
                                        layout
                                        key={pillar.title}
                                        variants={reveal}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{
                                            opacity: 0,
                                            y: shouldReduceMotion ? 0 : 12,
                                            transition: {
                                                duration: shouldReduceMotion ? 0.01 : 0.2,
                                            },
                                        }}
                                        transition={{
                                            layout: {
                                                duration: shouldReduceMotion ? 0.01 : 0.4,
                                                ease: [0.22, 1, 0.36, 1],
                                            },
                                        }}
                                        className="group relative flex min-h-[178px] flex-col overflow-hidden rounded-2xl bg-[#F7F7F6] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-[#F1F0EF] hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:bg-[#191a1b] dark:hover:bg-[#202122] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)] sm:p-5"
                                    >
                                        <span aria-hidden="true" className="pointer-events-none absolute -right-1 -top-5 select-none text-[6.5rem] font-semibold leading-none tracking-tighter text-black/[0.035] dark:text-white/[0.035]">{String(index + 1).padStart(2, "0")}</span>

                                        <div className="relative flex items-center justify-between gap-2">
                                            <span className="text-xs font-semibold tabular-nums text-[#E31B23]">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                            <span className="max-w-[75%] truncate rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium text-gray-600 dark:bg-white/[0.06] dark:text-gray-300">
                                                {pillar.scripture}
                                            </span>
                                        </div>

                                        <h3 className="relative mt-5 text-base font-semibold leading-snug tracking-tight">
                                            {pillar.title}
                                        </h3>

                                        <p className="relative mt-2 line-clamp-2 text-xs leading-5 text-gray-600 dark:text-gray-400">
                                            {pillar.description}
                                        </p>

                                        <span className="relative mt-auto pt-4 text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400 transition-colors group-hover:text-[#E31B23] dark:text-gray-500">
                                            Pillar {String(index + 1).padStart(2, "0")}
                                        </span>
                                    </motion.article>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        <div className="mt-7 flex flex-col items-center gap-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {showAllPillars
                                    ? "All 12 pillars are now displayed."
                                    : "Showing 4 of 12 pillars"}
                            </p>

                            <button
                                type="button"
                                onClick={() => setShowAllPillars((current) => !current)}
                                aria-expanded={showAllPillars}
                                aria-controls="pillar-list"
                                className="inline-flex items-center justify-center gap-3 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold transition-colors duration-300 hover:border-[#E31B23] hover:text-[#E31B23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E31B23] focus-visible:ring-offset-2 dark:border-white/20 dark:hover:border-[#E31B23] dark:focus-visible:ring-offset-[#101112]"
                            >
                                {showAllPillars ? "Show Less" : "Explore All 12 Pillars"}

                                <motion.i
                                    animate={{ rotate: showAllPillars ? 180 : 0 }}
                                    transition={{
                                        duration: shouldReduceMotion ? 0.01 : 0.3,
                                    }}
                                    className="fas fa-chevron-down text-xs"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </motion.div>

                    <p className="mt-8 max-w-3xl text-xs leading-6 text-gray-500 dark:text-gray-500">
                        Scripture references are provided as study references.
                        Readers are encouraged to consult each Bible passage
                        in its full context.
                    </p>
                </div>
            </section>

            {/* LOCAL VALUES */}
            <section className="bg-[#FAFAFA] px-[6%] py-20 dark:bg-[#141516] sm:py-24">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        variants={reveal}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="max-w-2xl"
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E31B23]">
                            Our Local Expression
                        </p>

                        <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                            Faith expressed in everyday life.
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
                            Inspired by the wider ministry's spiritual
                            foundations, we seek to build a church community
                            centred on God's Word, prayer, fellowship, and
                            practical service.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.12 }}
                        className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {values.map((value, index) => (
                            <motion.article
                                key={value.title}
                                variants={reveal}
                                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                                transition={{
                                    duration: shouldReduceMotion ? 0.01 : 0.3,
                                }}
                                className="py-6"
                            >
                                <span className="text-sm font-medium tabular-nums text-[#E31B23]">
                                    0{index + 1}
                                </span>

                                <h3 className="mt-4 text-base font-semibold">
                                    {value.title}
                                </h3>

                                <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-400">
                                    {value.text}
                                </p>
                            </motion.article>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CLOSING STATEMENT */}
            <section className="px-[6%] py-20 sm:py-24">
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mx-auto max-w-7xl pt-2 sm:pt-4"
                >
                    <motion.p
                        variants={reveal}
                        className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E31B23]"
                    >
                        Our Commitment
                    </motion.p>

                    <motion.div
                        variants={reveal}
                        className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
                    >
                        <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                            Growing in faith.
                            <span className="block text-black/40 dark:text-white/40">
                                Serving with purpose.
                            </span>
                        </h2>

                        <p className="max-w-md text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
                            We remain committed to worshipping God, building
                            one another in faith, and sharing the love of Jesus
                            Christ with our community.
                        </p>
                    </motion.div>
                </motion.div>
            </section>
        </main>
    );
}

export default About;
