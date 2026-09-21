import { welcomeFeatures } from "../../data/homeData";
import ScrollReveal from "../ScrollReveal/ScrollReveal";

function FeatureIcon({ type }) {
    if (type === "book") {
        return <i className="fas fa-book-open"></i>;
    }

    if (type === "users") {
        return <i className="fas fa-users"></i>;
    }

    if (type === "heart") {
        return <i className="far fa-heart"></i>;
    }

    return <i className="fas fa-place-of-worship"></i>;
}

function WelcomeSection() {
    return (
        <section
            className="
        w-full
        max-w-3xl
        space-y-8
        text-[#030e5c]

        dark:text-white
      "
        >
            {/* INTRODUCTION */}
            <ScrollReveal>
                <div className="space-y-3">
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
                        Welcome Home
                    </span>

                    <h2
                        className="
              text-3xl
              font-semibold
              leading-tight
              sm:text-4xl
            "
                    >
                        We're Glad You're Here!
                    </h2>

                    <p
                        className="
              max-w-2xl
              text-base
              leading-7
              text-gray-600

              dark:text-gray-300
            "
                    >
                        Living Faith Church Iguosa is a family of believers
                        committed to winning souls, building leaders and
                        impacting our world with the love of Christ.
                    </p>
                </div>
            </ScrollReveal>

            {/* FEATURES */}
            <div
                className="
          grid
          w-full
          grid-cols-1
          gap-6
          sm:grid-cols-2
        "
            >
                {welcomeFeatures.map((feature, index) => (
                    <ScrollReveal
                        key={feature.title}
                        delay={index * 100}
                    >
                        <article
                            className="
                h-full
                rounded-xl
                border
                border-gray-100
                bg-white
                p-5
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
                            {/* ICON */}
                            <div
                                className="
                  mb-4
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#f7b731]/15
                  text-lg
                  text-[#bd1717]

                  dark:text-[#f7b731]
                "
                            >
                                <FeatureIcon type={feature.icon} />
                            </div>

                            {/* TITLE */}
                            <h3 className="mb-2 text-lg font-semibold">
                                {feature.title}
                            </h3>

                            {/* DESCRIPTION */}
                            <p
                                className="
                  text-sm
                  leading-6
                  text-gray-600

                  dark:text-gray-300
                "
                            >
                                {feature.description}
                            </p>
                        </article>
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}

export default WelcomeSection;