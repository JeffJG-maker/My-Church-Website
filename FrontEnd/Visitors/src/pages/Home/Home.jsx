import HomeHero from "../../components/HomeHero/HomeHero";
import WelcomeSection from "../../components/WelcomeSection/WelcomeSection";
import FeaturedSermons from "../../components/FeaturedSermons/FeaturedSermons";
import Footer from "../../components/Footer/Footer";

function Home() {
    return (
        <main className="bg-white text-[#17172b] transition-colors duration-500 dark:bg-[#101112] dark:text-white">
            {/* Hero */}
            <div className="sticky top-0 z-0 h-screen w-full">
                <HomeHero />
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Welcome + Upcoming Event */}
                <WelcomeSection />

                {/* Featured Sermons */}
                <FeaturedSermons />

                {/* Footer */}
                <Footer />
            </div>
        </main>
    );
}

export default Home;