import { upcomingEvent } from "../../data/homeData";

function EventCard() {
    return (
        <article
            className="
        w-full
        max-w-full
        rounded-xl
        bg-white
        p-6
        text-[#030e5c]
        shadow-[0_10px_30px_#ceceff]

        transition-all
        duration-500

        dark:bg-[#181a38]
        dark:text-white
        dark:shadow-black/30

        md:max-w-[390px]
        lg:max-w-[520px]
        lg:min-w-[400px]
      "
        >
            {/* HEADER */}
            <div className="flex items-center gap-4">
                <div
                    className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-[#f7b731]/15
            text-xl
            text-[#f7b731]
          "
                >
                    <i className="fas fa-calendar-day"></i>
                </div>

                <div>
                    <span
                        className="
              text-xs
              font-bold
              tracking-wider
              text-[#bd1717]
              dark:text-[#f7b731]
            "
                    >
                        {upcomingEvent.label}
                    </span>

                    <h3 className="mt-1 text-lg font-semibold">
                        {upcomingEvent.title}
                    </h3>
                </div>
            </div>

            {/* EVENT DETAILS */}
            <div className="my-7 space-y-5 text-sm">
                {/* DATE */}
                <div className="flex items-center gap-3">
                    <i className="far fa-calendar-check w-5 text-lg text-[#bd1717] dark:text-[#f7b731]"></i>

                    <p>{upcomingEvent.date}</p>
                </div>

                {/* TIME */}
                <div className="flex items-center gap-3">
                    <i className="far fa-clock w-5 text-lg text-[#bd1717] dark:text-[#f7b731]"></i>

                    <p>{upcomingEvent.time}</p>
                </div>

                {/* LOCATION */}
                <div className="flex items-start gap-3">
                    <i className="fas fa-location-dot w-5 pt-1 text-lg text-[#bd1717] dark:text-[#f7b731]"></i>

                    <p className="leading-6">
                        {upcomingEvent.location}
                    </p>
                </div>
            </div>

            {/* BUTTON */}
            <button
                type="button"
                className="
          flex
          w-full
          items-center
          justify-center
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
                View All Events

                <i className="fas fa-arrow-right ml-2"></i>
            </button>
        </article>
    );
}

export default EventCard;