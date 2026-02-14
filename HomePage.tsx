
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Leaf, Package, MapPin, Share2, PlusCircle, ArrowRight,
  TrendingUp, Award, Clock, DollarSign, X, Camera,
  CheckCircle2, AlertTriangle, HelpCircle, Radar, Zap, Shield,
  Target, Sparkles, ChevronRight, Truck, Radio, Wifi
} from 'lucide-react';
import { User, WasteCategory } from '../types';
import { GoogleGenAI } from "@google/genai";

const data = [
  { name: 'Jan', impact: 400, sales: 2400 },
  { name: 'Feb', impact: 300, sales: 1398 },
  { name: 'Mar', impact: 200, sales: 9800 },
  { name: 'Apr', impact: 278, sales: 3908 },
  { name: 'May', impact: 189, sales: 4800 },
  { name: 'Jun', impact: 239, sales: 3800 },
];

const CATEGORIES: WasteCategory[] = ['Plastic', 'Paper', 'Metal', 'Glass', 'Organic', 'E-Waste'];

const HomePage: React.FC<{ user: User }> = ({ user }) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [showRadarModal, setShowRadarModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [listingStep, setListingStep] = useState(1);
  const [marketInsight, setMarketInsight] = useState<string | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const isSeller = user.role === 'SELLER';

  const fetchMarketInsight = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = isSeller 
        ? `You are an AI market analyst for a waste seller. Analyze current demand for ${CATEGORIES.join(', ')}. Provide a punchy 2-sentence market prediction. Focus on price increases.`
        : `You are an AI eco-analyst for a sustainable buyer. Provide a very brief (2 sentences) report on waste reduction impact and buying trends.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setMarketInsight(response.text || "Market demand is surging for high-density polyethylene. Industrial hubs nearby are looking for clean batches.");
    } catch (error) {
      setMarketInsight(isSeller 
        ? "Copper scrap values projected to rise by 12% this week. Hold inventory for maximum yield." 
        : "Nearby recycling centers have increased their processing capacity. Great time to support local nodes.");
    }
  };

  const handleExpandRadar = async () => {
    setIsScanning(true);
    setShowRadarModal(true);
    await fetchMarketInsight();
    setTimeout(() => setIsScanning(false), 1500);
  };

  const toggleBroadcast = () => {
    setIsBroadcasting(!isBroadcasting);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
               {isSeller ? 'Seller Command' : 'Eco Hub'}
             </h1>
             <div className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-md uppercase tracking-widest">Live</div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {isSeller ? `Partner Ref: ${user.id.slice(0, 6)} is processing 4 inbound requests.` : `Welcome back, ${user.name}. Your impact is growing.`}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={toggleBroadcast}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl shadow-sm border transition-all font-black text-xs uppercase tracking-widest ${
              isBroadcasting 
                ? 'bg-emerald-600 border-emerald-600 text-white radial-sonar' 
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-200'
            }`}
          >
            <Wifi size={16} className={isBroadcasting ? 'text-white' : 'text-emerald-500'} />
            {isBroadcasting ? 'Supply Live to Buyers' : 'Launch Live Signal'}
          </button>
          {isSeller && (
            <button 
              onClick={() => { setShowCreateListing(true); setListingStep(1); }}
              className="flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-8 py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all font-black text-xs uppercase tracking-widest"
            >
              <PlusCircle size={18} />
              Add Inventory
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid - Symmetrical Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={isSeller ? <TrendingUp /> : <Leaf />} 
          title={isSeller ? "Yield Rank" : "Eco Impact"} 
          value={isSeller ? "Top 5%" : "1.2 Tons"} 
          subValue={isSeller ? "Global seller index" : "+12% vs last month"} 
          color="emerald" 
        />
        <StatCard 
          icon={isSeller ? <DollarSign /> : <Zap />} 
          title={isSeller ? "Total Revenue" : "Credits Earned"} 
          value={isSeller ? "Rs. 42,850" : "8,420"} 
          subValue={isSeller ? "Rs. 3,200 available" : "Spendable in Market"} 
          color="lime" 
        />
        <StatCard 
          icon={<Package />} 
          title={isSeller ? "Asset Volume" : "Active Orders"} 
          value={isSeller ? "1,240kg" : "12"} 
          subValue={isSeller ? "Ready for transit" : "2 arriving today"} 
          color="blue" 
        />
        <StatCard 
          icon={isSeller ? <Target /> : <Award />} 
          title={isSeller ? "Supply Trust" : "Reputation"} 
          value={isSeller ? "98.4%" : "Elite 850"} 
          subValue={isSeller ? "Verified purity" : "Eco Master Tier"} 
          color="amber" 
        />
      </div>

      {/* Charts and Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {isSeller ? 'Revenue Streams' : 'Impact Analytics'}
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time ledger projection</p>
            </div>
            <select className="bg-slate-50 dark:bg-slate-800 border-none text-[10px] font-black uppercase tracking-widest rounded-xl p-3 px-4 focus:ring-0">
              <option>Q3 Performance</option>
              <option>Annual View</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', background: '#fff' }} />
                <Area type="monotone" dataKey={isSeller ? "sales" : "impact"} stroke="#10b981" fillOpacity={1} fill="url(#colorImpact)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col transition-colors group overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {isSeller ? 'Demand Radar' : 'Network Map'}
            </h3>
            <div className="flex items-center gap-1.5 text-emerald-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Active Scan</span>
            </div>
          </div>
          
          <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] relative min-h-[250px] flex items-center justify-center border border-slate-100 dark:border-slate-800 group overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#10b981_0%,_transparent_70%)] group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="relative text-center p-6 z-10">
              <div className="relative mb-6">
                <div className="absolute -inset-4 bg-emerald-500/10 rounded-full animate-ping" />
                <MapPin className="text-emerald-600 dark:text-emerald-400 mx-auto" size={48} />
              </div>
              <p className="text-base text-slate-900 dark:text-slate-100 font-black">
                {isSeller ? '3 High-Demand Zones' : '12 Potential Sellers'}
              </p>
              <p className="text-xs text-slate-400 mt-1 font-bold">Within your 5-mile logistics radius</p>
              
              <div className="mt-8 flex -space-x-4 justify-center">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/${i+10}/80/80`} className="w-12 h-12 rounded-2xl border-4 border-white dark:border-slate-900 shadow-xl hover:z-20 transition-all hover:-translate-y-2 cursor-pointer" />
                ))}
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black border-4 border-white dark:border-slate-900 shadow-xl">+12</div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleExpandRadar}
            className="mt-8 w-full py-5 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-[0.2em] bg-emerald-50 dark:bg-emerald-900/20 rounded-[2rem] hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all flex items-center justify-center gap-3 group"
          >
            <Radar size={18} className="group-hover:rotate-180 transition-transform duration-1000" />
            Launch Strategic Scan
          </button>
        </div>
      </div>

      {/* Intelligence Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Sparkles className="text-amber-500" />
            {isSeller ? 'Market Intelligence' : 'Sustainability Guide'}
          </h3>
          <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors flex items-center gap-2">
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <EducationCard 
            title={isSeller ? "Copper Surge" : "Sorting Compliance 2024"} 
            desc={isSeller ? "Local Colombo yard prices indicate a 15% increase in copper scrap value this week." : "Stay updated with the latest regulations for home-sorted micro-plastics."}
            image="https://dixdeynibyck7.cloudfront.net/images/content/Commodities/COPPER_01_L.jpg"
            tag={isSeller ? "Pricing" : "Compliance"}
          />
          <EducationCard 
            title={isSeller ? "HDPE Demand Spike" : "Carbon Credits 101"} 
            desc={isSeller ? "Industrial buyers in your area are seeking clean HDPE bales for immediate processing." : "Learn how your daily waste sorting translates into spendable eco-credits."}
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbTQ-djuumI3ACJe-HI6MmnNyOh6Lj4K9m0w&s"
            tag={isSeller ? "Demand" : "Tutorial"}
          />
          <EducationCard 
            title={isSeller ? "Logistics Beta" : "Community Goals"} 
            desc={isSeller ? "New electric fleet routes in Kandy can reduce your transport overhead by 22%." : "Our city is 82% towards its zero-waste goal. Your contributions matter."}
            image="https://betacargologistics.com.ng/wp-content/uploads/2024/03/h1-2.webp"
            tag={isSeller ? "Logistics" : "Impact"}
          />
        </div>
      </div>

      {/* Radar Expansion Modal */}
      {showRadarModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setShowRadarModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/10 transition-colors">
            <div className="p-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">AI {isSeller ? 'Market' : 'Eco'}-Radar</h3>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Status: High-Precision Sweep Active</p>
                </div>
                <button onClick={() => setShowRadarModal(false)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:text-slate-900 dark:hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="relative aspect-video bg-slate-950 rounded-[2.5rem] overflow-hidden flex items-center justify-center mb-10 border border-slate-800">
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-full h-full opacity-30 bg-[radial-gradient(circle_at_center,_#10b981_0%,_transparent_70%)]" />
                   {isScanning && (
                      <div className="absolute w-[200%] h-1 bg-emerald-500/50 blur-sm animate-spin origin-center" style={{ animationDuration: '4s' }} />
                   )}
                   <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10">
                     {Array.from({length: 100}).map((_, i) => <div key={i} className="border border-emerald-500/20" />)}
                   </div>
                   {!isScanning && (
                     <div className="relative w-full h-full">
                        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_20px_#10b981]" />
                        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-lime-400 rounded-full animate-pulse shadow-[0_0_20px_#a3e635]" />
                        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-[0_0_20px_#3b82f6]" />
                     </div>
                   )}
                </div>
                
                <div className="relative z-10 text-center px-12">
                   {isScanning ? (
                     <div className="space-y-4">
                        <Radar className="text-emerald-400 animate-spin mx-auto" size={64} style={{ animationDuration: '2s' }} />
                        <p className="text-white font-black text-xl tracking-[0.2em] uppercase">Processing Nodes...</p>
                     </div>
                   ) : (
                     <div className="space-y-4 animate-float">
                        <CheckCircle2 className="text-emerald-400 mx-auto" size={64} />
                        <p className="text-white font-black text-2xl">Scan Complete</p>
                        <p className="text-emerald-400 font-bold uppercase text-[10px] tracking-[0.3em]">Found {isSeller ? '3 High-Yield Opportunities' : '12 Trusted Partners'}</p>
                     </div>
                   )}
                </div>
              </div>

              {!isScanning && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                   <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white flex gap-6 shadow-xl shadow-emerald-100 dark:shadow-none">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                         <Zap size={28} />
                      </div>
                      <div>
                         <h4 className="font-black text-white/60 uppercase text-[10px] tracking-[0.2em] mb-1">AI Strategic Advisor</h4>
                         <p className="text-lg font-bold leading-snug">
                            {marketInsight}
                         </p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <RadarResultCard 
                        title={isSeller ? "Priority Pickup" : "Verified Seller"} 
                        desc={isSeller ? "LankaCycle Ltd • Rs. 45,000/t" : "EcoScrap Colombo • 0.8 km"}
                        icon={<Truck size={16} />} 
                      />
                      <RadarResultCard 
                        title={isSeller ? "Yield Bonus" : "Bulk Offer"} 
                        desc={isSeller ? "Clean Metal +15% Credits" : "HDPE Bundle Sale"}
                        icon={<Award size={16} />} 
                      />
                   </div>
                </div>
              )}

              <button 
                onClick={() => setShowRadarModal(false)}
                className="mt-10 w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isScanning ? 'Abort Protocol' : (isSeller ? 'Access Trading Desk' : 'Explore Matches')}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Listing Modal with SWING ANIMATION */}
      {showCreateListing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setShowCreateListing(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden transition-colors border border-white/5 animate-swing-modal">
            <div className="p-10">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">New Supply Record</h3>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Step {listingStep} of 3 • Ledger Update</p>
                </div>
                <button onClick={() => setShowCreateListing(false)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:text-slate-900 dark:hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {listingStep === 1 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Name</label>
                      <input placeholder="e.g. Mixed PET Bales" className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-900 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Classification</label>
                      <select className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-900 dark:text-white">
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Composition Details</label>
                    <textarea placeholder="Specify purity levels, contaminants..." rows={3} className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-900 dark:text-white" />
                  </div>
                </div>
              )}

              {listingStep === 2 && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Verification Visuals</label>
                      <div className="h-48 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all cursor-pointer group">
                        <Camera size={40} className="mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Upload Photo</span>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price per Unit (Rs.)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">Rs.</span>
                          <input type="number" placeholder="0.00" className="w-full pl-12 pr-5 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-900 dark:text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Quantity/Mass</label>
                        <input type="number" placeholder="kg / count" className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-900 dark:text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {listingStep === 3 && (
                <div className="text-center py-10 space-y-8">
                   <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                     <CheckCircle2 size={48} />
                   </div>
                   <div>
                     <h4 className="text-3xl font-black text-slate-900 dark:text-white">Broadcast supply?</h4>
                     <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed mt-2">
                       This will alert buyers in your local sector. <strong>+10 Community Score</strong> for new listings.
                     </p>
                   </div>
                   <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl flex items-center gap-4 text-left border border-amber-100 dark:border-amber-900/20">
                     <AlertTriangle className="text-amber-500 shrink-0" size={24} />
                     <p className="text-xs text-amber-900 dark:text-amber-400 font-bold leading-relaxed uppercase tracking-wide">
                       Your pricing is 5% lower than neighbors. Expect rapid bids.
                     </p>
                   </div>
                </div>
              )}

              <div className="mt-12 flex justify-between gap-6 border-t border-slate-50 dark:border-slate-800 pt-10">
                <button 
                  onClick={() => listingStep > 1 ? setListingStep(listingStep - 1) : setShowCreateListing(false)}
                  className="px-10 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  {listingStep === 1 ? 'Discard' : 'Back'}
                </button>
                <button 
                  onClick={() => listingStep < 3 ? setListingStep(listingStep + 1) : setShowCreateListing(false)}
                  className="px-12 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-700 transition-all flex items-center gap-3"
                >
                  {listingStep === 3 ? 'Sync Supply' : 'Next Protocol'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, subValue, color }: { icon: React.ReactNode, title: string, value: string, subValue: string, color: string }) => {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    lime: 'bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
  };
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group">
      <div className={`w-14 h-14 ${colorMap[color]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{value}</h4>
      <p className="text-[10px] font-bold text-slate-400 mt-4 flex items-center gap-1.5 uppercase tracking-widest">
        {subValue} <HelpCircle size={10} className="text-slate-300" />
      </p>
    </div>
  );
};

const EducationCard = ({ title, desc, image, tag }: { title: string, desc: string, image: string, tag: string }) => (
  <div className="group cursor-pointer bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
    <div className="h-52 overflow-hidden relative">
      <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={title} />
      <div className="absolute top-6 left-6">
        <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
          {tag}
        </span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
        <span className="text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">Deep Read <ArrowRight size={14} /></span>
      </div>
    </div>
    <div className="p-8">
      <h4 className="font-black text-xl mb-4 text-slate-900 dark:text-white leading-tight group-hover:text-emerald-500 transition-colors">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);

const RadarResultCard = ({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) => (
  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 hover:border-emerald-200 transition-all group">
     <div className="flex items-center gap-3 mb-2 text-emerald-600 dark:text-emerald-400">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-emerald-500 transition-colors">{title}</span>
     </div>
     <p className="font-black text-slate-900 dark:text-white text-sm">{desc}</p>
  </div>
);

export default HomePage;
