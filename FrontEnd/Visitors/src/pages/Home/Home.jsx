import HomeHero from "../../components/HomeHero/HomeHero";
import EventCard from "../../components/EventCard/EventCard";
import WelcomeSection from "../../components/WelcomeSection/WelcomeSection";
import FeaturedSermons from "../../components/FeaturedSermons/FeaturedSermons";
import Footer from "../../components/Footer/Footer";
import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";


function Home() {
    return (
        <main className="bg-white text-[#030e5c] transition-colors duration-500 dark:bg-[#0f1026] dark:text-white">
            {/* HERO */}
            <div
                className="
          sticky
          top-0
          z-0
          h-screen
          w-full
        "
            >
                <HomeHero />
            </div>

            {/* CONTENT THAT SLIDES OVER HERO */}
            <div className="relative z-10">
                {/* INTRODUCTORY SECTION */}
                <section
                    className="
            flex
            min-h-screen
            w-full
            flex-col
            items-center
            justify-center
            gap-12
            bg-white
            px-[5%]
            py-20
            dark:bg-[#0f1026]
            lg:flex-row
            lg:gap-16
          "
                >
                    <ScrollReveal>
                        <EventCard />
                    </ScrollReveal>

                    <WelcomeSection />
                </section>

                {/* FEATURED SERMONS */}
                <FeaturedSermons />

                <Footer />
            </div>
        </main>
    );
}

export default Home;