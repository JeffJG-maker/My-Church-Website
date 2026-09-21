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
        window.open("https://www.youtube.com/", "_blank");
    };

    return (
        <section
            className="
        relative
        h-[90vh]
        min-h-[600px]
        w-full
        overflow-hidden
        bg-[#0b0b25]
      "
        >
            {/* IMAGE SLIDER */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                    className="
            flex
            h-full
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
                h-full
                min-w-full
                shrink-0
                object-cover
              "
                        />
                    ))}
                </div>
            </div>

            {/* DARK GRADIENT */}
            <div
                className="
          pointer-events-none
          absolute
          inset-0
          z-10
          bg-gradient-to-r
          from-[#080810]/65
          via-[#080810]/15
          to-[#080810]/45
        "
            />

            {/* LEFT ARROW */}
            <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous slide"
                className="
          absolute
          left-4
          top-1/2
          z-30
          flex
          h-10
          w-10
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-white/30
          bg-black/20
          text-white
          backdrop-blur-sm
          transition-all
          duration-300
          hover:bg-white/20
          sm:left-6
        "
            >
                <i className="fas fa-chevron-left"></i>
            </button>

            {/* RIGHT ARROW */}
            <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="
          absolute
          right-4
          top-1/2
          z-30
          flex
          h-10
          w-10
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-white/30
          bg-black/20
          text-white
          backdrop-blur-sm
          transition-all
          duration-300
          hover:bg-white/20
          sm:right-6
        "
            >
                <i className="fas fa-chevron-right"></i>
            </button>

            {/* HERO MESSAGE */}
            <div
                className={`
          absolute
          left-[8%]
          top-1/2
          z-20
          w-[80%]
          max-w-[500px]
          -translate-y-1/2

          transition-all
          duration-1000
          ease-out

          ${contentVisible
                        ? "translate-x-0 opacity-100"
                        : "translate-x-[-25px] opacity-0"
                    }
        `}
            >
                <h1
                    className="
            text-4xl
            font-medium
            leading-tight
            text-white
            sm:text-5xl
            lg:text-[3.2rem]
          "
                >
                    {heroContent.titleFirst}
                    <br />

                    <span className="text-[#f7b731]">
                        {heroContent.titleSecond}
                    </span>
                </h1>

                <p
                    className="
            mt-4
            max-w-[450px]
            text-base
            leading-7
            text-white/90
            sm:text-lg
          "
                >
                    {heroContent.description}
                </p>

                {/* BUTTONS */}
                <div className="mt-7 flex flex-wrap items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setShowJoinModal(true)}
                        className="
              rounded-md
              bg-[#f7b731]
              px-5
              py-3
              text-sm
              font-semibold
              text-[#0b0b25]
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#e5a91f]
            "
                    >
                        {heroContent.joinButton}

                        <i className="fas fa-arrow-right ml-2"></i>
                    </button>

                    <button
                        type="button"
                        onClick={handleWatchLive}
                        className="
              flex
              items-center
              gap-2
              rounded-md
              border
              border-white
              bg-transparent
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-white
              hover:text-[#0b0b25]
            "
                    >
                        <span>{heroContent.watchButton}</span>

                        <i className="far fa-play-circle text-lg"></i>
                    </button>
                </div>
            </div>

            {/* SLIDE INDICATORS */}
            <div
                className="
          absolute
          bottom-8
          left-1/2
          z-30
          flex
          -translate-x-1/2
          items-center
          gap-2
        "
            >
                {heroSlides.map((slide, index) => (
                    <button
                        key={slide.image}
                        type="button"
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`
              h-2
              rounded-full
              transition-all
              duration-300

              ${currentSlide === index
                                ? "w-7 bg-[#f7b731]"
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
            bg-black/70
            p-5
            backdrop-blur-sm
          "
                    onClick={() => setShowJoinModal(false)}
                >
                    <div
                        className="
              w-full
              max-w-md
              rounded-xl
              bg-white
              p-7
              text-[#030e5c]
              shadow-2xl
              dark:bg-[#181a38]
              dark:text-white
            "
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#bd1717] dark:text-[#f7b731]">
                                    You're Welcome
                                </span>

                                <h2 className="mt-2 text-2xl font-semibold">
                                    Join Us This Sunday
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowJoinModal(false)}
                                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-gray-500
                  transition
                  hover:bg-gray-100
                  hover:text-gray-900
                  dark:hover:bg-white/10
                  dark:hover:text-white
                "
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="mt-6 space-y-4 text-sm">
                            <div className="flex items-start gap-3">
                                <i className="far fa-calendar-check mt-1 text-[#bd1717] dark:text-[#f7b731]"></i>

                                <div>
                                    <p className="font-semibold">Sunday Service</p>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                                        8:00AM - 12:00PM
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <i className="fas fa-location-dot mt-1 text-[#bd1717] dark:text-[#f7b731]"></i>

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
                bg-[#bd1717]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#a31313]
                dark:bg-[#f7b731]
                dark:text-[#0b0b25]
                dark:hover:bg-[#e5a91f]
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