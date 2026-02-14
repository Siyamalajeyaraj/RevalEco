
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, Star, Info, Plus, Heart, Share2, ArrowUpRight, MapPin, Navigation, X } from 'lucide-react';
import { CATEGORY_COLORS } from '../constants';
import { WasteCategory, WasteItem } from '../types';

interface MarketplacePageProps {
  onAddToCart: (item: WasteItem, quantity: number) => void;
  onToggleFavorite: (id: string) => void;
  favoriteIds: string[];
}

const CATEGORIES: WasteCategory[] = ['Plastic', 'Paper', 'Metal', 'Glass', 'Organic', 'E-Waste'];

const MarketplacePage: React.FC<MarketplacePageProps> = ({ onAddToCart, onToggleFavorite, favoriteIds }) => {
  const [activeCategory, setActiveCategory] = useState<WasteCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [radius, setRadius] = useState<number>(50); // Default radius 50km
  const [toast, setToast] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<WasteItem | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [products, setProducts] = useState<WasteItem[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRadius = p.distance <= radius;
    return matchesCategory && matchesSearch && matchesRadius;
  });

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative">
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-10 font-black text-xs uppercase tracking-widest">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          {toast}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">EcoMart LK</h1>
          <p className="text-slate-500 font-medium tracking-tight">Source bulk recyclables with localized logistics.</p>
        </div>
        
        <div className="flex flex-1 max-w-md items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search supply..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm font-bold"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all shadow-sm font-black text-[10px] uppercase tracking-[0.2em] ${
              showFilters ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border-slate-100 text-slate-600'
            }`}
          >
            <Filter size={16} />
            {showFilters ? 'Hide Logic' : 'Smart Filter'}
          </button>
        </div>
      </div>

      {/* Radius Filter and Active Category Info */}
      <div className={`p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] transition-all duration-500 overflow-hidden ${showFilters ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 py-0 border-none'}`}>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4 w-full">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Navigation size={14} className="text-emerald-500" />
                Pickup Radius
              </label>
              <span className="text-sm font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-lg">{radius} km</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={radius} 
              onChange={(e) => setRadius(parseInt(e.target.value))} 
              className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              <span>Local (1km)</span>
              <span>Regional (100km)</span>
            </div>
          </div>
          <div className="w-px h-16 bg-slate-100 dark:bg-slate-800 hidden md:block" />
          <div className="flex-1 text-center md:text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Results Found</p>
            <h4 className="text-3xl font-black text-slate-900 dark:text-white">{filteredProducts.length} <span className="text-sm text-slate-400">Assets</span></h4>
          </div>
        </div>
      </div>

      {/* Intelligence Color Bar Categories */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        <CategoryPill active={activeCategory === 'All'} onClick={() => setActiveCategory('All')} label="All Supply" color="slate" />
        {CATEGORIES.map(cat => (
          <CategoryPill 
            key={cat} 
            active={activeCategory === cat} 
            onClick={() => setActiveCategory(cat)} 
            label={cat} 
            color={CATEGORY_COLORS[cat]}
          />
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favoriteIds.includes(product.id)}
            onAdd={onAddToCart}
            onToggleFavorite={() => {
              onToggleFavorite(product.id);
              showNotification(favoriteIds.includes(product.id) ? "Removed from profile" : "Saved to your profile");
            }}
            onNotify={showNotification}
            onSelect={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Search size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">No active supply</h3>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">Adjust your radius or sector search.</p>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-xl"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <img
                    src={selectedProduct.image}
                    className="w-full h-96 object-cover rounded-[2rem] shadow-2xl"
                    alt={selectedProduct.title}
                  />
                  <div className="flex items-center gap-4">
                    <span className="bg-blue-500 text-white px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest shadow-lg">
                      {selectedProduct.category}
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-full text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                      <MapPin size={16} className="inline mr-2" />
                      {selectedProduct.distance} km away
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{selectedProduct.title}</h2>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">Rs.{selectedProduct.price.toLocaleString()}</span>
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">per {selectedProduct.unit}</span>
                    </div>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{selectedProduct.description}</p>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Star size={20} className="text-amber-400 fill-amber-400" />
                      <span className="font-black text-lg">{selectedProduct.rating}</span>
                    </div>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-slate-500 uppercase text-sm tracking-widest">Stock: {selectedProduct.quantity}</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 border border-slate-100 dark:border-slate-700">
                        <button onClick={() => setModalQty(Math.max(1, modalQty - 1))} className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white">-</button>
                        <span className="w-12 text-center font-black text-lg">{modalQty}</span>
                        <button onClick={() => setModalQty(modalQty + 1)} className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white">+</button>
                      </div>
                      <button
                        onClick={() => { onAddToCart(selectedProduct, modalQty); setSelectedProduct(null); showNotification("Added to cart!"); }}
                        className="flex-1 bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                      >
                        <Plus size={20} /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface CategoryPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ label, active, onClick, color }) => {
  const colorMap: Record<string, string> = {
    blue: 'border-blue-500 text-blue-500 bg-blue-500',
    emerald: 'border-emerald-500 text-emerald-500 bg-emerald-500',
    orange: 'border-orange-500 text-orange-500 bg-orange-500',
    amber: 'border-amber-500 text-amber-500 bg-amber-500',
    slate: 'border-slate-500 text-slate-500 bg-slate-500',
    indigo: 'border-indigo-500 text-indigo-500 bg-indigo-500',
  };

  const ringColor = active ? `ring-2 ring-offset-2 ring-${color}-500` : '';

  return (
    <button 
      onClick={onClick}
      className={`px-6 py-3 rounded-2xl whitespace-nowrap font-black text-xs uppercase tracking-widest transition-all border-2 flex items-center gap-3 ${
        active 
          ? `bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105 border-transparent` 
          : `bg-white dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-${color}-300`
      }`}
    >
      <div className={`w-2 h-2 rounded-full ${colorMap[color].split(' ')[2]}`} />
      {label}
    </button>
  );
};

const ProductCard = ({ product, onAdd, onToggleFavorite, isFavorite, onNotify, onSelect }: { product: WasteItem, onAdd: any, onToggleFavorite: any, isFavorite: boolean, onNotify: any, onSelect: () => void }) => {
  const [qty, setQty] = useState(1);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  
  const handleToggleFav = () => {
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 600);
    onToggleFavorite();
  };

  const categoryColorClass = {
    'Plastic': 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]',
    'Organic': 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]',
    'E-Waste': 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]',
    'Metal': 'bg-amber-600',
    'Paper': 'bg-slate-400',
    'Glass': 'bg-indigo-500',
  }[product.category] || 'bg-slate-900';

  return (
    <div onClick={onSelect} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col min-h-[500px] cursor-pointer">
      <div className="relative h-56 overflow-hidden">
        <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.title} />
        <div className="absolute top-5 left-5 flex flex-col gap-2">
          <span className={`${categoryColorClass} text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2`}>
            {product.category}
          </span>
          <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest shadow-lg flex items-center gap-1.5">
            <MapPin size={12} className="text-emerald-500" />
            {product.distance} km
          </span>
        </div>
        <div className="absolute top-5 right-5 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              handleToggleFav();
            }}
            className={`p-3 backdrop-blur-md rounded-2xl shadow-xl transition-all ${
              isFavorite ? 'bg-rose-500 text-white' : 'bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-rose-500'
            } ${isHeartAnimating ? 'animate-heart-pop' : ''}`}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); if (navigator.share) { navigator.share({ title: product.title, text: product.description, url: window.location.href }).then(() => onNotify("Shared successfully!")).catch(() => onNotify("Share cancelled")); } else { navigator.clipboard.writeText(window.location.href).then(() => onNotify("Link copied to clipboard")); } }} className="p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl text-slate-400 hover:text-blue-500 transition-all shadow-xl">
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-black text-base text-slate-900 dark:text-white line-clamp-1">{product.title}</h3>
          <div className="text-right">
            <span className="block font-black text-emerald-600 dark:text-emerald-400">Rs.{product.price.toLocaleString()}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">per {product.unit}</span>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 line-clamp-2 font-medium leading-relaxed">{product.description}</p>

        <div className="mt-auto space-y-6">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-widest">
              <Star size={14} className="text-amber-400 fill-amber-400" /> {product.rating}
            </span>
            <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Stock: {product.quantity}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl px-3 border border-slate-100 dark:border-slate-700">
              <button onClick={(e) => { e.stopPropagation(); setQty(Math.max(1, qty - 1)); }} className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white">-</button>
              <span className="w-8 text-center font-black text-sm">{qty}</span>
              <button onClick={(e) => { e.stopPropagation(); setQty(qty + 1); }} className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white">+</button>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(product, qty); }}
              className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
