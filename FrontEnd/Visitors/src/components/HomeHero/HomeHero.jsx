import { useEffect, useState } from "react";

import {
    motion,
    AnimatePresence,
    useReducedMotion,
} from "framer-motion";

import { heroSlides } from "../../data/homeData";

function HomeHero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showJoinModal, setShowJoinModal] = useState(false);

    const shouldReduceMotion = useReducedMotion();

    // Rotating hero messages
    const heroMessages = [
        "God's Presence",
        "Word of God",
        "Beyond the Church",
        "Grow in Purpose.",
    ];

    const activeMessage =
        heroMessages[currentSlide % heroMessages.length];

    // Automatically rotate background and text
    useEffect(() => {
        if (!heroSlides?.length || shouldReduceMotion) {
            return undefined;
        }

        const slider = setInterval(() => {
            setCurrentSlide((current) =>
                current === heroSlides.length - 1
                    ? 0
                    : current + 1
            );
        }, 6000);

        return () => clearInterval(slider);
    }, [shouldReduceMotion, heroSlides.length]);

    // Modal keyboard and scrolling behavior
    useEffect(() => {
        if (!showJoinModal) return undefined;

        const previousOverflow = document.body.style.overflow;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setShowJoinModal(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [showJoinModal]);

    // Previous slide
    const previousSlide = () => {
        if (!heroSlides?.length) return;

        setCurrentSlide((current) =>
            current === 0.
                ? heroSlides.length - 1
                : current - 1
        );
    };

    // Next slide
    const nextSlide = () => {
        if (!heroSlides?.length) return;

        setCurrentSlide((current) =>
            current === heroSlides.length - 1
                ? 0
                : current + 1
        );
    };

    // Select slide
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Watch Live
    const handleWatchLive = () => {
        window.open(
            "https://www.youtube.com/",
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <section
            aria-labelledby="home-hero-title"
            className="relative isolate h-[85vh] min-h-[600px] w-full overflow-hidden bg-[#101112]"
        >
            {/* Background Slider */}
            <div
                className="absolute inset-0 z-0"
                aria-hidden="true"
            >
                {heroSlides?.length > 0 ? (
                    <AnimatePresence initial={false}>
                        <motion.img
                            key={heroSlides[currentSlide]?.image}
                            src={heroSlides[currentSlide]?.image}
                            alt=""
                            initial={
                                shouldReduceMotion
                                    ? false
                                    : {
                                        opacity: 0,
                                        scale: 1.02,
                                    }
                            }
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={
                                shouldReduceMotion
                                    ? undefined
                                    : { opacity: 0 }
                            }
                            transition={{
                                duration: shouldReduceMotion ? 0 : 1,
                                ease: "easeInOut",
                            }}
                            className="absolute inset-0 h-full w-full object-cover object-center"
                        />
                    </AnimatePresence>
                ) : (
                    <div className="absolute inset-0 bg-[#101112]" />
                )}
            </div>

            {/* Dark Overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#101112]/80 via-[#101112]/45 to-[#101112]/20"
                aria-hidden="true"
            />

            {/* Hero Content */}
            <div className="relative z-20 flex h-full items-center">
                <div className="mx-auto w-full max-w-[1400px] px-6 pt-24 sm:px-12 md:pt-28 lg:px-16">

                    <div className="max-w-[520px]">

                        {/* Main Heading */}
                        <h1
                            id="home-hero-title"
                            className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl"
                        >
                            A Place to Encounter
                        </h1>

                        {/* Animated Heading */}
                        <div className="mt-2 min-h-[45px] sm:min-h-[55px]">
                            <AnimatePresence mode="wait">
                                <motion.h2
                                    key={activeMessage}
                                    initial={
                                        shouldReduceMotion
                                            ? false
                                            : {
                                                opacity: 0,
                                                y: 8,
                                            }
                                    }
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    exit={
                                        shouldReduceMotion
                                            ? undefined
                                            : {
                                                opacity: 0,
                                                y: -6,
                                            }
                                    }
                                    transition={{
                                        duration: shouldReduceMotion
                                            ? 0
                                            : 0.4,
                                        ease: "easeOut",
                                    }}
                                    className="text-2xl font-medium leading-tight text-[#D9B95B] sm:text-3xl md:text-4xl"
                                >
                                    {activeMessage}
                                </motion.h2>
                            </AnimatePresence>
                        </div>

                        {/* Description */}
                        <p className="mt-5 max-w-[430px] text-sm leading-6 text-white/85 sm:text-base">
                            Join us for worship, prayer, and the teaching of God's Word as we grow together in faith.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-7 flex flex-wrap items-center gap-3">

                            {/* Plan Your Visit */}
                            <motion.button
                                type="button"
                                onClick={() => setShowJoinModal(true)}
                                whileHover={
                                    shouldReduceMotion
                                        ? undefined
                                        : { y: -2 }
                                }
                                whileTap={
                                    shouldReduceMotion
                                        ? undefined
                                        : { scale: 0.98 }
                                }
                                className="inline-flex items-center justify-center rounded-full bg-[#D9B95B] px-5 py-3 text-sm font-semibold text-[#171717] transition-colors hover:bg-[#C8A747] focus:outline-none focus:ring-2 focus:ring-white/70"
                            >
                                Plan Your Visit

                                <i
                                    className="fas fa-arrow-right ml-2 text-xs"
                                    aria-hidden="true"
                                />
                            </motion.button>

                            {/* Watch Live */}
                            <motion.button
                                type="button"
                                onClick={handleWatchLive}
                                whileHover={
                                    shouldReduceMotion
                                        ? undefined
                                        : { y: -2 }
                                }
                                whileTap={
                                    shouldReduceMotion
                                        ? undefined
                                        : { scale: 0.98 }
                                }
                                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70"
                            >
                                Watch Live

                                <i
                                    className="far fa-play-circle text-lg"
                                    aria-hidden="true"
                                />
                            </motion.button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Slider Controls */}
            {heroSlides?.length > 1 && (
                <>
                    {/* Previous */}
                    <button
                        type="button"
                        onClick={previousSlide}
                        aria-label="Previous slide"
                        className="absolute left-4 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition hover:bg-[#D91620] focus:outline-none focus:ring-2 focus:ring-white/70 sm:left-6"
                    >
                        <i
                            className="fas fa-chevron-left"
                            aria-hidden="true"
                        />
                    </button>

                    {/* Next */}
                    <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next slide"
                        className="absolute right-4 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition hover:bg-[#D91620] focus:outline-none focus:ring-2 focus:ring-white/70 sm:right-6"
                    >
                        <i
                            className="fas fa-chevron-right"
                            aria-hidden="true"
                        />
                    </button>

                    {/* Slide Indicators */}
                    <div
                        className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2"
                        role="group"
                        aria-label="Choose hero slide"
                    >
                        {heroSlides.map((slide, index) => (
                            <button
                                key={slide.image || index}
                                type="button"
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                                aria-current={
                                    currentSlide === index
                                        ? "true"
                                        : undefined
                                }
                                className={`h-2 rounded-full transition-all ${currentSlide === index
                                    ? "w-6 bg-[#D9B95B]"
                                    : "w-2 bg-white/60 hover:bg-white"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Plan Your Visit Modal */}
            <AnimatePresence>
                {showJoinModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
                        onClick={() => setShowJoinModal(false)}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="join-modal-title"
                            initial={
                                shouldReduceMotion
                                    ? false
                                    : {
                                        opacity: 0,
                                        y: 15,
                                    }
                            }
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: 10,
                            }}
                            className="my-auto w-full max-w-md rounded-2xl bg-white p-6 text-[#171717] shadow-2xl dark:bg-[#181A1D] dark:text-white"
                            onClick={(event) => event.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#D91620]">
                                        You're Welcome
                                    </span>

                                    <h2
                                        id="join-modal-title"
                                        className="mt-2 text-xl font-semibold"
                                    >
                                        Join Us This Sunday
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowJoinModal(false)}
                                    aria-label="Close modal"
                                    className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-[#D91620] dark:hover:bg-white/10"
                                >
                                    <i
                                        className="fas fa-times"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>

                            {/* Service Details */}
                            <div className="mt-6 space-y-5 text-sm">

                                <div className="flex items-start gap-3">
                                    <i
                                        className="far fa-calendar-check mt-1 text-[#D91620]"
                                        aria-hidden="true"
                                    />

                                    <div>
                                        <p className="font-semibold">
                                            Sunday Service
                                        </p>

                                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                                            8:00AM - 12:00PM
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <i
                                        className="fas fa-location-dot mt-1 text-[#D91620]"
                                        aria-hidden="true"
                                    />

                                    <div>
                                        <p className="font-semibold">
                                            Location
                                        </p>

                                        <p className="mt-1 leading-6 text-gray-600 dark:text-gray-300">
                                            Living Faith Church Iguosa,
                                            Edo State, Nigeria.
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Modal Button */}
                            <button
                                type="button"
                                onClick={() => setShowJoinModal(false)}
                                className="mt-7 w-full rounded-full bg-[#D9B95B] px-5 py-3 text-sm font-semibold text-[#171717] transition-colors hover:bg-[#C8A747]"
                            >
                                See You Sunday
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

export default HomeHero;