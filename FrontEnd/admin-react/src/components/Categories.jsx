
import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLayerGroup,
    faSearch,
    faPlus,
    faPen,
    faTrash,
    faTimes,
    faBookOpen,
} from "@fortawesome/free-solid-svg-icons";

const Categories = ({ categories = [], setCategories }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [formError, setFormError] = useState("");
    const [notice, setNotice] = useState("");

    const filteredCategories = useMemo(() => {
        return categories.filter((category) =>
            category.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
    }, [categories, searchTerm]);

    const resetForm = () => {
        setCategoryName("");
        setEditingCategory(null);
        setFormError("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const name = categoryName.trim();

        if (!name) {
            setFormError("Please enter a category name.");
            return;
        }

        const duplicate = categories.some(
            (category) =>
                category.toLowerCase() === name.toLowerCase() &&
                category !== editingCategory
        );

        if (duplicate) {
            setFormError("This category already exists.");
            return;
        }

        if (editingCategory) {
            setCategories((previous) =>
                previous.map((category) =>
                    category === editingCategory ? name : category
                )
            );
            setNotice(`"${editingCategory}" was updated to "${name}".`);
        } else {
            setCategories((previous) => [...previous, name]);
            setNotice(`"${name}" was added successfully.`);
        }

        resetForm();
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setCategoryName(category);
        setFormError("");
        setNotice("");
    };

    const handleDelete = (category) => {
        const confirmed = window.confirm(
            `Delete "${category}"? Existing sermons using this category may still retain its name.`
        );

        if (!confirmed) return;

        setCategories((previous) =>
            previous.filter((item) => item !== category)
        );

        if (editingCategory === category) resetForm();

        setNotice(`"${category}" was deleted.`);
    };

    return (
        <section className="space-y-6 text-[var(--text)]">
            {/* Page heading */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold">Categories</h2>
                    <p className="mt-1 text-sm text-[var(--muted-text)]">
                        Organize your sermons into meaningful categories.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        resetForm();
                        setNotice("");
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#1a1a4c] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Add Category
                </button>
            </div>

            {/* Summary card */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-background)] p-5 shadow-[0_5px_24px_var(--card-shadow)]">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                        <FontAwesomeIcon icon={faLayerGroup} />
                    </div>
                    <div>
                        <p className="text-sm text-[var(--muted-text)]">
                            Total Categories
                        </p>
                        <h3 className="text-2xl font-bold">{categories.length}</h3>
                    </div>
                </div>
            </div>

            {/* Add/Edit form */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-background)] p-5 shadow-[0_5px_24px_var(--card-shadow)]">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-semibold">
                        {editingCategory ? "Edit Category" : "Create a Category"}
                    </h3>

                    {(editingCategory || categoryName) && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-md p-2 text-[var(--muted-text)] hover:bg-[var(--hover)]"
                            aria-label="Cancel editing"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(event) => {
                            setCategoryName(event.target.value);
                            setFormError("");
                        }}
                        placeholder="Enter category name, e.g. Faith"
                        className="min-w-0 flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[#1a1a4c]"
                    />

                    <button
                        type="submit"
                        className="rounded-lg bg-[#1a1a4c] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                    >
                        {editingCategory ? "Save Changes" : "Save Category"}
                    </button>
                </form>

                {formError && (
                    <p className="mt-3 text-sm text-rose-500">{formError}</p>
                )}
                {notice && (
                    <p className="mt-3 text-sm text-emerald-600">{notice}</p>
                )}
            </div>

            {/* Category list */}
            <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-background)] shadow-[0_5px_24px_var(--card-shadow)]">
                <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-color)] p-5 sm:flex-row sm:items-center">
                    <div>
                        <h3 className="font-semibold">All Categories</h3>
                        <p className="mt-1 text-sm text-[var(--muted-text)]">
                            {filteredCategories.length}{" "}
                            {filteredCategories.length === 1 ? "category" : "categories"} found
                        </p>
                    </div>

                    <div className="relative w-full sm:max-w-xs">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]"
                        />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search categories..."
                            className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] py-3 pl-10 pr-3 text-sm text-[var(--text)] outline-none focus:border-[#1a1a4c]"
                        />
                    </div>
                </div>

                {filteredCategories.length > 0 ? (
                    <div className="divide-y divide-[var(--border-color)]">
                        {filteredCategories.map((category, index) => (
                            <div
                                key={category}
                                className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-[var(--hover)]"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                                        <FontAwesomeIcon icon={faBookOpen} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">{category}</p>
                                        <p className="text-xs text-[var(--muted-text)]">
                                            Category {index + 1}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(category)}
                                        title={`Edit ${category}`}
                                        aria-label={`Edit ${category}`}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted-text)] transition hover:bg-[var(--hover)] hover:text-[#1a1a4c]"
                                    >
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(category)}
                                        title={`Delete ${category}`}
                                        aria-label={`Delete ${category}`}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted-text)] transition hover:bg-rose-50 hover:text-rose-600"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-5 py-12 text-center">
                        <FontAwesomeIcon
                            icon={faLayerGroup}
                            className="mb-3 text-3xl text-[var(--muted-text)]"
                        />
                        <p className="font-medium">No categories found</p>
                        <p className="mt-1 text-sm text-[var(--muted-text)]">
                            Try another search or create a new category.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Categories;
