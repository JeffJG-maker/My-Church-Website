import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLayerGroup,
    faSearch,
    faPlus,
    faPen,
    faTrash,
    faTimes,
    faBookOpen,
    faArrowUpRightFromSquare,
    faCheck,
} from "@fortawesome/free-solid-svg-icons";

const Categories = ({ categories = [], setCategories }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [formError, setFormError] = useState("");
    const [notice, setNotice] = useState("");
    const [showForm, setShowForm] = useState(false);

    const filteredCategories = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        return categories.filter((category) => category.toLowerCase().includes(query));
    }, [categories, searchTerm]);

    const resetForm = () => {
        setCategoryName("");
        setEditingCategory(null);
        setFormError("");
        setShowForm(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const name = categoryName.trim().replace(/\s+/g, " ");
        if (!name) return setFormError("Please enter a category name.");
        const duplicate = categories.some(
            (category) => category.toLowerCase() === name.toLowerCase() && category !== editingCategory
        );
        if (duplicate) return setFormError("This category already exists.");
        if (editingCategory) {
            setCategories((previous) => previous.map((category) => category === editingCategory ? name : category));
            setNotice(`“${editingCategory}” was updated to “${name}”.`);
        } else {
            setCategories((previous) => [...previous, name]);
            setNotice(`“${name}” was added successfully.`);
        }
        resetForm();
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setCategoryName(category);
        setFormError("");
        setNotice("");
        setShowForm(true);
    };

    const handleDelete = (category) => {
        if (!window.confirm(`Delete “${category}” from your category list? Sermons already using this name may still retain it.`)) return;
        setCategories((previous) => previous.filter((item) => item !== category));
        if (editingCategory === category) resetForm();
        setNotice(`“${category}” was removed from the category list.`);
    };

    return (
        <motion.section className="space-y-6 text-[var(--text)]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                        <FontAwesomeIcon icon={faLayerGroup} /> Content management
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Sermon Categories</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-text)]">Keep your sermon library organized with clear, consistent topics that are easy for your team and congregation to browse.</p>
                </div>
                <button type="button" onClick={() => { resetForm(); setNotice(""); setShowForm(true); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--active-theme-color)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90">
                    <FontAwesomeIcon icon={faPlus} /> Add category
                </button>
            </div>

            {notice && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} role="status" className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <span className="flex items-center gap-2"><FontAwesomeIcon icon={faCheck} />{notice}</span>
                <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification"><FontAwesomeIcon icon={faTimes} /></button>
            </motion.div>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-background)] p-5 shadow-[0_4px_18px_var(--card-shadow)] sm:col-span-2">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-[var(--muted-text)]">Total categories</p>
                            <p className="mt-2 text-3xl font-bold tracking-tight">{categories.length}</p>
                            <p className="mt-1 text-xs text-[var(--muted-text)]">Topics available in your sermon category selector</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--hover)] text-[var(--text)]"><FontAwesomeIcon icon={faLayerGroup} className="text-lg" /></div>
                    </div>
                </div>
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-background)] p-5 shadow-[0_4px_18px_var(--card-shadow)]">
                    <p className="text-sm font-medium text-[var(--muted-text)]">Currently displayed</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight">{filteredCategories.length}</p>
                    <p className="mt-1 text-xs text-[var(--muted-text)]">Matching your search</p>
                </div>
            </div>

            <AnimatePresence>
                {showForm && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-background)] shadow-[0_4px_18px_var(--card-shadow)]">
                    <div className="flex items-start justify-between gap-4 border-b border-[var(--border-color)] px-5 py-4 sm:px-6">
                        <div><h3 className="font-semibold">{editingCategory ? "Edit category" : "Create a category"}</h3><p className="mt-1 text-sm text-[var(--muted-text)]">Use a short, recognizable name such as Prayer or Christian Living.</p></div>
                        <button type="button" onClick={resetForm} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--muted-text)] transition hover:bg-[var(--hover)]" aria-label="Close category form"><FontAwesomeIcon icon={faTimes} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:p-6">
                        <div className="min-w-0 flex-1"><label htmlFor="category-name" className="mb-2 block text-sm font-medium">Category name</label><input id="category-name" autoFocus value={categoryName} onChange={(event) => { setCategoryName(event.target.value); setFormError(""); }} maxLength={60} placeholder="e.g. Faith, Prayer, Christian Living" className="h-12 w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-background)] px-4 text-sm outline-none transition focus:border-[var(--active-theme-color)] focus:ring-2 focus:ring-[var(--active-theme-color)]/15" />{formError && <p role="alert" className="mt-2 text-sm text-rose-600">{formError}</p>}</div>
                        <div className="flex gap-2 sm:pt-7"><button type="button" onClick={resetForm} className="rounded-xl border border-[var(--border-color)] px-4 py-3 text-sm font-semibold transition hover:bg-[var(--hover)]">Cancel</button><button type="submit" className="rounded-xl bg-[var(--active-theme-color)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">{editingCategory ? "Save changes" : "Create category"}</button></div>
                    </form>
                </motion.div>}
            </AnimatePresence>

            <section className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-background)] shadow-[0_4px_18px_var(--card-shadow)]">
                <div className="flex flex-col gap-4 border-b border-[var(--border-color)] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div><h3 className="font-semibold">All categories</h3><p className="mt-1 text-sm text-[var(--muted-text)]">Manage the topics used to organize sermons.</p></div>
                    <label className="relative block w-full sm:max-w-sm"><FontAwesomeIcon icon={faSearch} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-text)]" /><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search category names..." aria-label="Search categories" className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-background)] pl-10 pr-4 text-sm outline-none transition focus:border-[var(--active-theme-color)] focus:ring-2 focus:ring-[var(--active-theme-color)]/15" /></label>
                </div>
                {filteredCategories.length > 0 ? <div className="divide-y divide-[var(--border-color)]">
                    {filteredCategories.map((category, index) => <motion.div layout key={category} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[var(--hover)] sm:px-6">
                        <div className="flex min-w-0 items-center gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--background)] text-[var(--muted-text)]"><FontAwesomeIcon icon={faBookOpen} /></div><div className="min-w-0"><p className="truncate text-sm font-semibold">{category}</p><p className="mt-1 text-xs text-[var(--muted-text)]">Sermon topic · Category {String(index + 1).padStart(2, "0")}</p></div></div>
                        <div className="flex shrink-0 items-center gap-1"><button type="button" onClick={() => handleEdit(category)} title={`Edit ${category}`} aria-label={`Edit ${category}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted-text)] transition hover:bg-[var(--background)] hover:text-[var(--text)]"><FontAwesomeIcon icon={faPen} /></button><button type="button" onClick={() => handleDelete(category)} title={`Delete ${category}`} aria-label={`Delete ${category}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted-text)] transition hover:bg-rose-50 hover:text-rose-600"><FontAwesomeIcon icon={faTrash} /></button></div>
                    </motion.div>)}
                </div> : <div className="px-6 py-14 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--muted-text)]"><FontAwesomeIcon icon={faSearch} /></div><p className="mt-4 font-semibold">No categories found</p><p className="mt-1 text-sm text-[var(--muted-text)]">Try another search or create a new category.</p>{searchTerm && <button type="button" onClick={() => setSearchTerm("")} className="mt-4 text-sm font-semibold underline underline-offset-4">Clear search</button>}</div>}
                <div className="flex flex-col gap-2 border-t border-[var(--border-color)] px-5 py-3 text-xs text-[var(--muted-text)] sm:flex-row sm:items-center sm:justify-between sm:px-6"><span>Showing {filteredCategories.length} of {categories.length} categories</span><span className="inline-flex items-center gap-2"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /> Changes update the category selector</span></div>
            </section>
        </motion.section>
    );
};

export default Categories;
