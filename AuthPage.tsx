
import React, { useState } from 'react';
import { Recycle, ArrowRight, User as UserIcon, Store, Mail, Lock, ShieldCheck } from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    // Simulate auth
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: 'Eco Enthusiast',
      email: 'user@revaleco.com',
      role: role,
      avatar: 'https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww',
      ecoScore: 850,
      location: 'Colombo, SL',
      favoriteIds: [] // New: initialize empty favorites
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Panel: Hero */}
      <div className="hidden lg:flex flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://videos.pexels.com/video-files/8295518/8295518-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-emerald-900/50 z-5"></div>

        <div className="relative z-10 max-w-md text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Recycle className="text-white animate-pulse" size={48} />
            <span className="text-4xl font-bold">RevalEco</span>
          </div>
          <h1 className="text-5xl font-bold mb-6">Revolutionize Your Waste Management.</h1>
          <p className="text-xl text-emerald-200/80 leading-relaxed mb-10">
            Join the movement towards a cleaner planet. Buy, sell, and recycle materials with ease.
          </p>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-emerald-800/40 p-4 rounded-2xl">
              <h3 className="text-2xl font-bold">12k+</h3>
              <p className="text-sm text-emerald-300">Active Users</p>
            </div>
            <div className="bg-emerald-800/40 p-4 rounded-2xl">
              <h3 className="text-2xl font-bold">50t</h3>
              <p className="text-sm text-emerald-300">Recycled/Month</p>
            </div>
            <div className="bg-emerald-800/40 p-4 rounded-2xl">
              <h3 className="text-2xl font-bold">98%</h3>
              <p className="text-sm text-emerald-300">Trust Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex flex-col justify-center p-8 lg:p-20 bg-white">
        <div className="max-w-md mx-auto w-full">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-12">
            <Recycle className="text-emerald-600" size={32} />
            <span className="text-2xl font-bold">RevalEco</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500">Choose your path to start saving the planet.</p>
          </div>

          {!role ? (
            <div className="space-y-4">
              <button 
                onClick={() => setRole('BUYER')}
                className="group w-full p-6 border-2 border-slate-100 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center gap-4 text-left"
              >
                <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Buyer Account</h4>
                  <p className="text-sm text-slate-500">I want to purchase recyclable materials.</p>
                </div>
                <ArrowRight className="ml-auto text-slate-300 group-hover:text-emerald-600" />
              </button>

              <button 
                onClick={() => setRole('SELLER')}
                className="group w-full p-6 border-2 border-slate-100 rounded-2xl hover:border-lime-500 hover:bg-lime-50 transition-all flex items-center gap-4 text-left"
              >
                <div className="p-4 bg-lime-100 text-lime-600 rounded-xl group-hover:bg-lime-600 group-hover:text-white transition-colors">
                  <Store size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Seller Account</h4>
                  <p className="text-sm text-slate-500">I have waste to sell for recycling.</p>
                </div>
                <ArrowRight className="ml-auto text-slate-300 group-hover:text-lime-600" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <button type="button" onClick={() => setRole(null)} className="text-sm font-medium text-emerald-600 hover:underline">
                  ← Change Role ({role})
                </button>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input type="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" required />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input type="password" placeholder="Password" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" required />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                {isLogin ? 'Sign In' : 'Create Account'}
                <ShieldCheck size={20} />
              </button>
              <p className="text-center text-slate-500 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-emerald-600 font-bold hover:underline">
                  {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
