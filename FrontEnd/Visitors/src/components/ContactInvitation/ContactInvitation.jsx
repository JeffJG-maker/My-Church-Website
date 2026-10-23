
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const smoothEase = [0.22, 1, 0.36, 1];

function ContactInvitation() {
    return (
        <section className="overflow-hidden bg-white px-5 py-20 transition-colors duration-500 dark:bg-[#101112] sm:px-8 md:py-28">
            <div className="mx-auto max-w-6xl">
                <div className="max-w-3xl">
                    {/* Section Label */}
                    <motion.div
                        initial={{ opacity: 0, y: 35 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 1.2,
                            delay: 0.1,
                            ease: smoothEase,
                        }}
                        className="mb-6 flex items-center gap-3"
                    >
                        <span className="h-[3px] w-9 rounded-full bg-[#E31B23]" />

                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E31B23] dark:text-white">
                            Let's Connect
                        </p>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h2
                        initial={{ opacity: 0, y: 45 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 1.4,
                            delay: 0.25,
                            ease: smoothEase,
                        }}
                        className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-[#171717] dark:text-white sm:text-4xl md:text-5xl lg:text-6xl"
                    >
                        We're here
                        <span className="block text-[#E31B23]">
                            for you.
                        </span>
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 1.4,
                            delay: 0.4,
                            ease: smoothEase,
                        }}
                        className="mt-6 max-w-2xl text-base leading-8 text-[#666666] dark:text-white/65 md:text-md"
                    >
                        Have a question, a prayer request, or a testimony
                        to share? We'd love to hear from you. Reach out to
                        us, and let us know how we can connect with you.
                    </motion.p>

                    {/* Contact Button and Tagline */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 1.4,
                            delay: 0.55,
                            ease: smoothEase,
                        }}
                        className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
                    >
                        <Link
                            to="/contact"
                            className="group inline-flex items-center gap-3 rounded-full bg-[#E31B23] px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#c8171e] focus:outline-none focus:ring-2 focus:ring-[#E31B23] focus:ring-offset-2 dark:focus:ring-offset-[#101112]"
                        >
                            Contact Us

                            <span
                                className="inline-block text-lg transition-transform duration-300 group-hover:translate-x-1"
                                aria-hidden="true"
                            >
                                →
                            </span>
                        </Link>

                        <p className="text-sm text-[#777777] dark:text-white/45">
                            Building Lives, Raising Champions
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default ContactInvitation;
