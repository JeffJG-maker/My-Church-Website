import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const contactItems = [
    {
        icon: "fa-solid fa-location-dot",
        title: "Our Location",
        content: "Living Faith Church, Iguosa",
        type: "text",
    },
    {
        icon: "fa-solid fa-phone",
        title: "Phone",
        content: "09157999889",
        type: "phone",
    },
    {
        icon: "fa-solid fa-envelope",
        title: "Email",
        content: "Send us a message through the form.",
        type: "text",
    },
    {
        icon: "fa-solid fa-hands-praying",
        title: "Prayer & Enquiries",
        content: "We are available to listen, pray with you, and connect with you.",
        type: "text",
    },
];

function Contact() {
    const shouldReduceMotion = useReducedMotion();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const fadeUp = {
        hidden: {
            opacity: shouldReduceMotion ? 1 : 0,
            y: shouldReduceMotion ? 0 : 28,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: shouldReduceMotion ? 0 : 0.7,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const stagger = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.12,
            },
        },
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errorMessage) setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSending(true);
        setSubmitted(false);
        setErrorMessage("");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/contact`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to send your message.");
            }

            setSubmitted(true);
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            console.error("Contact form error:", error);
            setErrorMessage(
                error.message || "Unable to send your message. Please try again later."
            );
        } finally {
            setIsSending(false);
        }
    };

    const fieldClass =
        "w-full rounded-xl border-0 bg-white px-4 py-3.5 text-sm text-[#171717] outline-none ring-1 ring-black/[0.07] transition duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-[#E31B23]/50 dark:bg-[#101112] dark:text-white dark:ring-white/[0.08] dark:focus:ring-[#E31B23]/70";

    return (
        <main className="min-h-screen overflow-hidden bg-white text-[#171717] transition-colors duration-500 dark:bg-[#101112] dark:text-white">
            {/* Hero */}
            <section
                className="relative flex min-h-[390px] items-center justify-center overflow-hidden bg-cover bg-center px-6 py-24 sm:min-h-[440px]"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg, rgba(12,12,12,0.78), rgba(12,12,12,0.58)), url('/media/contactBackground.png')",
                }}
            >
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#E31B23]/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-white/[0.07] blur-3xl" />

                <motion.div
                    className="relative z-10 mx-auto max-w-3xl text-center"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                >
                    <span className="mb-5 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-white/80 sm:text-sm">
                        <span className="h-px w-8 bg-[#E31B23]" />
                        Get in touch
                        <span className="h-px w-8 bg-[#E31B23]" />
                    </span>

                    <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                        Contact Us
                    </h1>

                    <p className="mx-auto max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                        We would love to hear from you. Reach out with your questions,
                        prayer requests, testimonies, or enquiries about our church.
                    </p>
                </motion.div>
            </section>

            {/* Contact details and form */}
            <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                    >
                        <motion.div variants={fadeUp} className="mb-9 max-w-xl">
                            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-[#E31B23]">
                                We’re here for you
                            </span>
                            <h2 className="mb-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                                Let’s{" "}
                                <span className="text-[#E31B23]">connect.</span>
                            </h2>
                            <p className="text-base leading-7 text-gray-600 dark:text-gray-400">
                                Whether you need assistance, want to share a testimony, or
                                would like someone to pray with you, we welcome your message.
                            </p>
                        </motion.div>

                        <motion.div variants={stagger} className="space-y-2">
                            {contactItems.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    variants={fadeUp}
                                    className="group flex items-start gap-4 rounded-2xl bg-[#F7F7F6] p-5 transition duration-300 hover:-translate-y-0.5 hover:bg-[#F3F0EF] dark:bg-[#181a1d] dark:hover:bg-[#1d1f22] sm:gap-5 sm:p-6"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E31B23]/[0.09] text-[#E31B23] transition duration-300 group-hover:bg-[#E31B23] group-hover:text-white dark:bg-[#E31B23]/15">
                                        <i className={`${item.icon} text-base`} aria-hidden="true" />
                                    </div>

                                    <div className="min-w-0 pt-0.5">
                                        <h3 className="mb-1.5 font-semibold tracking-tight">
                                            {item.title}
                                        </h3>
                                        {item.type === "phone" ? (
                                            <a
                                                href="tel:09157999889"
                                                className="text-sm leading-6 text-gray-600 transition-colors hover:text-[#E31B23] dark:text-gray-400 dark:hover:text-[#E31B23]"
                                            >
                                                {item.content}
                                            </a>
                                        ) : (
                                            <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                                                {item.content}
                                            </p>
                                        )}
                                    </div>

                                    <span className="ml-auto mt-1 hidden text-sm text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#E31B23] sm:block">
                                        <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.p
                            variants={fadeUp}
                            className="mt-6 flex items-start gap-3 px-1 text-sm leading-6 text-gray-500 dark:text-gray-400"
                        >
                            <i className="fa-solid fa-heart mt-1 text-[#E31B23]" aria-hidden="true" />
                            <span>
                                You are welcome here. We look forward to connecting with you.
                            </span>
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.12 }}
                        transition={{
                            duration: shouldReduceMotion ? 0 : 0.7,
                            delay: shouldReduceMotion ? 0 : 0.12,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="rounded-[1.75rem] bg-[#F7F7F6] p-5 dark:bg-[#181a1d] sm:p-8 lg:p-10"
                    >
                        <div className="mb-8">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.22em] text-[#E31B23]">
                                Send a message
                            </span>
                            <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                                How can we help?
                            </h2>
                            <p className="max-w-lg text-sm leading-6 text-gray-600 dark:text-gray-400">
                                Fill in the details below and we’ll get back to you as soon as
                                we can.
                            </p>
                        </div>

                        {submitted && (
                            <motion.div
                                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-400"
                                role="status"
                                aria-live="polite"
                            >
                                <i className="fa-solid fa-circle-check mt-0.5" aria-hidden="true" />
                                <div>
                                    <p className="font-semibold">Message sent successfully.</p>
                                    <p className="mt-1 opacity-80">
                                        Thank you for reaching out to us.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 flex items-start gap-3 rounded-xl bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400"
                                role="alert"
                            >
                                <i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true" />
                                <div>
                                    <p className="font-semibold">Message could not be sent.</p>
                                    <p className="mt-1 opacity-80">{errorMessage}</p>
                                </div>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-semibold"
                                    >
                                        Your Name
                                    </label>
                                    <div className="relative">
                                        <i
                                            className="fa-solid fa-user pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400"
                                            aria-hidden="true"
                                        />
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            required
                                            className={`${fieldClass} pl-11`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <i
                                            className="fa-solid fa-envelope pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400"
                                            aria-hidden="true"
                                        />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            required
                                            className={`${fieldClass} pl-11`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="subject"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Subject
                                </label>
                                <div className="relative">
                                    <i
                                        className="fa-solid fa-tag pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="What would you like to talk about?"
                                        required
                                        className={`${fieldClass} pl-11`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Message
                                </label>
                                <div className="relative">
                                    <i
                                        className="fa-solid fa-message pointer-events-none absolute left-4 top-4 text-sm text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Write your message here..."
                                        rows={5}
                                        required
                                        className={`${fieldClass} resize-y pl-11`}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSending}
                                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#E31B23] px-6 py-4 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#C9151C] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSending ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <i
                                            className="fa-solid fa-arrow-right transition-transform duration-300 group-hover:translate-x-1"
                                            aria-hidden="true"
                                        />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs leading-5 text-gray-500 dark:text-gray-500">
                                Your message is sent directly to our church contact service.
                            </p>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Closing invitation */}
            <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#F7F7F6] px-6 py-12 text-center dark:bg-[#181a1d] sm:px-10 sm:py-16"
                >
                    <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#E31B23]/[0.07] blur-2xl" />
                    <div className="relative mx-auto max-w-2xl">
                        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E31B23]/10 text-[#E31B23]">
                            <i className="fa-solid fa-church text-lg" aria-hidden="true" />
                        </div>
                        <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
                            We look forward to hearing from you.
                        </h2>
                        <p className="leading-7 text-gray-600 dark:text-gray-400">
                            Thank you for connecting with Living Faith Church Iguosa. May God
                            bless you richly.
                        </p>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}

export default Contact;
