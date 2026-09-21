import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";

function Contact() {
    return (
        <main
            className="
        min-h-screen
        bg-white
        text-[#030e5c]
        transition-colors
        duration-500
        dark:bg-[#0f1026]
        dark:text-white
      "
        >
            {/* HERO */}
            <section
                className="
          relative
          flex
          min-h-[60vh]
          items-center
          overflow-hidden
          bg-[#0b0b25]
          px-[6%]
          pb-16
          pt-32
          text-white
        "
            >
                {/* BACKGROUND */}
                <img
                    src="/media/contactBackground.png"
                    alt=""
                    className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            opacity-50
          "
                />

                {/* OVERLAY */}
                <div
                    className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#0b0b25]/95
            via-[#0b0b25]/75
            to-[#0b0b25]/40
          "
                ></div>

                {/* CONTENT */}
                <ScrollReveal>
                    <div className="relative z-10 max-w-3xl">
                        <p
                            className="
                text-sm
                font-semibold
                uppercase
                tracking-widest
                text-[#f7b731]
              "
                        >
                            Home . Contact Us
                        </p>

                        <h1
                            className="
                mt-4
                text-4xl
                font-semibold
                leading-tight
                sm:text-5xl
                lg:text-6xl
              "
                        >
                            CONTACT US
                        </h1>

                        <p
                            className="
                mt-6
                max-w-xl
                text-base
                leading-7
                text-white/80
                sm:text-lg
              "
                        >
                            We would love to hear from you. Reach out to us,
                            connect with our family and let's continue building
                            lives and raising champions together.
                        </p>

                        {/* WHATSAPP / CALL BUTTON */}
                        <a
                            href="https://wa.me/2349157999889"
                            target="_blank"
                            rel="noreferrer"
                            className="
                mt-8
                inline-flex
                items-center
                gap-4
                rounded-md
                border
                border-white/20
                bg-white/10
                px-5
                py-3
                text-sm
                font-semibold
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#f7b731]
                hover:bg-[#f7b731]
                hover:text-[#0b0b25]
              "
                        >
                            <span>Let's Talk</span>

                            <i className="fas fa-phone-alt"></i>
                        </a>
                    </div>
                </ScrollReveal>
            </section>

            {/* CONTACT INFORMATION + FORM */}
            <section className="px-[6%] py-20 sm:py-24">
                <div
                    className="
            mx-auto
            grid
            max-w-7xl
            gap-12
            lg:grid-cols-[1fr_1.1fr]
            lg:gap-16
          "
                >
                    {/* INFORMATION */}
                    <ScrollReveal>
                        <div className="lg:pt-5">
                            <span
                                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-widest
                  text-[#bd1717]
                  dark:text-[#f7b731]
                "
                            >
                                Get In Touch
                            </span>

                            <h2
                                className="
                  mt-3
                  text-3xl
                  font-semibold
                  leading-tight
                  sm:text-4xl
                "
                            >
                                Need more information?
                                <br />
                                Get in touch with us
                            </h2>

                            <p
                                className="
                  mt-5
                  max-w-lg
                  text-sm
                  leading-7
                  text-gray-600
                  dark:text-gray-300
                "
                            >
                                A connected group of winners families worldwide.
                                Whether you have a question, need information or
                                simply want to connect with us, we are happy to
                                hear from you.
                            </p>

                            {/* CONTACT DETAILS */}
                            <div className="mt-10 space-y-7">
                                {/* PHONE */}
                                <div className="flex items-start gap-4">
                                    <div
                                        className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f7b731]/15
                      text-[#bd1717]
                      dark:text-[#f7b731]
                    "
                                    >
                                        <i className="fas fa-phone-alt"></i>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            Phone Number
                                        </h3>

                                        <a
                                            href="tel:+2349157999889"
                                            className="
                        mt-1
                        block
                        text-sm
                        text-gray-600
                        transition-colors
                        hover:text-[#bd1717]
                        dark:text-gray-300
                        dark:hover:text-[#f7b731]
                      "
                                        >
                                            +234 9157999889
                                        </a>
                                    </div>
                                </div>

                                {/* EMAIL */}
                                <div className="flex items-start gap-4">
                                    <div
                                        className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f7b731]/15
                      text-[#bd1717]
                      dark:text-[#f7b731]
                    "
                                    >
                                        <i className="far fa-envelope"></i>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            Email
                                        </h3>

                                        <a
                                            href="mailto:josasofure@gmail.com"
                                            className="
                        mt-1
                        block
                        break-all
                        text-sm
                        text-gray-600
                        transition-colors
                        hover:text-[#bd1717]
                        dark:text-gray-300
                        dark:hover:text-[#f7b731]
                      "
                                        >
                                            josasofure@gmail.com
                                        </a>
                                    </div>
                                </div>

                                {/* ADDRESS */}
                                <div className="flex items-start gap-4">
                                    <div
                                        className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f7b731]/15
                      text-[#bd1717]
                      dark:text-[#f7b731]
                    "
                                    >
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            Address
                                        </h3>

                                        <p
                                            className="
                        mt-1
                        max-w-md
                        text-sm
                        leading-6
                        text-gray-600
                        dark:text-gray-300
                      "
                                        >
                                            5, Faith Academy Secondary School, Beside
                                            7UP Junction, Iguosa. Benin City. Edo State.
                                            Nigeria.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* FORM */}
                    <ScrollReveal delay={150}>
                        <div
                            className="
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-7
                shadow-[0_10px_35px_rgba(3,14,92,0.10)]
                dark:border-white/10
                dark:bg-[#181a38]
                dark:shadow-black/25
                sm:p-9
              "
                        >
                            <h2 className="text-2xl font-semibold sm:text-3xl">
                                Send Message
                            </h2>

                            <p
                                className="
                  mt-3
                  text-sm
                  leading-6
                  text-gray-600
                  dark:text-gray-300
                "
                            >
                                Please fill out the form below with your details
                                and message to get in touch with us.
                            </p>

                            <form
                                onSubmit={(event) => event.preventDefault()}
                                className="mt-7"
                            >
                                {/* NAMES */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="first-name"
                                            className="mb-2 block text-sm font-medium"
                                        >
                                            First Name
                                        </label>

                                        <input
                                            type="text"
                                            id="first-name"
                                            placeholder="Enter First Name"
                                            required
                                            className="
                        w-full
                        rounded-md
                        border
                        border-gray-200
                        bg-gray-50
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition-all
                        duration-300
                        focus:border-[#f7b731]
                        focus:ring-2
                        focus:ring-[#f7b731]/20
                        dark:border-white/10
                        dark:bg-white/5
                        dark:text-white
                        dark:placeholder:text-gray-500
                      "
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="last-name"
                                            className="mb-2 block text-sm font-medium"
                                        >
                                            Last Name
                                        </label>

                                        <input
                                            type="text"
                                            id="last-name"
                                            placeholder="Enter Last Name"
                                            required
                                            className="
                        w-full
                        rounded-md
                        border
                        border-gray-200
                        bg-gray-50
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition-all
                        duration-300
                        focus:border-[#f7b731]
                        focus:ring-2
                        focus:ring-[#f7b731]/20
                        dark:border-white/10
                        dark:bg-white/5
                        dark:text-white
                        dark:placeholder:text-gray-500
                      "
                                        />
                                    </div>
                                </div>

                                {/* EMAIL */}
                                <div className="mt-5">
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Enter Your Email"
                                        required
                                        className="
                      w-full
                      rounded-md
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3
                      text-sm
                      outline-none
                      transition-all
                      duration-300
                      focus:border-[#f7b731]
                      focus:ring-2
                      focus:ring-[#f7b731]/20
                      dark:border-white/10
                      dark:bg-white/5
                      dark:text-white
                      dark:placeholder:text-gray-500
                    "
                                    />
                                </div>

                                {/* MESSAGE */}
                                <div className="mt-5">
                                    <label
                                        htmlFor="message"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Message
                                    </label>

                                    <textarea
                                        id="message"
                                        rows="6"
                                        placeholder="Input your message..."
                                        className="
                      w-full
                      resize-none
                      rounded-md
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3
                      text-sm
                      outline-none
                      transition-all
                      duration-300
                      focus:border-[#f7b731]
                      focus:ring-2
                      focus:ring-[#f7b731]/20
                      dark:border-white/10
                      dark:bg-white/5
                      dark:text-white
                      dark:placeholder:text-gray-500
                    "
                                    ></textarea>
                                </div>

                                {/* SUBSCRIBE */}
                                <label
                                    htmlFor="subscribe"
                                    className="
                    mt-5
                    flex
                    cursor-pointer
                    items-start
                    gap-3
                    text-sm
                    text-gray-600
                    dark:text-gray-300
                  "
                                >
                                    <input
                                        type="checkbox"
                                        id="subscribe"
                                        className="
                      mt-1
                      h-4
                      w-4
                      shrink-0
                      accent-[#f7b731]
                    "
                                    />

                                    <span>
                                        Yes, subscribe to our social media channels and
                                        platforms.
                                    </span>
                                </label>

                                {/* SUBMIT */}
                                <button
                                    type="submit"
                                    className="
                    mt-7
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-md
                    bg-[#bd1717]
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-[#a31313]
                    dark:bg-[#f7b731]
                    dark:text-[#0b0b25]
                    dark:hover:bg-[#e5a91f]
                  "
                                >
                                    SUBMIT
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </main>
    );
}

export default Contact;