
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

function Footer() {
    const shouldReduceMotion = useReducedMotion();

    const churchLinks = [
        { name: "About Us", path: "/about" },
    ];

    const exploreLinks = [
        { name: "Sermons", path: "/sermons" },
        { name: "Events", path: "/events" },
    ];

    const connectLinks = [
        { name: "Contact Us", path: "/contact" },
    ];

    const socialLinks = [
        {
            name: "TikTok",
            href: "https://www.tiktok.com/@livingfaithchurch_1",
            icon: "fab fa-tiktok",
        },
    ];

    const revealVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 25,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: shouldReduceMotion ? 0.01 : 0.9,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const groupVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.12,
                delayChildren: shouldReduceMotion ? 0 : 0.05,
            },
        },
    };

    const linkClass =
        "w-fit text-sm text-white/55 transition-colors duration-300 hover:text-[#E31B23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E31B23] focus-visible:ring-offset-4 focus-visible:ring-offset-[#111214]";

    return (
        <footer className="relative overflow-hidden bg-gradient-to-b from-[#303234] to-[#27292B] text-white">
            <div className="mx-auto max-w-7xl px-6 pb-7 pt-12 sm:px-10 sm:pt-14 lg:px-[7%]">
                <motion.div
                    variants={groupVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.12 }}
                >
                    <motion.div
                        variants={revealVariants}
                        className="flex flex-col justify-between gap-6 border-b border-white/[0.09] pb-9 sm:flex-row sm:items-end sm:pb-10"
                    >
                        <div className="max-w-xl">
                            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E31B23]">
                                Welcome Home
                            </p>

                            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Living Faith Church
                                <span className="text-white/55">, Iguosa</span>
                            </h2>

                            <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
                                A place of faith, fellowship, and spiritual
                                growth. Building Lives, Raising Champions.
                            </p>

                            <p className="mt-2 text-xs text-white/40">
                                Iguosa, Edo State, Nigeria
                            </p>
                        </div>

                        <Link
                            to="/contact"
                            className="group inline-flex w-fit items-center gap-3 text-sm font-medium text-white transition-colors duration-300 hover:text-[#E31B23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E31B23] focus-visible:ring-offset-4 focus-visible:ring-offset-[#111214]"
                        >
                            Plan a Visit or Contact Us
                            <span
                                aria-hidden="true"
                                className="text-[#E31B23] transition-transform duration-300 group-hover:translate-x-1"
                            >
                                →
                            </span>
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={groupVariants}
                        className="grid grid-cols-2 gap-x-8 gap-y-9 py-9 sm:gap-x-12 sm:py-10 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]"
                    >
                        <motion.div variants={revealVariants}>
                            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white">
                                Our Church
                            </h3>

                            <nav
                                aria-label="Our Church"
                                className="flex flex-col items-start gap-3"
                            >
                                {churchLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={linkClass}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </motion.div>

                        <motion.div variants={revealVariants}>
                            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white">
                                Explore
                            </h3>

                            <nav
                                aria-label="Explore"
                                className="flex flex-col items-start gap-3"
                            >
                                {exploreLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={linkClass}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </motion.div>

                        <motion.div variants={revealVariants}>
                            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white">
                                Connect
                            </h3>

                            <nav
                                aria-label="Connect"
                                className="flex flex-col items-start gap-3"
                            >
                                {connectLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={linkClass}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </motion.div>

                        <motion.div
                            variants={revealVariants}
                            className="col-span-2 lg:col-span-1"
                        >
                            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white">
                                Stay Connected
                            </h3>

                            <p className="max-w-xs text-sm leading-6 text-white/50">
                                Follow our church activities, messages, and
                                upcoming events.
                            </p>

                            <div className="mt-5 flex items-center gap-3">
                                {socialLinks.map((social) => (
                                    <motion.a
                                        key={social.name}
                                        variants={revealVariants}
                                        href={social.href}
                                        aria-label={social.name}
                                        title={social.name}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] text-sm text-white/65 transition-all duration-300 hover:border-[#E31B23] hover:bg-[#E31B23] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E31B23] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111214]"
                                        whileHover={
                                            shouldReduceMotion
                                                ? undefined
                                                : { y: -3 }
                                        }
                                        whileTap={
                                            shouldReduceMotion
                                                ? undefined
                                                : { scale: 0.96 }
                                        }
                                    >
                                        <i
                                            className={social.icon}
                                            aria-hidden="true"
                                        />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={revealVariants}
                        className="flex flex-col gap-3 border-t border-white/[0.09] pt-6 text-xs leading-5 text-white/40 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <p>
                            © {new Date().getFullYear()} Living Faith Church,
                            Iguosa. All rights reserved.
                        </p>

                        <p className="tracking-wide">
                            Faith. Fellowship. Purpose.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </footer>
    );
}

export default Footer;
