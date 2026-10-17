
import { useEffect, useState } from "react";
import { heroSlides, heroContent } from "../../data/homeData";

function HomeHero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);

    // HERO MESSAGE FADE-IN
    useEffect(() => {
        const timer = setTimeout(() => {
            setContentVisible(true);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    // AUTOMATIC SLIDER
    useEffect(() => {
        if (!heroSlides.length) return;

        const slider = setInterval(() => {
            setCurrentSlide((current) =>
                current === heroSlides.length - 1 ? 0 : current + 1
            );
        }, 6000);

        return () => clearInterval(slider);
    }, []);

    const previousSlide = () => {
        setCurrentSlide((current) =>
            current === 0 ? heroSlides.length - 1 : current - 1
        );
    };

    const nextSlide = () => {
        setCurrentSlide((current) =>
            current === heroSlides.length - 1 ? 0 : current + 1
        );
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const handleWatchLive = () => {
        window.open("https://www.youtube.com/", "_blank", "noopener,noreferrer");
    };

    return (
        <section
            className="
    relative
    isolate
    h-[75vh]
    min-h-[500px]
    w-full
    overflow-hidden
    bg-[#101112]
    md:h-[90vh]
    md:min-h-[600px]
  "
        >
            {/* IMAGE SLIDER */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                    className="
            flex
            h-full
            w-full
            transition-transform
            duration-700
            ease-in-out
          "
                    style={{
                        transform: `translateX(-${currentSlide * 100}%)`,
                    }}
                >
                    {heroSlides.map((slide) => (
                        <img
                            key={slide.image}
                            src={slide.image}
                            alt={slide.alt}
                            className="
                block
                h-full
                w-full
                min-w-full
                shrink-0
                object-cover
              "
                        />
                    ))}
                </div>
            </div>

            {/* DARK / RED-ORANGE GRADIENT */}
            <div
                className="
          pointer-events-none
          absolute
          inset-0
          z-10
          bg-gradient-to-r
          from-[#101112]/90
          via-[#101112]/40
          to-[#9B111E]/40
        "
            />

            {/* LEFT ARROW */}
            <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous slide"
                className="
          absolute
          left-2
          top-1/2
          z-30
          flex
          h-9
          w-9
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-white/30
          bg-black/30
          text-white
          backdrop-blur-sm
          transition-all
          duration-300
          hover:border-[#F7941D]
          hover:bg-[#E31B23]/50
          sm:left-5
          sm:h-10
          sm:w-10
          lg:left-6
        "
            >
                <i className="fas fa-chevron-left" />
            </button>

            {/* RIGHT ARROW */}
            <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="
          absolute
          right-2
          top-1/2
          z-30
          flex
          h-9
          w-9
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-white/30
          bg-black/30
          text-white
          backdrop-blur-sm
          transition-all
          duration-300
          hover:border-[#F7941D]
          hover:bg-[#E31B23]/50
          sm:right-5
          sm:h-10
          sm:w-10
          lg:right-6
        "
            >
                <i className="fas fa-chevron-right" />
            </button>

            {/* HERO MESSAGE */}
            <div
                className={`
          absolute
          inset-x-0
          top-1/2
          z-20
          mx-auto
          w-full
          max-w-[1400px]
          -translate-y-1/2
          px-14
          transition-all
          duration-1000
          ease-out
          sm:px-20
          md:px-24
          lg:px-16
          ${contentVisible
                        ? "translate-x-0 opacity-100"
                        : "translate-x-[-25px] opacity-0"
                    }
        `}
            >
                <div className="max-w-[550px]">
                    <h1
                        className="
              text-3xl
              font-medium
              leading-tight
              text-white
              sm:text-4xl
              md:text-5xl
              lg:text-[3.2rem]
            "
                    >
                        {heroContent.titleFirst}
                        <br />

                        <span className="text-[#F7941D]">
                            {heroContent.titleSecond}
                        </span>
                    </h1>

                    <p
                        className="
              mt-4
              max-w-[450px]
              text-sm
              leading-6
              text-white/90
              sm:text-base
              sm:leading-7
              lg:text-lg
            "
                    >
                        {heroContent.description}
                    </p>

                    {/* BUTTONS */}
                    <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-7 sm:gap-4">
                        <button
                            type="button"
                            onClick={() => setShowJoinModal(true)}
                            className="
                inline-flex
                items-center
                justify-center
                rounded-md
                bg-[#E31B23]
                px-4
                py-3
                text-xs
                font-semibold
                text-white
                shadow-lg
                shadow-[#E31B23]/20
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#C9151C]
                sm:px-5
                sm:text-sm
              "
                        >
                            {heroContent.joinButton}
                            <i className="fas fa-arrow-right ml-2" />
                        </button>

                        <button
                            type="button"
                            onClick={handleWatchLive}
                            className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-md
                border
                border-white/80
                bg-black/10
                px-3
                py-2.5
                text-xs
                font-semibold
                text-white
                backdrop-blur-sm
                transition-all
                duration-300
                hover:border-[#F7941D]
                hover:bg-[#F7941D]
                sm:px-4
                sm:text-sm
              "
                        >
                            <span>{heroContent.watchButton}</span>
                            <i className="far fa-play-circle text-lg" />
                        </button>
                    </div>
                </div>
            </div>

            {/* SLIDE INDICATORS */}
            <div
                className="
          absolute
          bottom-5
          left-1/2
          z-30
          flex
          -translate-x-1/2
          items-center
          gap-2
          sm:bottom-7
        "
            >
                {heroSlides.map((slide, index) => (
                    <button
                        key={slide.image}
                        type="button"
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={currentSlide === index ? "true" : undefined}
                        className={`
              h-2
              rounded-full
              transition-all
              duration-300
              ${currentSlide === index
                                ? "w-7 bg-[#F7941D]"
                                : "w-2 bg-white/60 hover:bg-white"
                            }
            `}
                    />
                ))}
            </div>

            {/* JOIN US MODAL */}
            {showJoinModal && (
                <div
                    className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-black/70
            p-4
            backdrop-blur-sm
            sm:p-5
          "
                    onClick={() => setShowJoinModal(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="join-modal-title"
                        className="
              my-auto
              w-full
              max-w-md
              rounded-xl
              bg-white
              p-5
              text-[#171717]
              shadow-2xl
              dark:bg-[#181a1d]
              dark:text-white
              sm:p-7
            "
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#E31B23] dark:text-[#F7941D]">
                                    You're Welcome
                                </span>

                                <h2
                                    id="join-modal-title"
                                    className="mt-2 text-xl font-semibold sm:text-2xl"
                                >
                                    Join Us This Sunday
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowJoinModal(false)}
                                aria-label="Close Join Us modal"
                                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-gray-500
                  transition
                  hover:bg-[#FFF1E6]
                  hover:text-[#E31B23]
                  dark:hover:bg-white/10
                  dark:hover:text-[#F7941D]
                "
                            >
                                <i className="fas fa-times" />
                            </button>
                        </div>

                        <div className="mt-6 space-y-4 text-sm">
                            <div className="flex items-start gap-3">
                                <i className="far fa-calendar-check mt-1 text-[#E31B23] dark:text-[#F7941D]" />

                                <div>
                                    <p className="font-semibold">Sunday Service</p>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                                        8:00AM - 12:00PM
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <i className="fas fa-location-dot mt-1 text-[#E31B23] dark:text-[#F7941D]" />

                                <div>
                                    <p className="font-semibold">Location</p>
                                    <p className="mt-1 leading-6 text-gray-600 dark:text-gray-300">
                                        Living Faith Church Iguosa, Edo State, Nigeria.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowJoinModal(false)}
                            className="
                mt-7
                w-full
                rounded-md
                bg-[#E31B23]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#C9151C]
              "
                        >
                            See You Sunday
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default HomeHero;
