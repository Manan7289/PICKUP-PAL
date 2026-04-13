import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronUp, Info, AlertTriangle, 
  Clock, CreditCard, ShieldCheck, Mail, Utensils,
  QrCode, UserMinus, RotateCcw, LayoutGrid,
  Store, ShieldAlert, Key, RefreshCw
} from 'lucide-react';
import { legalContent } from './LegalContent';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Restaurants from "./pages/Restaurants";
import Food from "./pages/Food";
import { useNavigate } from "react-router-dom";

// --- Sub-components ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate(); // ✅ ADD THIS

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Terms', href: '#who-we-are' },
    { name: 'Privacy', href: '#your-data' },
    { name: 'QR System', href: '#qr-system' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <Utensils className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-brand-600">
              PickupPal
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-600 hover:text-brand-600 font-medium"
              >
                {link.name}
              </a>
            ))}

            {/* ✅ FIXED BUTTON */}
            <button
              onClick={() => navigate("/login")}
              className="bg-brand-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-brand-700 transition"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-slate-600 hover:text-brand-600"
                >
                  {link.name}
                </a>
              ))}

              {/* ✅ FIXED MOBILE BUTTON */}
              <div className="px-3 pt-4">
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="w-full bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Get Started
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section className="pt-32 pb-20 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
          Your One-Stop Solution for <span className="text-brand-600">Canteen Cravings & Mess Stress</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Because we know you're tired of playing 'Guess the Ingredient' at the college mess. We promise these terms are easier to swallow than yesterday's hostel lunch.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#who-we-are"
            className="w-full sm:w-auto bg-brand-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-700 transition-all hover:shadow-xl hover:shadow-brand-100 active:scale-95"
          >
            Read Terms
          </a>
          <button className="w-full sm:w-auto bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:border-brand-200 hover:bg-brand-50 transition-all active:scale-95">
            Contact Support
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

const Intro = () => (
  <section className="py-16 px-4 bg-white/50">
    <div className="max-w-3xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-bold mb-6">
        <ShieldCheck size={18} />
        <span>Transparency First</span>
      </div>
      <p className="text-lg text-slate-600 leading-relaxed italic">
        "Most terms and conditions are written for lawyers. Ours are written for you. We believe in being upfront about how we work, how we use your data, and what we expect from our community. Because great food tastes better when there's trust on the menu."
      </p>
    </div>
  </section>
);

const LegalCard = ({ section, index }) => {
  const icons = {
    "who-we-are": <Store className="text-brand-500" />,
    "agreeing-to": <ShieldCheck className="text-brand-500" />,
    "your-data": <CreditCard className="text-brand-500" />,
    "restaurants": <Utensils className="text-brand-500" />,
    "qr-system": <QrCode className="text-brand-500" />,
    "penalties": <ShieldAlert className="text-brand-500" />,
    "cancellations": <RotateCcw className="text-brand-500" />,
    "multiple-orders": <LayoutGrid className="text-brand-500" />,
    "restaurant-owners": <Store className="text-brand-500" />,
    "not-responsible": <ShieldAlert className="text-brand-500" />,
    "account-security": <Key className="text-brand-500" />,
    "changes": <RefreshCw className="text-brand-500" />,
    "contact": <Mail className="text-brand-500" />,
  };

  return (
    <motion.div
      id={section.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.05 }}
      className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-brand-50 rounded-2xl group-hover:bg-brand-100 transition-colors">
          {icons[section.id] || <Info className="text-brand-500" />}
        </div>
        <h3 className="text-2xl font-bold text-slate-800 pt-2">{section.title}</h3>
      </div>
      <div className="text-slate-600 leading-relaxed pl-0 md:pl-16">
        <p className="whitespace-pre-line">{section.content}</p>
      </div>
    </motion.div>
  );
};

const ImportantNotices = () => {
  const notices = [
    {
      icon: <QrCode className="text-amber-600" />,
      title: "Keep it private",
      text: "Do not share your QR code with anyone else. It's your unique identity for order pickup.",
      color: "bg-amber-50 border-amber-200"
    },
    {
      icon: <AlertTriangle className="text-red-600" />,
      title: "No-show penalties",
      text: "No-show penalties may apply if you repeatedly fail to collect your orders without notice.",
      color: "bg-red-50 border-red-200"
    },
    {
      icon: <Clock className="text-blue-600" />,
      title: "Refund timeline",
      text: "Refunds may take 5–7 business days to appear in your account, depending on your bank.",
      color: "bg-blue-50 border-blue-200"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Important Notices</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {notices.map((notice, idx) => (
            <div key={idx} className={`${notice.color} border-2 p-6 rounded-3xl flex flex-col items-center text-center`}>
              <div className="mb-4 p-3 bg-white rounded-2xl shadow-sm">
                {notice.icon}
              </div>
              <h4 className="font-bold text-slate-900 mb-2">{notice.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{notice.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalAgreement = () => {
  const [agreed, setAgreed] = useState(false);

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-800/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-6">Ready to start picking up?</h2>
          <p className="text-slate-300 mb-10 text-lg">
            By tapping “I agree” below, you confirm that you have read this, understood it, and agree to it.
          </p>
          
          <div className="space-y-6">
            <label className="flex items-center justify-center gap-3 cursor-pointer group">
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                agreed ? 'bg-brand-500 border-brand-500' : 'border-slate-500 group-hover:border-brand-400'
              }`}>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={agreed} 
                  onChange={() => setAgreed(!agreed)} 
                />
                {agreed && <ShieldCheck size={16} className="text-white" />}
              </div>
              <span className="text-slate-300 font-medium">I have read and understood these terms</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                disabled={!agreed}
                className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-bold text-lg transition-all ${
                  agreed 
                  ? 'bg-brand-500 text-white hover:bg-brand-600 hover:scale-105 active:scale-95 shadow-xl shadow-brand-500/20' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                onClick={() => alert('Agreement accepted! Redirecting to app...')}
              >
                I Agree
              </button>
              <button 
                className="w-full sm:w-auto px-10 py-4 rounded-2xl font-bold text-lg text-slate-400 hover:text-white transition-colors"
                onClick={() => alert('No problem! You can review the terms again whenever you need.')}
              >
                I Do Not Agree
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-slate-50 pt-20 pb-10 px-4 border-t border-slate-100">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Utensils className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900">PickupPal</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
            The modern way to pick up your favorite local food. Clear, fast, and friendly.
          </p>
        </div>
        <div>
          <h5 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Product</h5>
          <ul className="space-y-4 text-slate-500 text-sm">
            <li><a href="#" className="hover:text-brand-600 transition-colors">How it works</a></li>
            <li><a href="#" className="hover:text-brand-600 transition-colors">Restaurants</a></li>
            <li><a href="#" className="hover:text-brand-600 transition-colors">Mobile App</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Company</h5>
          <ul className="space-y-4 text-slate-500 text-sm">
            <li><a href="#" className="hover:text-brand-600 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-brand-600 transition-colors">Support</a></li>
            <li><a href="#" className="hover:text-brand-600 transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Legal</h5>
          <ul className="space-y-4 text-slate-500 text-sm">
            <li><a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-brand-600 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-brand-600 transition-colors">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
        <p>© 2026 PickupPal Technologies Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-600 transition-colors">Twitter</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Instagram</a>
          <a href="#" className="hover:text-slate-600 transition-colors">LinkedIn</a>
        </div>
      </div>
    </div>
  </footer>
);

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-40 bg-white text-brand-600 p-4 rounded-2xl shadow-2xl border border-slate-100 hover:bg-brand-50 transition-colors group"
        >
          <ChevronUp className="group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// --- Main App Component ---

export default function App() {
  return (
    <Router>
      <Routes>

        {/* 🌐 Your existing UI as homepage */}
        <Route path="/" element={
          <div className="min-h-screen selection:bg-brand-200 selection:text-brand-900">
            <Navbar />
            <main>
              <Hero />
              <Intro />
              <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto">
                  <div className="grid gap-8">
                    {legalContent.map((section, idx) => (
                      <LegalCard key={section.id} section={section} index={idx} />
                    ))}
                  </div>
                </div>
              </section>
              <ImportantNotices />
              <FinalAgreement />
            </main>
            <Footer />
            <BackToTop />
          </div>
        } />

        {/* 🔐 Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🍽️ App pages */}
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/food/:id" element={<Food />} />

      </Routes>
    </Router>
  );
}