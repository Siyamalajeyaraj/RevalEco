
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Recycle, ShoppingCart, LayoutDashboard, TrendingUp, User as UserIcon, 
  LogOut, Search, BarChart3
} from 'lucide-react';
import { User, UserRole, CartItem, WasteItem } from './types';
import { COLORS } from './constants';

// Pages
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import CartPage from './pages/CartPage';
import TrendingPage from './pages/TrendingPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [nightVision, setNightVision] = useState(false);

  // Check for stored login info on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const toggleFavorite = (productId: string) => {
    if (!currentUser) return;
    
    setCurrentUser(prev => {
      if (!prev) return null;
      const alreadyFav = prev.favoriteIds.includes(productId);
      const newFavs = alreadyFav 
        ? prev.favoriteIds.filter(id => id !== productId)
        : [...prev.favoriteIds, productId];
      
      // Save to database
      fetch(`http://localhost:5000/api/user/${prev.id}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      }).catch(err => console.error('Failed to save favorite:', err));
      
      return { ...prev, favoriteIds: newFavs };
    });
  };

  const addToCart = (product: WasteItem, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, cartQuantity: item.cartQuantity + quantity } 
            : item
        );
      }
      return [...prev, { ...product, cartQuantity: quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <HashRouter>
      <div className={`min-h-screen flex flex-col md:flex-row bg-slate-50 transition-colors duration-500 ${nightVision ? 'dark bg-slate-950 text-slate-100' : 'text-slate-900'}`}>
        {/* Navigation Sidebar */}
        {currentUser && (
          <>
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 transition-colors duration-500 z-50">
              <div className="p-8 flex items-center gap-3 mb-10">
                <div className="p-2.5 bg-emerald-600 rounded-2xl text-white shadow-lg">
                  <Recycle size={28} />
                </div>
                <span className="text-2xl font-black tracking-tighter text-emerald-900 dark:text-emerald-400">RevalEco</span>
              </div>
              
              <nav className="flex-1 px-4 space-y-2">
                <NavLink to="/" icon={<LayoutDashboard size={20} />} label="Overview" />
                <NavLink to="/marketplace" icon={<Search size={20} />} label="Market" />
                <NavLink to="/trending" icon={<TrendingUp size={20} />} label="Intelligence" />
                <NavLink to="/dashboard" icon={<BarChart3 size={20} />} label={currentUser.role === 'SELLER' ? 'Management' : 'Activity'} />
                <NavLink to="/cart" icon={<ShoppingCart size={20} />} label="Cart" badge={cart.length} />
              </nav>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <NavLink to="/profile" icon={<UserIcon size={20} />} label="Profile" />
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                  }}
                  className="w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-red-500 rounded-2xl transition-all group"
                >
                  <LogOut size={20} />
                  <span className="font-black text-xs uppercase tracking-widest">Sign Out</span>
                </button>
              </div>
            </aside>

            {/* Mobile Navigation */}
            <header className="md:hidden flex items-center justify-between p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
              <div className="flex items-center gap-3">
                <Recycle className="text-emerald-600" size={24} />
                <span className="text-xl font-black tracking-tighter">RevalEco</span>
              </div>
              <button onClick={() => {
                setCurrentUser(null);
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
              }} className="p-2 text-slate-400"><LogOut size={20} /></button>
            </header>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl rounded-t-[2rem]">
              <BottomNavLink to="/" icon={<LayoutDashboard size={22} />} label="Home" />
              <BottomNavLink to="/marketplace" icon={<Search size={22} />} label="Market" />
              <BottomNavLink to="/trending" icon={<TrendingUp size={22} />} label="Trends" />
              <BottomNavLink to="/dashboard" icon={<BarChart3 size={22} />} label="Admin" />
              <BottomNavLink to="/profile" icon={<UserIcon size={22} />} label="Profile" />
            </nav>
          </>
        )}

        <main className={`flex-1 overflow-y-auto transition-colors duration-500 ${currentUser ? 'pb-24 md:pb-0' : ''}`}>
          <Routes>
            {!currentUser ? (
              <Route path="*" element={<AuthPage onLogin={setCurrentUser} />} />
            ) : (
              <>
                <Route path="/" element={<HomePage user={currentUser} />} />
                <Route path="/marketplace" element={
                  <MarketplacePage 
                    onAddToCart={addToCart} 
                    onToggleFavorite={toggleFavorite}
                    favoriteIds={currentUser.favoriteIds}
                  />
                } />
                <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} onClear={clearCart} />} />
                <Route path="/trending" element={<TrendingPage />} />
                <Route path="/profile" element={
                  <ProfilePage 
                    user={currentUser} 
                    setUser={setCurrentUser} 
                    nightVision={nightVision} 
                    setNightVision={setNightVision} 
                  />
                } />
                <Route path="/dashboard" element={<DashboardPage user={currentUser} />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

const NavLink = ({ to, icon, label, badge }: { to: string, icon: React.ReactNode, label: string, badge?: number }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${isActive ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
      <div className="flex items-center gap-4">
        {icon}
        <span className="font-black text-xs uppercase tracking-widest">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${isActive ? 'bg-white text-emerald-600 border-white' : 'bg-emerald-100 text-emerald-700'}`}>
          {badge}
        </span>
      )}
    </Link>
  );
};

const BottomNavLink = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex flex-col items-center justify-center flex-1 py-3 px-1 relative transition-all ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
      {icon}
      <span className="text-[9px] font-black uppercase mt-1">{label}</span>
    </Link>
  );
};

export default App;
