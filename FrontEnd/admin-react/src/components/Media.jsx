import { useEffect, useMemo, useRef, useState } from "react";
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

const formatSize = (bytes) => {
    if (!Number.isFinite(bytes) || bytes < 0) return "—";
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Media = () => {
    const fileInputRef = useRef(null);
    const [mediaItems, setMediaItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [notice, setNotice] = useState("");
    const [previewItem, setPreviewItem] = useState(null);

    useEffect(() => {
        return () => {
            mediaItems.forEach((item) => URL.revokeObjectURL(item.url));
        };
        // Object URLs should be released when this page unmounts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredItems = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return mediaItems.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(query);
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

    const handleFiles = (event) => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;

        const newItems = files.map((file) => {
            const kind = file.type.startsWith("image/")
                ? "image"
                : file.type.startsWith("video/")
                    ? "video"
                    : "other";

            return {
                id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
                name: file.name,
                kind,
                size: file.size,
                type: file.type || "Unknown file type",
                url: URL.createObjectURL(file),
                file,
                addedAt: new Date(),
            };
        });

        setMediaItems((current) => [...newItems, ...current]);
        setNotice(
            `${newItems.length} file${newItems.length === 1 ? "" : "s"} added for this session.`
        );
        event.target.value = "";
    };

    const handleDelete = (item) => {
        const confirmed = window.confirm(`Remove "${item.name}" from this media list?`);
        if (!confirmed) return;

        URL.revokeObjectURL(item.url);
        setMediaItems((current) => current.filter((media) => media.id !== item.id));
        if (previewItem?.id === item.id) setPreviewItem(null);
        setNotice(`"${item.name}" was removed from this session.`);
    };

    return (
        <section className="min-w-0 space-y-6 text-[var(--text)]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold">Media Library</h2>
                    <p className="mt-1 text-sm text-[var(--muted-text)]">
                        View and manage images, videos, and other media files.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1a1a4c] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    <FontAwesomeIcon icon={faUpload} />
                    Upload Media
                </button>

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
                    className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                    {
                        label: "Total Files",
                        value: mediaItems.length,
                        icon: faPhotoVideo,
                        tone: "bg-violet-100 text-violet-700",
                    },
                    {
                        label: "Images",
                        value: imageCount,
                        icon: faImage,
                        tone: "bg-emerald-100 text-emerald-700",
                    },
                    {
                        label: "Videos",
                        value: videoCount,
                        icon: faVideo,
                        tone: "bg-blue-100 text-blue-700",
                    },
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
                        placeholder="Search media files..."
                        aria-label="Search media files"
                        className="h-11 w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] pl-9 pr-3 text-sm outline-none focus:border-[#1a1a4c]"
                    />
                </div>

                <select
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value)}
                    aria-label="Filter media by type"
                    className="h-11 rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] px-3 text-sm outline-none focus:border-[#1a1a4c]"
                >
                    <option value="all">All media</option>
                    <option value="images">Images</option>
                    <option value="videos">Videos</option>
                    <option value="other">Other files</option>
                </select>
            </div>

            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredItems.map((item) => (
                        <article
                            key={item.id}
                            className="min-w-0 overflow-hidden rounded-2xl bg-[var(--card-background)] shadow-[0_5px_24px_var(--card-shadow)]"
                        >
                            <button
                                type="button"
                                onClick={() => setPreviewItem(item)}
                                className="flex h-48 w-full items-center justify-center overflow-hidden bg-[var(--hover)]"
                                aria-label={`Preview ${item.name}`}
                            >
                                {item.kind === "image" ? (
                                    <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                                ) : item.kind === "video" ? (
                                    <div className="flex flex-col items-center gap-3 text-[var(--muted-text)]">
                                        <FontAwesomeIcon icon={faVideo} className="text-4xl" />
                                        <span className="text-xs">Video preview</span>
                                    </div>
                                ) : (
                                    <FontAwesomeIcon icon={faFile} className="text-4xl text-[var(--muted-text)]" />
                                )}
                            </button>

                            <div className="flex items-start justify-between gap-3 p-4">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold" title={item.name}>{item.name}</p>
                                    <p className="mt-1 text-xs text-[var(--muted-text)]">
                                        {item.kind === "image" ? "Image" : item.kind === "video" ? "Video" : "File"} · {formatSize(item.size)}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(item)}
                                    title={`Remove ${item.name}`}
                                    aria-label={`Remove ${item.name}`}
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--muted-text)] transition hover:bg-rose-50 hover:text-rose-600"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl bg-[var(--card-background)] px-5 py-14 text-center shadow-[0_5px_24px_var(--card-shadow)]">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                        <FontAwesomeIcon icon={faPhotoVideo} className="text-xl" />
                    </div>
                    <h3 className="font-semibold">
                        {mediaItems.length === 0 ? "Your media library is empty" : "No media files found"}
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-text)]">
                        {mediaItems.length === 0
                            ? "Upload images or videos to preview them here during this browser session."
                            : "Try another search or change the file type filter."}
                    </p>
                    {mediaItems.length === 0 && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-5 rounded-lg bg-[#1a1a4c] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                        >
                            Upload your first file
                        </button>
                    )}
                </div>
            )}

            {previewItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) setPreviewItem(null);
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="media-preview-title"
                        className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-[var(--card-background)] text-[var(--text)] shadow-2xl"
                    >
                        <div className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] p-4">
                            <h3 id="media-preview-title" className="truncate font-semibold">{previewItem.name}</h3>
                            <button
                                type="button"
                                onClick={() => setPreviewItem(null)}
                                aria-label="Close preview"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-[var(--hover)]"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="flex max-h-[75vh] items-center justify-center overflow-auto bg-black/5 p-4">
                            {previewItem.kind === "image" ? (
                                <img src={previewItem.url} alt={previewItem.name} className="max-h-[65vh] max-w-full object-contain" />
                            ) : previewItem.kind === "video" ? (
                                <video src={previewItem.url} controls className="max-h-[65vh] max-w-full" />
                            ) : (
                                <div className="py-12 text-center">
                                    <FontAwesomeIcon icon={faFile} className="mb-3 text-4xl text-[var(--muted-text)]" />
                                    <p className="text-sm text-[var(--muted-text)]">Preview is not available for this file type.</p>
                                </div>
                            )}
                        </div>
                        <div className="border-t border-[var(--border-color)] p-4 text-xs text-[var(--muted-text)]">
                            {previewItem.type} · {formatSize(previewItem.size)}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Media;
