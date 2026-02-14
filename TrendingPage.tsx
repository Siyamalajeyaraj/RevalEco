
import React, { useState } from 'react';
import { 
  Heart, MessageCircle, Share2, TrendingUp, Sparkles, Filter, 
  X, Plus, Camera, ArrowRight, CheckCircle2, Leaf, Lightbulb,
  PenTool, Image as ImageIcon, MapPin
} from 'lucide-react';
import { TRENDING_IDEAS } from '../constants';

const TrendingPage: React.FC = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareStep, setShareStep] = useState(1);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Sparkles className="text-amber-500" size={36} />
            Trending Eco-Ideas
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Get inspired by what others are building with recycled waste.</p>
        </div>
        <div className="hidden md:flex gap-2">
           <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all">
            <Filter size={18} />
            Filter
          </button>
          <button 
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all"
          >
            <Plus size={18} />
            Share Your DIY
          </button>
        </div>
      </div>

      {/* Featured Trend */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-emerald-900 h-[400px] shadow-2xl group cursor-pointer">
        <img 
          src="https://www.miemiegift.com/cdn/shop/articles/miemie-gift-pipe-cleaner-LAVENDER-tutorial-cover-purple-lavender-on-white-background_5bc0d86d-cdf2-42aa-bb48-75460da13487.jpg?v=1752400493&width=1100" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
          alt="Featured DIY"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-emerald-200 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-emerald-500/30">
            <TrendingUp size={14} />
            Trend of the Week
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">Upcycled Pipe Cleaner Flowers</h2>
          <p className="text-emerald-100/80 text-lg mb-8 line-clamp-2 font-medium">
            Turn industrial wire scraps and pipe cleaners into beautiful eternal bouquets. A sustainable alternative to fresh-cut flowers.
          </p>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => window.open('https://onelittleproject.com/pipe-cleaner-daffodils-and-tulips/', '_blank')}
              className="bg-white text-emerald-900 px-8 py-4 rounded-2xl font-bold shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
            >
              See Full Guide
            </button>
            <div className="flex -space-x-3">
              {[1,2,3,4,5].map(i => (
                <img key={i} src={`https://picsum.photos/seed/user_${i}/40/40`} className="w-10 h-10 rounded-full border-2 border-emerald-800" />
              ))}
              <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold text-emerald-200 border-2 border-emerald-800">
                +1k
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
        {TRENDING_IDEAS.map(idea => (
          <div key={idea.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500">
            <div className="relative h-64 overflow-hidden">
              <img src={idea.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={idea.title} />
              <div className="absolute top-5 right-5 flex gap-2">
                <button 
                  onClick={() => {
                    // Item saved - could show a toast notification
                  }}
                  className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-slate-400 hover:text-red-500 transition-all shadow-sm"
                >
                  <Heart size={20} />
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="flex gap-2 mb-4">
                {idea.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg">{tag}</span>
                ))}
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900">{idea.title}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium line-clamp-2">{idea.description}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center gap-5 text-slate-400">
                  <span className="flex items-center gap-1.5 text-xs font-bold">
                    <Heart size={18} className="text-red-400 fill-red-400" />
                    {idea.likes}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold">
                    <MessageCircle size={18} />
                    42
                  </span>
                </div>
                <button onClick={() => { if (navigator.share) { navigator.share({ title: idea.title, text: idea.description, url: window.location.href }).catch(() => {}); } else { navigator.clipboard.writeText(window.location.href); } }} className="text-slate-400 hover:text-emerald-600 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      <div className="md:hidden fixed bottom-24 right-6 z-40">
        <button 
          onClick={() => setShowShareModal(true)}
          className="w-16 h-16 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-slate-300"
        >
          <Plus size={32} />
        </button>
      </div>

      {/* Share DIY Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => {setShowShareModal(false); setShareStep(1);}} />
          <div className="relative bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-float">
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Share Your DIY</h3>
                  <p className="text-slate-500 text-sm font-medium">Step {shareStep} of 3 • {shareStep === 1 ? 'Project Details' : shareStep === 2 ? 'Instructions' : 'Impact'}</p>
                </div>
                <button 
                  onClick={() => {setShowShareModal(false); setShareStep(1);}} 
                  className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {shareStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Project Name</label>
                    <div className="relative">
                      <Lightbulb className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                      <input 
                        placeholder="e.g. Ocean Bottle Chandelier" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Primary Material</label>
                      <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold">
                        <option>Plastic</option>
                        <option>Metal</option>
                        <option>Glass</option>
                        <option>Paper</option>
                        <option>Textiles</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Difficulty Level</label>
                      <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold">
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {shareStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Project Visuals</label>
                    <div className="h-44 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-[2rem] flex flex-col items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-all cursor-pointer group">
                      <Camera size={40} className="mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-black uppercase tracking-widest">Upload Masterpiece</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Steps & Tips</label>
                    <div className="relative">
                      <PenTool className="absolute left-4 top-4 text-slate-300" size={18} />
                      <textarea 
                        placeholder="Write down the secret steps..." 
                        rows={4} 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {shareStep === 3 && (
                <div className="text-center py-6 space-y-8">
                   <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto relative">
                     <CheckCircle2 size={48} />
                     <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
                   </div>
                   <div>
                     <h4 className="text-3xl font-black text-slate-900">Inspire the World!</h4>
                     <p className="text-slate-500 max-w-xs mx-auto leading-relaxed mt-2 font-medium">
                       Your project will be shared with the RevalEco community and earn you <strong>150 EcoPoints</strong>.
                     </p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl flex items-center gap-4 text-left border border-slate-100">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                        <Leaf size={24} />
                     </div>
                     <div>
                       <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Eco Projection</p>
                       <p className="text-sm font-bold text-slate-700">This project diverts ~0.5kg of waste.</p>
                     </div>
                   </div>
                </div>
              )}

              <div className="mt-12 flex justify-between gap-4 border-t border-slate-50 pt-8">
                <button 
                  onClick={() => shareStep > 1 ? setShareStep(shareStep - 1) : setShowShareModal(false)}
                  className="px-8 py-4 text-slate-400 font-bold hover:text-slate-900 transition-all uppercase text-xs tracking-[0.2em]"
                >
                  {shareStep === 1 ? 'Discard' : 'Go Back'}
                </button>
                <button 
                  onClick={() => shareStep < 3 ? setShareStep(shareStep + 1) : (setShowShareModal(false), setShareStep(1))}
                  className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center gap-3 uppercase text-xs tracking-[0.2em]"
                >
                  {shareStep === 3 ? 'Blast Off' : 'Continue'}
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

export default TrendingPage;
