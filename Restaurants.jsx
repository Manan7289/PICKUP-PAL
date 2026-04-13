import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Store, ChevronRight, LogOut, Utensils,
  MapPin, Star, Loader2
} from "lucide-react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await API.get("/restaurants");
        setRestaurants(res.data);
      } catch (err) {
        setError("Could not load restaurants. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  // Palette for cards (cycles through)
  const accents = [
    "from-brand-500 to-brand-700",
    "from-emerald-500 to-emerald-700",
    "from-violet-500 to-violet-700",
    "from-amber-500 to-amber-700",
    "from-rose-500 to-rose-700",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Fixed background blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-brand-100/60 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Topbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <Utensils className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-brand-600">PickupPal</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 text-sm font-medium transition-colors px-3 py-1.5 rounded-xl hover:bg-red-50"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
            Pick your canteen 🍽️
          </h1>
          <p className="text-slate-500">Choose a restaurant and order ahead. Skip the line.</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            placeholder="Search restaurants…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-slate-800 placeholder:text-slate-400"
          />
        </motion.div>

        {/* States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p>Loading restaurants…</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 text-center">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24 text-slate-400">
            <Store className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No restaurants found</p>
            <p className="text-sm mt-1">Try a different search</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map((r, i) => (
                <motion.div
                  key={r._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => navigate(`/food/${r._id}`)}
                  className="group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Color band */}
                  <div className={`h-24 bg-gradient-to-br ${accents[i % accents.length]} flex items-center justify-center`}>
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Utensils className="text-white w-7 h-7" />
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-1">
                      {r.name}
                    </h2>

                    <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-3">
                      <MapPin size={13} />
                      <span>{r.address || "On campus"}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} className="fill-amber-400" />
                        <span className="text-sm font-medium text-slate-700">4.5</span>
                      </div>
                      <div className="flex items-center gap-1 text-brand-600 text-sm font-semibold group-hover:gap-2 transition-all">
                        View menu <ChevronRight size={15} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
