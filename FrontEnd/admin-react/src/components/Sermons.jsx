import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBookOpen,
    faLayerGroup,
    faPlayCircle,
    faSearch,
    faSyncAlt,
    faEye,
    faPen,
    faTrash,
    faChevronLeft,
    faChevronRight
} from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";

const latestSermons = [
    {
        id: 1,
        title: "Walking By Faith",
        speaker: "Pastor Tobore",
        date: "2 hours ago",
        thumbnail: "/media/Walking By Faith Thumbnail.jpg"
    },
    {
        id: 2,
        title: "The Power of Prayer",
        speaker: "Pastor Tobore",
        date: "5 hours ago",
        thumbnail: "/media/The Power of Prayer Thumbnail.jpg"
    },
    {
        id: 3,
        title: "Living a Life of Purpose",
        speaker: "Pastor Paul",
        date: "1 day ago",
        thumbnail: "/media/Living a Life of Purpose Thumbnail.jpg"
    },
    {
        id: 4,
        title: "The Power of Consecration",
        speaker: "Pastor Paul",
        date: "2 days ago",
        thumbnail: "/media/The Power of Consecration Thumbnail.jpg"
    }
];

const sermonSummary = [
    {
        title: "Total Sermons",
        value: "128",
        icon: faBookOpen
    },
    {
        title: "Categories",
        value: "8",
        icon: faLayerGroup
    },
    {
        title: "Total Views",
        value: "24.5K",
        icon: faPlayCircle
    }
];

const Sermons = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    return (
        <section className="sermons-page">

            <div className="flex gap-6 justify-between">


                <main className="dashboard-content">

                    {/* Page heading */}
                    <div className="page-heading mb-7">
                        <div>
                            <h2 className="text-xl font-bold">
                                Sermons
                            </h2>

                            <p className="text-xs text-slate-500 mt-1">
                                Manage, update and organize your sermons.
                            </p>
                        </div>
                    </div>

                    {/* Summary cards */}
                    <section className="sermon-summary grid grid-cols-3 gap-[15px] mb-[18px]">
                        {sermonSummary.map((summary, index) => (
                            <div
                                key={summary.title}
                                className="summary-card flex items-center gap-[14px] p-[18px] bg-[var(--card-background)] shadow-[0_5px_30px_var(--card-shadow)] rounded-[14px] cursor-pointer transition-transform duration-300 hover:-translate-y-[5px]"
                            >
                                <div
                                    className="summary-icon w-[42px] h-[42px] flex items-center justify-center rounded-full"
                                    style={{
                                        backgroundColor:
                                            index === 0
                                                ? "#eee9ff"
                                                : index === 1
                                                    ? "#e5f7ed"
                                                    : "#e7efff",

                                        color:
                                            index === 0
                                                ? "#7055df"
                                                : index === 1
                                                    ? "#20a468"
                                                    : "#4878df"
                                    }}
                                >
                                    <FontAwesomeIcon icon={summary.icon} />
                                </div>

                                <div>
                                    <span className="block mb-[5px] text-[11px] text-slate-500">
                                        {summary.title}
                                    </span>

                                    <h3 className="text-[23px] font-bold">
                                        {summary.value}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="sermon-toolbar flex items-center gap-3 p-4 mb-[18px] bg-[var(--card-background)] shadow-[0_5px_20px_var(--card-shadow)] rounded-[14px]">

                        {/* Search */}
                        <div className="search-field w-1/2 relative">

                            <div className="sermon-search w-full h-10 flex items-center gap-[9px] px-3 border border-[#e8ebf0] rounded-lg">

                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="text-[#929bab] text-[13px]"
                                />

                                <input
                                    type="text"
                                    placeholder="Search sermons..."
                                    className="w-full border-none outline-none bg-transparent text-[12px] text-[var(--text)]"
                                />

                            </div>

                            <div className="search-suggestions absolute left-0 top-[50px] z-10 w-full max-h-[350px] overflow-auto bg-[var(--card-background)] shadow-[0_10px_30px_var(--card-shadow)] rounded-[10px]">
                            </div>

                        </div>

                        {/* Category */}
                        <select
                            className="min-w-[150px] h-10 px-3 border border-[#e8ebf0] rounded-lg bg-transparent text-[#596274] text-[11px] outline-none"
                        >
                            <option value="all">
                                All Categories
                            </option>
                        </select>

                        {/* Speaker */}
                        <select
                            className="min-w-[150px] h-10 px-3 border border-[#e8ebf0] rounded-lg bg-transparent text-[#596274] text-[11px] outline-none"
                        >
                            <option value="all">
                                All Speakers
                            </option>
                        </select>

                    </section>

                    {/* Table heading */}
                    <div className="table-header flex items-center justify-between p-5">

                        <div>
                            <h3 className="text-[14px] font-semibold mb-1">
                                All Sermons
                            </h3>

                            <span className="text-[10px] text-slate-500">
                                Showing your available sermons
                            </span>
                        </div>

                        <button
                            type="button"
                            className="refresh-btn flex items-center gap-[7px] px-3 py-[9px] border border-[#e8ebf0] rounded-[7px] bg-[var(--card-background)] text-[var(--text)] text-[10px]"
                        >
                            <FontAwesomeIcon icon={faSyncAlt} />
                            Refresh
                        </button>

                    </div>

                    <section className="sermon-table-card bg-[var(--card-background)] shadow-[0_10px_30px_var(--card-shadow)] rounded-[14px] overflow-hidden">

                        <div className="table-wrapper w-full overflow-x-auto">

                            <table className="w-full min-w-[700px] border-collapse">

                                <thead>
                                    <tr>
                                        <th className="px-[18px] py-[13px] text-left text-[9px] font-bold uppercase tracking-[0.7px] text-[#6060ad] whitespace-nowrap">
                                            Sermon
                                        </th>

                                        <th className="px-[18px] py-[13px] text-left text-[9px] font-bold uppercase tracking-[0.7px] text-[#6060ad] whitespace-nowrap">
                                            Speaker
                                        </th>

                                        <th className="px-[18px] py-[13px] text-left text-[9px] font-bold uppercase tracking-[0.7px] text-[#6060ad] whitespace-nowrap">
                                            Category
                                        </th>

                                        <th className="px-[18px] py-[13px] text-left text-[9px] font-bold uppercase tracking-[0.7px] text-[#6060ad] whitespace-nowrap">
                                            Date
                                        </th>

                                        <th className="px-[18px] py-[13px] text-left text-[9px] font-bold uppercase tracking-[0.7px] text-[#6060ad] whitespace-nowrap">
                                            Duration
                                        </th>

                                        <th className="px-[18px] py-[13px] text-left text-[9px] font-bold uppercase tracking-[0.7px] text-[#6060ad] whitespace-nowrap">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {/* Sermon rows will go here */}
                                    <tr className="transition-colors duration-200 hover:bg-[var(--hover)]">

                                        {/* Sermon */}
                                        <td className="px-[18px] py-[14px] border-t border-[var(--card-shadow)] text-[10px] whitespace-nowrap">

                                            <div className="flex items-center gap-[11px] min-w-[220px]">

                                                <img
                                                    src="/media/Walking By Faith Thumbnail.jpg"
                                                    alt="Walking By Faith"
                                                    className="w-12 h-[38px] object-cover rounded-[6px]"
                                                />

                                                <div>
                                                    <strong className="block mb-1 text-[11px] font-semibold">
                                                        Walking By Faith
                                                    </strong>

                                                    <span className="text-[9px] text-[#969eab]">
                                                        Pastor Tobore
                                                    </span>
                                                </div>

                                            </div>

                                        </td>

                                        {/* Speaker */}
                                        <td className="px-[18px] py-[14px] border-t border-[var(--card-shadow)] text-[10px] whitespace-nowrap">
                                            Pastor Tobore
                                        </td>

                                        {/* Category */}
                                        <td className="px-[18px] py-[14px] border-t border-[var(--card-shadow)] text-[10px] whitespace-nowrap">

                                            <span className="inline-block px-2 py-[5px] rounded-[5px] bg-[#eee9ff] text-[#7055df] text-[9px]">
                                                Faith
                                            </span>

                                        </td>

                                        {/* Date */}
                                        <td className="px-[18px] py-[14px] border-t border-[var(--card-shadow)] text-[10px] whitespace-nowrap">
                                            June 17, 2026
                                        </td>

                                        {/* Duration */}
                                        <td className="px-[18px] py-[14px] border-t border-[var(--card-shadow)] text-[10px] whitespace-nowrap">
                                            45:00
                                        </td>

                                        {/* Actions */}
                                        <td className="px-[18px] py-[14px] border-t border-[var(--card-shadow)]">

                                            <div className="flex items-center gap-[6px]">

                                                <button className="w-[30px] h-[30px] flex items-center justify-center border-none rounded-[6px] bg-[#edf3ff] text-[#4d75d9] text-[11px]">
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>

                                                <button className="w-[30px] h-[30px] flex items-center justify-center border-none rounded-[6px] bg-[#fff5e8] text-[#df8a2d] text-[11px]">
                                                    <FontAwesomeIcon icon={faPen} />
                                                </button>

                                                <button className="w-[30px] h-[30px] flex items-center justify-center border-none rounded-[6px] bg-[#ffedf0] text-[#dc6378] text-[11px]">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                </tbody>

                            </table>

                        </div>

                        {/* Pagination */}
                        <div className="pagination flex items-center justify-between px-5 py-4 border-t border-[var(--border)] text-[10px] text-slate-500">

                            <span>
                                Showing 1–3 of 128 sermons
                            </span>

                            <div className="pagination-buttons flex items-center gap-[5px]">

                                <button
                                    disabled
                                    className="min-w-[29px] h-[29px] border-none rounded-[6px] bg-[var(--background)] text-[#697385] text-[10px] opacity-40 cursor-not-allowed"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>

                                <button
                                    className="min-w-[29px] h-[29px] border-none rounded-[6px] bg-[var(--active-theme-color)] text-white text-[10px]"
                                >
                                    1
                                </button>

                                <button
                                    className="min-w-[29px] h-[29px] border-none rounded-[6px] bg-[var(--background)] text-[#697385] text-[10px]"
                                >
                                    2
                                </button>

                                <button
                                    className="min-w-[29px] h-[29px] border-none rounded-[6px] bg-[var(--background)] text-[#697385] text-[10px]"
                                >
                                    3
                                </button>

                                <span className="px-[3px]">
                                    ...
                                </span>

                                <button
                                    className="min-w-[29px] h-[29px] border-none rounded-[6px] bg-[var(--background)] text-[#697385] text-[10px]"
                                >
                                    43
                                </button>

                                <button
                                    className="min-w-[29px] h-[29px] border-none rounded-[6px] bg-[var(--background)] text-[#697385] text-[10px]"
                                >
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>

                        </div>

                    </section>

                </main>

                <aside className="">

                    <h3 className="text-[1.15rem] font-bold mb-4 ml-1 tracking-[-0.3px]">
                        Latest Sermons Added
                    </h3>

                    <div className="bg-[var(--card-background)] rounded-[24px] p-5 shadow-[0_10px_20px_var(--card-shadow)]">

                        <ul className="flex flex-col gap-5">

                            {latestSermons.map((sermon) => (
                                <li
                                    key={sermon.id}
                                    className="flex gap-[14px]"
                                >

                                    <img
                                        src={sermon.thumbnail}
                                        // alt={sermon.title}
                                        className="w-12 h-[42px] rounded-full object-cover shrink-0 shadow-[0_2px_5px_#0000000d]"
                                    />

                                    <div className="flex flex-col gap-[2px]">

                                        <p className="text-[0.9rem] leading-[1.35] m-0 text-[var(--text)]">
                                            <span className="font-bold">
                                                {sermon.title}
                                            </span>

                                            {" "}

                                            <span className="font-medium text-slate-500 text-xs">
                                                by {sermon.speaker}
                                            </span>
                                        </p>

                                        <p className="text-[11px] text-slate-500 m-0">
                                            {sermon.date}
                                        </p>

                                    </div>

                                </li>
                            ))}

                        </ul>

                    </div>

                    <div className="mt-5">

                        <button
                            type="button"
                            onClick={() => setShowAddModal(true)}
                            className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                p-3
                border-2
                border-dashed
                border-[var(--text)]
                rounded-[16px]
                bg-transparent
                text-[var(--text)]
                text-[0.9rem]
                font-semibold
                transition-all
                duration-200
                hover:bg-[var(--background)]
            "
                        >
                            <span className="text-[1.2rem]">+</span>
                            Add Sermon
                        </button>

                    </div>

                </aside>

            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-[#0a1220a6] backdrop-blur-[3px]">

                    {/* Modal */}
                    <div
                        className="
                absolute
                top-1/2
                left-1/2
                -translate-x-1/2
                -translate-y-1/2

                w-[min(92%,650px)]
                max-h-[90vh]

                p-[10px]

                bg-[var(--card-background)]

                rounded-[15px]

                shadow-[0_25px_80px_#00000040]

                overflow-hidden
            "
                    >

                        {/* =========================
                MODAL HEADER
            ========================== */}
                        <div
                            className="
                    flex
                    items-start
                    justify-between

                    px-[25px]
                    py-[22px]

                    border-b
                    border-[#e8ebf0]
                "
                        >

                            <div>

                                <h2
                                    className="
                            mb-[5px]
                            text-[18px]
                            font-semibold
                            text-[#6060ad]
                        "
                                >
                                    Add New Sermon
                                </h2>

                                <p className="text-[11px] text-slate-500">
                                    Add a new sermon to your church library.
                                </p>

                            </div>


                            {/* Close button */}
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setThumbnailFile(null);
                                    setVideoFile(null);
                                }}
                                className="
                        w-8
                        h-8

                        flex
                        items-center
                        justify-center

                        border-none
                        rounded-[7px]

                        bg-[#d6d6d6]

                        text-[#687284]
                        text-[14px]

                        transition-all
                        duration-200

                        hover:bg-[#eceef1]
                        hover:text-[#222b3b]
                    "
                            >
                                ×
                            </button>

                        </div>


                        {/* =========================
                FORM
            ========================== */}
                        <form
                            className="
                    max-h-[calc(90vh-85px)]
                    overflow-y-auto
                    p-[25px]
                "
                            onSubmit={(event) => {
                                event.preventDefault();
                            }}
                        >

                            {/* =========================
                    SERMON TITLE
                ========================== */}
                            <div className="mb-[18px]">

                                <label
                                    className="
                            block
                            mb-[7px]

                            text-[11px]
                            font-semibold
                            text-[var(--text)]
                        "
                                >
                                    Sermon Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Enter sermon title"
                                    required
                                    className="
                            w-full
                            h-[42px]

                            px-3

                            border-none
                            rounded-[8px]

                            bg-[var(--background)]

                            text-[12px]
                            text-[var(--text)]

                            outline-none

                            placeholder:text-[#a7aebb]

                            focus:ring-[3px]
                            focus:ring-[#087f5b14]
                        "
                                />

                            </div>


                            {/* =========================
                    SPEAKER + CATEGORY
                ========================== */}
                            <div className="grid grid-cols-2 gap-[15px]">

                                {/* Speaker */}
                                <div className="mb-[18px]">

                                    <label
                                        className="
                                block
                                mb-[7px]

                                text-[11px]
                                font-semibold
                                text-[var(--text)]
                            "
                                    >
                                        Speaker
                                    </label>

                                    <input
                                        type="text"
                                        name="speaker"
                                        placeholder="e.g. Pastor Tobore"
                                        required
                                        className="
                                w-full
                                h-[42px]

                                px-3

                                border-none
                                rounded-[8px]

                                bg-[var(--background)]

                                text-[12px]
                                text-[var(--text)]

                                outline-none

                                placeholder:text-[#a7aebb]

                                focus:ring-[3px]
                                focus:ring-[#087f5b14]
                            "
                                    />

                                </div>


                                {/* Category */}
                                <div className="mb-[18px]">

                                    <label
                                        className="
                                block
                                mb-[7px]

                                text-[11px]
                                font-semibold
                                text-[var(--text)]
                            "
                                    >
                                        Category
                                    </label>

                                    <select
                                        name="category"
                                        required
                                        className="
                                w-full
                                h-[42px]

                                px-3

                                border-none
                                rounded-[8px]

                                bg-[var(--background)]

                                text-[12px]
                                text-[var(--text)]

                                outline-none

                                focus:ring-[3px]
                                focus:ring-[#087f5b14]
                            "
                                    >
                                        <option value="">
                                            Select category
                                        </option>

                                        <option value="Faith">
                                            Faith
                                        </option>

                                        <option value="Prayer">
                                            Prayer
                                        </option>

                                        <option value="Teaching">
                                            Teaching
                                        </option>

                                        <option value="Worship">
                                            Worship
                                        </option>

                                        <option value="Praise">
                                            Praise
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* =========================
                    DATE + DURATION
                ========================== */}
                            <div className="grid grid-cols-2 gap-[15px]">

                                {/* Date */}
                                <div className="mb-[18px]">

                                    <label
                                        className="
                                block
                                mb-[7px]

                                text-[11px]
                                font-semibold
                                text-[var(--text)]
                            "
                                    >
                                        Sermon Date
                                    </label>

                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        className="
                                w-full
                                h-[42px]

                                px-3

                                border-none
                                rounded-[8px]

                                bg-[var(--background)]

                                text-[12px]
                                text-[var(--text)]

                                outline-none

                                focus:ring-[3px]
                                focus:ring-[#087f5b14]
                            "
                                    />

                                </div>


                                {/* Duration */}
                                <div className="mb-[18px]">

                                    <label
                                        className="
                                block
                                mb-[7px]

                                text-[11px]
                                font-semibold
                                text-[var(--text)]
                            "
                                    >
                                        Duration
                                    </label>

                                    <input
                                        type="text"
                                        name="duration"
                                        placeholder="e.g. 45:00"
                                        required
                                        className="
                                w-full
                                h-[42px]

                                px-3

                                border-none
                                rounded-[8px]

                                bg-[var(--background)]

                                text-[12px]
                                text-[var(--text)]

                                outline-none

                                placeholder:text-[#a7aebb]

                                focus:ring-[3px]
                                focus:ring-[#087f5b14]
                            "
                                    />

                                </div>

                            </div>


                            {/* =========================
                    DESCRIPTION
                ========================== */}
                            <div className="mb-[18px]">

                                <label
                                    className="
                            block
                            mb-[7px]

                            text-[11px]
                            font-semibold
                            text-[var(--text)]
                        "
                                >
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    rows="5"
                                    placeholder="Write a short description of the sermon..."
                                    required
                                    className="
                            w-full
                            min-h-[110px]

                            p-3

                            border-none
                            rounded-[8px]

                            bg-[var(--background)]

                            text-[12px]
                            text-[var(--text)]

                            outline-none

                            resize-y

                            leading-[1.5]

                            placeholder:text-[#a7aebb]

                            focus:ring-[3px]
                            focus:ring-[#087f5b14]
                        "
                                />

                            </div>


                            {/* =========================
                    THUMBNAIL
                ========================== */}
                            <div className="mb-[18px]">

                                <label
                                    className="
                            block
                            mb-[7px]

                            text-[11px]
                            font-semibold
                            text-[var(--text)]
                        "
                                >
                                    Thumbnail
                                </label>


                                <div
                                    className="
                            relative

                            min-h-[68px]

                            flex
                            items-center

                            gap-3

                            px-[14px]
                            py-3

                            border
                            border-dashed
                            border-[#cfd5dd]

                            rounded-[9px]

                            bg-transparent

                            overflow-hidden

                            transition-all
                            duration-200

                            hover:border-[#1d1d46]
                            hover:bg-[#f8fcfa]
                        "
                                >

                                    {/* Icon */}
                                    <div
                                        className="
                                w-[38px]
                                h-[38px]
                                shrink-0

                                flex
                                items-center
                                justify-center

                                rounded-[8px]

                                bg-[#eaf7f1]

                                text-[#1d1d46]

                                text-[15px]
                            "
                                    >
                                        🖼️
                                    </div>


                                    {/* Text */}
                                    <div className="flex-1 min-w-0">

                                        <strong
                                            className="
                                    block
                                    mb-1

                                    text-[11px]
                                    text-[#394253]
                                "
                                        >
                                            Choose sermon thumbnail
                                        </strong>

                                        <span className="block text-[9px] text-[#929baa]">
                                            {thumbnailFile
                                                ? thumbnailFile.name
                                                : "JPG, PNG or WEBP"}
                                        </span>

                                    </div>


                                    {/* Invisible actual file input */}
                                    <input
                                        type="file"
                                        name="thumbnail"
                                        accept="image/*"
                                        onChange={(event) => {
                                            setThumbnailFile(event.target.files[0]);
                                        }}
                                        className="
        absolute
        inset-0
        w-full
        h-full
        opacity-0
        cursor-pointer
    "
                                    />

                                </div>

                            </div>


                            {/* =========================
                    VIDEO
                ========================== */}
                            <div className="mb-[18px]">

                                <label
                                    className="
                            block
                            mb-[7px]

                            text-[11px]
                            font-semibold
                            text-[var(--text)]
                        "
                                >
                                    Sermon Video
                                </label>


                                <div
                                    className="
                            relative

                            min-h-[68px]

                            flex
                            items-center

                            gap-3

                            px-[14px]
                            py-3

                            border
                            border-dashed
                            border-[#cfd5dd]

                            rounded-[9px]

                            bg-transparent

                            overflow-hidden

                            transition-all
                            duration-200

                            hover:border-[#1d1d46]
                            hover:bg-[#f8fcfa]
                        "
                                >

                                    {/* Icon */}
                                    <div
                                        className="
                                w-[38px]
                                h-[38px]
                                shrink-0

                                flex
                                items-center
                                justify-center

                                rounded-[8px]

                                bg-[#eaf7f1]

                                text-[#1d1d46]

                                text-[15px]
                            "
                                    >
                                        🎥
                                    </div>


                                    {/* Text */}
                                    <div className="flex-1 min-w-0">

                                        <strong
                                            className="
                                    block
                                    mb-1

                                    text-[11px]
                                    text-[#394253]
                                "
                                        >
                                            Choose sermon video
                                        </strong>

                                        <span className="block text-[9px] text-[#929baa]">
                                            {videoFile
                                                ? videoFile.name
                                                : "MP4, WebM or MOV"}
                                        </span>

                                    </div>


                                    {/* Invisible file input */}
                                    <input
                                        type="file"
                                        name="video"
                                        accept="video/*"
                                        onChange={(event) => {
                                            setVideoFile(event.target.files[0]);
                                        }}
                                        className=" absolute inset-0 w-full h-full opacity-0 cursor-pointer
    "
                                    />
                                </div>

                            </div>


                            {/* =========================
                    MODAL ACTIONS
                ========================== */}
                            <div
                                className="
                        flex
                        justify-end
                        gap-[10px]

                        pt-2
                    "
                            >

                                {/* Cancel */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setThumbnailFile(null);
                                        setVideoFile(null);
                                    }}
                                    className="
                            h-10

                            px-[17px]

                            border-none
                            rounded-[8px]

                            bg-[var(--background)]

                            text-[#657084]
                            text-[11px]
                            font-semibold

                            transition-colors
                            duration-200

                            hover:bg-[#f7f8fa]
                        "
                                >
                                    Cancel
                                </button>


                                {/* Add Sermon */}
                                <button
                                    type="submit"
                                    className="
                            h-10

                            px-[17px]

                            flex
                            items-center
                            gap-2

                            border-none
                            rounded-[8px]

                            bg-[#1d1d46]

                            text-white
                            text-[11px]
                            font-semibold

                            transition-all
                            duration-200

                            hover:bg-[#3a3a7d]
                            hover:-translate-y-[1px]
                        "
                                >
                                    <span>+</span>
                                    Add Sermon
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </section>
    );
};

export default Sermons;