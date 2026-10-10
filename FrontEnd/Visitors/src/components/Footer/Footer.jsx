import { Link } from "react-router-dom";
import ScrollReveal from "../ScrollReveal/ScrollReveal";

function Footer() {
    const churchLinks = [
        { name: "About Us", path: "/about" },
        { name: "Our Pastors", path: "/about" },
        { name: "Ministries", path: "/about" },
        { name: "Events", path: "/events" },
        { name: "Contact Us", path: "/contact" },
    ];

    const mediaLinks = [
        { name: "Sermons", path: "/sermons" },
        { name: "Events", path: "/events" },
        { name: "Contact Us", path: "/contact" },
    ];

    const socialLinks = [
        {
            name: "Facebook",
            href: "#",
            icon: "fab fa-facebook-f",
        },
        {
            name: "Instagram",
            href: "#",
            icon: "fab fa-instagram",
        },
        {
            name: "YouTube",
            href: "#",
            icon: "fab fa-youtube",
        },
    ];

    return (
        <footer className="border-t border-[#27292d] bg-gradient-to-b from-[#101112] via-[#141618] to-[#101112] text-white transition-colors duration-500">
            <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-[7%]">
                <ScrollReveal>
                    {/* TOP FOOTER AREA */}
                    <div className="mb-16 flex flex-col gap-8">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">
                                Living Faith Church
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                Iguosa, Edo State, Nigeria
                            </p>
                        </div>

                        {/* LEARN MORE */}
                        <Link
                            to="/about"
                            className="
                                group
                                flex
                                w-fit
                                items-center
                                gap-3
                                border-b
                                border-white/20
                                pb-2
                                text-sm
                                text-gray-300
                                transition-colors
                                duration-300
                                hover:border-[#F7941D]
                                hover:text-[#F7941D]
                            "
                        >
                            Learn More About Us

                            <i className="fas fa-arrow-right text-xs text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#F7941D]" />
                        </Link>
                    </div>

                    {/* MAIN LINKS */}
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                        {/* CHURCH */}
                        <div>
                            <h3 className="mb-6 text-sm font-semibold text-white">
                                Church
                            </h3>

                            <nav className="flex flex-col items-start gap-4">
                                {churchLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className="
                                            text-sm
                                            text-gray-400
                                            transition-colors
                                            duration-300
                                            hover:text-[#F7941D]
                                        "
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* GROW */}
                        <div>
                            <h3 className="mb-6 text-sm font-semibold text-white">
                                Grow With Us
                            </h3>

                            <nav className="flex flex-col items-start gap-4">
                                <Link
                                    to="/sermons"
                                    className="
                                        text-sm
                                        text-gray-400
                                        transition-colors
                                        duration-300
                                        hover:text-[#F7941D]
                                    "
                                >
                                    Listen to Sermons
                                </Link>

                                <Link
                                    to="/events"
                                    className="
                                        text-sm
                                        text-gray-400
                                        transition-colors
                                        duration-300
                                        hover:text-[#F7941D]
                                    "
                                >
                                    Upcoming Events
                                </Link>

                                <Link
                                    to="/about"
                                    className="
                                        text-sm
                                        text-gray-400
                                        transition-colors
                                        duration-300
                                        hover:text-[#F7941D]
                                    "
                                >
                                    Our Vision
                                </Link>

                                <Link
                                    to="/about"
                                    className="
                                        text-sm
                                        text-gray-400
                                        transition-colors
                                        duration-300
                                        hover:text-[#F7941D]
                                    "
                                >
                                    Our Mission
                                </Link>
                            </nav>
                        </div>

                        {/* CONNECT */}
                        <div>
                            <h3 className="mb-6 text-sm font-semibold text-white">
                                Connect
                            </h3>

                            <nav className="flex flex-col items-start gap-4">
                                {mediaLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className="
                                            text-sm
                                            text-gray-400
                                            transition-colors
                                            duration-300
                                            hover:text-[#F7941D]
                                        "
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* BOTTOM SOCIAL AREA */}
                    <div className="mt-16 border-t border-[#27292d] pt-8">
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                            {/* SOCIAL ICONS */}
                            <div className="flex items-center gap-5">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        aria-label={social.name}
                                        className="
                                            text-gray-400
                                            transition-colors
                                            duration-300
                                            hover:text-[#E31B23]
                                        "
                                    >
                                        <i className={social.icon} />
                                    </a>
                                ))}
                            </div>

                            {/* LOCATION */}
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <i className="fas fa-location-dot text-[#E31B23]" />
                                <span>Edo State, Nigeria</span>
                            </div>
                        </div>

                        {/* COPYRIGHT */}
                        <div className="mt-10 flex flex-col gap-3 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
                            <p>
                                © {new Date().getFullYear()} Living Faith Church
                                Iguosa. All Rights Reserved.
                            </p>

                            <p>
                                Building Lives, Raising Champions
                            </p>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </footer>
    );
}

export default Footer;