
import HomeHero from "../../components/HomeHero/HomeHero";
import WelcomeSection from "../../components/WelcomeSection/WelcomeSection";
import FeaturedSermons from "../../components/FeaturedSermons/FeaturedSermons";
import ContactInvitation from "../../components/ContactInvitation/ContactInvitation";
import Footer from "../../components/Footer/Footer";
import SEO from "../../components/SEO/SEO";

function Home() {
    return (
        <main className="bg-white text-[#171717] transition-colors duration-500 dark:bg-[#101112] dark:text-white">
            <SEO
                title="Winners Chapel in Iguosa, Edo State"
                description="Welcome to Living Faith Church Iguosa, popularly known as Winners Chapel. Join us for worship, inspiring sermons, prayer, fellowship, and faith-building experiences in Iguosa, Edo State, Nigeria."
                path="/"
            />

            <HomeHero />

            <div className="relative z-10">
                <WelcomeSection />
                <FeaturedSermons />
                <ContactInvitation />
                <Footer />
            </div>
        </main>
    );
}

export default Home;
