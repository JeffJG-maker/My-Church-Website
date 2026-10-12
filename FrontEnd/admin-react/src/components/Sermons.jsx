import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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
    faChevronRight,
    faPlus,
    faTimes,
    faUpload,
    faVideo,
} from "@fortawesome/free-solid-svg-icons";
const emptyForm = {
    title: "",
    speaker: "",
    category: "",
    date: "",
    duration: "",
    description: "",
    type: "video",
};
const formatDate = (date) => {
    if (!date) return "—";
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};
const API_BASE = "http://localhost:5000";

const getMediaUrl = (value) => {
    if (!value) return "";
    if (/^https?:\/\//i.test(value) || value.startsWith("blob:")) return value;
    return `${API_BASE}/${value.replace(/^\/+/, "")}`;
};

const dateInputValue = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
    return date.toISOString().slice(0, 10);
};

const Sermons = ({
    categories: sharedCategories = ["Faith", "Prayer", "Teaching", "Worship", "Praise"],
}) => {
    const [sermons, setSermons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [audioFile, setAudioFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    // Keep typing separate from the search currently applied to the table.
    const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [speakerFilter, setSpeakerFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3;
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [viewingSermon, setViewingSermon] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [formError, setFormError] = useState("");
    const [notice, setNotice] = useState("");
    const [showActivityHistory, setShowActivityHistory] = useState(false);
    const [activities, setActivities] = useState(() => {
        try {
            const saved = localStorage.getItem("church-sermon-activity");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("church-sermon-activity", JSON.stringify(activities));
        } catch (error) {
            console.error("Could not save sermon activity history:", error);
        }
    }, [activities]);

    const recordActivity = (action, sermonTitle, thumbnail = "", sermonId = null) => {
        const activity = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            action,
            sermonTitle,
            sermonId,
            thumbnail: thumbnail || "",
            timestamp: new Date().toISOString(),
        };
        setActivities((current) => {
            const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
            return [activity, ...current]
                .filter((item) => new Date(item.timestamp).getTime() >= cutoff)
                .slice(0, 100);
        });
    };

    const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
    const recentActivities = activities.filter(
        (activity) => new Date(activity.timestamp).getTime() >= twoWeeksAgo
    );
    const displayedActivities = showActivityHistory
        ? recentActivities
        : recentActivities.slice(0, 4);

    const formatActivityTime = (timestamp) => {
        const time = new Date(timestamp);
        if (Number.isNaN(time.getTime())) return "Time unavailable";
        const difference = Math.max(0, Date.now() - time.getTime());
        const minutes = Math.floor(difference / 60000);
        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
        return time.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
    };
    const fetchSermons = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/api/sermons`);
            if (!response.ok) throw new Error("Could not load sermons from the server.");
            const data = await response.json();
            setSermons(Array.isArray(data) ? data.map((sermon) => ({
                ...sermon,
                date: dateInputValue(sermon.date),
                thumbnail: getMediaUrl(sermon.thumbnail),
                mediaUrl: getMediaUrl(sermon.mediaUrl),
                duration: sermon.duration || "—",
                views: sermon.views || 0,
            })) : []);
        } catch (error) {
            setNotice(error.message || "Unable to connect to the sermons API.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSermons();
    }, []);

    const speakers = useMemo(
        () =>
            [
                ...new Set(
                    sermons.map((sermon) => sermon.speaker).filter(Boolean)
                ),
            ].sort(),
        [sermons]
    );
    const filteredSermons = useMemo(() => {
        const query = appliedSearchTerm.trim().toLowerCase();
        return sermons.filter((sermon) => {
            const matchesSearch =
                !query ||
                sermon.title.toLowerCase().includes(query) ||
                sermon.speaker.toLowerCase().includes(query) ||
                sermon.category.toLowerCase().includes(query);
            const matchesCategory =
                categoryFilter === "all" ||
                sermon.category === categoryFilter;
            const matchesSpeaker =
                speakerFilter === "all" ||
                sermon.speaker === speakerFilter;
            return matchesSearch && matchesCategory && matchesSpeaker;
        });
    }, [sermons, appliedSearchTerm, categoryFilter, speakerFilter]);
    const totalPages = Math.max(
        1,
        Math.ceil(filteredSermons.length / pageSize)
    );
    const safePage = Math.min(currentPage, totalPages);
    const pageSermons = filteredSermons.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize
    );
    const totalViews = sermons.reduce(
        (total, sermon) => total + (Number(sermon.views) || 0),
        0
    );
    const summary = [
        {
            title: "Total Sermons",
            value: sermons.length,
            icon: faBookOpen,
            tone: "bg-violet-100 text-violet-700",
        },
        {
            title: "Categories",
            value: new Set(sermons.map((sermon) => sermon.category)).size,
            icon: faLayerGroup,
            tone: "bg-emerald-100 text-emerald-700",
        },
        {
            title: "Total Views",
            value: totalViews.toLocaleString(),
            icon: faPlayCircle,
            tone: "bg-blue-100 text-blue-700",
        },
    ];
    const latestSermons = [...sermons]
        .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
        .slice(0, 4);
    const suggestions =
        searchTerm.trim().length >= 2
            ? sermons
                .filter(
                    (sermon) =>
                        sermon.title
                            .toLowerCase()
                            .includes(searchTerm.trim().toLowerCase()) ||
                        sermon.speaker
                            .toLowerCase()
                            .includes(searchTerm.trim().toLowerCase())
                )
                .slice(0, 5)
            : [];
    const resetForm = () => {
        setForm(emptyForm);
        setThumbnailFile(null);
        setVideoFile(null);
        setAudioFile(null);
        setEditingId(null);
        setFormError("");
    };
    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };
    const openEditModal = (sermon) => {
        setForm({
            title: sermon.title,
            speaker: sermon.speaker,
            category: sermon.category,
            date: dateInputValue(sermon.date),
            duration: sermon.duration === "—" ? "" : sermon.duration || "",
            description: sermon.description || "",
            type: sermon.type || "video",
        });
        setThumbnailFile(null);
        setVideoFile(null);
        setAudioFile(null);
        setEditingId(sermon.id);
        setFormError("");
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };
    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        if (!form.title.trim() || !form.speaker.trim() || !form.category || !form.date || !form.description.trim()) {
            setFormError("Please complete the title, speaker, category, date and description fields.");
            return;
        }

        if (editingId === null && !thumbnailFile) {
            setFormError("Please choose a thumbnail image for the sermon.");
            return;
        }
        if (editingId === null && form.type === "video" && !videoFile) {
            setFormError("Please choose a video file for this sermon.");
            return;
        }
        if (editingId === null && form.type === "audio" && !audioFile) {
            setFormError("Please choose an audio file for this sermon.");
            return;
        }

        setSaving(true);
        try {
            let response;
            if (editingId !== null) {
                const payload = {
                    title: form.title.trim(),
                    speaker: form.speaker.trim(),
                    category: form.category,
                    date: form.date,
                    description: form.description.trim(),
                    type: form.type,
                };
                response = await fetch(`${API_BASE}/api/sermons/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                const payload = new FormData();
                payload.append("title", form.title.trim());
                payload.append("speaker", form.speaker.trim());
                payload.append("category", form.category);
                payload.append("date", form.date);
                payload.append("description", form.description.trim());
                payload.append("type", form.type);
                payload.append("thumbnail", thumbnailFile);
                if (form.type === "video" && videoFile) payload.append("video", videoFile);
                if (form.type === "audio" && audioFile) payload.append("audio", audioFile);
                response = await fetch(`${API_BASE}/api/sermons`, { method: "POST", body: payload });
            }

            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.message || "The sermon could not be saved.");

            const activityTitle = form.title.trim();
            const previousSermon = editingId !== null
                ? sermons.find((sermon) => String(sermon.id) === String(editingId))
                : null;
            const activityThumbnail = editingId !== null
                ? (previousSermon?.thumbnail || form.thumbnail || "")
                : getMediaUrl(result.thumbnail || result.sermon?.thumbnail || "");
            recordActivity(
                editingId !== null ? "updated" : "uploaded",
                activityTitle,
                activityThumbnail,
                editingId !== null ? editingId : (result.id ?? result.sermon?.id ?? null)
            );
            await fetchSermons();
            setNotice(editingId !== null ? "Sermon updated successfully." : "Sermon added successfully.");
            setSearchTerm("");
            setAppliedSearchTerm("");
            setCategoryFilter("all");
            setSpeakerFilter("all");
            setCurrentPage(1);
            closeModal();
        } catch (error) {
            setFormError(error.message || "Something went wrong while saving the sermon.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (sermon) => {
        const confirmed = window.confirm(`Delete "${sermon.title}"? This cannot be undone.`);
        if (!confirmed) return;
        try {
            const response = await fetch(`${API_BASE}/api/sermons/${sermon.id}`, { method: "DELETE" });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.message || "Failed to delete sermon.");
            setSermons((current) => current.filter((item) => item.id !== sermon.id));
            recordActivity("deleted", sermon.title, sermon.thumbnail, sermon.id);
            if (viewingSermon?.id === sermon.id) setViewingSermon(null);
            setNotice("Sermon deleted successfully.");
        } catch (error) {
            setNotice(error.message || "Failed to delete sermon.");
        }
    };

    const handleRefresh = async () => {
        setSearchTerm("");
        setAppliedSearchTerm("");
        setCategoryFilter("all");
        setSpeakerFilter("all");
        setCurrentPage(1);
        await fetchSermons();
        setNotice("Sermon list refreshed.");
    };
    const applySearch = () => {
        setAppliedSearchTerm(searchTerm.trim());
        setShowSuggestions(false);
        setCurrentPage(1);
    };
    const chooseSuggestion = (sermon) => {
        setSearchTerm(sermon.title);
        setAppliedSearchTerm(sermon.title);
        setShowSuggestions(false);
        setCurrentPage(1);
    };
    const changePage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };
    return (
        <motion.section className="sermons-page min-w-0 text-[var(--text)]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}>
            <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(280px,300px)]">
                {/* MAIN CONTENT */}
                <main className="min-w-0 space-y-4">
                    {/* PAGE HEADING */}
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Sermons</h2>
                            <p className="mt-1 text-sm text-[var(--muted-text)]">
                                Manage, update and organize your sermons.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--active-theme-color)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Add Sermon
                        </button>
                    </div>
                    {/* NOTIFICATION */}
                    {loading && <p className="rounded-lg bg-[var(--card-background)] px-4 py-3 text-sm text-[var(--muted-text)]">Loading sermons from the server...</p>}
                    {notice && (
                        <div
                            className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800"
                            role="status"
                        >
                            <span>{notice}</span>
                            <button
                                type="button"
                                onClick={() => setNotice("")}
                                aria-label="Dismiss notification"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    )}
                    {/* SUMMARY CARDS */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {summary.map((item) => (
                            <motion.article
                                key={item.title}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                                className="flex min-w-0 items-center gap-3 rounded-2xl bg-[var(--card-background)] p-4 shadow-[0_5px_24px_var(--card-shadow)]"
                            >
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.tone}`}
                                >
                                    <FontAwesomeIcon icon={item.icon} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-[var(--muted-text)]">
                                        {item.title}
                                    </p>
                                    <p className="mt-1 text-xl font-bold">
                                        {item.value}
                                    </p>
                                </div>
                            </motion.article>
                        ))}
                    </section>
                    {/* SEARCH AND FILTERS */}
                    <section className="rounded-2xl bg-[var(--card-background)] p-3 shadow-[0_5px_24px_var(--card-shadow)]">
                        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(130px,1fr)_minmax(130px,1fr)]">
                            <div className="relative min-w-0">
                                <div className="flex h-10 items-center gap-3 rounded-lg border border-[var(--border-color)] px-3">
                                    <FontAwesomeIcon
                                        icon={faSearch}
                                        className="text-sm text-[var(--muted-text)]"
                                    />
                                    <input
                                        type="search"
                                        value={searchTerm}
                                        onChange={(event) => {
                                            // Typing updates suggestions only; the table waits for Enter or a suggestion click.
                                            setSearchTerm(event.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                event.preventDefault();
                                                applySearch();
                                            }
                                            if (event.key === "Escape") {
                                                setShowSuggestions(false);
                                            }
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() =>
                                            setTimeout(
                                                () => setShowSuggestions(false),
                                                150
                                            )
                                        }
                                        placeholder="Search sermons..."
                                        className="w-full min-w-0 bg-transparent text-sm outline-none"
                                        aria-label="Search sermons"
                                    />
                                </div>
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute left-0 right-0 top-11 z-20 overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--card-background)] shadow-xl">
                                        {suggestions.map((sermon) => (
                                            <button
                                                type="button"
                                                key={sermon.id}
                                                onMouseDown={() => chooseSuggestion(sermon)}
                                                className="block w-full px-4 py-2.5 text-left transition hover:bg-[var(--hover)]"
                                            >
                                                <span className="block text-sm font-medium">
                                                    {sermon.title}
                                                </span>
                                                <span className="mt-1 block text-xs text-[var(--muted-text)]">
                                                    {sermon.speaker}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <select
                                value={categoryFilter}
                                onChange={(event) => {
                                    setCategoryFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                                className="h-10 min-w-0 rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm"
                                aria-label="Filter by category"
                            >
                                <option value="all">All Categories</option>
                                {[
                                    ...new Set([
                                        ...sharedCategories,
                                        ...sermons.map((sermon) => sermon.category),
                                    ]),
                                ].map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={speakerFilter}
                                onChange={(event) => {
                                    setSpeakerFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                                className="h-10 min-w-0 rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm"
                                aria-label="Filter by speaker"
                            >
                                <option value="all">All Speakers</option>
                                {speakers.map((speaker) => (
                                    <option key={speaker} value={speaker}>
                                        {speaker}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </section>
                    {/* ALL SERMONS HEADING: OUTSIDE THE TABLE CARD */}
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="text-base font-bold">All Sermons</h3>
                            <p className="mt-1 text-xs text-[var(--muted-text)]">
                                {filteredSermons.length} sermon{filteredSermons.length === 1 ? "" : "s"} found
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[var(--border-color)] px-3 py-2 text-sm transition hover:bg-[var(--hover)]"
                        >
                            <FontAwesomeIcon icon={faSyncAlt} />
                            Refresh
                        </button>
                    </div>
                    {/* TABLE CARD */}
                    <section className="min-w-0 overflow-hidden rounded-2xl bg-[var(--card-background)] shadow-[0_5px_24px_var(--card-shadow)]">
                        {/* TABLE */}
                        <div className="w-full min-w-0 overflow-hidden">
                            <table className="w-full table-fixed border-collapse text-left text-xs">
                                <colgroup>
                                    <col className="w-[34%]" />
                                    <col className="w-[16%]" />
                                    <col className="w-[13%]" />
                                    <col className="w-[14%]" />
                                    <col className="w-[10%]" />
                                    <col className="w-[13%]" />
                                </colgroup>
                                <thead className="bg-[var(--background)]">
                                    <tr>
                                        {[
                                            "Sermon",
                                            "Speaker",
                                            "Category",
                                            "Date",
                                            "Duration",
                                            "Actions",
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-text)] sm:px-3"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageSermons.map((sermon) => (
                                        <motion.tr
                                            key={sermon.id}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-[var(--border-color)] transition hover:bg-[var(--hover)]"
                                        >
                                            <td className="px-2 py-2 sm:px-3">
                                                <div className="flex min-w-0 items-center gap-2">
                                                    {sermon.thumbnail ? (
                                                        <img
                                                            src={sermon.thumbnail}
                                                            alt=""
                                                            className="h-8 w-10 shrink-0 rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-8 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--hover)] text-[var(--muted-text)]">
                                                            <FontAwesomeIcon icon={faVideo} />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p
                                                            className="truncate font-semibold"
                                                            title={sermon.title}
                                                        >
                                                            {sermon.title}
                                                        </p>
                                                        <p
                                                            className="mt-1 truncate text-[10px] text-[var(--muted-text)]"
                                                            title={sermon.description || ""}
                                                        >
                                                            {sermon.description || "No description"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="truncate px-2 py-2 sm:px-3" title={sermon.speaker}>
                                                {sermon.speaker}
                                            </td>
                                            <td className="px-2 py-2 sm:px-3">
                                                <span
                                                    className="inline-block max-w-full truncate rounded-full bg-violet-100 px-2 py-1 text-[10px] font-medium text-violet-700"
                                                    title={sermon.category}
                                                >
                                                    {sermon.category}
                                                </span>
                                            </td>
                                            <td className="truncate px-2 py-2 sm:px-3" title={formatDate(sermon.date)}>
                                                {formatDate(sermon.date)}
                                            </td>
                                            <td className="truncate px-2 py-2 sm:px-3">
                                                {sermon.duration || "—"}
                                            </td>
                                            <td className="px-1 py-2 sm:px-2">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setViewingSermon(sermon)}
                                                        title="View sermon"
                                                        aria-label={`View ${sermon.title}`}
                                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(sermon)}
                                                        title="Edit sermon"
                                                        aria-label={`Edit ${sermon.title}`}
                                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                    >
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(sermon)}
                                                        title="Delete sermon"
                                                        aria-label={`Delete ${sermon.title}`}
                                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {!loading && pageSermons.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-3 py-5 text-center">
                                                <p className="font-semibold">
                                                    No sermons found
                                                </p>
                                                <p className="mt-1 text-xs text-[var(--muted-text)]">
                                                    Try changing your search or filters.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* PAGINATION */}
                        <div className="flex items-center justify-between gap-2 border-t border-[var(--border-color)] px-3 py-2">
                            <p className="min-w-0 truncate text-[10px] text-[var(--muted-text)] sm:text-xs">
                                {filteredSermons.length === 0
                                    ? "Showing 0 sermons"
                                    : `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(
                                        safePage * pageSize,
                                        filteredSermons.length
                                    )} of ${filteredSermons.length}`}
                            </p>
                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    disabled={safePage === 1}
                                    onClick={() => changePage(safePage - 1)}
                                    className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-color)] disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Previous page"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                                <span className="px-2 text-xs font-semibold">
                                    {safePage} / {totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={safePage === totalPages}
                                    onClick={() => changePage(safePage + 1)}
                                    className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-color)] disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Next page"
                                >
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
                {/* RIGHT-SIDE RECENT ACTIVITY */}
                <aside className="flex h-fit min-w-0 flex-col gap-3 xl:sticky xl:top-4">
                    <div>
                        <h3 className="text-base font-bold">Recent Activity</h3>
                        <p className="mt-1 text-xs text-[var(--muted-text)]">
                            A record of sermon uploads, updates and deletions.
                        </p>
                    </div>
                    <section className="rounded-2xl bg-[var(--card-background)] p-5 shadow-[0_5px_24px_var(--card-shadow)]">
                        {displayedActivities.length > 0 ? (
                            <ul className="space-y-4">
                                {displayedActivities.map((activity, index) => {
                                    const activitySermon = sermons.find(
                                        (sermon) => String(sermon.id) === String(activity.sermonId)
                                            || sermon.title?.trim().toLowerCase() === activity.sermonTitle?.trim().toLowerCase()
                                    );
                                    const activityThumbnail = activity.thumbnail || activitySermon?.thumbnail || "";

                                    return (
                                        <motion.li
                                            key={activity.id}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.22, delay: index * 0.025 }}
                                            className="flex min-w-0 items-start gap-3"
                                        >
                                            {activityThumbnail ? (
                                                <img
                                                    src={getMediaUrl(activityThumbnail)}
                                                    alt={`${activity.sermonTitle} thumbnail`}
                                                    className="h-10 w-10 shrink-0 rounded-lg object-cover shadow-sm"
                                                    onError={(event) => {
                                                        event.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${activity.action === "uploaded" ? "bg-emerald-100 text-emerald-700" : activity.action === "updated" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                                                    <FontAwesomeIcon icon={activity.action === "uploaded" ? faUpload : activity.action === "updated" ? faPen : faTrash} />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm leading-5">
                                                    <span className="font-semibold">Sermon {activity.action}</span>
                                                </p>
                                                <p className="mt-0.5 break-words text-xs font-medium text-[var(--muted-text)]">
                                                    {activity.sermonTitle}
                                                </p>
                                                <p className="mt-1 text-[11px] text-[var(--muted-text)]" title={new Date(activity.timestamp).toLocaleString()}>
                                                    {formatActivityTime(activity.timestamp)}
                                                </p>
                                            </div>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="py-5 text-center">
                                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--hover)] text-[var(--muted-text)]">
                                    <FontAwesomeIcon icon={faSyncAlt} />
                                </div>
                                <p className="mt-3 text-sm font-semibold">No activity yet</p>
                                <p className="mt-1 text-xs leading-5 text-[var(--muted-text)]">
                                    When you upload, update or delete a sermon, the activity will appear here with its time.
                                </p>
                            </div>
                        )}
                        {recentActivities.length > 4 && (
                            <button
                                type="button"
                                onClick={() => setShowActivityHistory((current) => !current)}
                                className="mt-5 w-full rounded-lg border border-[var(--border-color)] px-3 py-2 text-xs font-semibold transition hover:bg-[var(--hover)]"
                            >
                                {showActivityHistory
                                    ? "Show only the last 4 activities"
                                    : "View activity history (last 14 days)"}
                            </button>
                        )}
                    </section>
                    <button
                        type="button"
                        onClick={openAddModal}
                        className="flex min-h-[64px] w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--border-color)] px-4 py-4 font-semibold transition hover:bg-[var(--hover)]"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Sermon
                    </button>
                </aside>
            </div>
            {/* ADD / EDIT SERMON MODAL */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeModal();
                    }}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sermon-modal-title"
                        initial={{ opacity: 0, scale: 0.97, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-[var(--card-background)] shadow-2xl"
                    >
                        <div className="flex items-start justify-between border-b border-[var(--border-color)] px-6 py-5">
                            <div>
                                <h2 id="sermon-modal-title" className="text-lg font-bold">
                                    {editingId !== null ? "Edit Sermon" : "Add New Sermon"}
                                </h2>
                                <p className="mt-1 text-sm text-[var(--muted-text)]">
                                    Enter the sermon details below.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[var(--hover)]"
                                aria-label="Close modal"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="max-h-[calc(92vh-90px)] space-y-5 overflow-y-auto p-6"
                        >
                            {formError && (
                                <p
                                    role="alert"
                                    className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700"
                                >
                                    {formError}
                                </p>
                            )}
                            <div>
                                <label
                                    htmlFor="sermon-title"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Sermon title *
                                </label>
                                <input
                                    id="sermon-title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleFormChange}
                                    required
                                    maxLength={120}
                                    placeholder="Enter sermon title"
                                    className="h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="sermon-speaker"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Speaker *
                                    </label>
                                    <input
                                        id="sermon-speaker"
                                        name="speaker"
                                        value={form.speaker}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="e.g. Pastor Tobore"
                                        className="h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="sermon-category"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Category *
                                    </label>
                                    <select
                                        id="sermon-category"
                                        name="category"
                                        value={form.category}
                                        onChange={handleFormChange}
                                        required
                                        className="h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                                    >
                                        <option value="">Select category</option>
                                        {[
                                            ...new Set([
                                                ...sharedCategories,
                                                ...sermons.map((sermon) => sermon.category),
                                            ]),
                                        ].map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label
                                        htmlFor="sermon-date"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Sermon date *
                                    </label>
                                    <input
                                        id="sermon-date"
                                        type="date"
                                        name="date"
                                        value={form.date}
                                        onChange={handleFormChange}
                                        required
                                        className="h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="sermon-type" className="mb-2 block text-sm font-medium">Media type *</label>
                                    <select id="sermon-type" name="type" value={form.type} onChange={handleFormChange} required disabled={editingId !== null} className="h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500">
                                        <option value="video">Video sermon</option>
                                        <option value="audio">Audio sermon</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        htmlFor="sermon-duration"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Duration *
                                    </label>
                                    <input
                                        id="sermon-duration"
                                        name="duration"
                                        value={form.duration}
                                        onChange={handleFormChange}
                                        placeholder="e.g. 45:00"
                                        pattern="[0-9]{1,3}:[0-5][0-9]"
                                        title="Use minutes:seconds, for example 45:00"
                                        className="h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="sermon-description"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="sermon-description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleFormChange}
                                    rows={4}
                                    placeholder="Write a short description of the sermon..."
                                    className="w-full resize-y rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="sermon-thumbnail"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Thumbnail image
                                    </label>
                                    <label className="flex min-h-20 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[var(--border-color)] p-3 hover:bg-[var(--hover)]">
                                        <FontAwesomeIcon
                                            icon={faUpload}
                                            className="text-lg text-[var(--muted-text)]"
                                        />
                                        <span className="min-w-0 text-sm">
                                            <span className="block font-medium">
                                                {thumbnailFile?.name || "Choose image"}
                                            </span>
                                            <span className="mt-1 block text-xs text-[var(--muted-text)]">
                                                JPG, PNG or WEBP
                                            </span>
                                        </span>
                                        <input
                                            id="sermon-thumbnail"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="sr-only"
                                            onChange={(event) =>
                                                setThumbnailFile(event.target.files?.[0] || null)
                                            }
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label
                                        htmlFor="sermon-video"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        {form.type === "video" ? "Sermon video *" : "Sermon audio *"}
                                    </label>
                                    <label className="flex min-h-20 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[var(--border-color)] p-3 hover:bg-[var(--hover)]">
                                        <FontAwesomeIcon icon={form.type === "video" ? faVideo : faUpload} className="text-lg text-[var(--muted-text)]" />
                                        <span className="min-w-0 text-sm">
                                            <span className="block break-all font-medium">{form.type === "video" ? (videoFile?.name || "Choose video") : (audioFile?.name || "Choose audio")}</span>
                                            <span className="mt-1 block text-xs text-[var(--muted-text)]">{form.type === "video" ? "MP4, WebM or MOV" : "MP3, WAV or M4A"}</span>
                                        </span>
                                        {form.type === "video" ? (
                                            <input id="sermon-video" type="file" accept="video/mp4,video/webm,video/quicktime" className="sr-only" onChange={(event) => setVideoFile(event.target.files?.[0] || null)} />
                                        ) : (
                                            <input id="sermon-audio" type="file" accept="audio/mpeg,audio/wav,audio/mp4,audio/*" className="sr-only" onChange={(event) => setAudioFile(event.target.files?.[0] || null)} />
                                        )}
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col-reverse gap-3 border-t border-[var(--border-color)] pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg border border-[var(--border-color)] px-5 py-3 text-sm font-semibold hover:bg-[var(--hover)]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-[var(--active-theme-color)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                                >
                                    {saving ? "Saving..." : editingId !== null ? "Save changes" : "Add sermon"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            {/* VIEW SERMON MODAL */}
            {viewingSermon && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setViewingSermon(null);
                        }
                    }}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sermon-details-title"
                        initial={{ opacity: 0, scale: 0.97, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-[var(--card-background)] shadow-2xl"
                    >
                        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-color)] p-5">
                            <h2 id="sermon-details-title" className="text-lg font-bold">
                                Sermon details
                            </h2>
                            <button
                                type="button"
                                onClick={() => setViewingSermon(null)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[var(--hover)]"
                                aria-label="Close details"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="min-h-0 space-y-4 overflow-y-auto p-5">
                            {viewingSermon.thumbnail && (
                                <img
                                    src={viewingSermon.thumbnail}
                                    alt=""
                                    className="max-h-64 w-full rounded-xl object-cover"
                                />
                            )}
                            <div>
                                <h3 className="text-xl font-bold">
                                    {viewingSermon.title}
                                </h3>
                                <p className="mt-1 text-sm text-[var(--muted-text)]">
                                    By {viewingSermon.speaker}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <p>
                                    <span className="text-[var(--muted-text)]">
                                        Category:
                                    </span>
                                    <br />
                                    {viewingSermon.category}
                                </p>
                                <p>
                                    <span className="text-[var(--muted-text)]">
                                        Date:
                                    </span>
                                    <br />
                                    {formatDate(viewingSermon.date)}
                                </p>
                                <p>
                                    <span className="text-[var(--muted-text)]">
                                        Duration:
                                    </span>
                                    <br />
                                    {viewingSermon.duration || "—"}
                                </p>
                                <p>
                                    <span className="text-[var(--muted-text)]">
                                        Views:
                                    </span>
                                    <br />
                                    {(viewingSermon.views || 0).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 text-sm font-semibold">
                                    Description
                                </p>
                                <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--muted-text)]">
                                    {viewingSermon.description ||
                                        "No description provided."}
                                </p>
                            </div>
                            {viewingSermon.mediaUrl && viewingSermon.type === "video" && (
                                <video controls src={viewingSermon.mediaUrl} className="max-h-64 w-full rounded-lg object-contain" />
                            )}
                            {viewingSermon.mediaUrl && viewingSermon.type === "audio" && (
                                <audio controls src={viewingSermon.mediaUrl} className="w-full" />
                            )}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const sermon = viewingSermon;
                                        setViewingSermon(null);
                                        openEditModal(sermon);
                                    }}
                                    className="rounded-lg bg-[var(--active-theme-color)] px-4 py-2 text-sm font-semibold text-white"
                                >
                                    Edit sermon
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.section>
    );
};
export default Sermons;
