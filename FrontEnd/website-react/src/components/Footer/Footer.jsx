import { Link } from "react-router-dom";
import ScrollReveal from "../ScrollReveal/ScrollReveal";

function Footer() {
    const quickLinks = [
        { name: "About Us", path: "/about" },
        { name: "Our Pastors", path: "/about" },
        { name: "Ministries", path: "/about" },
        { name: "Sermons", path: "/" },
        { name: "Events", path: "/" },
        { name: "Contact Us", path: "/contact" },
    ];

    const serviceTimes = [
        {
            title: "Sunday Service",
            time: "8:00AM - 10:20AM",
            icon: "fas fa-calendar-day",
        },
        {
            title: "Midweek Service",
            time: "6:00PM - 7:30PM",
            icon: "far fa-clock",
        },
        {
            title: "Prayer Meeting",
            time: "5:00PM - 6:00PM (Fridays)",
            icon: "fas fa-praying-hands",
        },
    ];

    return (
        <footer
            className="
        relative
        z-10
        overflow-hidden
        bg-[#0b0b25]
        px-6
        pb-6
        pt-20
        text-[#eff0f4]
        transition-colors
        duration-500
        sm:px-10
        lg:px-16
      "
        >
            {/* BACKGROUND IMAGE */}
            <img
                src="/media/pexels-adrien-olichon-1257089-2387819.jpg"
                alt=""
                className="
          pointer-events-none
          absolute
          inset-0
          h-full
          w-full
          object-cover
          opacity-[0.07]
        "
            />

            {/* DARK OVERLAY */}
            <div className="pointer-events-none absolute inset-0 bg-[#0b0b25]/90"></div>

            {/* FOOTER CONTENT */}
            <div
                className="
          relative
          mx-auto
          grid
          max-w-7xl
          grid-cols-1
          gap-12
          border-b
          border-white/10
          pb-12
          md:grid-cols-2
          lg:grid-cols-[2.2fr_1fr_1.3fr_1.5fr]
          lg:gap-10
        "
            >
                {/* ABOUT */}
                <ScrollReveal>
                    <div>
                        <h3 className="mb-5 text-lg font-semibold text-white">
                            About Our Church
                        </h3>

                        <p className="max-w-md text-sm leading-7 text-gray-300">
                            Living Faith Church Iguosa is part of Winners' Chapel
                            International, a global ministry with a mandate to raise
                            believers who are impacting their world positively and
                            fulfilling God's purpose.
                        </p>

                        <Link
                            to="/about"
                            className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-md
                bg-[#f7b731]
                px-5
                py-3
                text-sm
                text-[#0b0b25]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#e5a91f]
              "
                        >
                            Learn More About Us
                            <i className="fas fa-arrow-right"></i>
                        </Link>
                    </div>
                </ScrollReveal>

                {/* QUICK LINKS */}
                <ScrollReveal delay={100}>
                    <div>
                        <h3 className="mb-5 text-lg font-semibold text-white">
                            Quick Links
                        </h3>

                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={`${link.name}-${link.path}`}>
                                    <Link
                                        to={link.path}
                                        className="
                      group
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-gray-300
                      transition-colors
                      duration-300
                      hover:text-[#f7b731]
                    "
                                    >
                                        <i
                                            className="
                        fas
                        fa-chevron-right
                        text-[9px]
                        text-[#f7b731]
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                                        ></i>

                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </ScrollReveal>

                {/* SERVICE TIMES */}
                <ScrollReveal delay={200}>
                    <div>
                        <h3 className="mb-5 text-lg font-semibold text-white">
                            Service Times
                        </h3>

                        <div className="space-y-5">
                            {serviceTimes.map((service) => (
                                <div
                                    key={service.title}
                                    className="flex items-start gap-3"
                                >
                                    <div
                                        className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f7b731]/10
                      text-sm
                      text-[#f7b731]
                    "
                                    >
                                        <i className={service.icon}></i>
                                    </div>

                                    <div>
                                        <strong className="block text-sm text-white">
                                            {service.title}
                                        </strong>

                                        <p className="mt-1 text-xs text-gray-400">
                                            {service.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                {/* STAY CONNECTED */}
                <ScrollReveal delay={300}>
                    <div>
                        <h3 className="mb-5 text-lg font-semibold text-white">
                            Stay Connected
                        </h3>

                        <p className="text-sm leading-6 text-gray-300">
                            Subscribe to our newsletter and stay updated with our
                            latest news and events.
                        </p>

                        {/* NEWSLETTER */}
                        <form
                            onSubmit={(event) => event.preventDefault()}
                            className="
                mt-5
                flex
                overflow-hidden
                rounded-md
                border
                border-white/10
                bg-white/5
              "
                        >
                            <input
                                type="email"
                                placeholder="Your email address"
                                required
                                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-gray-500
                "
                            />

                            <button
                                type="submit"
                                aria-label="Subscribe"
                                className="
                  flex
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  bg-[#f7b731]
                  text-[#0b0b25]
                  transition-colors
                  duration-300
                  hover:bg-[#e5a91f]
                "
                            >
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </form>

                        {/* SOCIAL LINKS */}
                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href="#"
                                aria-label="Facebook"
                                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  text-sm
                  text-gray-300
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#f7b731]
                  hover:bg-[#f7b731]
                  hover:text-[#0b0b25]
                "
                            >
                                <i className="fab fa-facebook-f"></i>
                            </a>

                            <a
                                href="#"
                                aria-label="Instagram"
                                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  text-sm
                  text-gray-300
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#f7b731]
                  hover:bg-[#f7b731]
                  hover:text-[#0b0b25]
                "
                            >
                                <i className="fab fa-instagram"></i>
                            </a>

                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  text-sm
                  text-gray-300
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#f7b731]
                  hover:bg-[#f7b731]
                  hover:text-[#0b0b25]
                "
                            >
                                <i className="fab fa-linkedin-in"></i>
                            </a>

                            <a
                                href="#"
                                aria-label="YouTube"
                                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  text-sm
                  text-gray-300
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#f7b731]
                  hover:bg-[#f7b731]
                  hover:text-[#0b0b25]
                "
                            >
                                <i className="fab fa-youtube"></i>
                            </a>
                        </div>
                    </div>
                </ScrollReveal>
            </div>

            {/* FOOTER BOTTOM */}
            <ScrollReveal delay={400}>
                <div
                    className="
            relative
            mx-auto
            flex
            max-w-7xl
            flex-col
            gap-3
            pt-6
            text-xs
            text-gray-400
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
                >
                    <p>
                        &copy; 2025 Living Faith Church Iguosa. All Rights Reserved.
                    </p>

                    <p className="flex items-center gap-1">
                        Building Lives, Raising Champions
                        <i className="fas fa-heart text-[#f7b731]"></i>
                    </p>
                </div>
            </ScrollReveal>
        </footer>
    );
}

export default Footer;