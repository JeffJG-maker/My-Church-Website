import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const unwrapEvent = (payload) => {
  if (!payload || typeof payload !== "object") return null;
  const candidate = payload.event || payload.data?.event || payload.data || payload;
  return candidate && !Array.isArray(candidate) && typeof candidate === "object" && (candidate.title || candidate.name) ? candidate : null;
};

const getEventId = (item) => String(item?._id || item?.id || item?.slug || "");

const resolveMediaUrl = (value) => {
  if (!value) return "";
  const path = typeof value === "string" ? value : value.url || value.path || value.secure_url || "";
  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  if (path.startsWith("//")) return `https:${path}`;
  return `${API_URL}/${path.replace(/^\/+/, "")}`;
};

function EventDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(() => unwrapEvent(location.state?.event));
  const [loading, setLoading] = useState(!unwrapEvent(location.state?.event));
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadEvent() {
      const passed = unwrapEvent(location.state?.event);
      if (passed && (!id || getEventId(passed) === String(id))) {
        setEvent(passed);
        setLoading(false);
        setError("");
        return;
      }
      setLoading(true);
      setError("");
      setEvent(null);
      try {
        // First use the original single-event endpoint.
        const response = await fetch(`${API_URL}/api/events/${encodeURIComponent(id)}`, { signal: controller.signal });
        if (response.ok) {
          const found = unwrapEvent(await response.json());
          if (found) {
            setEvent(found);
            return;
          }
        }
        // Some backends expose the list but not an individual-event endpoint.
        // Find the clicked event using the same ID the card used.
        const listResponse = await fetch(`${API_URL}/api/events`, { signal: controller.signal });
        if (!listResponse.ok) throw new Error(`Events request failed (${listResponse.status})`);
        const payload = await listResponse.json();
        const list = Array.isArray(payload) ? payload : (payload.events || payload.data?.events || payload.data || []);
        const match = Array.isArray(list) ? list.find((item) => getEventId(item) === String(id) || String(item.id) === String(id) || String(item._id) === String(id)) : null;
        if (!match) throw new Error("The selected event could not be found.");
        setEvent(match);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to load event details:", err);
          setError("Unable to load this event. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadEvent();
    return () => controller.abort();
  }, [id, location.state]);

  const formatDate = (value) => {
    if (!value) return "Date to be announced";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };
  const goBack = () => navigate("/events");
  const redButton = "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFF1F1] to-[#FFF8F6] px-4 py-2 text-sm font-semibold text-[#D91620] shadow-[0_5px_18px_rgba(217,22,32,0.08)] transition duration-300 hover:-translate-y-0.5 hover:from-[#FDE4E4] hover:to-[#FFF1EC] focus:outline-none focus:ring-2 focus:ring-[#D91620]/20 dark:from-[#2A1B1C] dark:to-[#211B1A] dark:text-[#FF777D] dark:hover:from-[#382021] dark:hover:to-[#2D211F]";
  const darkButton = "inline-flex items-center justify-center gap-2 rounded-full bg-[#252525] px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#111111] hover:shadow-[0_9px_24px_rgba(0,0,0,0.18)] focus:outline-none focus:ring-2 focus:ring-gray-400/30 dark:bg-[#F0F0ED] dark:text-[#202020] dark:hover:bg-white";

  if (loading) return <main className="min-h-screen bg-white px-6 py-28 dark:bg-[#111212]"><div className="mx-auto max-w-6xl animate-pulse space-y-7"><div className="h-5 w-32 rounded bg-gray-200 dark:bg-[#292B2D]"/><div className="h-14 max-w-2xl rounded bg-gray-200 dark:bg-[#292B2D]"/><div className="grid gap-6 md:grid-cols-3">{[1,2,3].map(n => <div key={n} className="h-24 rounded-xl bg-gray-100 dark:bg-[#1A1C1D]"/>)}</div><div className="h-48 rounded-xl bg-gray-100 dark:bg-[#1A1C1D]"/></div></main>;

  if (error || !event) return <main className="flex min-h-screen items-center justify-center bg-white px-6 text-[#292929] dark:bg-[#111212] dark:text-white"><div className="text-center"><i className="fa-solid fa-calendar-xmark mb-5 text-5xl text-gray-300 dark:text-gray-600"/><h1 className="mb-3 text-2xl font-bold">Event Not Found</h1><p className="mb-7 text-gray-600 dark:text-gray-400">{error || "The selected event could not be found."}</p><button type="button" onClick={goBack} className={redButton}><i className="fa-solid fa-arrow-left"/> Back to Events</button></div></main>;

  const imageUrl = resolveMediaUrl(event.image || event.imageUrl || event.thumbnail);
  const details = [
    { label: "Date", value: formatDate(event.date), icon: "fa-regular fa-calendar" },
    { label: "Time", value: event.time || "Time to be announced", icon: "fa-regular fa-clock" },
    { label: "Location", value: event.location || "Location to be announced", icon: "fa-solid fa-location-dot" },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#292929] transition-colors duration-300 dark:bg-[#111212] dark:text-[#F5F5F2]">
      <motion.section
        className="px-6 pb-12 pt-28 md:pt-36"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.2, 0.7, 0.2, 1] }}
      ><div className="mx-auto max-w-6xl">
        <p className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-[#D91620]">{event.label || "UPCOMING EVENT"}</p>
        <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{event.title || event.name}</h1>
      </div></motion.section>

      <motion.section
        className="px-6 pb-14"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.2, 0.7, 0.2, 1] }}
      ><div className="mx-auto max-w-6xl"><div className="grid gap-6 md:grid-cols-3">
        {details.map((item, index) => <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.18 + index * 0.08 }} className="flex gap-4 rounded-2xl bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.055)] dark:border dark:border-[#292B2D] dark:bg-[#1A1C1D] dark:shadow-black/10"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-[#292B2D] dark:text-gray-200"><i className={`${item.icon} text-lg`}/></div><div><p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{item.label}</p><p className="font-semibold leading-relaxed">{item.value}</p></div></motion.div>)}
      </div></div></motion.section>

      <motion.section className="px-6 pb-24" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.22, ease: [0.2, 0.7, 0.2, 1] }}><div className="mx-auto max-w-6xl">
        <div className={`grid items-stretch gap-8 lg:gap-12 ${imageUrl ? "lg:grid-cols-[1fr_0.95fr]" : "lg:max-w-4xl"}`}>
          <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.28 }} className="rounded-3xl bg-gradient-to-br from-white via-[#FFFCFB] to-[#FFF5F3] p-7 shadow-[0_16px_45px_rgba(40,24,20,0.07)] sm:p-9 dark:from-[#1A1C1D] dark:via-[#191A1B] dark:to-[#21191A] dark:shadow-black/20">
            <div className="mb-5 flex items-center gap-3"><span className="h-8 w-1 rounded-full bg-[#D91620]"/><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D91620]">Event Overview</p></div>
            <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">About This Event</h2>
            <p className="whitespace-pre-line text-base leading-8 text-gray-600 dark:text-gray-300 md:text-lg">{event.description || "Join us for a powerful time of worship, prayer, fellowship, and the Word of God."}</p>
          </motion.div>
          {imageUrl && <motion.div initial={{ opacity: 0, x: 18, scale: 0.985 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.6, delay: 0.34 }} className="group relative min-h-[280px] overflow-hidden rounded-3xl bg-gray-100 shadow-[0_18px_48px_rgba(40,24,20,0.12)] dark:bg-[#1A1C1D] dark:shadow-black/30"><img src={imageUrl} alt={event.title || "Event"} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" onError={(e) => { e.currentTarget.style.display = "none"; console.error("Event image failed to load:", imageUrl); }}/><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/5"/></motion.div>}
        </div>
        <motion.div className="mt-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.45 }}><motion.button type="button" onClick={goBack} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.18 }} className={darkButton}><i className="fa-solid fa-arrow-left"/> Back to All Events</motion.button></motion.div>
      </div></motion.section>
    </main>
  );
}

export default EventDetails;
