import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

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
    faFolderOpen,
    faCloudArrowUp,
    faArrowUpRightFromSquare,
    faRefresh,
} from "@fortawesome/free-solid-svg-icons";

const SERVER_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_URL = `${SERVER_URL}/api/media`;

const formatSize = (bytes) => {
    if (!Number.isFinite(Number(bytes)) || Number(bytes) < 0) {
        return "—";
    }

    if (Number(bytes) < 1024 * 1024) {
        return `${Math.max(1, Math.round(Number(bytes) / 1024))} KB`;
    }

    return `${(Number(bytes) / (1024 * 1024)).toFixed(1)} MB`;
};

const getMediaKind = (item) => {
    if (item.kind) return item.kind;

    const type = item.type || item.mimetype || "";
    const name = item.name || item.filename || "";

    if (type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name)) {
        return "image";
    }

    if (type.startsWith("video/") || /\.(mp4|mov|webm|avi|mkv)$/i.test(name)) {
        return "video";
    }

    return "other";
};

const Media = ({ token }) => {
    const shouldReduceMotion = useReducedMotion();
    const fileInputRef = useRef(null);

    const [mediaItems, setMediaItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const [notice, setNotice] = useState("");
    const [noticeType, setNoticeType] = useState("success");

    const [previewItem, setPreviewItem] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const motionDuration = shouldReduceMotion ? 0 : 0.35;

    const requestHeaders = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const showNotice = (message, type = "success") => {
        setNotice(message);
        setNoticeType(type);
    };

    const loadMedia = async () => {
        setIsLoading(true);
        setLoadError("");

        try {
            const response = await fetch(API_URL, {
                headers: requestHeaders,
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok || data.success === false) {
                throw new Error(data.message || "Could not load media files.");
            }

            const items = Array.isArray(data)
                ? data
                : data.items || data.media || data.data || [];

            const normalizedItems = items.map((item) => {
                const fileUrl = item.url || item.path || "";

                return {
                    ...item,
                    id: item._id || item.id,
                    name: item.name || item.filename || "Untitled file",
                    kind: getMediaKind(item),
                    url: fileUrl.startsWith("http")
                        ? fileUrl
                        : `${SERVER_URL}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`,
                };
            });

            setMediaItems(normalizedItems);
        } catch (error) {
            setLoadError(error.message || "Unable to connect to the media server.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMedia();
    }, [token]);

    useEffect(() => {
        if (!previewItem) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setPreviewItem(null);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => window.removeEventListener("keydown", handleEscape);
    }, [previewItem]);

    const filteredItems = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return mediaItems.filter((item) => {
            const searchableText = [
                item.name,
                item.type,
                item.kind,
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch = searchableText.includes(query);

            const matchesType =
                typeFilter === "all" ||
                (typeFilter === "images" && item.kind === "image") ||
                (typeFilter === "videos" && item.kind === "video") ||
                (typeFilter === "other" && item.kind === "other");

            return matchesSearch && matchesType;
        });
    }, [mediaItems, searchTerm, typeFilter]);

    const imageCount = mediaItems.filter(
        (item) => item.kind === "image"
    ).length;

    const videoCount = mediaItems.filter(
        (item) => item.kind === "video"
    ).length;

    const uploadFiles = async (files) => {
        if (!files.length || isUploading) return;

        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file);
        });

        setIsUploading(true);
        setNotice("");
        setLoadError("");

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: requestHeaders,
                body: formData,
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok || data.success === false) {
                throw new Error(data.message || "Media upload failed.");
            }

            await loadMedia();

            showNotice(
                `${files.length} file${files.length === 1 ? "" : "s"} uploaded successfully.`
            );
        } catch (error) {
            showNotice(
                error.message || "Unable to upload the selected files.",
                "error"
            );
        } finally {
            setIsUploading(false);
        }
    };

    const handleFiles = async (event) => {
        await uploadFiles(Array.from(event.target.files || []));
        event.target.value = "";
    };

    const handleDelete = async (item) => {
        const confirmed = window.confirm(
            `Permanently delete "${item.name}" from your media library?`
        );

        if (!confirmed || deletingId) return;

        setDeletingId(item.id);
        setNotice("");

        try {
            const response = await fetch(`${API_URL}/${item.id}`, {
                method: "DELETE",
                headers: requestHeaders,
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok || data.success === false) {
                throw new Error(data.message || "Could not delete this media file.");
            }

            setMediaItems((current) =>
                current.filter((media) => media.id !== item.id)
            );

            if (previewItem?.id === item.id) {
                setPreviewItem(null);
            }

            showNotice("Media file deleted successfully.");
        } catch (error) {
            showNotice(
                error.message || "Unable to delete this media file.",
                "error"
            );
        } finally {
            setDeletingId(null);
        }
    };

    const cardClass =
        "shadow-xl shadow-[var(--card-shadow)] bg-[var(--card-background)]";

    const buttonClass =
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

    const secondaryButton =
        `${buttonClass} bg-[var(--button-background)] text-[var(--button-text)] hover:bg-[var(--button-hover)]`;

    const inputClass =
        "h-10 rounded-md border border-[var(--border-color)] bg-[var(--input-background)] text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted-text)] focus:border-[#C51D27]";

    return (
        <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionDuration, ease: "easeOut" }}
            className="min-w-0 space-y-5 pb-6 text-[var(--text)]"
        >
            {/* Page heading */}

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                        Content management
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight">
                        Media Library
                    </h1>

                    <p className="mt-1 text-sm text-[var(--muted-text)]">
                        Manage photos and videos for your church website.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={loadMedia}
                        disabled={isLoading}
                        className={secondaryButton}
                    >
                        <FontAwesomeIcon
                            icon={faRefresh}
                            className={isLoading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className={`${buttonClass} bg-[#292929] text-white hover:bg-[#414141] dark:bg-[#E7E5E2] dark:text-[#171717] dark:hover:bg-white`}
                    >
                        <FontAwesomeIcon icon={faUpload} />
                        {isUploading ? "Uploading..." : "Upload media"}
                    </button>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFiles}
            />

            {/* Compact summary */}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[var(--border-color)] pb-4">
                <div className="flex items-center gap-2 text-xs">
                    <FontAwesomeIcon
                        icon={faPhotoVideo}
                        className="text-[var(--muted-text)]"
                    />
                    <span className="font-semibold">{mediaItems.length}</span>
                    <span className="text-[var(--muted-text)]">Total files</span>
                </div>

                <span className="hidden h-4 w-px bg-[var(--border-color)] sm:block" />

                <div className="flex items-center gap-2 text-xs">
                    <FontAwesomeIcon
                        icon={faImage}
                        className="text-[var(--muted-text)]"
                    />
                    <span className="font-semibold">{imageCount}</span>
                    <span className="text-[var(--muted-text)]">Images</span>
                </div>

                <span className="hidden h-4 w-px bg-[var(--border-color)] sm:block" />

                <div className="flex items-center gap-2 text-xs">
                    <FontAwesomeIcon
                        icon={faVideo}
                        className="text-[var(--muted-text)]"
                    />
                    <span className="font-semibold">{videoCount}</span>
                    <span className="text-[var(--muted-text)]">Videos</span>
                </div>
            </div>

            {/* Notification */}

            <AnimatePresence>
                {(notice || loadError) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -5 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -5 }}
                        className={`flex items-center justify-between gap-3 rounded-md border px-4 py-3 text-xs ${loadError || noticeType === "error"
                                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
                                : "border-[var(--border-color)] bg-[var(--card-background)] text-[var(--text)]"
                            }`}
                    >
                        <span>{loadError || notice}</span>

                        <button
                            type="button"
                            onClick={() => {
                                setNotice("");
                                setLoadError("");
                            }}
                            aria-label="Dismiss notification"
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md hover:bg-black/5"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upload area */}

            <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: motionDuration, delay: 0.05 }}
                onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={(event) => {
                    if (event.currentTarget === event.target) {
                        setIsDragging(false);
                    }
                }}
                onDrop={async (event) => {
                    event.preventDefault();
                    setIsDragging(false);

                    await uploadFiles(
                        Array.from(event.dataTransfer.files || [])
                    );
                }}
                className={`flex flex-col items-center justify-center gap-3 rounded-md border border-dashed px-5 py-5 text-center transition sm:flex-row sm:text-left ${isDragging
                        ? "border-[#C51D27] bg-[#C51D27]/5"
                        : "border-[var(--border-color)] bg-[var(--card-background)] hover:border-[var(--muted-text)]"
                    }`}
            >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[var(--hover)] text-[var(--muted-text)]">
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                        {isDragging ? "Drop files to upload" : "Add media to your library"}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted-text)]">
                        Drag files here or browse your device. Images and videos are supported.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className={`${secondaryButton} shrink-0`}
                >
                    Browse files
                </button>
            </motion.div>

            {/* Collection */}

            <div className={`overflow-hidden rounded-md ${cardClass}`}>
                <div className="flex flex-col justify-between gap-3 border-b border-[var(--border-color)] px-4 py-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-sm font-semibold">
                            Your collection
                        </h2>

                        <p className="mt-1 text-xs text-[var(--muted-text)]">
                            {filteredItems.length}{" "}
                            {filteredItems.length === 1 ? "file" : "files"}
                            {" "}shown
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="relative sm:w-60">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-text)]"
                            />

                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search media..."
                                aria-label="Search media files"
                                className={`${inputClass} w-full pl-9 pr-3`}
                            />
                        </div>

                        <select
                            value={typeFilter}
                            onChange={(event) => setTypeFilter(event.target.value)}
                            aria-label="Filter media by type"
                            className={`${inputClass} px-3`}
                        >
                            <option value="all">All media</option>
                            <option value="images">Images</option>
                            <option value="videos">Videos</option>
                            <option value="other">Other files</option>
                        </select>
                    </div>
                </div>

                <div className="p-4">
                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="animate-pulse overflow-hidden rounded-md border border-[var(--border-color)]"
                                >
                                    <div className="aspect-[4/3] bg-[var(--hover)]" />

                                    <div className="space-y-2 p-3">
                                        <div className="h-3 w-3/4 rounded bg-[var(--hover)]" />
                                        <div className="h-3 w-1/3 rounded bg-[var(--hover)]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredItems.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: shouldReduceMotion ? 0 : 0.045,
                                    },
                                },
                            }}
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                        >
                            {filteredItems.map((item) => (
                                <motion.article
                                    key={item.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 8 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                    transition={{ duration: motionDuration }}
                                    className={`group min-w-0 overflow-hidden rounded-md border border-[var(--border-color)] bg-[var(--card-background)] transition duration-200 hover:border-[var(--muted-text)] ${deletingId === item.id ? "opacity-50" : ""
                                        }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setPreviewItem(item)}
                                        className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[var(--hover)]"
                                        aria-label={`Preview ${item.name}`}
                                    >
                                        {item.kind === "image" ? (
                                            <img
                                                src={item.url}
                                                alt={item.name}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"
                                            />
                                        ) : item.kind === "video" ? (
                                            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[var(--muted-text)]">
                                                <FontAwesomeIcon
                                                    icon={faVideo}
                                                    className="text-3xl"
                                                />

                                                <span className="text-xs font-medium">
                                                    Video
                                                </span>
                                            </div>
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faFile}
                                                className="text-3xl text-[var(--muted-text)]"
                                            />
                                        )}

                                        <span className="absolute left-2.5 top-2.5 rounded-sm bg-black/60 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-white">
                                            {item.kind === "image"
                                                ? "Image"
                                                : item.kind === "video"
                                                    ? "Video"
                                                    : "File"}
                                        </span>

                                        <span className="absolute bottom-2.5 right-2.5 rounded-sm bg-black/60 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                                            Preview
                                        </span>
                                    </button>

                                    <div className="flex items-center justify-between gap-3 border-t border-[var(--border-color)] px-3 py-3">
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className="truncate text-xs font-semibold"
                                                title={item.name}
                                            >
                                                {item.name}
                                            </p>

                                            <p className="mt-1 text-[10px] text-[var(--muted-text)]">
                                                {formatSize(item.size)}
                                                <span className="mx-1.5">·</span>
                                                {item.type || item.kind}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item)}
                                            disabled={deletingId === item.id}
                                            title={`Delete ${item.name}`}
                                            aria-label={`Delete ${item.name}`}
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--muted-text)] transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                            <div className="mb-3 grid h-11 w-11 place-items-center rounded-md bg-[var(--hover)] text-[var(--muted-text)]">
                                <FontAwesomeIcon icon={faFolderOpen} />
                            </div>

                            <h3 className="text-sm font-semibold">
                                {mediaItems.length === 0
                                    ? "Your media library is empty"
                                    : "No matching media"}
                            </h3>

                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-[var(--muted-text)]">
                                {mediaItems.length === 0
                                    ? "Upload photos and videos to get started."
                                    : "Try a different search term or filter."}
                            </p>

                            {mediaItems.length === 0 ? (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`${buttonClass} mt-4 bg-[#292929] text-white hover:bg-[#414141] dark:bg-[#E7E5E2] dark:text-[#171717]`}
                                >
                                    <FontAwesomeIcon icon={faUpload} />
                                    Upload media
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setTypeFilter("all");
                                    }}
                                    className={`${secondaryButton} mt-4`}
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Media preview */}

            <AnimatePresence>
                {previewItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-5"
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) {
                                setPreviewItem(null);
                            }
                        }}
                    >
                        <motion.div
                            initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.99 }}
                            transition={{ duration: motionDuration }}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="media-preview-title"
                            className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-md border border-[var(--border-color)] bg-[var(--card-background)] text-[var(--text)] shadow-2xl"
                        >
                            <div className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] px-4 py-3">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">
                                        Media preview
                                    </p>

                                    <h3
                                        id="media-preview-title"
                                        className="mt-1 truncate text-sm font-semibold"
                                    >
                                        {previewItem.name}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-1">
                                    <a
                                        href={previewItem.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        title="Open media in new tab"
                                        className="grid h-8 w-8 place-items-center rounded-md text-[var(--muted-text)] transition hover:bg-[var(--hover)]"
                                    >
                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => setPreviewItem(null)}
                                        aria-label="Close preview"
                                        className="grid h-8 w-8 place-items-center rounded-md text-[var(--muted-text)] transition hover:bg-[var(--hover)]"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex max-h-[75vh] items-center justify-center overflow-auto bg-black/5 p-3 sm:p-5">
                                {previewItem.kind === "image" ? (
                                    <img
                                        src={previewItem.url}
                                        alt={previewItem.name}
                                        className="max-h-[65vh] max-w-full object-contain"
                                    />
                                ) : previewItem.kind === "video" ? (
                                    <video
                                        src={previewItem.url}
                                        controls
                                        className="max-h-[65vh] max-w-full"
                                    />
                                ) : (
                                    <div className="py-12 text-center">
                                        <FontAwesomeIcon
                                            icon={faFile}
                                            className="mb-3 text-3xl text-[var(--muted-text)]"
                                        />

                                        <p className="text-sm text-[var(--muted-text)]">
                                            Preview is not available for this file type.
                                        </p>

                                        <a
                                            href={previewItem.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-3 inline-block text-xs font-semibold text-[#C51D27] hover:underline"
                                        >
                                            Open file
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between gap-3 border-t border-[var(--border-color)] px-4 py-3 text-xs text-[var(--muted-text)]">
                                <span>{previewItem.type || "Media file"}</span>
                                <span>{formatSize(previewItem.size)}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
};

export default Media;