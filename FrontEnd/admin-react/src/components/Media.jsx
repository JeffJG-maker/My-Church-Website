import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {

    faPhotoVideo,

    faSearch,

    faUpload,

    faImage,

    faVideo,

    faTrash,

    faTimes,

    faFile,

} from "@fortawesome/free-solid-svg-icons";

const SERVER_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const API_URL = `${SERVER_URL}/api/media`;

const formatSize = (bytes) => {

    if (!Number.isFinite(Number(bytes)) || Number(bytes) < 0) return "—";

    if (Number(bytes) < 1024 * 1024) {

        return `${Math.max(1, Math.round(Number(bytes) / 1024))} KB`;

    }

    return `${(Number(bytes) / (1024 * 1024)).toFixed(1)} MB`;

};

const Media = ({ token }) => {

    const shouldReduceMotion = useReducedMotion();
    const fileInputRef = useRef(null);

    const [mediaItems, setMediaItems] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [typeFilter, setTypeFilter] = useState("all");

    const [notice, setNotice] = useState("");

    const [previewItem, setPreviewItem] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const [isUploading, setIsUploading] = useState(false);

    const [isDragging, setIsDragging] = useState(false);

    const loadMedia = async () => {

        try {

            const response = await fetch(API_URL);

            const data = await response.json();

            if (!response.ok || data.success === false) {

                throw new Error(data.message || "Could not load media files.");

            }

            const items = Array.isArray(data) ? data : (data.items || data.media || data.data || []);

            setMediaItems(

                (items || []).map((item) => ({

                    ...item,

                    id: item._id || item.id,

                    url: item.url?.startsWith("http")

                        ? item.url

                        : `${SERVER_URL}${item.url?.startsWith("/") ? "" : "/"}${item.url || ""}`,

                }))

            );

        } catch (error) {

            setNotice(error.message || "Unable to connect to the media server.");

        } finally {

            setIsLoading(false);

        }

    };

    useEffect(() => {

        loadMedia();

    }, []);

    const filteredItems = useMemo(() => {

        const query = searchTerm.trim().toLowerCase();

        return mediaItems.filter((item) => {

            const matchesSearch = (item.name || "").toLowerCase().includes(query);

            const matchesType =

                typeFilter === "all" ||

                (typeFilter === "images" && item.kind === "image") ||

                (typeFilter === "videos" && item.kind === "video") ||

                (typeFilter === "other" && item.kind === "other");

            return matchesSearch && matchesType;

        });

    }, [mediaItems, searchTerm, typeFilter]);

    const imageCount = mediaItems.filter((item) => item.kind === "image").length;

    const videoCount = mediaItems.filter((item) => item.kind === "video").length;

    const uploadFiles = async (files) => {

        if (!files.length) return;

        const formData = new FormData();

        files.forEach((file) => formData.append("files", file));

        setIsUploading(true);

        setNotice("");

        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,

            });

            const data = await response.json();

            if (!response.ok || data.success === false) {

                throw new Error(data.message || "Media upload failed.");

            }

            await loadMedia();

            setNotice(`${files.length} file${files.length === 1 ? "" : "s"} uploaded successfully.`);

        } catch (error) {

            setNotice(error.message || "Unable to upload the selected files.");

        } finally {

            setIsUploading(false);

        }

    };

    const handleFiles = async (event) => {

        await uploadFiles(Array.from(event.target.files || []));

        event.target.value = "";

    };

    const handleDelete = async (item) => {

        const confirmed = window.confirm(`Remove "${item.name}" from the media library?`);

        if (!confirmed) return;

        try {

            const response = await fetch(`${API_URL}/${item.id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });

            const data = await response.json();

            if (!response.ok || data.success === false) {

                throw new Error(data.message || "Could not delete this media file.");

            }

            setMediaItems((current) => current.filter((media) => media.id !== item.id));

            if (previewItem?.id === item.id) setPreviewItem(null);

            setNotice(`"${item.name}" was deleted successfully.`);

        } catch (error) {

            setNotice(error.message || "Unable to delete this media file.");

        }

    };

    const stats = [

        {

            label: "Total files",

            value: mediaItems.length,

            icon: faPhotoVideo,

            iconStyle: "bg-[#1a1a4c]/[0.08] text-[#55558b] dark:bg-indigo-300/10 dark:text-indigo-200",

            detail: "All stored media",

        },

        {

            label: "Images",

            value: imageCount,

            icon: faImage,

            iconStyle: "bg-[#1a1a4c]/[0.08] text-[#55558b] dark:bg-indigo-300/10 dark:text-indigo-200",

            detail: "Photo assets",

        },

        {

            label: "Videos",

            value: videoCount,

            icon: faVideo,

            iconStyle: "bg-[#1a1a4c]/[0.08] text-[#55558b] dark:bg-indigo-300/10 dark:text-indigo-200",

            detail: "Video assets",

        },

    ];

    return (

        <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
            className="min-w-0 space-y-6 pb-8 text-[var(--text)]">

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#171744] via-[#252568] to-[#4545a0] p-6 text-white shadow-[0_14px_35px_rgba(26,26,76,0.20)] sm:p-8">

                <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/5" />

                <div className="pointer-events-none absolute -bottom-24 right-36 h-52 w-52 rounded-full bg-fuchsia-400/10 blur-2xl" />

                <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">

                    <div className="max-w-xl">

                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/90">

                            <span className="h-2 w-2 rounded-full bg-emerald-300" /> CHURCH MEDIA CENTRE

                        </div>

                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Media Library</h2>

                        <p className="mt-3 max-w-lg text-sm leading-6 text-indigo-100 sm:text-base">

                            Keep your church photos and videos organised in one place, ready for your website and media team.

                        </p>

                    </div>

                    <button

                        type="button"

                        onClick={() => fileInputRef.current?.click()}

                        disabled={isUploading}

                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-[#202052] shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"

                    >

                        <FontAwesomeIcon icon={faUpload} />

                        {isUploading ? "Uploading files..." : "Upload media"}

                    </button>

                </div>

                <input

                    ref={fileInputRef}

                    type="file"

                    multiple

                    accept="image/*,video/*"

                    className="hidden"

                    onChange={handleFiles}

                />

            </div>

            {notice && (

                <div

                    role="status"

                    className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-[var(--text)]"

                >

                    <span>{notice}</span>

                    <button

                        type="button"

                        onClick={() => setNotice("")}

                        aria-label="Dismiss notification"

                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition hover:bg-black/5"

                    >

                        <FontAwesomeIcon icon={faTimes} />

                    </button>

                </div>

            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                {stats.map((stat) => (

                    <motion.article

                        key={stat.label}
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: "easeOut" }}

                        className={`group relative isolate flex items-center gap-4 overflow-hidden rounded-3xl border border-[var(--border-color)]/60 bg-[var(--card-background)] p-5 shadow-[0_8px_28px_var(--card-shadow)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_var(--card-shadow)] ${"before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-[#1a1a4c]/70 dark:before:bg-indigo-300/60"

                            }`}

                    >

                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg shadow-inner transition duration-300 group-hover:rotate-3 group-hover:scale-105 ${stat.iconStyle}`}>

                            <FontAwesomeIcon icon={stat.icon} />

                        </div>

                        <div className="min-w-0 flex-1">

                            <p className="text-sm font-semibold text-[var(--muted-text)]">{stat.label}</p>

                            <div className="mt-1 flex items-end justify-between gap-2">

                                <p className="text-3xl font-extrabold tracking-tight">{stat.value}</p>

                                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${stat.iconStyle}`}>{stat.detail}</span>

                            </div>

                        </div>

                    </motion.article>

                ))}

            </div>

            <div

                onDragEnter={(event) => {

                    event.preventDefault();

                    setIsDragging(true);

                }}

                onDragOver={(event) => event.preventDefault()}

                onDragLeave={(event) => {

                    if (event.currentTarget === event.target) setIsDragging(false);

                }}

                onDrop={async (event) => {

                    event.preventDefault();

                    setIsDragging(false);

                    await uploadFiles(Array.from(event.dataTransfer.files || []));

                }}

                className={`group/upload relative overflow-hidden rounded-3xl border-2 border-dashed p-6 shadow-[0_12px_30px_var(--card-shadow)] transition duration-300 sm:p-7 ${isDragging

                    ? "border-[#4545a0] bg-[#1a1a4c]/[0.045] shadow-md dark:border-indigo-300/60 dark:bg-indigo-300/[0.06]"

                    : "border-[var(--border-color)] bg-[var(--card-background)] hover:border-[#4545a0]/50 hover:shadow-[0_18px_38px_var(--card-shadow)]"

                    }`}

            >

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1a1a4c]/[0.07] text-xl text-[#4545a0] shadow-sm ring-1 ring-[#1a1a4c]/10 dark:bg-indigo-300/10 dark:text-indigo-200 dark:ring-indigo-300/10 transition duration-300 group-hover/upload:rotate-3 group-hover/upload:scale-105">

                        <FontAwesomeIcon icon={faUpload} />

                    </div>

                    <div className="min-w-0 flex-1">

                        <p className="font-semibold">Add new media</p>

                        <p className="mt-1 text-sm text-[var(--muted-text)]">

                            Drag and drop image or video files here, or browse your device. Files are saved to your media library.

                        </p>

                    </div>

                    <button

                        type="button"

                        onClick={() => fileInputRef.current?.click()}

                        disabled={isUploading}

                        className="shrink-0 rounded-xl bg-gradient-to-r from-[#252568] to-[#4545a0] px-5 py-3 text-sm font-bold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"

                    >

                        Browse files

                    </button>

                </div>

            </div>

            <div className="overflow-hidden rounded-3xl border border-[var(--border-color)]/60 bg-[var(--card-background)] shadow-[0_12px_34px_var(--card-shadow)] transition duration-300 hover:shadow-[0_18px_42px_var(--card-shadow)]">

                <div className="flex flex-col gap-4 border-b border-[var(--border-color)] bg-[#1a1a4c]/[0.035] dark:bg-white/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h3 className="text-lg font-extrabold tracking-tight">Your collection</h3>

                        <p className="mt-1 text-sm text-[var(--muted-text)]">

                            {filteredItems.length} {filteredItems.length === 1 ? "file" : "files"} shown

                            {searchTerm ? ` for “${searchTerm}”` : " in your library"}

                        </p>

                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">

                        <div className="relative min-w-0 sm:w-64">

                            <FontAwesomeIcon

                                icon={faSearch}

                                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-text)]"

                            />

                            <input

                                type="search"

                                value={searchTerm}

                                onChange={(event) => setSearchTerm(event.target.value)}

                                placeholder="Search media..."

                                aria-label="Search media files"

                                className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-background)] pl-9 pr-3 text-sm shadow-sm transition duration-200 outline-none hover:border-indigo-400/60 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"

                            />

                        </div>

                        <select

                            value={typeFilter}

                            onChange={(event) => setTypeFilter(event.target.value)}

                            aria-label="Filter media by type"

                            className="h-11 rounded-xl border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm shadow-sm transition duration-200 outline-none hover:border-indigo-400/60 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"

                        >

                            <option value="all">All media</option>

                            <option value="images">Images</option>

                            <option value="videos">Videos</option>

                            <option value="other">Other files</option>

                        </select>

                    </div>

                </div>

                <div className="bg-[var(--card-background)] p-5">

                    {isLoading ? (

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                            {[1, 2, 3].map((item) => (

                                <div key={item} className="animate-pulse overflow-hidden rounded-2xl border border-[var(--border-color)]">

                                    <div className="h-48 bg-[var(--hover)]" />

                                    <div className="space-y-2 p-4">

                                        <div className="h-3 w-3/4 rounded bg-[var(--hover)]" />

                                        <div className="h-3 w-1/3 rounded bg-[var(--hover)]" />

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : filteredItems.length > 0 ? (

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                            {filteredItems.map((item) => (

                                <motion.article

                                    key={item.id}
                                    initial={shouldReduceMotion ? false : { opacity: 0, x: -14, y: 8 }}
                                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                                    viewport={{ once: true, amount: 0.15 }}
                                    transition={{ duration: shouldReduceMotion ? 0 : 0.38, ease: "easeOut" }}

                                    className="group relative min-w-0 overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--card-background)] shadow-[0_8px_24px_var(--card-shadow)] transition duration-300 hover:-translate-y-1 hover:border-[#4545a0]/50 hover:shadow-[0_18px_38px_var(--card-shadow)]"

                                >

                                    <button

                                        type="button"

                                        onClick={() => setPreviewItem(item)}

                                        className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-[var(--hover)]"

                                        aria-label={`Preview ${item.name}`}

                                    >

                                        {item.kind === "image" ? (

                                            <img

                                                src={item.url}

                                                alt={item.name}

                                                loading="lazy"

                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"

                                            />

                                        ) : item.kind === "video" ? (

                                            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#1a1a4c]/[0.045] dark:bg-indigo-300/[0.06] text-[var(--muted-text)]">

                                                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--card-background)] text-2xl shadow-lg transition group-hover:scale-110">

                                                    <FontAwesomeIcon icon={faVideo} />

                                                </span>

                                                <span className="text-xs font-semibold uppercase tracking-[0.18em]">Video file</span>

                                            </div>

                                        ) : (

                                            <FontAwesomeIcon icon={faFile} className="text-4xl text-[var(--muted-text)]" />

                                        )}

                                        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">

                                            {item.kind === "image" ? "Image" : item.kind === "video" ? "Video" : "File"}

                                        </span>

                                        <span className="absolute bottom-3 right-3 rounded-lg bg-black/55 px-2.5 py-1 text-xs font-medium text-white opacity-0 backdrop-blur transition group-hover:opacity-100">

                                            Click to preview

                                        </span>

                                    </button>

                                    <div className="border-t border-[var(--border-color)] bg-[var(--card-background)] p-4">

                                        <div className="flex items-start justify-between gap-3">

                                            <div className="min-w-0 flex-1">

                                                <p className="truncate text-sm font-extrabold tracking-tight" title={item.name}>{item.name}</p>

                                                <p className="mt-1.5 text-xs text-[var(--muted-text)]">

                                                    {formatSize(item.size)} <span className="mx-1.5">·</span> {item.type || (item.kind === "image" ? "Image" : "Video")}

                                                </p>

                                            </div>

                                            <button

                                                type="button"

                                                onClick={() => handleDelete(item)}

                                                title={`Delete ${item.name}`}

                                                aria-label={`Delete ${item.name}`}

                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--muted-text)] transition hover:bg-rose-500/10 hover:text-rose-500"

                                            >

                                                <FontAwesomeIcon icon={faTrash} />

                                            </button>

                                        </div>

                                    </div>

                                </motion.article>

                            ))}

                        </div>

                    ) : (

                        <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-[var(--border-color)] bg-[var(--card-background)] px-5 py-16 text-center shadow-inner transition duration-300 hover:border-[#4545a0]/50">

                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#1a1a4c]/[0.07] text-2xl text-[#4545a0] shadow-inner dark:bg-indigo-300/10 dark:text-indigo-200">

                                <FontAwesomeIcon icon={faPhotoVideo} />

                            </div>

                            <h3 className="text-lg font-bold">

                                {mediaItems.length === 0 ? "Your library is ready for its first upload" : "No matching media found"}

                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted-text)]">

                                {mediaItems.length === 0

                                    ? "Upload church photos and videos to build your collection. Your saved files will appear here."

                                    : "Try a different search term or switch the media filter."}

                            </p>

                            {mediaItems.length === 0 ? (

                                <button

                                    type="button"

                                    onClick={() => fileInputRef.current?.click()}

                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#252568] to-[#4545a0] px-5 py-3 text-sm font-bold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"

                                >

                                    <FontAwesomeIcon icon={faUpload} /> Upload your first file

                                </button>

                            ) : (

                                <button

                                    type="button"

                                    onClick={() => { setSearchTerm(""); setTypeFilter("all"); }}

                                    className="mt-5 rounded-xl border border-[#4545a0]/25 bg-[#1a1a4c]/[0.04] px-4 py-2.5 text-sm font-bold transition hover:bg-[#1a1a4c]/[0.08]"

                                >

                                    Clear filters

                                </button>

                            )}

                        </div>

                    )}

                </div>

            </div>

            {previewItem && (

                <div

                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"

                    onMouseDown={(event) => {

                        if (event.target === event.currentTarget) setPreviewItem(null);

                    }}

                >

                    <div

                        role="dialog"

                        aria-modal="true"

                        aria-labelledby="media-preview-title"

                        className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-indigo-400/20 bg-[var(--card-background)] text-[var(--text)] shadow-[0_30px_100px_rgba(0,0,0,0.35)]"

                    >

                        <div className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] bg-[#1a1a4c]/[0.035] dark:bg-white/[0.025] p-4 sm:p-5">

                            <div className="min-w-0">

                                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#55558b] dark:text-indigo-200">Media preview</p>

                                <h3 id="media-preview-title" className="mt-1 truncate font-bold">{previewItem.name}</h3>

                            </div>

                            <button

                                type="button"

                                onClick={() => setPreviewItem(null)}

                                aria-label="Close preview"

                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition hover:bg-[var(--hover)]"

                            >

                                <FontAwesomeIcon icon={faTimes} />

                            </button>

                        </div>

                        <div className="flex max-h-[75vh] items-center justify-center overflow-auto bg-black/10 p-4 sm:p-6">

                            {previewItem.kind === "image" ? (

                                <img src={previewItem.url} alt={previewItem.name} className="max-h-[65vh] max-w-full rounded-lg object-contain" />

                            ) : previewItem.kind === "video" ? (

                                <video src={previewItem.url} controls className="max-h-[65vh] max-w-full rounded-lg" />

                            ) : (

                                <div className="py-12 text-center">

                                    <FontAwesomeIcon icon={faFile} className="mb-3 text-4xl text-[var(--muted-text)]" />

                                    <p className="text-sm text-[var(--muted-text)]">Preview is not available for this file type.</p>

                                </div>

                            )}

                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-color)] bg-[#1a1a4c]/[0.025] dark:bg-white/[0.02] p-4 text-xs text-[var(--muted-text)] sm:px-5">

                            <span>{previewItem.type || "Media file"}</span>

                            <span>{formatSize(previewItem.size)}</span>

                        </div>

                    </div>

                </div>

            )}

        </motion.section>

    );

};

export default Media;
