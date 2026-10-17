import React, { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faPlus,
    faPen,
    faTrash,
    faTimes,
    faUsers,
    faFilter,
    faEllipsisVertical,
    faEnvelope,
    faUserShield,
    faUserCheck,
    faArrowUpRightFromSquare,
    faShieldHalved,
    faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

const inputClass =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50/80 px-3.5 py-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100/70 dark:border-neutral-700 dark:bg-[#101112] dark:text-white dark:focus:border-indigo-500 dark:focus:bg-[#141618] dark:focus:ring-indigo-950/60";

const labelClass =
    "mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300";

const panelClass =
    "rounded-2xl border border-neutral-200/80 bg-white shadow-[0_12px_36px_-24px_rgba(26,26,76,0.28)] dark:border-neutral-800 dark:bg-[#141618] dark:shadow-black/10";

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0 },
};

export default function Users() {
    const shouldReduceMotion = useReducedMotion();

    const emptyForm = {
        name: "",
        email: "",
        role: "Viewer",
        status: "Active",
    };

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All roles");
    const [statusFilter, setStatusFilter] = useState("All statuses");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [menuId, setMenuId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState("");

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const query = search.trim().toLowerCase();
            const matchesSearch = `${user.name} ${user.email} ${user.role}`
                .toLowerCase()
                .includes(query);
            const matchesRole =
                roleFilter === "All roles" || user.role === roleFilter;
            const matchesStatus =
                statusFilter === "All statuses" || user.status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, search, roleFilter, statusFilter]);

    const activeCount = users.filter((user) => user.status === "Active").length;
    const adminCount = users.filter((user) => user.role === "Admin").length;

    const openAddForm = () => {
        setEditingId(null);
        setForm({ ...emptyForm });
        setFormError("");
        setMenuId(null);
        setShowForm(true);
    };

    const openEditForm = (user) => {
        setEditingId(user.id);
        setForm({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        });
        setFormError("");
        setMenuId(null);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm({ ...emptyForm });
        setFormError("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const name = form.name.trim();
        const email = form.email.trim().toLowerCase();

        if (!name || !email) {
            setFormError("Please complete the name and email fields.");
            return;
        }

        const emailExists = users.some(
            (user) =>
                user.email.toLowerCase() === email && user.id !== editingId
        );

        if (emailExists) {
            setFormError("A user with this email address already exists.");
            return;
        }

        if (editingId !== null) {
            setUsers((currentUsers) =>
                currentUsers.map((user) =>
                    user.id === editingId ? { ...user, ...form, name, email } : user
                )
            );
        } else {
            setUsers((currentUsers) => [
                ...currentUsers,
                {
                    ...form,
                    name,
                    email,
                    id: Date.now(),
                    joined: new Date().toLocaleDateString(),
                },
            ]);
        }

        closeForm();
    };

    const handleDelete = (user) => {
        const confirmed = window.confirm(
            `Are you sure you want to remove ${user.name}?`
        );

        if (confirmed) {
            setUsers((currentUsers) =>
                currentUsers.filter((item) => item.id !== user.id)
            );
        }

        setMenuId(null);
    };

    const getInitials = (name) =>
        name
            .trim()
            .split(/\s+/)
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

    const enterTransition = shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.42, ease: "easeOut" };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: shouldReduceMotion
                        ? { staggerChildren: 0 }
                        : { staggerChildren: 0.08, delayChildren: 0.02 },
                },
            }}
            className="space-y-6 pb-8 text-neutral-900 dark:text-white"
        >
            {/* Heading */}
            <motion.div
                variants={fadeUp}
                transition={enterTransition}
                className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
            >
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a4c] dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        People & access
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-[34px]">
                        Users
                        <span className="ml-2 align-middle text-neutral-300 dark:text-neutral-700">
                            /
                        </span>
                        <span className="ml-2 align-middle text-base font-medium tracking-normal text-neutral-400 dark:text-neutral-500">
                            Team management
                        </span>
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                        Keep your dashboard team organized and manage who has access to
                        your workspace.
                    </p>
                </div>

                <motion.button
                    type="button"
                    onClick={openAddForm}
                    whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#1a1a4c] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/15 transition hover:bg-[#292967] focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:shadow-black/20 dark:focus:ring-indigo-950"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Add user
                </motion.button>
            </motion.div>

            {/* Compact overview strip, intentionally not a repeated row of dashboard cards */}
            <motion.div
                variants={fadeUp}
                transition={enterTransition}
                className={`${panelClass} grid grid-cols-1 divide-y divide-neutral-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-neutral-800`}
            >
                <div className="flex items-center gap-3.5 px-5 py-4">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-[#1a1a4c] dark:bg-indigo-950/50 dark:text-indigo-300">
                        <FontAwesomeIcon icon={faUsers} />
                    </span>
                    <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Total users
                        </p>
                        <p className="mt-0.5 text-xl font-bold tracking-tight">
                            {users.length}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3.5 px-5 py-4">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <FontAwesomeIcon icon={faUserCheck} />
                    </span>
                    <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Active accounts
                        </p>
                        <p className="mt-0.5 text-xl font-bold tracking-tight">
                            {activeCount}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3.5 px-5 py-4">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                        <FontAwesomeIcon icon={faUserShield} />
                    </span>
                    <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Administrators
                        </p>
                        <p className="mt-0.5 text-xl font-bold tracking-tight">
                            {adminCount}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Main table panel */}
            <motion.div
                variants={fadeUp}
                transition={enterTransition}
                className={`${panelClass} overflow-visible`}
            >
                <div className="flex flex-col gap-4 border-b border-neutral-100 p-4 dark:border-neutral-800 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-sm font-bold">All users</h2>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            View, search, and update team access.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="relative min-w-0 sm:w-64">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search users..."
                                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/80 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100/70 dark:border-neutral-700 dark:bg-[#101112] dark:text-white dark:focus:border-indigo-500 dark:focus:bg-[#141618] dark:focus:ring-indigo-950/60"
                            />
                        </div>

                        <label className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 dark:border-neutral-700 dark:bg-[#101112]">
                            <FontAwesomeIcon
                                icon={faFilter}
                                className="text-xs text-neutral-400"
                            />
                            <select
                                aria-label="Filter users by role"
                                value={roleFilter}
                                onChange={(event) => setRoleFilter(event.target.value)}
                                className="min-w-0 bg-transparent py-2.5 text-xs text-neutral-700 outline-none dark:text-neutral-200"
                            >
                                <option>All roles</option>
                                <option>Admin</option>
                                <option>Editor</option>
                                <option>Viewer</option>
                            </select>
                        </label>

                        <select
                            aria-label="Filter users by status"
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs text-neutral-700 outline-none focus:border-indigo-400 dark:border-neutral-700 dark:bg-[#101112] dark:text-neutral-200"
                        >
                            <option>All statuses</option>
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 px-5 py-4">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Showing{" "}
                        <span className="font-bold text-neutral-800 dark:text-neutral-100">
                            {filteredUsers.length}
                        </span>{" "}
                        of {users.length} {users.length === 1 ? "user" : "users"}
                    </p>

                    {(search ||
                        roleFilter !== "All roles" ||
                        statusFilter !== "All statuses") && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setRoleFilter("All roles");
                                    setStatusFilter("All statuses");
                                }}
                                className="text-xs font-semibold text-[#1a1a4c] transition hover:underline dark:text-indigo-300"
                            >
                                Clear filters
                            </button>
                        )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left">
                        <thead>
                            <tr className="bg-neutral-50/90 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500 dark:bg-[#181a1d] dark:text-neutral-400">
                                <th className="px-5 py-3.5 sm:px-6">User</th>
                                <th className="px-4 py-3.5">Role</th>
                                <th className="px-4 py-3.5">Status</th>
                                <th className="px-4 py-3.5">Date added</th>
                                <th className="px-5 py-3.5 text-right sm:px-6">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            <AnimatePresence initial={false}>
                                {filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        layout={!shouldReduceMotion}
                                        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -8 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="group transition-colors hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10"
                                    >
                                        <td className="px-5 py-4 sm:px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-xs font-bold text-[#1a1a4c] ring-1 ring-indigo-200/50 dark:from-indigo-950 dark:to-violet-950 dark:text-indigo-200 dark:ring-indigo-900/60">
                                                    {getInitials(user.name)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                                                        {user.name}
                                                    </p>
                                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                                                        <FontAwesomeIcon
                                                            icon={faEnvelope}
                                                            className="text-[10px]"
                                                        />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${user.role === "Admin"
                                                    ? "bg-violet-50 text-violet-700 ring-1 ring-violet-200/70 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/60"
                                                    : user.role === "Editor"
                                                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200/70 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900/60"
                                                        : "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200/70 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700"
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${user.status === "Active"
                                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                                                    }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${user.status === "Active"
                                                        ? "bg-emerald-500"
                                                        : "bg-neutral-400"
                                                        }`}
                                                />
                                                {user.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-xs text-neutral-500 dark:text-neutral-400">
                                            {user.joined || "—"}
                                        </td>

                                        <td className="px-5 py-4 sm:px-6">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    type="button"
                                                    aria-label={`Edit ${user.name}`}
                                                    onClick={() => openEditForm(user)}
                                                    className="grid h-9 w-9 place-items-center rounded-xl text-neutral-500 transition hover:bg-indigo-50 hover:text-[#1a1a4c] dark:hover:bg-neutral-800 dark:hover:text-indigo-300"
                                                >
                                                    <FontAwesomeIcon icon={faPen} className="text-xs" />
                                                </button>

                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        aria-label={`More actions for ${user.name}`}
                                                        onClick={() =>
                                                            setMenuId(menuId === user.id ? null : user.id)
                                                        }
                                                        className="grid h-9 w-9 place-items-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faEllipsisVertical}
                                                            className="text-sm"
                                                        />
                                                    </button>

                                                    <AnimatePresence>
                                                        {menuId === user.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -5, scale: 0.98 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: -5, scale: 0.98 }}
                                                                transition={{ duration: 0.15 }}
                                                                className="absolute right-0 top-10 z-30 w-44 origin-top-right rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl shadow-neutral-900/10 dark:border-neutral-700 dark:bg-[#1b1d20] dark:shadow-black/30"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openEditForm(user)}
                                                                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                                                >
                                                                    <FontAwesomeIcon icon={faPen} />
                                                                    Edit user
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDelete(user)}
                                                                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                    Remove user
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Empty state */}
                {filteredUsers.length === 0 && (
                    <motion.div
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center px-6 py-16 text-center"
                    >
                        <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-[#1a1a4c] ring-1 ring-indigo-100 dark:from-indigo-950/60 dark:to-violet-950/60 dark:text-indigo-200 dark:ring-indigo-900/60">
                            <FontAwesomeIcon icon={faUsers} className="text-xl" />
                        </div>

                        <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                            {users.length ? "No users found" : "Your team starts here"}
                        </h3>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                            {users.length
                                ? "Try changing your search or filters to find the user you're looking for."
                                : "Add your first dashboard user to start organizing team access and responsibilities."}
                        </p>

                        {users.length === 0 && (
                            <button
                                type="button"
                                onClick={openAddForm}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1a1a4c] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-950/10 transition hover:-translate-y-0.5 hover:bg-[#292967] dark:shadow-black/20"
                            >
                                <FontAwesomeIcon icon={faUserPlus} />
                                Add your first user
                            </button>
                        )}
                    </motion.div>
                )}

                <div className="flex flex-col gap-2 border-t border-neutral-100 px-5 py-3.5 text-[10px] text-neutral-400 dark:border-neutral-800 dark:text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
                    <span>Showing {filteredUsers.length} result(s)</span>
                    <span className="inline-flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faShieldHalved} />
                        Role changes are currently local to this interface
                    </span>
                </div>
            </motion.div>

            {/* Animated add/edit modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        key="user-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-neutral-950/60 p-4 backdrop-blur-sm"
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) closeForm();
                        }}
                    >
                        <motion.form
                            initial={
                                shouldReduceMotion
                                    ? false
                                    : { opacity: 0, y: 18, scale: 0.98 }
                            }
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{
                                duration: shouldReduceMotion ? 0 : 0.23,
                                ease: "easeOut",
                            }}
                            onSubmit={handleSubmit}
                            onMouseDown={(event) => event.stopPropagation()}
                            className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-950/20 dark:border-neutral-800 dark:bg-[#141618] dark:shadow-black/40"
                        >
                            <div className="border-b border-neutral-100 bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/70 px-5 py-5 dark:border-neutral-800 dark:from-indigo-950/40 dark:via-[#141618] dark:to-violet-950/30 sm:px-7">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a4c] dark:text-indigo-300">
                                            {editingId !== null ? "Update account" : "Team workspace"}
                                        </p>
                                        <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
                                            {editingId !== null ? "Edit user" : "Add a new user"}
                                        </h2>
                                        <p className="mt-1.5 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                                            Set up the user's details and dashboard role.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={closeForm}
                                        aria-label="Close form"
                                        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-neutral-500 transition hover:bg-white hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 px-5 py-5 sm:px-7">
                                <label className="block">
                                    <span className={labelClass}>Full name</span>
                                    <input
                                        required
                                        autoFocus
                                        value={form.name}
                                        onChange={(event) => {
                                            setForm({ ...form, name: event.target.value });
                                            setFormError("");
                                        }}
                                        placeholder="e.g. John Okafor"
                                        className={inputClass}
                                    />
                                </label>

                                <label className="block">
                                    <span className={labelClass}>Email address</span>
                                    <input
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={(event) => {
                                            setForm({ ...form, email: event.target.value });
                                            setFormError("");
                                        }}
                                        placeholder="name@example.com"
                                        className={inputClass}
                                    />
                                </label>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <label className="block">
                                        <span className={labelClass}>Dashboard role</span>
                                        <select
                                            value={form.role}
                                            onChange={(event) =>
                                                setForm({ ...form, role: event.target.value })
                                            }
                                            className={inputClass}
                                        >
                                            <option>Admin</option>
                                            <option>Editor</option>
                                            <option>Viewer</option>
                                        </select>
                                    </label>

                                    <label className="block">
                                        <span className={labelClass}>Account status</span>
                                        <select
                                            value={form.status}
                                            onChange={(event) =>
                                                setForm({ ...form, status: event.target.value })
                                            }
                                            className={inputClass}
                                        >
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </select>
                                    </label>
                                </div>

                                {formError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                                    >
                                        {formError}
                                    </motion.p>
                                )}

                                <div className="flex items-start gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5 text-xs leading-5 text-indigo-950 dark:border-indigo-900/50 dark:bg-indigo-950/25 dark:text-indigo-200">
                                    <FontAwesomeIcon
                                        icon={faShieldHalved}
                                        className="mt-0.5 shrink-0"
                                    />
                                    <p>
                                        This saves a user record in the current interface only.
                                        Login credentials and real permissions require backend
                                        integration.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-2 border-t border-neutral-100 bg-neutral-50/70 px-5 py-4 dark:border-neutral-800 dark:bg-[#101112] sm:flex-row sm:justify-end sm:px-7">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-[#181a1d] dark:text-neutral-200 dark:hover:bg-neutral-800"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a1a4c] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-950/10 transition hover:bg-[#292967] focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:shadow-black/20 dark:focus:ring-indigo-950"
                                >
                                    <FontAwesomeIcon icon={editingId !== null ? faPen : faPlus} />
                                    {editingId !== null ? "Save changes" : "Add user"}
                                </button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
