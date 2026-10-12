import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarAlt,
    faSearch,
    faPlus,
    faPen,
    faTrash,
    faTimes,
    faMapMarkerAlt,
    faClock,
    faFilter,
} from "@fortawesome/free-solid-svg-icons";

const emptyEventForm = {
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    status: "Upcoming",
};

const initialEvents = [];

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
    const [events, setEvents] = useState(initialEvents);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyEventForm);
    const [formError, setFormError] = useState("");
    const [notice, setNotice] = useState("");

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingCount = events.filter(
        (event) => event.date && new Date(`${event.date}T00:00:00`) >= today
    ).length;
    const pastCount = events.filter(
        (event) => event.date && new Date(`${event.date}T00:00:00`) < today
    ).length;

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
            date: event.date,
            time: event.time,
            location: event.location,
            description: event.description,
            status: event.status,
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

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormError("");

        if (!form.title.trim() || !form.date || !form.time || !form.location.trim()) {
            setFormError("Please complete the event title, date, time, and location.");
            return;
        }

        const updatedEvent = {
            id: editingId ?? Date.now(),
            title: form.title.trim(),
            date: form.date,
            time: form.time,
            location: form.location.trim(),
            description: form.description.trim(),
            status: form.status,
        };

        if (editingId !== null) {
            setEvents((current) =>
                current.map((item) => (item.id === editingId ? updatedEvent : item))
            );
            setNotice("Event updated successfully.");
        } else {
            setEvents((current) => [...current, updatedEvent]);
            setNotice("Event added successfully.");
        }

        closeModal();
    };

    const handleDelete = (eventItem) => {
        if (!window.confirm(`Delete "${eventItem.title}"? This cannot be undone.`)) {
            return;
        }

        setEvents((current) => current.filter((item) => item.id !== eventItem.id));
        setNotice("Event deleted successfully.");
    };

    return (
        <section className="min-w-0 space-y-6 text-[var(--text)]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold">Events</h2>
                    <p className="mt-1 text-sm text-[var(--muted-text)]">
                        Create and manage church services, meetings, and special programmes.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openAddModal}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1a1a4c] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Add Event
                </button>
            </div>

            {notice && (
                <div
                    role="status"
                    className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                >
                    <span>{notice}</span>
                    <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                    { label: "Total Events", value: events.length, icon: faCalendarAlt, tone: "bg-violet-100 text-violet-700" },
                    { label: "Upcoming Events", value: upcomingCount, icon: faClock, tone: "bg-emerald-100 text-emerald-700" },
                    { label: "Past Events", value: pastCount, icon: faMapMarkerAlt, tone: "bg-blue-100 text-blue-700" },
                ].map((stat) => (
                    <article
                        key={stat.label}
                        className="flex items-center gap-3 rounded-2xl bg-[var(--card-background)] p-5 shadow-[0_5px_24px_var(--card-shadow)]"
                    >
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.tone}`}>
                            <FontAwesomeIcon icon={stat.icon} />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--muted-text)]">{stat.label}</p>
                            <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                        </div>
                    </article>
                ))}
            </div>

            <div className="flex flex-col gap-3 rounded-2xl bg-[var(--card-background)] p-4 shadow-[0_5px_24px_var(--card-shadow)] sm:flex-row">
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
                        className="h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] pl-9 pr-3 text-sm outline-none focus:border-[#1a1a4c]"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faFilter} className="text-[var(--muted-text)]" />
                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        aria-label="Filter events by status"
                        className="h-11 rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none focus:border-[#1a1a4c]"
                    >
                        <option value="all">All events</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {filteredEvents.map((eventItem) => {
                        const isPast =
                            eventItem.date &&
                            new Date(`${eventItem.date}T00:00:00`) < today;

                        return (
                            <article
                                key={eventItem.id}
                                className="rounded-2xl bg-[var(--card-background)] p-5 shadow-[0_5px_24px_var(--card-shadow)]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
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
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-2xl bg-[var(--card-background)] px-5 py-14 text-center shadow-[0_5px_24px_var(--card-shadow)]">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
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
                            className="mt-5 rounded-lg bg-[#1a1a4c] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                        >
                            Add your first event
                        </button>
                    )}
                </div>
            )}

            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeModal();
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="event-modal-title"
                        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-[var(--card-background)] text-[var(--text)] shadow-2xl"
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
                                    className="h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none focus:border-[#1a1a4c]"
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
                                        className="h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none focus:border-[#1a1a4c]"
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
                                        className="h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none focus:border-[#1a1a4c]"
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
                                    className="h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none focus:border-[#1a1a4c]"
                                />
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
                                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] p-3 text-sm outline-none focus:border-[#1a1a4c]"
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
                                    className="rounded-lg bg-[#1a1a4c] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                                >
                                    {editingId !== null ? "Save Changes" : "Add Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Events;
