
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const smoothEase = [0.22, 1, 0.36, 1];

function ContactInvitation() {
    const shouldReduceMotion = useReducedMotion();

    const reveal = (delay = 0) => ({
        initial: shouldReduceMotion ? false : { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: {
            duration: shouldReduceMotion ? 0 : 0.9,
            delay: shouldReduceMotion ? 0 : delay,
            ease: smoothEase,
        },
    });

    return (
        <section
            aria-labelledby="contact-invitation-heading"
            className="bg-[#F7F7F7] px-5 py-16 transition-colors duration-500 dark:bg-[#101112] sm:px-8 md:py-20"
        >
            <div className="mx-auto max-w-6xl">
                <div className="max-w-2xl">
                    <motion.div
                        {...reveal(0.1)}
                        className="mb-5 flex items-center gap-3"
                    >
                        <span className="h-[3px] w-8 rounded-full bg-[#E31B23]" />
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23]">
                            Let's Connect
                        </p>
                    </motion.div>

                    <motion.h2
                        {...reveal(0.2)}
                        id="contact-invitation-heading"
                        className="text-3xl font-extrabold leading-tight tracking-tight text-[#171717] dark:text-white sm:text-4xl"
                    >
                        We're here for you.
                    </motion.h2>

                    <motion.p
                        {...reveal(0.3)}
                        className="mt-4 max-w-xl text-sm leading-7 text-[#666666] dark:text-white/65"
                    >
                        Have a question, prayer request, or testimony to share?
                        We'd love to hear from you. Get in touch with Living
                        Faith Church Iguosa and connect with us.
                    </motion.p>

                    <motion.div {...reveal(0.4)} className="mt-7">
                        <Link
                            to="/contact"
                            className="group inline-flex items-center gap-3 rounded-full bg-[#D91620] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(217,22,32,0.14)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#B9121B] hover:shadow-[0_12px_26px_rgba(217,22,32,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D91620] focus:ring-offset-2 dark:focus:ring-offset-[#101112]"
                        >
                            Contact Us
                            <span
                                aria-hidden="true"
                                className="inline-block text-lg transition-transform duration-300 group-hover:translate-x-1"
                            >
                                →
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default ContactInvitation;
