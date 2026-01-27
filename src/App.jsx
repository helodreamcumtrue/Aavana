import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Minus, 
  X, 
  ArrowRight, 
  ArrowUpRight, 
  Instagram, 
  Twitter, 
  Menu,
  ShoppingBag,
  Leaf,
  ShieldCheck,
  Check,
  Package,
  ArrowDown,
  Globe,
  Wind,
  Truck,
  Activity,
  Heart,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';


const PRODUCTS = [
  {
    id: 'REF-AVN-001',
    category: 'METABOLIC / ENERGY',
    flavor: 'Chocolate',
    price: 70.00,
    color: '#FF2D55',
    details: 'Coco, organic oats, organic honey.',
    stats: { pro: '14g', fib: '8g', cal: '210' },
    image: 'cho.jpg'
  },
  {
    id: 'REF-AVN-002',
    category: 'ANCIENT / GRAINS',
    flavor: 'Orange',
    price: 70.00,
    color: '#4CD964',
    details: 'Sprouted millets, sea salt, roasted cumin.',
    stats: { pro: '14g', fib: '10g', cal: '125' },
    image: 'oran.jpg'
  },
  {
    id: 'REF-AVN-003',
    category: 'VITALITY / SEEDS',
    flavor: 'Straberry',
    price: 60.00,
    color: '#FF9500',
    details: 'Straberry, Raspberry, agave.',
    stats: { pro: '18g', fib: '10g', cal: '180' },
    image: 'stra.jpg'
  },
  {
    id: 'REF-AVN-004',
    category: 'HERITAGE / CLEAN',
    flavor: 'Kiwi',
    price: 70.00,
    color: '#FFCC00',
    details: 'Kiwi, organic spices.',
    stats: { pro: '16g', fib: '13g', cal: '190' },
    image: 'kiwii.png'
  }
];

// --- INTERACTIVE COMPONENTS ---

const Cursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const hover = () => setIsHovering(true);
    const unhover = () => setIsHovering(false);
    window.addEventListener('mousemove', move);
    document.querySelectorAll('button, a, .group').forEach(el => {
      el.addEventListener('mouseenter', hover);
      el.addEventListener('mouseleave', unhover);
    });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <motion.div 
      className="fixed top-0 left-0 w-4 h-4 bg-black rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      animate={{ 
        x: pos.x - 8, y: pos.y - 8,
        scale: isHovering ? 6 : 1,
        opacity: isHovering ? 0.2 : 1
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 0.5 }}
    />
  );
};

const Nav = ({ setView, view, cartCount, setIsCartOpen }) => (
  <nav className="fixed top-0 w-full z-50 px-8 py-8 md:px-12 flex justify-between items-center bg-white/90 backdrop-blur-md border-b border-neutral-100">
    <div className="flex items-center gap-12 md:gap-24">
      <h1 
        className="text-2xl font-black tracking-tighter cursor-pointer font-syne uppercase italic" 
        onClick={() => setView('home')}
      >
        Aavana
      </h1>
      <div className="hidden md:flex gap-16 text-[11px] font-bold uppercase tracking-[0.5em] text-neutral-400">
        <button onClick={() => setView('pantry')} className={`hover:text-black transition-colors ${view === 'pantry' ? 'text-black' : ''}`}>The Index</button>
        <button onClick={() => setView('ethos')} className={`hover:text-black transition-colors ${view === 'ethos' ? 'text-black' : ''}`}>Ethos</button>
      </div>
    </div>
    <div className="flex items-center gap-8">
      <button 
        onClick={() => setIsCartOpen(true)}
        className="flex items-center gap-4 group"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 group-hover:opacity-100 transition-opacity hidden sm:block font-syne">Vault</span>
        <div className="relative">
          <ShoppingBag size={20} strokeWidth={1.5} />
          <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {cartCount}
          </span>
        </div>
      </button>
      <Menu size={24} strokeWidth={1} className="cursor-pointer hover:scale-110 transition-transform" />
    </div>
  </nav>
);

const Cart = ({ isOpen, close, cart, updateQty }) => {
  const total = cart.reduce((a, b) => a + (b.price * b.quantity), 0);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-[101] p-12 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-16">
              <span className="text-3xl font-syne font-bold uppercase tracking-tighter italic">The Bag</span>
              <X onClick={close} className="cursor-pointer opacity-40 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex-1 overflow-y-auto space-y-10 hide-scrollbar pr-4">
              {cart.length === 0 ? (
                <div className="text-neutral-400 italic text-center py-40 border border-dashed border-neutral-100 rounded-3xl font-serif">Bag is currently empty.</div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-8 items-center border-b border-neutral-50 pb-8 group">
                    <div className="w-20 aspect-square bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0 border border-neutral-50 group-hover:border-neutral-200 transition-colors">
                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between font-bold text-sm">
                        <span className="uppercase tracking-tighter font-syne">{item.flavor}</span>
                        <span>₹{item.price}</span>
                      </div>
                      <div className="flex items-center border border-neutral-100 rounded-full px-4 py-1 gap-8 bg-neutral-50 w-fit">
                        <Minus size={12} className="cursor-pointer opacity-40 hover:opacity-100" onClick={() => updateQty(item.id, -1)} />
                        <span className="text-xs font-black">{item.quantity}</span>
                        <Plus size={12} className="cursor-pointer opacity-40 hover:opacity-100" onClick={() => updateQty(item.id, 1)} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="pt-12 border-t border-neutral-100 space-y-8">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest leading-none">Total Procurement</span>
                <span className="text-5xl font-syne font-bold tracking-tighter">₹{total.toFixed(2)}</span>
              </div>
              <button className="w-full bg-black text-white py-6 rounded-full font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all flex items-center justify-center gap-4 font-syne">
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- CORE PAGES ---

const Home = ({ setView }) => {
  return (
    <div className="pt-24">
      {/* HERO SECTION */}
      <section className="min-h-[90vh] flex flex-col justify-center px-8 md:px-12 relative overflow-hidden bg-white">
        <div className="container mx-auto grid lg:grid-cols-12 gap-16 items-center">
           <motion.div 
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-12 z-10"
           >
              <div className="flex items-center gap-6">
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-neutral-300 italic">2026 // Source Index</span>
                 <div className="h-[1px] w-12 bg-neutral-200" />
              </div>
              <h2 className="text-[12vw] lg:text-[9vw] font-syne font-black leading-[0.8] tracking-tighter uppercase ink-text">
                 Fuel the<br/>
                 <span className="italic font-light text-neutral-200">Pause.</span>
              </h2>
              <p className="text-2xl md:text-3xl text-neutral-500 font-light leading-relaxed max-w-xl italic">
                A modern Indian organic brand built for those who demand honest nutrition and direct farm links.
              </p>
              <div className="flex flex-wrap gap-8 pt-8">
                 <button onClick={() => setView('pantry')} className="bg-black text-white px-14 py-6 rounded-full font-bold uppercase tracking-widest text-[11px] hover:scale-105 transition-transform flex items-center gap-6 font-syne">
                   Explore Index <ArrowRight size={20} />
                 </button>
                 <button onClick={() => setView('ethos')} className="border-b border-black py-4 font-bold uppercase tracking-widest text-[11px] hover:opacity-50 transition-opacity font-syne">Read Manifesto</button>
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
             className="lg:col-span-5 relative aspect-[4/5] bg-neutral-100 rounded-[50px] overflow-hidden group shadow-2xl"
           >
              <img src="hello.png?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-60 transition-transform duration-[10s] group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-black/5" />
              <div className="absolute bottom-12 left-12 p-8 bg-white/10 backdrop-blur-xl rounded-[32px] border border-white/30 text-white space-y-2">
                 <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Shop Now </div>
                 <div className="text-3xl font-syne font-bold uppercase tracking-tighter italic"> </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="py-64 bg-neutral-50 px-8 md:px-12 border-y border-neutral-100">
         <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-32 items-start">
               <div className="space-y-16">
                  <div className="inline-flex p-8 bg-white rounded-[32px] shadow-sm border border-neutral-100">
                    <Leaf size={50} className="text-neutral-800" strokeWidth={1} />
                  </div>
                  <h3 className="text-5xl md:text-8xl font-syne font-bold uppercase tracking-tighter leading-none italic">
                     Small choices.<br/>Honest life.
                  </h3>
                  <p className="text-2xl text-neutral-400 font-light leading-relaxed italic pr-12">
                    Aavana is a collective of people who believe in metabolic integrity, especially when life moves at its fastest.
                  </p>
               </div>
               <div className="grid gap-12">
                  <div className="space-y-8 p-14 bg-white rounded-[60px] border border-neutral-100 shadow-sm transition-all hover:shadow-2xl hover:scale-[1.02]">
                     <span className="text-5xl font-syne font-black text-neutral-100">01.</span>
                     <h5 className="font-bold uppercase tracking-[0.3em] text-[12px] text-neutral-800 font-syne">The Purpose</h5>
                     <p className="text-2xl text-neutral-500 font-light leading-relaxed italic">To engineer snacks that support mindful living and daily vitality, without unnecessary lab shortcuts.</p>
                  </div>
                  <div className="space-y-8 p-14 bg-white rounded-[60px] border border-neutral-100 shadow-sm transition-all hover:shadow-2xl hover:scale-[1.02]">
                     <span className="text-5xl font-syne font-black text-neutral-100">02.</span>
                     <h5 className="font-bold uppercase tracking-[0.3em] text-[12px] text-neutral-800 font-syne">The Integrity</h5>
                     <p className="text-2xl text-neutral-500 font-light leading-relaxed italic">Every artifact is created with care, sourced with absolute transparency, and delivered with honesty.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="py-64 px-8 md:px-12 bg-white">
         <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-40 gap-16 border-l-8 border-black pl-12">
               <h4 className="text-6xl md:text-[9vw] font-syne font-black uppercase tracking-tighter leading-none">Farm.<br/>To Bag.</h4>
               <p className="max-w-md text-neutral-400 text-xl leading-relaxed font-light italic">Good food begins in the soil. Ethical practices are our non-negotiable baseline across the entire supply lifecycle.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
               {[
                 { icon: <Globe />, title: "The Source", desc: "Trusted organic partnerships providing seasonal peak ingredients." },
                 { icon: <Wind />, title: "The Craft", desc: "Cold-press architecture ensures enzymatic integrity and raw energy." },
                 { icon: <Truck />, title: "The Path", desc: "Direct-to-residence fulfillment in sustainable, zero-plastic aim packaging." }
               ].map((item, i) => (
                 <div key={i} className="space-y-12 p-16 bg-neutral-50 rounded-[60px] border border-neutral-100 transition-all duration-1000 hover:bg-white hover:shadow-2xl group">
                    <div className="w-20 aspect-square bg-white rounded-3xl flex items-center justify-center text-neutral-800 shadow-sm group-hover:bg-black group-hover:text-white transition-colors duration-500">
                       {React.cloneElement(item.icon, { size: 32, strokeWidth: 1 })}
                    </div>
                    <div className="space-y-6">
                      <h5 className="text-4xl font-syne font-bold uppercase tracking-tighter leading-none">{item.title}</h5>
                      <p className="text-neutral-400 text-lg leading-relaxed font-light italic">{item.desc}</p>
                    </div>
                    <div className="w-16 h-[2px] bg-black opacity-10 group-hover:w-full group-hover:opacity-100 transition-all duration-700" />
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

const Pantry = ({ addToCart }) => (
  <div className="pt-48 px-8 md:px-12 pb-64 bg-white">
    <div className="container mx-auto">
      <header className="mb-48 max-w-6xl">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-4 h-4 rounded-full bg-black animate-pulse" />
          <span className="text-[12px] font-bold uppercase tracking-[0.8em] text-neutral-400 italic font-syne">Availability Index</span>
        </div>
        <h2 className="text-8xl md:text-[13vw] font-syne font-black uppercase tracking-tighter leading-[0.7] mb-16 italic">Pantry.</h2>
        <p className="text-3xl md:text-4xl text-neutral-400 font-light max-w-4xl leading-relaxed italic pr-24 border-l-2 border-neutral-100 pl-12">
          A meticulously curated collection of organic fuel engineered for precision, metabolic balance, and simple living.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
        {PRODUCTS.map((p, i) => (
          <motion.div 
            key={p.id} initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            className="group"
          >
            <div className="relative aspect-[4/5] bg-neutral-50 rounded-[48px] overflow-hidden border border-neutral-100 transition-all duration-1000 shadow-sm group-hover:shadow-2xl group-hover:scale-[1.02]">
               <img src={p.image} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" alt="" />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />
               <button 
                onClick={() => addToCart(p)}
                className="absolute bottom-10 right-10 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl translate-y-24 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 active:scale-90 z-20"
               >
                 <Plus size={32} strokeWidth={1} />
               </button>
               <div className="absolute top-10 left-10">
                  <span className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-black shadow-sm font-syne">{p.category}</span>
               </div>
            </div>
            
            <div className="space-y-8 pt-10 px-4">
               <div className="flex justify-between items-baseline">
                  <h3 className="text-4xl font-syne font-bold uppercase tracking-tighter leading-none italic">{p.flavor}</h3>
                  <span className="text-2xl font-bold font-syne opacity-30 italic">₹{p.price}</span>
               </div>
               <p className="text-lg text-neutral-400 leading-relaxed font-light italic pr-10 line-clamp-2">{p.details}</p>
               <div className="grid grid-cols-3 gap-1 pt-10 border-t border-neutral-100">
                  <div className="text-center space-y-2"><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300 block font-syne">Protein</span><div className="text-base font-bold font-syne italic">{p.stats.pro}</div></div>
                  <div className="text-center space-y-2"><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300 block font-syne">Fiber</span><div className="text-base font-bold font-syne italic">{p.stats.fib}</div></div>
                  <div className="text-center space-y-2"><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300 block font-syne">KCAL</span><div className="text-base font-bold font-syne italic">{p.stats.cal}</div></div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const Ethos = () => (
  <div className="pt-48 px-8 md:px-12 pb-64 bg-white">
    <div className="container mx-auto max-w-6xl text-center">
      <header className="py-64 space-y-20 border-b border-neutral-100">
         <h2 className="text-[15vw] font-syne font-black uppercase tracking-tighter leading-none italic">Ethos.</h2>
         <p className="text-4xl md:text-7xl font-syne font-light opacity-60 leading-[1.1] max-w-5xl mx-auto italic tracking-tight">
          "Raw Integrity. Deliberate Sourcing."
         </p>
      </header>

      <div className="space-y-96 py-80 text-left">
         <div className="grid lg:grid-cols-2 gap-48 items-center">
            <div className="space-y-16">
               <span className="text-[12px] font-bold uppercase tracking-[1em] text-neutral-300 block font-syne">01 / GENESIS</span>
               <h3 className="text-6xl md:text-[6vw] font-syne font-bold italic tracking-tighter leading-[0.8] uppercase">The <br/>Philosophy.</h3>
               <p className="text-3xl font-light text-neutral-500 leading-relaxed italic pr-20">
                 Energy isn't a lab-grown chemical compound. It's a basic human right derived from raw, earthen integrity.
               </p>
            </div>
            <div className="aspect-[4/5] bg-neutral-100 rounded-[80px] overflow-hidden shadow-2xl border border-neutral-100 relative group">
               <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale opacity-60 transition-transform duration-[12s] group-hover:scale-110" alt="" />
               <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            </div>
         </div>
      </div>
    </div>
  </div>
);

// --- MAIN APP ENTRY ---

export default function App() {
  const [view, setView] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p).filter(p => p.quantity > 0));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&family=Syne:wght@700;800&display=swap');
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        .font-syne { font-family: 'Syne', sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .ink-text { color: #111; }
        .paper-grain {
          pointer-events: none;
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
          opacity: 0.08; z-index: 9999;
        }
      `}</style>

      <div className="paper-grain" />
      <Cursor />
      <Nav setView={setView} view={view} cartCount={cart.reduce((a,b) => a+b.quantity, 0)} setIsCartOpen={setIsCartOpen} />
      <Cart isOpen={isCartOpen} close={() => setIsCartOpen(false)} cart={cart} updateQty={updateQty} />

      <main>
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Home setView={setView} addToCart={addToCart} />
            </motion.div>
          )}
          {view === 'pantry' && (
            <motion.div key="pantry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Pantry addToCart={addToCart} />
            </motion.div>
          )}
          {view === 'ethos' && (
            <motion.div key="ethos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Ethos />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-[#050505] text-white pt-32 pb-12 px-8 md:px-12 relative z-10 rounded-t-[80px] md:rounded-t-[120px] overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-32 relative z-10">
            <div className="lg:col-span-5 space-y-12">
               <div className="space-y-4">
                 <h2 className="text-5xl md:text-7xl font-syne font-black tracking-tighter uppercase italic leading-none">Aavana.</h2>
                 <p className="text-[12px] font-bold uppercase tracking-[1em] text-neutral-600 italic font-syne">Index 2026</p>
               </div>
               <div className="space-y-8 max-w-sm border-l border-neutral-900 pl-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-500 font-syne">Registry</p>
                  <div className="flex border-b border-neutral-900 pb-3 group hover:border-white transition-colors duration-700">
                     <input type="text" placeholder="Your Address" className="bg-transparent border-none outline-none text-base w-full italic font-light placeholder:opacity-20 text-white" />
                     <button className="opacity-30 group-hover:opacity-100 transition-all hover:scale-125"><ArrowRight size={22} strokeWidth={1} /></button>
                  </div>
               </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-20 pt-4">
               <div className="space-y-10">
                  <h6 className="text-[10px] font-bold uppercase tracking-[0.8em] opacity-20 italic font-syne">Index</h6>
                  <ul className="space-y-6 text-[11px] font-bold uppercase tracking-[0.2em] italic">
                     <li onClick={() => setView('pantry')} className="cursor-pointer hover:text-neutral-400 transition-colors">The Store</li>
                     <li onClick={() => setView('ethos')} className="cursor-pointer hover:text-neutral-400 transition-colors">Ethos</li>
                     <li className="opacity-10 cursor-not-allowed"> </li>
                  </ul>
               </div>
               <div className="space-y-10">
                  <h6 className="text-[10px] font-bold uppercase tracking-[0.8em] opacity-20 italic font-syne"> </h6>
                  <ul className="space-y-6 text-[11px] font-bold uppercase tracking-[0.2em] italic">
                     <li className="cursor-pointer hover:text-neutral-400 transition-colors underline decoration-neutral-800 underline-offset-4"> </li>
                     <li className="cursor-pointer hover:text-neutral-400 transition-colors underline decoration-neutral-800 underline-offset-4"> </li>
                  </ul>
               </div>
               <div className="space-y-10 hidden md:block">
                  <h6 className="text-[10px] font-bold uppercase tracking-[0.8em] opacity-20 italic font-syne">Legal</h6>
                  <div className="text-[10px] font-bold space-y-4 opacity-30 leading-relaxed uppercase tracking-[0.1em]">
                     <div>Concept by- Lakshay Jain</div>
                     <div className="pt-4 border-t border-neutral-900">Aavana Foods Ltd.<br/>New Delhi, India</div>
                  </div>
               </div>
            </div>
          </div>
          <div className="pt-12 border-t border-neutral-900/50 flex flex-col md:flex-row justify-between items-center text-[9px] font-bold uppercase tracking-[0.8em] opacity-10 italic gap-12">
            <span className="text-center">© 2026 AAVANA ORGANICS, Concept by - Lakshay Jain</span>
            <div className="flex flex-wrap justify-center gap-12">
               <span className="border-b border-neutral-900 pb-1">Non-GMO</span>
               <span className="border-b border-neutral-900 pb-1">Zero Plastic Aim</span>
               <span className="border-b border-neutral-900 pb-1">Honest</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
