import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

function Footer() {
    const shouldReduceMotion = useReducedMotion();

    const churchLinks = [
        { name: "About Us", path: "/about" },
        { name: "Our Pastors", path: "/about" },
        { name: "Ministries", path: "/about" },
    ];

    const exploreLinks = [
        { name: "Sermons", path: "/sermons" },
        { name: "Events", path: "/events" },
    ];

    const connectLinks = [
        { name: "Contact Us", path: "/contact" },
    ];

    // Replace these placeholder URLs with the church's official social media links.
    const socialLinks = [
        { name: "Facebook", href: "#", icon: "fab fa-facebook-f" },
        { name: "Instagram", href: "#", icon: "fab fa-instagram" },
        { name: "YouTube", href: "#", icon: "fab fa-youtube" },
    ];

    const revealVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 42,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: shouldReduceMotion ? 0.01 : 1.15,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const groupVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.14,
                delayChildren: shouldReduceMotion ? 0 : 0.08,
            },
        },
    };

    const linkClass =
        "w-fit text-sm text-white/60 transition-colors duration-300 hover:text-[#E31B23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E31B23] focus-visible:ring-offset-4 focus-visible:ring-offset-[#111214]";

    return (
        <footer className="relative overflow-hidden bg-gradient-to-b from-[#151617] via-[#111214] to-[#0c0d0e] text-white">
            <div className="mx-auto max-w-7xl px-6 pb-7 pt-14 sm:px-10 sm:pt-16 lg:px-[7%]">
                <motion.div
                    variants={groupVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.12 }}
                >
                    {/* Footer introduction */}
                    <motion.div
                        variants={revealVariants}
                        className="flex flex-col justify-between gap-8 border-b border-white/[0.09] pb-10 sm:pb-12 lg:flex-row lg:items-end"
                    >
                        <div className="max-w-xl">
                            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#E31B23]">
                                Welcome Home
                            </p>

                            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Living Faith Church
                                <span className="text-white/55">, Iguosa</span>
                            </h2>

                            <p className="mt-3 max-w-md text-sm leading-7 text-white/55">
                                Building Lives, Raising Champions.
                            </p>
                        </div>

                        <Link
                            to="/contact"
                            className="group inline-flex w-fit items-center gap-3 text-sm font-medium text-white transition-colors duration-300 hover:text-[#E31B23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E31B23] focus-visible:ring-offset-4 focus-visible:ring-offset-[#111214]"
                        >
                            Plan a Visit or Contact Us
                            <i
                                className="fas fa-arrow-right text-xs text-[#E31B23] transition-transform duration-300 group-hover:translate-x-1"
                                aria-hidden="true"
                            />
                        </Link>
                    </motion.div>

                    {/* Footer navigation */}
                    <motion.div
                        variants={groupVariants}
                        className="grid grid-cols-2 gap-x-8 gap-y-10 py-10 sm:gap-x-12 sm:py-12 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]"
                    >
                        <motion.div variants={revealVariants}>
                            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                                Our Church
                            </h3>
                            <nav
                                aria-label="Our Church"
                                className="flex flex-col items-start gap-4"
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
                            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                                Explore
                            </h3>
                            <nav
                                aria-label="Explore"
                                className="flex flex-col items-start gap-4"
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
                            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                                Connect
                            </h3>
                            <nav
                                aria-label="Connect"
                                className="flex flex-col items-start gap-4"
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
                                <span className="text-sm leading-6 text-white/50">
                                    Iguosa, Edo State, Nigeria
                                </span>
                            </nav>
                        </motion.div>

                        <motion.div
                            variants={revealVariants}
                            className="col-span-2 lg:col-span-1"
                        >
                            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                                Stay Connected
                            </h3>
                            <p className="max-w-xs text-sm leading-6 text-white/55">
                                Follow along for messages, church updates, and upcoming events.
                            </p>

                            <motion.div
                                variants={groupVariants}
                                className="mt-5 flex items-center gap-3"
                            >
                                {socialLinks.map((social) => (
                                    <motion.a
                                        key={social.name}
                                        variants={revealVariants}
                                        href={social.href}
                                        aria-label={social.name}
                                        title={social.name}
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] text-sm text-white/65 transition-all duration-300 hover:border-[#E31B23] hover:bg-[#E31B23] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E31B23] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111214]"
                                        whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.04 }}
                                        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                                        target={social.href === "#" ? undefined : "_blank"}
                                        rel={social.href === "#" ? undefined : "noreferrer noopener"}
                                    >
                                        <i className={social.icon} aria-hidden="true" />
                                    </motion.a>
                                ))}
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Copyright */}
                    <motion.div
                        variants={revealVariants}
                        className="flex flex-col gap-3 border-t border-white/[0.09] pt-6 text-xs leading-5 text-white/40 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <p>
                            © {new Date().getFullYear()} Living Faith Church, Iguosa. All rights reserved.
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
