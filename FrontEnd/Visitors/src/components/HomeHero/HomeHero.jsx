
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

    const heroMessages = [
        "God's Presence",
        "the Word of God",
        "a Life of Purpose",
        "a Stronger Faith",
    ];

    const activeMessage =
        heroMessages[currentSlide % heroMessages.length];

    // Automatic slider
    useEffect(() => {
        if (!heroSlides?.length || shouldReduceMotion) {
            return undefined;
        }

        const slider = setInterval(() => {
            setCurrentSlide((current) =>
                current === heroSlides.length - 1 ? 0 : current + 1
            );
        }, 6000);

        return () => clearInterval(slider);
    }, [shouldReduceMotion]);

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

    // Slider controls
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
            className="relative isolate h-[65vh] min-h-[380px] w-full overflow-hidden bg-[#101112] sm:h-[85vh] sm:min-h-[600px]"
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
                                        scale: 1.025,
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
                                duration: shouldReduceMotion ? 0 : 1.1,
                                ease: "easeInOut",
                            }}
                            className="absolute inset-0 h-full w-full object-cover object-center"
                        />
                    </AnimatePresence>
                ) : (
                    <div className="absolute inset-0 bg-[#101112]" />
                )}
            </div>

            <div
                className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#101112]/95 via-[#101112]/75 to-[#101112]/25"
                aria-hidden="true"
            />

            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 bg-gradient-to-t from-black/45 to-transparent"
                aria-hidden="true"
            />

            <div className="relative z-20 flex h-full items-center">
                <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-13 mt-20">

                    <div className="max-w-[620px]">

                        <div className="mb-5 flex items-center gap-4">
                            <span className="h-[3px] w-8 shrink-0 rounded-full bg-[#D91620]" />

                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 sm:text-xs sm:tracking-[0.18em]">
                                Welcome to Living Faith Church Iguosa
                            </p>
                        </div>

                        <h1
                            id="home-hero-title"
                            className="max-w-[600px] text-[30px] font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-[42px] lg:text-5xl"
                        >
                            A Place to Encounter

                            <span className="block">
                                <AnimatePresence mode="wait">
                                    <motion.span
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
                                            duration: shouldReduceMotion ? 0 : 0.35,
                                            ease: "easeOut",
                                        }}
                                        className="inline-block font-light sm:text-3xl md:text-[38px] lg:text-4xl"
                                    >
                                        {activeMessage}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="mt-4 max-w-[470px] text-[13px] leading-6 text-white/80 sm:text-sm sm:leading-6 md:text-[15px]">
                            Join us for worship, prayer, and the teaching
                            of God's Word as we build lives and raise
                            champions.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-6 flex flex-wrap items-center gap-3">

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
                                className="inline-flex items-center justify-center rounded-full bg-[#dcdbdb] px-5 py-2.5 text-xs font-bold text-[#171717] shadow-md transition-all duration-300 hover:bg-[#D91620] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70 sm:px-6 sm:py-3 sm:text-sm"
                            >
                                Plan Your Visit

                                <i
                                    className="fas fa-arrow-right ml-2.5 text-xs"
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
                                className="inline-flex items-center gap-2.5 rounded-full bg-white/5 px-5 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#D91620] hover:bg-[#D91620] focus:outline-none sm:px-6 sm:py-3 sm:text-sm"
                            >
                                <i
                                    className="far fa-play-circle text-base"
                                    aria-hidden="true"
                                />

                                Watch Live
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
                        className="absolute left-3 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-xs text-white transition hover:bg-[#D91620] focus:outline-none focus:ring-2 focus:ring-white/70 sm:left-5"
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
                        className="absolute right-3 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-xs text-white transition hover:bg-[#D91620] focus:outline-none focus:ring-2 focus:ring-white/70 sm:right-5"
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
                                className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index
                                    ? "w-6 bg-[#D91620]"
                                    : "w-2 bg-white/70 hover:bg-white"
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
                        className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
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
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D91620]">
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
                                className="mt-7 w-full rounded-full bg-[#D91620] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B80F18]"
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
