import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";

function About() {
    return (
        <main
            className="
        min-h-screen
        bg-white
        text-[#030e5c]
        transition-colors
        duration-500
        dark:bg-[#0f1026]
        dark:text-white
      "
        >
            {/* PAGE INTRO */}
            <section
                className="
          flex
          min-h-[55vh]
          items-center
          justify-center
          bg-[#f1f1f1]
          px-[6%]
          pb-16
          pt-32
          text-center
          dark:bg-[#17182f]
        "
            >
                <ScrollReveal>
                    <div className="mx-auto max-w-3xl">
                        <span
                            className="
                text-sm
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#bd1717]
                dark:text-[#f7b731]
              "
                        >
                            About Our Church
                        </span>

                        <h1
                            className="
                mt-4
                text-4xl
                font-semibold
                leading-tight
                sm:text-5xl
                lg:text-6xl
              "
                        >
                            Winners Iguosa
                        </h1>

                        <p
                            className="
                mx-auto
                mt-6
                max-w-2xl
                text-base
                leading-8
                text-gray-600
                dark:text-gray-300
                sm:text-lg
              "
                        >
                            A family of believers committed to winning souls,
                            building leaders and impacting our world with the
                            love of Christ.
                        </p>
                    </div>
                </ScrollReveal>
            </section>

            {/* MAIN STORY */}
            <section className="px-[6%] py-20 sm:py-24">
                <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
                    {/* TEXT */}
                    <ScrollReveal>
                        <div>
                            <span
                                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-widest
                  text-[#bd1717]
                  dark:text-[#f7b731]
                "
                            >
                                Our Story
                            </span>

                            <h2
                                className="
                  mt-3
                  text-3xl
                  font-semibold
                  leading-tight
                  sm:text-4xl
                "
                            >
                                Building Lives,
                                <br />
                                Raising Champions
                            </h2>

                            <div
                                className="
                  mt-7
                  space-y-5
                  text-sm
                  leading-8
                  text-gray-600
                  dark:text-gray-300
                  sm:text-base
                "
                            >
                                <p>
                                    Living Faith Church Iguosa is a family of
                                    believers united by faith in Jesus Christ and
                                    committed to advancing the Kingdom of God.
                                </p>

                                <p>
                                    We believe that every believer has a purpose,
                                    and our responsibility is to help people discover
                                    that purpose, develop their gifts and become all
                                    that God has ordained them to be.
                                </p>

                                <p>
                                    Through the teaching of God's Word, prayer,
                                    fellowship, worship and practical kingdom
                                    service, we are committed to raising believers
                                    who will make a positive impact in their families,
                                    communities and the world.
                                </p>
                            </div>

                            {/* PASTOR */}
                            <div
                                className="
                  mt-8
                  border-l-4
                  border-[#f7b731]
                  pl-5
                "
                            >
                                <p className="text-sm font-semibold text-[#030e5c] dark:text-white">
                                    Winners Iguosa
                                </p>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    A people committed to God's purpose.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* IMAGE */}
                    <ScrollReveal delay={150}>
                        <div
                            className="
                relative
                overflow-hidden
                rounded-2xl
                shadow-[0_15px_40px_rgba(3,14,92,0.15)]
                dark:shadow-black/30
              "
                        >
                            <img
                                src="/media/AboutUsImage.png"
                                alt="Living Faith Church Iguosa"
                                className="
                  h-[420px]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  hover:scale-105
                  sm:h-[500px]
                "
                            />

                            <div
                                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#0b0b25]/50
                  via-transparent
                  to-transparent
                "
                            />
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* FAITH SECTION */}
            <section
                className="
          bg-[#f1f1f1]
          px-[6%]
          py-20
          dark:bg-[#17182f]
          sm:py-24
        "
            >
                <div className="mx-auto max-w-5xl">
                    <ScrollReveal>
                        <div className="text-center">
                            <span
                                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-widest
                  text-[#bd1717]
                  dark:text-[#f7b731]
                "
                            >
                                What Drives Us
                            </span>

                            <h2
                                className="
                  mt-3
                  text-3xl
                  font-semibold
                  sm:text-4xl
                "
                            >
                                The Faith That Brought Us This Far
                            </h2>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={150}>
                        <div
                            className="
                mt-10
                rounded-2xl
                bg-white
                p-7
                shadow-sm
                dark:bg-[#181a38]
                dark:shadow-black/20
                sm:p-10
              "
                        >
                            <div className="space-y-6 text-sm leading-8 text-gray-600 dark:text-gray-300 sm:text-base">
                                <p>
                                    Our journey has been sustained by an unwavering
                                    confidence in God's Word. We believe that faith
                                    is not merely something we profess but something
                                    we demonstrate through our daily lives.
                                </p>

                                <p>
                                    The Word of God remains our foundation. It shapes
                                    our decisions, strengthens our hope and gives us
                                    direction in every season. Through faith, we
                                    continue to believe God for transformed lives,
                                    growing families and a greater impact in our
                                    community.
                                </p>

                                <p>
                                    We remain committed to following God's leading,
                                    serving people with love and making Jesus known
                                    through everything we do.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* MINISTRY VALUES */}
            <section className="px-[6%] py-20 sm:py-24">
                <ScrollReveal>
                    <div className="mx-auto max-w-7xl">
                        <div className="text-center">
                            <span
                                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-widest
                  text-[#bd1717]
                  dark:text-[#f7b731]
                "
                            >
                                Our Values
                            </span>

                            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                                What We Stand For
                            </h2>
                        </div>

                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    icon: "fas fa-book-open",
                                    title: "The Word",
                                    text: "God's Word is the foundation of our faith and our way of life.",
                                },
                                {
                                    icon: "fas fa-praying-hands",
                                    title: "Prayer",
                                    text: "We depend on prayer and fellowship with God in everything we do.",
                                },
                                {
                                    icon: "fas fa-users",
                                    title: "People",
                                    text: "We value people and are committed to building strong relationships.",
                                },
                                {
                                    icon: "fas fa-globe-africa",
                                    title: "Kingdom Impact",
                                    text: "We desire to positively influence our community and our world.",
                                },
                            ].map((value, index) => (
                                <ScrollReveal key={value.title} delay={index * 100}>
                                    <article
                                        className="
                      h-full
                      rounded-xl
                      border
                      border-gray-100
                      bg-white
                      p-6
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-lg
                      dark:border-white/10
                      dark:bg-[#181a38]
                      dark:shadow-black/20
                    "
                                    >
                                        <div
                                            className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#f7b731]/15
                        text-lg
                        text-[#bd1717]
                        dark:text-[#f7b731]
                      "
                                        >
                                            <i className={value.icon}></i>
                                        </div>

                                        <h3 className="mt-5 text-lg font-semibold">
                                            {value.title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                                            {value.text}
                                        </p>
                                    </article>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>
            </section>

            {/* MINISTRY STAT */}
            <section
                className="
          bg-[#0b0b25]
          px-[6%]
          py-16
          text-white
          dark:bg-[#0a0b1d]
        "
            >
                <ScrollReveal>
                    <div
                        className="
              mx-auto
              flex
              max-w-5xl
              flex-col
              items-center
              justify-center
              gap-8
              text-center
              sm:flex-row
              sm:gap-16
            "
                    >
                        <div>
                            <p
                                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#f7b731]
                "
                            >
                                Winners Iguosa
                            </p>

                            <div className="mt-4 flex items-center justify-center gap-4">
                                <i className="fas fa-church text-3xl text-[#f7b731]"></i>

                                <div className="text-left">
                                    <h3 className="text-4xl font-bold sm:text-5xl">
                                        6+
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-300">
                                        Years of Ministry
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="hidden h-16 w-px bg-white/15 sm:block"></div>

                        <p className="max-w-lg text-sm leading-7 text-gray-300 sm:text-left">
                            Building lives, raising champions and advancing
                            God's Kingdom through the transforming power of His
                            Word.
                        </p>
                    </div>
                </ScrollReveal>
            </section>
        </main>
    );
}

export default About;