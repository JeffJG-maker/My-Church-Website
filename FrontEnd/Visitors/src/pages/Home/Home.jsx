
import HomeHero from "../../components/HomeHero/HomeHero";
import WelcomeSection from "../../components/WelcomeSection/WelcomeSection";
import FeaturedSermons from "../../components/FeaturedSermons/FeaturedSermons";
import ContactInvitation from "../../components/ContactInvitation/ContactInvitation";
import Footer from "../../components/Footer/Footer";

function Home() {
    return (
        <main className="bg-white text-[#171717] transition-colors duration-500 dark:bg-[#101112] dark:text-white">
            {/* Hero */}
            <HomeHero />

            {/* Main Content */}
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
