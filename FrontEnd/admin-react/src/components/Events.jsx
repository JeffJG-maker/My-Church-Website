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

const API_BASE_URL = "http://localhost:5000/api/events";
const MEDIA_API_URL = "http://localhost:5000/api/media";
const SERVER_URL = "http://localhost:5000";

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

const Events = () => {

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

                    headers: { "Content-Type": "application/json" },

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

                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:bg-teal-300 dark:text-slate-950 dark:hover:bg-teal-200"

                >

                    <FontAwesomeIcon icon={faPlus} />

                    Add Event

                </button>

            </div>

            {notice && (

                <div

                    role="status"

                    className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200/70 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"

                >

                    <span>{notice}</span>

                    <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification">

                        <FontAwesomeIcon icon={faTimes} />

                    </button>

                </div>

            )}

            <motion.section

                initial={reduceMotion ? false : { opacity: 0, y: 10 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.35, ease: "easeOut" }}

                aria-label="Event calendar overview"

                className="overflow-hidden rounded-2xl border border-[var(--border-color)]/70 bg-[var(--card-background)] shadow-[0_5px_24px_var(--card-shadow)]"

            >

                <div className="grid grid-cols-1 divide-y divide-[var(--border-color)]/70 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)] sm:divide-x sm:divide-y-0">

                    <div className="relative flex min-h-36 items-center gap-4 overflow-hidden p-5 sm:p-6">

                        <div className="pointer-events-none absolute -right-6 -top-8 h-32 w-32 rounded-full border-[18px] border-[#1a1a4c]/[0.04] dark:border-white/[0.04]" />

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a1a4c] text-white shadow-sm dark:bg-violet-200 dark:text-[#1a1a4c]">

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

                    <div className="grid grid-cols-2 divide-x divide-[var(--border-color)]/70">

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

            <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border-color)]/60 bg-[var(--card-background)] p-3 shadow-[0_5px_24px_var(--card-shadow)] sm:flex-row sm:items-center sm:p-4">

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

                        className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-background)] pl-9 pr-3 text-sm outline-none transition focus:border-[#7777bd] focus:ring-2 focus:ring-[#7777bd]/15"

                    />

                </div>

                <div className="flex items-center gap-2">

                    <FontAwesomeIcon icon={faFilter} className="text-[var(--muted-text)]" />

                    <select

                        value={statusFilter}

                        onChange={(event) => setStatusFilter(event.target.value)}

                        aria-label="Filter events by status"

                        className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none transition focus:border-[#7777bd] focus:ring-2 focus:ring-[#7777bd]/15 sm:w-auto"

                    >

                        <option value="all">All events</option>

                        <option value="upcoming">Upcoming</option>

                        <option value="completed">Completed</option>

                    </select>

                </div>

            </div>

            {isLoading ? (

                <div className="rounded-2xl border border-[var(--border-color)]/60 bg-[var(--card-background)] px-5 py-14 text-center text-sm text-[var(--muted-text)] shadow-[0_5px_24px_var(--card-shadow)]">

                    Loading events...

                </div>

            ) : filteredEvents.length > 0 ? (

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

                    {filteredEvents.map((eventItem) => {

                        const isPast = getEventStatus(eventItem.date) === "Completed";

                        return (

                            <motion.article

                                key={eventItem.id}

                                initial={reduceMotion ? false : { opacity: 0, y: 14 }}

                                animate={{ opacity: 1, y: 0 }}

                                transition={{ duration: 0.28, ease: "easeOut" }}

                                whileHover={reduceMotion ? undefined : { y: -3 }}

                                layout={!reduceMotion}

                                className="min-w-0 rounded-2xl border border-[var(--border-color)]/60 bg-[var(--card-background)] p-4 shadow-[0_5px_24px_var(--card-shadow)] transition-shadow duration-200 hover:shadow-md sm:p-5"

                            >

                                {eventItem.image && (
                                    <div className="mb-4 overflow-hidden rounded-xl bg-[var(--hover)]">
                                        <img
                                            src={eventItem.image.startsWith("http") ? eventItem.image : `${SERVER_URL}${eventItem.image.startsWith("/") ? "" : "/"}${eventItem.image}`}
                                            alt={eventItem.title}
                                            loading="lazy"
                                            className="h-44 w-full object-cover"
                                            onError={(event) => { event.currentTarget.style.display = "none"; }}
                                        />
                                    </div>
                                )}
                                <div className="flex items-start justify-between gap-3">

                                    <div className="flex min-w-0 items-start gap-3">

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a1a4c]/10 text-[#1a1a4c] dark:bg-violet-300/10 dark:text-violet-200">

                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-lg" />

                                        </div>

                                        <div className="min-w-0">

                                            <h3 className="break-words font-bold">{eventItem.title}</h3>

                                            <p className="mt-1 text-sm text-[var(--muted-text)]">

                                                {formatEventDate(eventItem.date)} · {eventItem.time}

                                            </p>

                                        </div>

                                    </div>

                                    <span

                                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${isPast

                                            ? "bg-slate-100 text-slate-600"

                                            : "bg-emerald-100 text-emerald-700"

                                            }`}

                                    >

                                        {isPast ? "Completed" : "Upcoming"}

                                    </span>

                                </div>

                                {eventItem.description && (

                                    <p className="mt-4 text-sm leading-6 text-[var(--muted-text)]">

                                        {eventItem.description}

                                    </p>

                                )}

                                <div className="mt-4 flex items-center gap-2 text-sm text-[var(--muted-text)]">

                                    <FontAwesomeIcon icon={faMapMarkerAlt} />

                                    <span className="break-words">{eventItem.location}</span>

                                </div>

                                <div className="mt-5 flex justify-end gap-2 border-t border-[var(--border-color)] pt-4">

                                    <button

                                        type="button"

                                        onClick={() => openEditModal(eventItem)}

                                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] px-3 py-2 text-sm hover:bg-[var(--hover)]"

                                    >

                                        <FontAwesomeIcon icon={faPen} />

                                        Edit

                                    </button>

                                    <button

                                        type="button"

                                        onClick={() => handleDelete(eventItem)}

                                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"

                                    >

                                        <FontAwesomeIcon icon={faTrash} />

                                        Delete

                                    </button>

                                </div>

                            </motion.article>

                        );

                    })}

                </div>

            ) : (

                <div className="rounded-2xl border border-[var(--border-color)]/60 bg-[var(--card-background)] px-5 py-14 text-center shadow-[0_5px_24px_var(--card-shadow)]">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a1a4c]/10 text-[#1a1a4c] dark:bg-violet-300/10 dark:text-violet-200">

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

                            className="mt-5 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:bg-teal-300 dark:text-slate-950 dark:hover:bg-teal-200"

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

                            className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[var(--border-color)]/70 bg-[var(--card-background)] text-[var(--text)] shadow-2xl"

                        >

                            <div className="flex items-center justify-between border-b border-[var(--border-color)] p-5">

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

                                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[var(--hover)]"

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

                                        className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none transition focus:border-[#7777bd] focus:ring-2 focus:ring-[#7777bd]/15"

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

                                            className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none transition focus:border-[#7777bd] focus:ring-2 focus:ring-[#7777bd]/15"

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

                                            className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none transition focus:border-[#7777bd] focus:ring-2 focus:ring-[#7777bd]/15"

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

                                        className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none transition focus:border-[#7777bd] focus:ring-2 focus:ring-[#7777bd]/15"

                                    />

                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <label className="block text-sm font-medium" htmlFor="event-image-picker">Event image</label>
                                        {form.image && (
                                            <button type="button" onClick={() => setForm((current) => ({ ...current, image: "" }))} className="text-xs font-semibold text-rose-600 hover:text-rose-700">
                                                Remove image
                                            </button>
                                        )}
                                    </div>
                                    {form.image ? (
                                        <div className="mb-3 overflow-hidden rounded-xl border border-[var(--border-color)]">
                                            <img src={form.image.startsWith("http") ? form.image : `${SERVER_URL}${form.image.startsWith("/") ? "" : "/"}${form.image}`} alt="Selected event" className="h-44 w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                                        </div>
                                    ) : (
                                        <div className="mb-3 flex min-h-24 items-center justify-center rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--hover)] px-4 text-center text-sm text-[var(--muted-text)]">
                                            No image selected. Choose a photo below, or leave this empty.
                                        </div>
                                    )}
                                    {isLoadingMedia ? (
                                        <p className="text-sm text-[var(--muted-text)]">Loading Media Library images...</p>
                                    ) : mediaLoadError ? (
                                        <p role="alert" className="text-sm text-rose-600">{mediaLoadError}</p>
                                    ) : mediaImages.length > 0 ? (
                                        <div id="event-image-picker" className="grid max-h-56 grid-cols-2 gap-3 overflow-y-auto rounded-xl border border-[var(--border-color)] p-2 sm:grid-cols-3">
                                            {mediaImages.map((image) => (
                                                <button key={image.id} type="button" onClick={() => setForm((current) => ({ ...current, image: image.url }))} aria-pressed={form.image === image.url} title={`Select ${image.name || "image"}`} className={`overflow-hidden rounded-lg border-2 text-left transition ${form.image === image.url ? "border-[#4545a0] ring-2 ring-[#4545a0]/20" : "border-transparent hover:border-[var(--border-color)]"}`}>
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

                                        className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-background)] p-3 text-sm outline-none transition focus:border-[#7777bd] focus:ring-2 focus:ring-[#7777bd]/15"

                                    />

                                </div>

                                <div className="flex flex-col-reverse gap-3 border-t border-[var(--border-color)] pt-4 sm:flex-row sm:justify-end">

                                    <button

                                        type="button"

                                        onClick={closeModal}

                                        className="rounded-lg border border-[var(--border-color)] px-5 py-3 text-sm font-semibold hover:bg-[var(--hover)]"

                                    >

                                        Cancel

                                    </button>

                                    <button

                                        type="submit"

                                        disabled={isSaving}

                                        className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-300 dark:text-slate-950 dark:hover:bg-teal-200"

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
