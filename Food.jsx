import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Utensils, Plus, Minus, ShoppingBag,
  X, QrCode, CheckCircle2, Loader2, IndianRupee
} from "lucide-react";
import API from "../api/api";

// QR Modal
function QRModal({ qrCode, onClose }) {
  return (
    <AnimatePresence>
      {qrCode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-green-500 w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-1">Order Placed!</h2>
            <p className="text-slate-500 text-sm mb-6">Show this QR code at the counter to collect your order.</p>

            <div className="bg-slate-50 rounded-2xl p-4 inline-block mb-6">
              <img src={qrCode} alt="QR Code" className="w-48 h-48 mx-auto" />
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-6">
              <QrCode size={16} />
              <span>Keep this code private</span>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-2xl hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Food() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState({}); // { foodId: quantity }
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");

  // Auth guard
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await API.get(`/food/${id}`);
        setFoods(res.data);
        // Grab restaurant name via separate call if needed
        try {
          const rRes = await API.get("/restaurants");
          const match = rRes.data.find((r) => r._id === id);
          if (match) setRestaurantName(match.name);
        } catch {}
      } catch (err) {
        console.error("Error fetching food", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [id]);

  const updateQty = (foodId, delta) => {
    setCart((prev) => {
      const current = prev[foodId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) delete updated[foodId];
      else updated[foodId] = next;
      return updated;
    });
  };

  const cartItems = Object.entries(cart).map(([foodId, quantity]) => ({
    foodId,
    quantity,
    food: foods.find((f) => f._id === foodId),
  }));

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = cartItems.reduce(
    (s, i) => s + (i.food?.price || 0) * i.quantity,
    0
  );

  const handleOrder = async () => {
    if (cartItems.length === 0) return;
    setOrdering(true);
    try {
      const res = await API.post("/order/create", {
        restaurantId: id,
        items: cartItems.map(({ foodId, quantity }) => ({ foodId, quantity })),
      });
      setQrCode(res.data.order.qrCode);
      setCart({}); // clear cart
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Order failed. Please try again.");
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-32">
      {/* Topbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/restaurants")}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Utensils className="text-white w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm leading-none block">
                {restaurantName || "Menu"}
              </span>
              <span className="text-xs text-slate-400 leading-none">PickupPal</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">What are you craving? 🍛</h1>
          <p className="text-slate-500 text-sm mt-1">Add items and place your order. We'll have it ready.</p>
        </motion.div>

        {loading && (
          <div className="flex flex-col items-center py-24 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p>Loading menu…</p>
          </div>
        )}

        {!loading && foods.length === 0 && (
          <div className="text-center py-24 text-slate-400">
            <Utensils className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No items available right now</p>
          </div>
        )}

        {/* Menu grid */}
        {!loading && (
          <div className="grid sm:grid-cols-2 gap-4">
            {foods.map((f, i) => {
              const qty = cart[f._id] || 0;
              return (
                <motion.div
                  key={f._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  {/* Icon placeholder */}
                  <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mb-3">
                    <Utensils className="text-brand-500 w-6 h-6" />
                  </div>

                  <div className="mb-4">
                    <h2 className="font-bold text-slate-900 text-base">{f.name}</h2>
                    {f.description && (
                      <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{f.description}</p>
                    )}
                    <div className="flex items-center gap-0.5 text-slate-800 font-bold mt-2">
                      <IndianRupee size={14} />
                      <span>{f.price}</span>
                    </div>
                  </div>

                  {/* Qty control */}
                  {qty === 0 ? (
                    <button
                      onClick={() => updateQty(f._id, 1)}
                      className="w-full py-2.5 rounded-2xl border-2 border-brand-200 text-brand-600 font-bold text-sm hover:bg-brand-50 hover:border-brand-400 transition-all active:scale-95"
                    >
                      + Add
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-brand-50 rounded-2xl px-2 py-1">
                      <button
                        onClick={() => updateQty(f._id, -1)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-brand-600 hover:bg-brand-100 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-brand-700 text-lg w-8 text-center">{qty}</span>
                      <button
                        onClick={() => updateQty(f._id, 1)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-brand-600 hover:bg-brand-100 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Sticky Cart Bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-0 right-0 z-40 px-4"
          >
            <div className="max-w-3xl mx-auto">
              <button
                onClick={handleOrder}
                disabled={ordering}
                className="w-full bg-slate-900 text-white rounded-3xl px-6 py-4 flex items-center justify-between shadow-2xl shadow-slate-900/30 hover:bg-slate-800 active:scale-98 transition-all disabled:opacity-70"
              >
                <div className="flex items-center gap-3">
                  {ordering ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <div className="relative">
                      <ShoppingBag size={20} />
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {totalItems}
                      </span>
                    </div>
                  )}
                  <span className="font-bold">
                    {ordering ? "Placing order…" : `Place Order (${totalItems} item${totalItems > 1 ? "s" : ""})`}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 font-bold text-lg">
                  <IndianRupee size={16} />
                  <span>{totalAmount}</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Modal */}
      <QRModal qrCode={qrCode} onClose={() => setQrCode(null)} />
    </div>
  );
}
