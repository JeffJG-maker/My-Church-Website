import { useEffect, useMemo, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {

    faCalendarAlt,

    faSearch,

    faPlus,

    faPen,

    faTrash,

    faTimes,

    faMapMarkerAlt,

    faFilter,

} from "@fortawesome/free-solid-svg-icons";

const emptyEventForm = {

    title: "",

    date: "",

    time: "",

    location: "",

    description: "",

    image: "",

    status: "Upcoming",

};

const SERVER_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

const API_BASE_URL = `${SERVER_URL}/api/events`;

const MEDIA_API_URL = `${SERVER_URL}/api/media`;

const toDateInputValue = (value) => {

    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

};

const getEventStatus = (dateValue) => {

    if (!dateValue) return "Upcoming";

    const eventDate = new Date(`${toDateInputValue(dateValue)}T00:00:00`);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return eventDate < today ? "Completed" : "Upcoming";

};

const normalizeEvent = (event) => ({

    ...event,

    date: toDateInputValue(event.date),

    title: event.title || "Untitled event",

    time: event.time || "",

    location: event.location || "",

    description: event.description || "",

    image: event.image || "",

    status: getEventStatus(event.date),

});

const formatEventDate = (date) => {

    if (!date) return "Date not set";

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-US", {

        month: "short",

        day: "numeric",

        year: "numeric",

    });

};

const Events = ({ token }) => {

    const [events, setEvents] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [isSaving, setIsSaving] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");

    const [showModal, setShowModal] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState(emptyEventForm);

    const [formError, setFormError] = useState("");

    const [notice, setNotice] = useState("");

    const [mediaImages, setMediaImages] = useState([]);

    const [isLoadingMedia, setIsLoadingMedia] = useState(false);

    const [mediaLoadError, setMediaLoadError] = useState("");

    const reduceMotion = useReducedMotion();

    useEffect(() => {

        const loadEvents = async () => {

            setIsLoading(true);

            try {

                const response = await fetch(API_BASE_URL);

                const data = await response.json();

                if (!response.ok) {

                    throw new Error(data.message || "Unable to load events.");

                }

                setEvents(Array.isArray(data) ? data.map(normalizeEvent) : []);

            } catch (error) {

                setNotice(error.message || "Could not connect to the events API. Make sure the backend is running.");

            } finally {

                setIsLoading(false);

            }

        };

        loadEvents();

    }, []);

    useEffect(() => {

        if (!showModal) return;

        const loadMediaImages = async () => {

            setIsLoadingMedia(true);

            setMediaLoadError("");

            try {

                const response = await fetch(MEDIA_API_URL);

                const data = await response.json();

                if (!response.ok || data.success === false) {

                    throw new Error(data.message || "Unable to load images from the Media Library.");

                }

                const items = Array.isArray(data) ? data : data.items;

                const images = (items || [])

                    .filter((item) => item.kind === "image" && item.url)

                    .map((item) => ({

                        ...item,

                        id: item._id || item.id || item.url,

                        url: item.url.startsWith("http")

                            ? item.url

                            : `${SERVER_URL}${item.url.startsWith("/") ? "" : "/"}${item.url}`,

                    }));

                setMediaImages(images);

            } catch (error) {

                setMediaLoadError(error.message || "Could not connect to the Media Library.");

            } finally {

                setIsLoadingMedia(false);

            }

        };

        loadMediaImages();

    }, [showModal]);

    const filteredEvents = useMemo(() => {

        const query = searchTerm.trim().toLowerCase();

        return events

            .filter((event) => {

                const matchesSearch =

                    !query ||

                    event.title.toLowerCase().includes(query) ||

                    event.location.toLowerCase().includes(query) ||

                    event.description.toLowerCase().includes(query);

                const matchesStatus =

                    statusFilter === "all" ||

                    event.status.toLowerCase() === statusFilter.toLowerCase();

                return matchesSearch && matchesStatus;

            })

            .sort((a, b) => (a.date || "").localeCompare(b.date || ""));

    }, [events, searchTerm, statusFilter]);

    const upcomingCount = events.filter((event) => getEventStatus(event.date) === "Upcoming").length;

    const pastCount = events.filter((event) => getEventStatus(event.date) === "Completed").length;

    const resetForm = () => {

        setForm(emptyEventForm);

        setEditingId(null);

        setFormError("");

    };

    const openAddModal = () => {

        resetForm();

        setNotice("");

        setShowModal(true);

    };

    const openEditModal = (event) => {

        setForm({

            title: event.title,

            date: toDateInputValue(event.date),

            time: event.time,

            location: event.location,

            description: event.description,

            image: event.image || "",

            status: getEventStatus(event.date),

        });

        setEditingId(event.id);

        setFormError("");

        setNotice("");

        setShowModal(true);

    };

    const closeModal = () => {

        setShowModal(false);

        resetForm();

    };

    const handleFormChange = (event) => {

        const { name, value } = event.target;

        setForm((current) => ({ ...current, [name]: value }));

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setFormError("");

        if (!form.title.trim() || !form.date || !form.time || !form.location.trim()) {

            setFormError("Please complete the event title, date, time, and location.");

            return;

        }

        const payload = {

            title: form.title.trim(),

            date: new Date(`${form.date}T00:00:00`).toISOString(),

            time: form.time,

            location: form.location.trim(),

            description: form.description.trim(),

            image: form.image || "",

            label: "UPCOMING EVENT",

            isPublished: true,

        };

        setIsSaving(true);

        try {

            const isEditing = editingId !== null;

            const response = await fetch(

                isEditing ? `${API_BASE_URL}/${editingId}` : API_BASE_URL,

                {

                    method: isEditing ? "PUT" : "POST",

                    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },

                    body: JSON.stringify(payload),

                }

            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(data.message || `Failed to ${isEditing ? "update" : "create"} event.`);

            }

            const savedEvent = normalizeEvent(data);

            if (isEditing) {

                setEvents((current) => current.map((item) => item.id === savedEvent.id ? savedEvent : item));

                setNotice("Event updated successfully.");

            } else {

                setEvents((current) => [...current, savedEvent]);

                setNotice("Event added successfully.");

            }

            closeModal();

        } catch (error) {

            setFormError(error.message || "Something went wrong while saving the event.");

        } finally {

            setIsSaving(false);

        }

    };

    const handleDelete = async (eventItem) => {

        if (!window.confirm(`Delete "${eventItem.title}"? This cannot be undone.`)) {

            return;

        }

        try {

            const response = await fetch(`${API_BASE_URL}/${eventItem.id}`, {

                method: "DELETE",

                headers: token ? { Authorization: `Bearer ${token}` } : {},

            });

            const data = await response.json();

            if (!response.ok) {

                throw new Error(data.message || "Failed to delete event.");

            }

            setEvents((current) => current.filter((item) => item.id !== eventItem.id));

            setNotice("Event deleted successfully.");

        } catch (error) {

            setNotice(error.message || "Something went wrong while deleting the event.");

        }

    };

    const sectionMotion = reduceMotion

        ? {}

        : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: "easeOut" } };

    return (

        <motion.section {...sectionMotion} className="min-w-0 space-y-6 text-[var(--text)]">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted-text)]">Church administration</p>

                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Events</h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-text)]">

                        Plan services, coordinate programmes, and keep your church calendar organised.

                    </p>

                </div>

                <button

                    type="button"

                    onClick={openAddModal}

                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#C51D27] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#A81720] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C51D27] focus-visible:ring-offset-2 dark:bg-[#E45A61] dark:text-slate-950 dark:hover:bg-[#F0787E]"

                >

                    <FontAwesomeIcon icon={faPlus} />

                    Add Event

                </button>

            </div>

            {notice && (

                <div

                    role="status"

                    className="flex items-center justify-between gap-3 rounded-lg  bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-sm  dark:bg-emerald-950/40 dark:text-emerald-200"

                >

                    <span>{notice}</span>

                    <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E7E5E3] text-[#333333] transition-all duration-300 hover:-translate-y-0.5 hover:text-[#C51D27] dark:bg-[#202124] dark:text-[#EAEAEA] dark:hover:text-[#F0787E]">

                        <FontAwesomeIcon icon={faTimes} />

                    </button>

                </div>

            )}

            <motion.section

                initial={reduceMotion ? false : { opacity: 0, y: 10 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.35, ease: "easeOut" }}

                aria-label="Event calendar overview"

                className="overflow-hidden rounded-lg bg-[var(--card-background)] shadow-[0_8px_28px_var(--card-shadow)]"

            >

                <div className="grid grid-cols-1  sm:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)] ">

                    <div className="relative flex min-h-36 items-center gap-4 overflow-hidden p-5 sm:p-6">

                        <div className="pointer-events-none absolute -right-6 -top-8 h-32 w-32 rounded-full border-[18px] border-[#C51D27]/[0.04] dark:border-white/[0.04]" />

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#C51D27] text-white shadow-sm dark:bg-violet-200 dark:text-[#C51D27]">

                            <FontAwesomeIcon icon={faCalendarAlt} className="text-lg" />

                        </div>

                        <div className="relative min-w-0">

                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">Calendar overview</p>

                            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">

                                <span className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">{events.length}</span>

                                <span className="text-sm text-[var(--muted-text)]">total events</span>

                            </div>

                        </div>

                    </div>

                    <div className="grid grid-cols-2 ">

                        <div className="flex min-w-0 flex-col justify-center p-5 sm:p-6">

                            <div className="mb-3 flex items-center gap-2">

                                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                                <span className="text-sm text-[var(--muted-text)]">Upcoming</span>

                            </div>

                            <p className="text-2xl font-semibold tabular-nums sm:text-3xl">{upcomingCount}</p>

                            <p className="mt-1 text-xs text-[var(--muted-text)]">Events still to come</p>

                        </div>

                        <div className="flex min-w-0 flex-col justify-center p-5 sm:p-6">

                            <div className="mb-3 flex items-center gap-2">

                                <span className="h-2 w-2 rounded-full bg-slate-400" />

                                <span className="text-sm text-[var(--muted-text)]">Completed</span>

                            </div>

                            <p className="text-2xl font-semibold tabular-nums sm:text-3xl">{pastCount}</p>

                            <p className="mt-1 text-xs text-[var(--muted-text)]">Events in the past</p>

                        </div>

                    </div>

                </div>

            </motion.section>

            <div className="flex flex-col gap-3 rounded-lg bg-[var(--card-background)] p-3 shadow-[0_5px_24px_var(--card-shadow)] sm:flex-row sm:items-center sm:p-4">

                <div className="relative min-w-0 flex-1">

                    <FontAwesomeIcon

                        icon={faSearch}

                        className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-text)]"

                    />

                    <input

                        type="search"

                        value={searchTerm}

                        onChange={(event) => setSearchTerm(event.target.value)}

                        placeholder="Search events..."

                        aria-label="Search events"

                        className="h-11 w-full rounded-lg bg-[var(--input-background)] pl-9 pr-3 text-sm outline-none transition focus:border-[#C51D27] focus:ring-2 focus:ring-[#C51D27]/15"

                    />

                </div>

                <div className="flex items-center gap-2">

                    <FontAwesomeIcon icon={faFilter} className="text-[var(--muted-text)]" />

                    <select

                        value={statusFilter}

                        onChange={(event) => setStatusFilter(event.target.value)}

                        aria-label="Filter events by status"

                        className="h-11 w-full rounded-lg bg-[var(--input-background)] px-3 text-sm outline-none transition focus:border-[#C51D27] focus:ring-2 focus:ring-[#C51D27]/15 sm:w-auto"

                    >

                        <option value="all">All events</option>

                        <option value="upcoming">Upcoming</option>

                        <option value="completed">Completed</option>

                    </select>

                </div>

            </div>

            {isLoading ? (

                <div className="rounded-lg bg-[var(--card-background)] px-5 py-14 text-center text-sm text-[var(--muted-text)] shadow-[0_5px_24px_var(--card-shadow)]">

                    Loading events...

                </div>

            ) : filteredEvents.length > 0 ? (

                <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 2xl:grid-cols-3">

                    {filteredEvents.map((eventItem) => {

                        const isPast = getEventStatus(eventItem.date) === "Completed";

                        const eventImageUrl = eventItem.image

                            ? eventItem.image.startsWith("http")

                                ? eventItem.image

                                : `${SERVER_URL}${eventItem.image.startsWith("/") ? "" : "/"}${eventItem.image}`

                            : "";

                        return (

                            <motion.article

                                key={eventItem.id}

                                initial={reduceMotion ? false : { opacity: 0, y: 14 }}

                                animate={{ opacity: 1, y: 0 }}

                                transition={{ duration: 0.28, ease: "easeOut" }}

                                whileHover={reduceMotion ? undefined : { y: -4 }}

                                layout={!reduceMotion}

                                className="group flex min-w-0 flex-col overflow-hidden rounded-md bg-[var(--card-background)] shadow-[0_5px_20px_var(--card-shadow)] transition-shadow duration-300 hover:shadow-[0_10px_28px_var(--card-shadow)]"

                            >

                                {/* Event image: consistent landscape crop across the grid */}

                                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--hover)]">

                                    {eventImageUrl ? (

                                        <img

                                            src={eventImageUrl}

                                            alt={eventItem.title}

                                            loading="lazy"

                                            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"

                                            onError={(event) => {

                                                event.currentTarget.style.display = "none";

                                            }}

                                        />

                                    ) : (

                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#C51D27]/10 via-[var(--card-background)] to-[var(--hover)] p-6 text-center">

                                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#C51D27]/10 text-[#C51D27] shadow-sm dark:bg-[#E45A61]/15 dark:text-[#F0787E]">

                                                <FontAwesomeIcon icon={faCalendarAlt} className="text-2xl" />

                                            </div>

                                            <span className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-text)]">

                                                Church event

                                            </span>

                                        </div>

                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                                    <div className="absolute left-4 top-4">

                                        <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-md ${isPast

                                            ? "bg-white/90 text-slate-700"

                                            : "bg-emerald-100/95 text-emerald-800"

                                            }`}>

                                            <span className={`mr-2 h-1.5 w-1.5 rounded-full ${isPast ? "bg-slate-500" : "bg-emerald-600"}`} />

                                            {isPast ? "Completed" : "Upcoming"}

                                        </span>

                                    </div>

                                </div>

                                {/* Event details */}

                                <div className="flex flex-1 min-w-0 flex-col p-5">

                                    <div className="min-w-0">

                                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C51D27] dark:text-[#F0787E]">

                                            Event programme

                                        </p>

                                        <h3 className="break-words text-lg font-bold tracking-tight text-[var(--text)] sm:text-xl">

                                            {eventItem.title}

                                        </h3>

                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--muted-text)]">

                                        <span className="inline-flex items-center gap-2">

                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-[#C51D27] dark:text-[#F0787E]" />

                                            {formatEventDate(eventItem.date)}

                                        </span>

                                        {eventItem.time && (

                                            <span className="rounded-md bg-[var(--hover)] px-2.5 py-1 text-xs font-semibold text-[var(--text)]">

                                                {eventItem.time}

                                            </span>

                                        )}

                                    </div>

                                    {eventItem.description && (

                                        <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-[var(--muted-text)]">

                                            {eventItem.description}

                                        </p>

                                    )}

                                    <div className="mt-3 flex items-start gap-2 text-sm text-[var(--muted-text)]">

                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mt-0.5 shrink-0 text-[#C51D27] dark:text-[#F0787E]" />

                                        <span className="line-clamp-2 break-words">{eventItem.location}</span>

                                    </div>

                                    <div className="mt-auto flex justify-end gap-1.5 pt-5">

                                        <button

                                            type="button"

                                            onClick={() => openEditModal(eventItem)}

                                            className="inline-flex items-center gap-2 rounded-full bg-[#E7E5E3] px-4 py-2.5 text-sm font-semibold text-[#333333] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-[#C51D27] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C51D27] dark:bg-[#202124] dark:text-[#EAEAEA] dark:hover:text-[#F0787E]"

                                        >

                                            <FontAwesomeIcon icon={faPen} />

                                            Edit

                                        </button>

                                        <button

                                            type="button"

                                            onClick={() => handleDelete(eventItem)}

                                            className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-500/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-rose-400"

                                        >

                                            <FontAwesomeIcon icon={faTrash} />

                                            Delete

                                        </button>

                                    </div>

                                </div>

                            </motion.article>

                        );

                    })}

                </div>

            ) : (

                <div className="rounded-lg bg-[var(--card-background)] px-5 py-14 text-center shadow-[0_5px_24px_var(--card-shadow)]">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#C51D27]/10 text-[#C51D27] dark:bg-[#E45A61]/10 dark:text-[#F0787E]">

                        <FontAwesomeIcon icon={faCalendarAlt} className="text-xl" />

                    </div>

                    <h3 className="font-semibold">

                        {events.length === 0 ? "No events added yet" : "No events found"}

                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-text)]">

                        {events.length === 0

                            ? "Add your first church event to start organizing upcoming programmes."

                            : "Try another search or change the status filter."}

                    </p>

                    {events.length === 0 && (

                        <button

                            type="button"

                            onClick={openAddModal}

                            className="mt-5 rounded-lg bg-[#C51D27] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A81720] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C51D27] focus-visible:ring-offset-2 dark:bg-[#E45A61] dark:text-slate-950 dark:hover:bg-[#F0787E]"

                        >

                            Add your first event

                        </button>

                    )}

                </div>

            )}

            <AnimatePresence>

                {showModal && (

                    <motion.div

                        initial={reduceMotion ? false : { opacity: 0 }}

                        animate={{ opacity: 1 }}

                        exit={{ opacity: 0 }}

                        transition={{ duration: 0.18 }}

                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"

                        onMouseDown={(event) => {

                            if (event.target === event.currentTarget) closeModal();

                        }}

                    >

                        <motion.div

                            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}

                            animate={{ opacity: 1, y: 0, scale: 1 }}

                            exit={{ opacity: 0, y: 8, scale: 0.99 }}

                            transition={{ duration: 0.2, ease: "easeOut" }}

                            role="dialog"

                            aria-modal="true"

                            aria-labelledby="event-modal-title"

                            className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-lg bg-[var(--card-background)] text-[var(--text)] shadow-2xl"

                        >

                            <div className="flex items-center justify-between p-5">

                                <div>

                                    <h2 id="event-modal-title" className="text-lg font-bold">

                                        {editingId !== null ? "Edit Event" : "Add New Event"}

                                    </h2>

                                    <p className="mt-1 text-sm text-[var(--muted-text)]">

                                        Enter the event details below.

                                    </p>

                                </div>

                                <button

                                    type="button"

                                    onClick={closeModal}

                                    aria-label="Close event form"

                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7E5E3] text-[#333333] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-[#C51D27] dark:bg-[#202124] dark:text-[#EAEAEA] dark:hover:text-[#F0787E]"

                                >

                                    <FontAwesomeIcon icon={faTimes} />

                                </button>

                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 p-5">

                                {formError && (

                                    <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">

                                        {formError}

                                    </p>

                                )}

                                <div>

                                    <label htmlFor="event-title" className="mb-1.5 block text-sm font-medium">

                                        Event title *

                                    </label>

                                    <input

                                        id="event-title"

                                        name="title"

                                        value={form.title}

                                        onChange={handleFormChange}

                                        required

                                        maxLength={120}

                                        placeholder="e.g. Sunday Worship Service"

                                        className="h-11 w-full rounded-lg bg-[var(--input-background)] px-3 text-sm outline-none transition focus:border-[#C51D27] focus:ring-2 focus:ring-[#C51D27]/15"

                                    />

                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    <div>

                                        <label htmlFor="event-date" className="mb-1.5 block text-sm font-medium">

                                            Date *

                                        </label>

                                        <input

                                            id="event-date"

                                            name="date"

                                            type="date"

                                            value={form.date}

                                            onChange={handleFormChange}

                                            required

                                            className="h-11 w-full rounded-lg bg-[var(--input-background)] px-3 text-sm outline-none transition focus:border-[#C51D27] focus:ring-2 focus:ring-[#C51D27]/15"

                                        />

                                    </div>

                                    <div>

                                        <label htmlFor="event-time" className="mb-1.5 block text-sm font-medium">

                                            Time *

                                        </label>

                                        <input

                                            id="event-time"

                                            name="time"

                                            type="time"

                                            value={form.time}

                                            onChange={handleFormChange}

                                            required

                                            className="h-11 w-full rounded-lg bg-[var(--input-background)] px-3 text-sm outline-none transition focus:border-[#C51D27] focus:ring-2 focus:ring-[#C51D27]/15"

                                        />

                                    </div>

                                </div>

                                <div>

                                    <label htmlFor="event-location" className="mb-1.5 block text-sm font-medium">

                                        Location *

                                    </label>

                                    <input

                                        id="event-location"

                                        name="location"

                                        value={form.location}

                                        onChange={handleFormChange}

                                        required

                                        placeholder="e.g. Main Auditorium"

                                        className="h-11 w-full rounded-lg bg-[var(--input-background)] px-3 text-sm outline-none transition focus:border-[#C51D27] focus:ring-2 focus:ring-[#C51D27]/15"

                                    />

                                </div>

                                <div>

                                    <div className="mb-2 flex items-center justify-between gap-3">

                                        <label className="block text-sm font-medium" htmlFor="event-image-picker">Event image</label>

                                        {form.image && (

                                            <button type="button" onClick={() => setForm((current) => ({ ...current, image: "" }))} className="rounded-full bg-[#E7E5E3] px-3.5 py-2 text-xs font-semibold text-[#333333] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-[#C51D27] dark:bg-[#202124] dark:text-[#EAEAEA] dark:hover:text-[#F0787E]">

                                                Remove image

                                            </button>

                                        )}

                                    </div>

                                    {form.image ? (

                                        <div className="mb-3 overflow-hidden rounded-lg">

                                            <img src={form.image.startsWith("http") ? form.image : `${SERVER_URL}${form.image.startsWith("/") ? "" : "/"}${form.image}`} alt="Selected event" className="h-44 w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />

                                        </div>

                                    ) : (

                                        <div className="mb-3 flex min-h-24 items-center justify-center rounded-lg border border-dashed border-[var(--muted-text)]/30 bg-[var(--hover)] px-4 text-center text-sm text-[var(--muted-text)]">

                                            No image selected. Choose a photo below, or leave this empty.

                                        </div>

                                    )}

                                    {isLoadingMedia ? (

                                        <p className="text-sm text-[var(--muted-text)]">Loading Media Library images...</p>

                                    ) : mediaLoadError ? (

                                        <p role="alert" className="text-sm text-rose-600">{mediaLoadError}</p>

                                    ) : mediaImages.length > 0 ? (

                                        <div id="event-image-picker" className="grid max-h-56 grid-cols-2 gap-3 overflow-y-auto rounded-lg p-2 sm:grid-cols-3">

                                            {mediaImages.map((image) => (

                                                <button key={image.id} type="button" onClick={() => setForm((current) => ({ ...current, image: image.url }))} aria-pressed={form.image === image.url} title={`Select ${image.name || "image"}`} className={`overflow-hidden rounded-md text-left transition ${form.image === image.url ? "ring-2 ring-[#C51D27]/70 ring-offset-2 ring-offset-[var(--card-background)]" : "hover:shadow-md"}`}>

                                                    <img src={image.url} alt={image.name || "Media library image"} loading="lazy" className="h-24 w-full object-cover" />

                                                    <span className="block truncate px-2 py-1.5 text-xs text-[var(--muted-text)]">{image.name || "Image"}</span>

                                                </button>

                                            ))}

                                        </div>

                                    ) : (

                                        <p className="rounded-lg bg-[var(--hover)] px-3 py-2 text-sm text-[var(--muted-text)]">No images found. Upload images in the Media Library first.</p>

                                    )}

                                </div>

                                <div>

                                    <label htmlFor="event-description" className="mb-1.5 block text-sm font-medium">

                                        Description

                                    </label>

                                    <textarea

                                        id="event-description"

                                        name="description"

                                        value={form.description}

                                        onChange={handleFormChange}

                                        rows={3}

                                        placeholder="Add details about this event..."

                                        className="w-full rounded-lg bg-[var(--input-background)] p-3 text-sm outline-none transition focus:border-[#C51D27] focus:ring-2 focus:ring-[#C51D27]/15"

                                    />

                                </div>

                                <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">

                                    <button

                                        type="button"

                                        onClick={closeModal}

                                        className="rounded-full bg-[#E7E5E3] px-5 py-3 text-sm font-semibold text-[#333333] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-[#C51D27] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C51D27] dark:bg-[#202124] dark:text-[#EAEAEA] dark:hover:text-[#F0787E]"

                                    >

                                        Cancel

                                    </button>

                                    <button

                                        type="submit"

                                        disabled={isSaving}

                                        className="rounded-lg bg-[#C51D27] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#A81720] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C51D27] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#E45A61] dark:text-slate-950 dark:hover:bg-[#F0787E]"

                                    >

                                        {isSaving ? "Saving..." : editingId !== null ? "Save Changes" : "Add Event"}

                                    </button>

                                </div>

                            </form>

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>

        </motion.section>

    );

};

export default Events;
