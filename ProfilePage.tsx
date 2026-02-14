
import React, { useState, useEffect, useRef } from 'react';
import {
  User as UserIcon, Settings, Shield, Bell,
  Moon, Trash2, Camera, MapPin, Award, Recycle,
  Sparkles, TreePine, Zap, Fingerprint, Globe,
  ChevronRight, LogOut, Star,
  Eye, Heart, Package, ArrowUpRight
} from 'lucide-react';
import { User, WasteItem } from '../types';
import { GoogleGenAI } from "@google/genai";
import { MOCK_PRODUCTS } from '../constants';

interface ProfilePageProps {
  user: User;
  setUser: (user: User | null) => void;
  nightVision: boolean;
  setNightVision: (val: boolean) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, setUser, nightVision, setNightVision }) => {
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [tempLocation, setTempLocation] = useState(user.location);

  const [preferences, setPreferences] = useState({
    identityLock: true,
    ecoSignals: true,
    fleetTracking: true,
  });

  const [products, setProducts] = useState<WasteItem[]>([]);

  // Get favorited items from real products
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  const favoriteItems = products.filter(item => user.favoriteIds.includes(item.id));

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCameraClick = () => fileInputRef.current?.click();

  const regenerateTip = async () => {
    setIsLoadingTip(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `As an advanced AI eco-advisor, analyze this user's profile: ${user.name}, ${user.role}, eco-score: ${user.ecoScore}.
        Provide a personalized, actionable sustainability tip in 15-25 words. Make it futuristic and inspiring.`,
      });
      setAiTip(response.text || "Switch to solar-powered sorting stations for 40% energy savings.");
    } catch (e) {
      setAiTip("Implement AI-driven waste classification for 95% accuracy and reduced contamination.");
    } finally {
      setIsLoadingTip(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUser({ ...user, avatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setTempName(user.name);
    setTempLocation(user.location);
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser({ ...user, name: tempName, location: tempLocation });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchEcoTip = async () => {
      setIsLoadingTip(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `As an advanced AI eco-advisor, analyze this user's profile: ${user.name}, ${user.role}, eco-score: ${user.ecoScore}.
          Provide a personalized, actionable sustainability tip in 15-25 words. Make it futuristic and inspiring.`,
        });
        setAiTip(response.text || "Switch to solar-powered sorting stations for 40% energy savings.");
      } catch (e) {
        setAiTip("Implement AI-driven waste classification for 95% accuracy and reduced contamination.");
      } finally {
        setIsLoadingTip(false);
      }
    };
    fetchEcoTip();

    // Check for scroll parameter in URL
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    if (params.get('scroll') === 'saved') {
      // Could scroll to saved section if needed
    }
  }, [user.ecoScore, user.role, user.name]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      <div className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-sm overflow-hidden group transition-colors duration-500">
        <div className="h-48 bg-emerald-950 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-emerald-400 to-transparent" />
        </div>
        
        <div className="px-8 pb-10">
          <div className="flex flex-col md:flex-row items-end gap-8 -mt-16 relative z-10">
            <div className="relative">
              <img src={user.avatar} className="relative w-40 h-40 rounded-[2.5rem] border-8 border-white dark:border-slate-900 shadow-2xl object-cover transition-colors duration-500 bg-white" alt={user.name} />
              <button onClick={handleCameraClick} className="absolute bottom-2 right-2 p-3 bg-emerald-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform active:scale-95 z-20">
                <Camera size={20} />
              </button>
            </div>
            
            <div className="flex-1 pb-4">
              <div className="flex flex-wrap items-center gap-4 mb-2">
                {isEditing ? (
                  <input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="text-4xl font-black text-slate-900 dark:text-white tracking-tight bg-transparent border-b-2 border-emerald-500 focus:outline-none"
                  />
                ) : (
                  <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
                )}
                <div className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-emerald-200">
                  Elite {user.role}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-slate-400 font-bold text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-emerald-500" />
                  {isEditing ? (
                    <input
                      value={tempLocation}
                      onChange={(e) => setTempLocation(e.target.value)}
                      className="bg-transparent border-b border-emerald-500 focus:outline-none font-bold"
                    />
                  ) : (
                    user.location
                  )}
                </span>
                <span className="flex items-center gap-1.5"><Globe size={16} className="text-blue-500" /> Node Active</span>
              </div>
            </div>

            <div className="flex gap-3 pb-4">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all">
                    Save
                  </button>
                  <button onClick={handleCancel} className="px-8 py-4 bg-slate-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-600 transition-all">
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={handleEdit} className="px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">
                  Edit Settings
                </button>
              )}
              <button onClick={() => setUser(null)} className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:text-red-500 transition-all">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-10"><Sparkles size={120} /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-400/30 rounded-xl"><Sparkles size={20} className="text-emerald-100" /></div>
                <h3 className="font-black text-xs uppercase tracking-[0.2em]">AI Eco-Advisor</h3>
              </div>
              <div className="min-h-[60px]">
                {isLoadingTip ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-emerald-400/30 rounded-full w-3/4" />
                    <div className="h-4 bg-emerald-400/30 rounded-full w-1/2" />
                  </div>
                ) : (
                  <p className="text-xl font-bold leading-relaxed mb-6">"{aiTip}"</p>
                )}
              </div>
              <button onClick={regenerateTip} className="w-full py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                Regenerate Tip
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Neural Hub</h3>
            <div className="space-y-4">
              <PreferenceToggle icon={<Shield size={18} />} label="Identity Lock" desc="Biometric signing" active={preferences.identityLock} onClick={() => togglePreference('identityLock')} />
              <PreferenceToggle icon={<Moon size={18} />} label="Night Vision" desc="Energy saving UI" active={nightVision} onClick={() => setNightVision(!nightVision)} />
              <PreferenceToggle icon={<MapPin size={18} />} label="Fleet Radar" desc="Real-time proximity" active={preferences.fleetTracking} onClick={() => togglePreference('fleetTracking')} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Heart className="text-rose-500 fill-rose-500" />
                Saved Materials
              </h3>
              <span className="text-[10px] font-black uppercase bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg text-slate-400">
                {favoriteItems.length} Saved
              </span>
            </div>

            {favoriteItems.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border border-dashed border-slate-200">
                <Package className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No favorites yet</p>
                <p className="text-slate-300 text-[10px] mt-2 font-medium">Items you heart in the market will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {favoriteItems.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-transparent hover:border-slate-200 transition-all group">
                    <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt={item.title} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-slate-900 dark:text-white truncate text-sm">{item.title}</h4>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Rs. {item.price.toLocaleString()}</p>
                      <button 
                        onClick={() => {
                          const newFavs = user.favoriteIds.filter(id => id !== item.id);
                          setUser({ ...user, favoriteIds: newFavs });
                        }}
                        className="mt-3 text-[9px] font-black uppercase text-rose-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Remove from saved
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent" />
             <div className="relative z-10">
               <div className="flex justify-between items-start mb-10">
                 <div>
                   <h3 className="text-3xl font-black mb-1">Eco Master</h3>
                   <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Level: 42</p>
                 </div>
                 <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                   <Award size={36} className="text-lime-400" />
                 </div>
               </div>
               <div className="h-4 bg-slate-800 rounded-full overflow-hidden p-1">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full w-[85%]" />
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PreferenceToggle = ({ icon, label, desc, active, onClick }: { icon: any, label: string, desc: string, active: boolean, onClick: any }) => (
  <button onClick={onClick} className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-between group transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
        {icon}
      </div>
      <div>
        <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{label}</p>
        <p className="text-[10px] text-slate-400 font-medium">{desc}</p>
      </div>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${active ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${active ? 'left-6' : 'left-1'}`} />
    </div>
  </button>
);

export default ProfilePage;
