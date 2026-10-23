import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { heroSlides } from "../../data/homeData";

function HomeHero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    // Keep each message aligned with the changing hero image.
    // If the project has more images than messages, the messages cycle safely.
    const heroMessages = [
        {
            eyebrow: "Welcome to Living Faith Church Iguosa",
            titleFirst: "A Place to Encounter",
            titleSecond: "God's Presence",
            description:
                "Join us for worship, prayer, and the teaching of God's Word as we grow together in faith.",
            joinButton: "Plan Your Visit",
            watchButton: "Watch Live",
        },
        {
            eyebrow: "Growing Together in Faith",
            titleFirst: "Rooted in the",
            titleSecond: "Word of God",
            description:
                "Discover biblical teaching, prayer, and fellowship that encourage you to know God and walk in His purpose.",
            joinButton: "Join Us This Sunday",
            watchButton: "Watch Live",
        },
        {
            eyebrow: "Faith in Action",
            titleFirst: "Sharing God's Love",
            titleSecond: "Beyond the Church",
            description:
                "We seek to serve our community with compassion, including through the free Gilead medical care we offer.",
            joinButton: "Be Our Guest",
            watchButton: "Watch Live",
        },
        {
            eyebrow: "A Family of Believers",
            titleFirst: "Find Fellowship.",
            titleSecond: "Grow in Purpose.",
            description:
                "Come worship with us, build meaningful connections, and grow alongside a community pursuing Christ.",
            joinButton: "Plan Your Visit",
            watchButton: "Watch Live",
        },
    ];

    const activeMessage = heroMessages[currentSlide % heroMessages.length];

    useEffect(() => {
        if (!heroSlides?.length || shouldReduceMotion) return undefined;

        const slider = setInterval(() => {
            setCurrentSlide((current) =>
                current === heroSlides.length - 1 ? 0 : current + 1
            );
        }, 6000);

        return () => clearInterval(slider);
    }, [shouldReduceMotion]);

    useEffect(() => {
        if (!showJoinModal) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") setShowJoinModal(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [showJoinModal]);

    const previousSlide = () => {
        if (!heroSlides?.length) return;
        setCurrentSlide((current) =>
            current === 0 ? heroSlides.length - 1 : current - 1
        );
    };

    const nextSlide = () => {
        if (!heroSlides?.length) return;
        setCurrentSlide((current) =>
            current === heroSlides.length - 1 ? 0 : current + 1
        );
    };

    const goToSlide = (index) => setCurrentSlide(index);

    const handleWatchLive = () => {
        window.open(
            "https://www.youtube.com/",
            "_blank",
            "noopener,noreferrer"
        );
    };

    const reduceMotionProps = shouldReduceMotion
        ? {}
        : {
            initial: { opacity: 0, x: -24 },
            animate: { opacity: 1, x: 0 },
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.12,
            },
        };

    return (
        <section
            aria-label="Welcome to Living Faith Church Iguosa"
            className="relative isolate h-[75vh] min-h-[500px] w-full overflow-hidden bg-[#101112] md:h-[90vh] md:min-h-[600px]"
        >
            {/* Background image slider */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {heroSlides?.length > 0 ? (
                    <AnimatePresence initial={false}>
                        <motion.img
                            key={heroSlides[currentSlide]?.image}
                            src={heroSlides[currentSlide]?.image}
                            alt={heroSlides[currentSlide]?.alt || "Living Faith Church"}
                            initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.035 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                            transition={{ duration: shouldReduceMotion ? 0 : 1.1, ease: "easeInOut" }}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </AnimatePresence>
                ) : (
                    <div className="absolute inset-0 bg-[#101112]" />
                )}
            </div>

            {/* Dark neutral overlay with a restrained red tint */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#101112]/90 via-[#101112]/55 to-[#101112]/30" />
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#101112]/35 via-transparent to-[#101112]/15" />

            {/* Previous slide */}
            {heroSlides?.length > 1 && (
                <>
                    <motion.button
                        type="button"
                        onClick={previousSlide}
                        aria-label="Previous slide"
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                        className="absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white/90 backdrop-blur-sm transition-colors hover:bg-[#D91620] focus:outline-none focus:ring-2 focus:ring-white/70 sm:left-5 lg:left-7"
                    >
                        <i className="fas fa-chevron-left" aria-hidden="true" />
                    </motion.button>

                    <motion.button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next slide"
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                        className="absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white/90 backdrop-blur-sm transition-colors hover:bg-[#D91620] focus:outline-none focus:ring-2 focus:ring-white/70 sm:right-5 lg:right-7"
                    >
                        <i className="fas fa-chevron-right" aria-hidden="true" />
                    </motion.button>
                </>
            )}

            {/* Hero copy */}
            <motion.div
                key={currentSlide}
                {...reduceMotionProps}
                className="absolute inset-x-0 top-1/2 z-20 mx-auto w-full max-w-[1400px] -translate-y-1/2 px-14 sm:px-20 md:px-24 lg:px-16"
            >
                <div className="max-w-[600px]">
                    <motion.p
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : 0.08 }}
                        className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 sm:text-xs"
                    >
                        {activeMessage.eyebrow}
                    </motion.p>

                    <motion.h1
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.12 }}
                        className="text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.6rem]"
                    >
                        {activeMessage.titleFirst}
                        <br />
                        <span className="text-[#D9B95B]">
                            {activeMessage.titleSecond}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.2 }}
                        className="mt-5 max-w-[480px] text-sm leading-6 text-white/85 sm:text-base sm:leading-7 lg:text-lg"
                    >
                        {activeMessage.description}
                    </motion.p>

                    <motion.div
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.28 }}
                        className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4"
                    >
                        <motion.button
                            type="button"
                            onClick={() => setShowJoinModal(true)}
                            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                            className="inline-flex items-center justify-center rounded-full bg-[#D9B95B] px-5 py-3 text-sm font-semibold text-[#171717] shadow-[0_8px_24px_rgba(217,185,91,0.2)] transition-colors hover:bg-[#C8A747] focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#101112]"
                        >
                            {activeMessage.joinButton}
                            <i className="fas fa-arrow-right ml-2 text-xs" aria-hidden="true" />
                        </motion.button>

                        <motion.button
                            type="button"
                            onClick={handleWatchLive}
                            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70"
                        >
                            <span>{activeMessage.watchButton}</span>
                            <i className="far fa-play-circle text-lg" aria-hidden="true" />
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Slide indicators */}
            {heroSlides?.length > 1 && (
                <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 sm:bottom-7">
                    {heroSlides.map((slide, index) => (
                        <button
                            key={slide.image || index}
                            type="button"
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={currentSlide === index ? "true" : undefined}
                            className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/80 ${currentSlide === index
                                    ? "w-7 bg-[#D9B95B]"
                                    : "w-2 bg-white/60 hover:bg-white"
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Join us modal */}
            <AnimatePresence>
                {showJoinModal && (
                    <motion.div
                        key="join-modal-backdrop"
                        initial={shouldReduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-5"
                        onClick={() => setShowJoinModal(false)}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="join-modal-title"
                            initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.99 }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: "easeOut" }}
                            className="my-auto w-full max-w-md rounded-2xl bg-white p-5 text-[#171717] shadow-2xl dark:bg-[#181A1D] dark:text-white sm:p-7"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#D91620]">
                                        You&apos;re Welcome
                                    </span>
                                    <h2 id="join-modal-title" className="mt-2 text-xl font-semibold sm:text-2xl">
                                        Join Us This Sunday
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowJoinModal(false)}
                                    aria-label="Close Join Us modal"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-[#D91620] focus:outline-none focus:ring-2 focus:ring-[#D91620]/30 dark:hover:bg-white/10"
                                >
                                    <i className="fas fa-times" aria-hidden="true" />
                                </button>
                            </div>

                            <div className="mt-6 space-y-5 text-sm">
                                <div className="flex items-start gap-3">
                                    <i className="far fa-calendar-check mt-1 text-[#D91620]" aria-hidden="true" />
                                    <div>
                                        <p className="font-semibold">Sunday Service</p>
                                        <p className="mt-1 text-gray-600 dark:text-gray-300">8:00AM - 12:00PM</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <i className="fas fa-location-dot mt-1 text-[#D91620]" aria-hidden="true" />
                                    <div>
                                        <p className="font-semibold">Location</p>
                                        <p className="mt-1 leading-6 text-gray-600 dark:text-gray-300">
                                            Living Faith Church Iguosa, Edo State, Nigeria.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                type="button"
                                onClick={() => setShowJoinModal(false)}
                                whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                                whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                                className="mt-7 w-full rounded-full bg-[#D9B95B] px-5 py-3 text-sm font-semibold text-[#171717] transition-colors hover:bg-[#C8A747] focus:outline-none focus:ring-2 focus:ring-[#D9B95B]/40"
                            >
                                See You Sunday
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

export default HomeHero;
