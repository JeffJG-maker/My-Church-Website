import { useState } from "react";
import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSending(true);
        setSubmitted(false);
        setErrorMessage("");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to send your message."
                );
            }

            setSubmitted(true);

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });

            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
        } catch (error) {
            console.error("Contact form error:", error);

            setErrorMessage(
                error.message ||
                "Unable to send your message. Please try again later."
            );
        } finally {
            setIsSending(false);
        }
    };

    return (
        <main className="min-h-screen bg-white text-[#17172b] transition-colors duration-500 dark:bg-[#0b0b18] dark:text-white">

            {/* ================= HERO ================= */}
            <section
                className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-cover bg-center px-6 py-24"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(10, 10, 30, 0.72), rgba(10, 10, 30, 0.82)), url('/media/contactBackground.png')",
                }}
            >
                <ScrollReveal>
                    <div className="relative z-10 mx-auto max-w-4xl text-center">

                        <span className="mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/15">
                            GET IN TOUCH
                        </span>

                        <h1 className="mb-5 text-4xl font-bold leading-tight text-white transition-all duration-300 sm:text-5xl md:text-6xl">
                            Contact Us
                        </h1>

                        <p className="mx-auto max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                            We would love to hear from you. Reach out to us for
                            questions, prayers, testimonies, enquiries, or any
                            information about our church.
                        </p>

                    </div>
                </ScrollReveal>
            </section>

            {/* ================= CONTACT CONTENT ================= */}
            <section className="px-6 py-20 sm:px-8 lg:px-12">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">

                    {/* ================= CONTACT INFO ================= */}
                    <ScrollReveal>
                        <div>

                            <div className="mb-8">

                                <span className="mb-3 inline-block text-sm font-bold uppercase tracking-[0.2em] text-[#6c63ff] dark:text-[#9b94ff]">
                                    Contact Us
                                </span>

                                <h2 className="mb-5 text-3xl font-bold leading-tight sm:text-4xl">
                                    We’re here to{" "}
                                    <span className="text-[#6c63ff] dark:text-[#9b94ff]">
                                        connect with you.
                                    </span>
                                </h2>

                                <p className="max-w-xl leading-7 text-gray-600 dark:text-gray-400">
                                    Whether you have a question, need assistance,
                                    want to share a testimony, or simply want to
                                    reach out, feel free to contact us.
                                </p>

                            </div>

                            {/* Contact cards */}
                            <div className="space-y-5">

                                {/* Address */}
                                <div className="group flex items-start gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-[#e0e0ff] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#e0e0ff] dark:border-white/10 dark:bg-[#121222] dark:shadow-none dark:hover:shadow-none">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6c63ff]/10 text-[#6c63ff] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#6c63ff] group-hover:text-white dark:bg-[#9b94ff]/10 dark:text-[#9b94ff] dark:group-hover:bg-[#9b94ff] dark:group-hover:text-[#0b0b18]">
                                        <i className="fa-solid fa-location-dot text-lg"></i>
                                    </div>

                                    <div>
                                        <h3 className="mb-1 font-bold">
                                            Our Location
                                        </h3>

                                        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                                            Living Faith Church, Iguosa
                                        </p>
                                    </div>

                                </div>

                                {/* Phone */}
                                <div className="group flex items-start gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-[#e0e0ff] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#e0e0ff] dark:border-white/10 dark:bg-[#121222] dark:shadow-none dark:hover:shadow-none">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6c63ff]/10 text-[#6c63ff] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#6c63ff] group-hover:text-white dark:bg-[#9b94ff]/10 dark:text-[#9b94ff] dark:group-hover:bg-[#9b94ff] dark:group-hover:text-[#0b0b18]">
                                        <i className="fa-solid fa-phone text-lg"></i>
                                    </div>

                                    <div>
                                        <h3 className="mb-1 font-bold">
                                            Phone
                                        </h3>

                                        <a
                                            href="tel:09157999889"
                                            className="text-sm leading-6 text-gray-500 transition-colors duration-300 hover:text-[#6c63ff] dark:text-gray-400 dark:hover:text-[#9b94ff]"
                                        >
                                            09157999889
                                        </a>
                                    </div>

                                </div>

                                {/* Email */}
                                <div className="group flex items-start gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-[#e0e0ff] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#e0e0ff] dark:border-white/10 dark:bg-[#121222] dark:shadow-none dark:hover:shadow-none">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6c63ff]/10 text-[#6c63ff] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#6c63ff] group-hover:text-white dark:bg-[#9b94ff]/10 dark:text-[#9b94ff] dark:group-hover:bg-[#9b94ff] dark:group-hover:text-[#0b0b18]">
                                        <i className="fa-solid fa-envelope text-lg"></i>
                                    </div>

                                    <div>
                                        <h3 className="mb-1 font-bold">
                                            Email
                                        </h3>

                                        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                                            Send us a message through the form.
                                        </p>
                                    </div>

                                </div>

                                {/* Prayer */}
                                <div className="group flex items-start gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-[#e0e0ff] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#e0e0ff] dark:border-white/10 dark:bg-[#121222] dark:shadow-none dark:hover:shadow-none">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6c63ff]/10 text-[#6c63ff] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#6c63ff] group-hover:text-white dark:bg-[#9b94ff]/10 dark:text-[#9b94ff] dark:group-hover:bg-[#9b94ff] dark:group-hover:text-[#0b0b18]">
                                        <i className="fa-solid fa-hands-praying text-lg"></i>
                                    </div>

                                    <div>
                                        <h3 className="mb-1 font-bold">
                                            Prayer & Enquiries
                                        </h3>

                                        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                                            We are available to listen and connect
                                            with you.
                                        </p>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </ScrollReveal>

                    {/* ================= CONTACT FORM ================= */}
                    <ScrollReveal delay={150}>
                        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_15px_40px_#e0e0ff] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_#e0e0ff] sm:p-8 lg:p-10 dark:border-white/10 dark:bg-[#121222] dark:shadow-none dark:hover:shadow-none">

                            <div className="mb-8">

                                <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
                                    Send us a message
                                </h2>

                                <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                                    Fill out the form below and we will get back to
                                    you.
                                </p>

                            </div>

                            {/* SUCCESS MESSAGE */}
                            {submitted && (
                                <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 transition-all duration-300 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">

                                    <i className="fa-solid fa-circle-check mt-0.5"></i>

                                    <div>
                                        <p className="font-semibold">
                                            Message sent successfully.
                                        </p>

                                        <p className="mt-1 opacity-80">
                                            Thank you for reaching out to us.
                                        </p>
                                    </div>

                                </div>
                            )}

                            {/* ERROR MESSAGE */}
                            {errorMessage && (
                                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 transition-all duration-300 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">

                                    <i className="fa-solid fa-circle-exclamation mt-0.5"></i>

                                    <div>
                                        <p className="font-semibold">
                                            Message could not be sent.
                                        </p>

                                        <p className="mt-1 opacity-80">
                                            {errorMessage}
                                        </p>
                                    </div>

                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >

                                {/* NAME + EMAIL */}
                                <div className="grid gap-5 sm:grid-cols-2">

                                    {/* NAME */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-2 block text-sm font-semibold"
                                        >
                                            Your Name
                                        </label>

                                        <div className="relative">

                                            <i className="fa-solid fa-user pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter your name"
                                                required
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-[#6c63ff] focus:ring-4 focus:ring-[#6c63ff]/10 dark:border-white/10 dark:bg-[#0b0b18] dark:text-white dark:focus:border-[#9b94ff] dark:focus:ring-[#9b94ff]/10"
                                            />

                                        </div>
                                    </div>

                                    {/* EMAIL */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-2 block text-sm font-semibold"
                                        >
                                            Email Address
                                        </label>

                                        <div className="relative">

                                            <i className="fa-solid fa-envelope pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email"
                                                required
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-[#6c63ff] focus:ring-4 focus:ring-[#6c63ff]/10 dark:border-white/10 dark:bg-[#0b0b18] dark:text-white dark:focus:border-[#9b94ff] dark:focus:ring-[#9b94ff]/10"
                                            />

                                        </div>
                                    </div>

                                </div>

                                {/* SUBJECT */}
                                <div>

                                    <label
                                        htmlFor="subject"
                                        className="mb-2 block text-sm font-semibold"
                                    >
                                        Subject
                                    </label>

                                    <div className="relative">

                                        <i className="fa-solid fa-tag pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

                                        <input
                                            id="subject"
                                            name="subject"
                                            type="text"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="What would you like to talk about?"
                                            required
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-[#6c63ff] focus:ring-4 focus:ring-[#6c63ff]/10 dark:border-white/10 dark:bg-[#0b0b18] dark:text-white dark:focus:border-[#9b94ff] dark:focus:ring-[#9b94ff]/10"
                                        />

                                    </div>
                                </div>

                                {/* MESSAGE */}
                                <div>

                                    <label
                                        htmlFor="message"
                                        className="mb-2 block text-sm font-semibold"
                                    >
                                        Message
                                    </label>

                                    <div className="relative">

                                        <i className="fa-solid fa-message pointer-events-none absolute left-4 top-4 text-gray-400"></i>

                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Write your message here..."
                                            rows="6"
                                            required
                                            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-[#6c63ff] focus:ring-4 focus:ring-[#6c63ff]/10 dark:border-white/10 dark:bg-[#0b0b18] dark:text-white dark:focus:border-[#9b94ff] dark:focus:ring-[#9b94ff]/10"
                                        ></textarea>

                                    </div>
                                </div>

                                {/* SUBMIT */}
                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#6c63ff] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#6c63ff]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#5b52e8] hover:shadow-xl hover:shadow-[#6c63ff]/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-[#7b73ff] dark:hover:bg-[#6c63ff]"
                                >
                                    {isSending ? (
                                        <>
                                            <i className="fa-solid fa-spinner fa-spin"></i>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <i className="fa-solid fa-paper-plane transition-transform duration-300 group-hover:translate-x-1"></i>
                                        </>
                                    )}
                                </button>

                            </form>
                        </div>
                    </ScrollReveal>

                </div>
            </section>

            {/* ================= BOTTOM CTA ================= */}
            <section className="px-6 pb-20 sm:px-8 lg:px-12">

                <ScrollReveal delay={100}>
                    <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#111126] px-6 py-12 text-center shadow-xl shadow-[#e0e0ff] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#e0e0ff] sm:px-10 dark:bg-[#15152a] dark:shadow-none dark:hover:shadow-none">

                        <div className="mx-auto max-w-2xl">

                            <i className="fa-solid fa-church mb-5 text-3xl text-[#9b94ff] transition-transform duration-300 hover:scale-110"></i>

                            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
                                We look forward to hearing from you.
                            </h2>

                            <p className="leading-7 text-white/60">
                                Thank you for connecting with Living Faith Church
                                Iguosa. May God bless you richly.
                            </p>

                        </div>

                    </div>
                </ScrollReveal>

            </section>

        </main>
    );
}

export default Contact;