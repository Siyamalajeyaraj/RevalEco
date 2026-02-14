
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area
} from 'recharts';
import { 
  Star, Award, TrendingUp, Package, Users, 
  ArrowUpRight, ArrowDownRight, MessageSquare, ShieldCheck,
  Edit3, Trash2, CheckCircle2, Clock, Truck, ListFilter,
  MoreVertical, ChevronRight, AlertCircle, ExternalLink,
  DollarSign, Wallet, CreditCard, ArrowRightLeft, Sparkles,
  RefreshCw, Plus, Leaf, Activity, ArrowRight, Box
} from 'lucide-react';
import { User, WasteItem, EarningsReport } from '../types';
import { MOCK_PRODUCTS } from '../constants';

const pieData = [
  { name: 'Plastic', value: 400, color: '#10b981' },
  { name: 'Metal', value: 300, color: '#3b82f6' },
  { name: 'Paper', value: 300, color: '#f59e0b' },
  { name: 'Glass', value: 200, color: '#6366f1' },
];

const salesTrend = [
  { day: 'Mon', sales: 400, revenue: 2400 },
  { day: 'Tue', sales: 300, revenue: 1398 },
  { day: 'Wed', sales: 900, revenue: 9800 },
  { day: 'Thu', sales: 500, revenue: 3908 },
  { day: 'Fri', sales: 700, revenue: 4800 },
  { day: 'Sat', sales: 800, revenue: 3800 },
  { day: 'Sun', sales: 400, revenue: 4300 },
];

const RECENT_ORDERS = [
  { id: 'ORD-8821', item: 'Aluminum Scrap', partner: 'LankaRecycle', amount: 'Rs. 45,000.00', status: 'Pending', date: 'Oct 24, 2023' },
  { id: 'ORD-8819', item: 'Plastic Bales', partner: 'GreenTech SL', amount: 'Rs. 12,000.00', status: 'Processing', date: 'Oct 23, 2023' },
  { id: 'ORD-8815', item: 'Cardboard', partner: 'Paper Mill Ltd', amount: 'Rs. 8,500.00', status: 'Completed', date: 'Oct 21, 2023' },
];

const FINANCIALS_MOCK = {
  seller: {
    totalRevenue: 428500,
    availableBalance: 32000.50,
    pendingPayout: 12400.00,
    nextPayoutDate: 'Oct 30, 2023',
    history: [
      { id: 'PAY-121', amount: 45000.00, date: 'Oct 15, 2023', status: 'SUCCESS', type: 'Payout' },
      { id: 'PAY-119', amount: 32000.00, date: 'Oct 01, 2023', status: 'SUCCESS', type: 'Payout' },
    ]
  },
  buyer: {
    totalSpent: 184200,
    ecoCredits: 840,
    pendingShipments: 4,
    history: [
      { id: 'TRN-442', amount: 4500.00, date: 'Oct 24, 2023', status: 'SUCCESS', type: 'Purchase' },
      { id: 'TRN-440', amount: 1200.00, date: 'Oct 23, 2023', status: 'SUCCESS', type: 'Purchase' },
    ]
  }
};

const DashboardPage: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'orders' | 'financials'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isSeller = user.role === 'SELLER';
  const roleData = isSeller ? FINANCIALS_MOCK.seller : FINANCIALS_MOCK.buyer;

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleRegisterThings = () => {
    alert("System Ready. Initiating 'Register Things' protocol...");
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {isSeller ? 'Supply Control' : 'Impact Station'}
            </h1>
            <div className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">
              {isSeller ? 'Elite Supply Node' : 'Global Buyer'}
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide">
             {isSeller ? 'Network Synchronized • Sector: Western Province' : 'Sustainability Impact Verified • Credits Active'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-900 p-2 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" />
            <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} label={isSeller ? "Supply" : "Log"} />
            <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label="Orders" />
            <TabButton active={activeTab === 'financials'} onClick={() => setActiveTab('financials')} label="Ledger" />
          </div>
          <button 
            onClick={refreshData}
            className={`p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 shadow-sm transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-3 space-y-8">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <MetricCard 
                title={isSeller ? "Gross Revenue" : "Investment"} 
                value={isSeller ? `Rs. ${FINANCIALS_MOCK.seller.totalRevenue.toLocaleString()}` : `Rs. ${FINANCIALS_MOCK.buyer.totalSpent.toLocaleString()}`} 
                change="+12.5%" 
                icon={isSeller ? <TrendingUp /> : <DollarSign />} 
                color="emerald" 
              />
              <MetricCard 
                title={isSeller ? "Trust Score" : "Eco-Credits"} 
                value={isSeller ? "Elite" : `${FINANCIALS_MOCK.buyer.ecoCredits}`} 
                change={isSeller ? "98%" : "Spendable"} 
                icon={isSeller ? <ShieldCheck /> : <Leaf />} 
                color="blue" 
              />
              <MetricCard 
                title={isSeller ? "Volume Out" : "Volume In"} 
                value={isSeller ? "1,240kg" : "840kg"} 
                change="+18.4%" 
                icon={<Package />} 
                color="amber" 
              />
            </div>

            {/* Main Analytics Chart */}
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Trend Matrix</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                    Sector activity in Colombo District
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase">Current</span>
                  </div>
                  <select className="bg-slate-50 dark:bg-slate-800 border-none text-[10px] font-black uppercase tracking-widest rounded-xl p-3 px-6 focus:ring-0">
                    <option>Weekly View</option>
                    <option>Monthly View</option>
                  </select>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesTrend}>
                    <defs>
                      <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-5" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', background: '#fff' }}
                      itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey={isSeller ? "revenue" : "sales"} stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorMain)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Symmetrical Grid for Feedbacks & AI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{isSeller ? 'Node Reviews' : 'Log Analysis'}</h3>
                    <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Full Audit</button>
                  </div>
                  <div className="space-y-6">
                    <LogItem role={isSeller ? "Review" : "Eco-Log"} />
                    <LogItem role={isSeller ? "Review" : "Eco-Log"} second />
                  </div>
               </div>

               <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Sparkles size={150} />
                 </div>
                 <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-emerald-500/20 rounded-2xl">
                          <Sparkles size={20} className="text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">AI Local Brain</span>
                      </div>
                      <h4 className="text-2xl font-black mb-4">{isSeller ? 'Yield Maximizer' : 'Spending Efficiency'}</h4>
                      <p className="text-slate-400 text-sm font-bold leading-relaxed mb-10">
                        {isSeller ? 'Metal values at Colombo Harbor are peaking. Recommend batch release within 12 hours for max LKR yield.' : 'Switch your organic sourcing to the Central Province hub to earn 15% more eco-credits this month.'}
                      </p>
                    </div>
                    <button className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3">
                      Run Strategy Engine <ArrowRight size={18} />
                    </button>
                 </div>
               </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Pie Chart Widget */}
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-8">{isSeller ? 'Supply Mix' : 'Sourcing Mix'}</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={8} dataKey="value">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 space-y-4">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-900 dark:text-slate-300">{(item.value / 1200 * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Widget */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-10 rounded-[3rem] text-white shadow-2xl">
               <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                  <Award className="text-lime-400" size={32} />
               </div>
               <h4 className="text-3xl font-black mb-3 leading-tight">Elite Node</h4>
               <p className="text-emerald-100/70 text-sm font-bold mb-10 leading-relaxed">
                 {isSeller ? "You're outperforming 94% of local sellers." : "Your volume diverted 12 tons from local landfills."}
               </p>
               <div className="space-y-4">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">
                    <span>Next Rank</span>
                    <span>94%</span>
                 </div>
                 <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-lime-400 w-[94%] shadow-[0_0_15px_#a3e635]" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors animate-in slide-in-from-right-4 duration-500">
          <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-8">
            <div className="space-y-2">
               <h3 className="text-3xl font-black text-slate-900 dark:text-white">{isSeller ? 'Asset Ledger' : 'Transaction History'}</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                 {isSeller ? 'Current inventory valuation: ' : 'Lifetime savings contribution: '}
                 <span className="text-emerald-600 font-black">Rs. 1,245,000.00</span>
               </p>
            </div>
            <div className="flex gap-4">
               <div className="relative">
                  <ListFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select className="pl-12 pr-8 py-4 bg-slate-50 dark:bg-slate-800 border-none text-[10px] font-black uppercase tracking-widest rounded-2xl focus:ring-0 text-slate-600 dark:text-slate-300">
                    <option>All Records</option>
                    <option>Verified Only</option>
                    <option>High Impact</option>
                  </select>
               </div>
               {isSeller && (
                 <button 
                  onClick={handleRegisterThings}
                  className="flex items-center gap-3 px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
                 >
                   <Box size={18} /> Register Things
                 </button>
               )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.25em]">
                <tr>
                  <th className="px-10 py-6">Supply Identifier</th>
                  <th className="px-10 py-6">Classification</th>
                  <th className="px-10 py-6 text-right">LKR Value/Unit</th>
                  <th className="px-10 py-6">Mass</th>
                  <th className="px-10 py-6 text-center">Status</th>
                  <th className="px-10 py-6 text-center">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {MOCK_PRODUCTS.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-700 shadow-sm group-hover:scale-110 transition-transform">
                           <img src={product.image} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-black text-sm text-slate-900 dark:text-slate-100">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-500">{product.category}</td>
                    <td className="px-10 py-8 text-right font-black text-sm text-emerald-600">Rs. {product.price.toLocaleString()}</td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-24">
                          <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" style={{ width: `${Math.min(product.quantity, 100)}%` }} />
                        </div>
                        <span className="font-black text-[10px] text-slate-400 uppercase">{product.quantity}{product.unit}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                         <ShieldCheck size={12} /> Verified
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <button className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-300 hover:text-emerald-500 rounded-2xl transition-all"><ChevronRight size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'financials' && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{isSeller ? 'Available for Payout' : 'Current Wallet'}</p>
                <h4 className="text-5xl font-black text-slate-900 dark:text-white mb-10 tracking-tighter">Rs. {(isSeller ? FINANCIALS_MOCK.seller.availableBalance : FINANCIALS_MOCK.buyer.totalSpent).toLocaleString()}</h4>
                <button className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-[1.5rem] shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-4">
                   {isSeller ? <Wallet size={18} /> : <Plus size={18} />} {isSeller ? 'Withdraw Funds' : 'Recharge Wallet'}
                </button>
             </div>
             
             <div className="bg-emerald-600 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-emerald-100 dark:shadow-none">
                <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.2em] mb-4">{isSeller ? 'Pending Settlement' : 'Eco-Credits Balance'}</p>
                <h4 className="text-5xl font-black mb-10 tracking-tighter">{isSeller ? `Rs. ${FINANCIALS_MOCK.seller.pendingPayout.toLocaleString()}` : FINANCIALS_MOCK.buyer.ecoCredits}</h4>
                <div className="flex items-center gap-4 text-emerald-100 font-bold text-xs bg-emerald-500/30 p-5 rounded-3xl backdrop-blur-md">
                   {isSeller ? <Clock size={20} /> : <Leaf size={20} />} 
                   {isSeller ? `Estimated: ${FINANCIALS_MOCK.seller.nextPayoutDate}` : 'Spendable on premium analytics'}
                </div>
             </div>

             <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-colors">
                <div className="absolute top-0 right-0 p-12 text-slate-50 dark:text-slate-800/30 group-hover:scale-110 transition-transform">
                  <CreditCard size={120} />
                </div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Verifed Account</p>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Sustainable Bank SL</h4>
                    <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">**** **** **** 8821</p>
                  </div>
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:gap-4 transition-all mt-10">
                    Audit Security <ChevronRight size={16} />
                  </button>
                </div>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
             <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Supply Ledger</h3>
                <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-emerald-500 transition-all">
                  <ExternalLink size={20} />
                </button>
             </div>
             <div className="space-y-6">
                {roleData.history.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center justify-between p-8 bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all group">
                    <div className="flex items-center gap-8">
                       <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                          <DollarSign size={28} />
                       </div>
                       <div>
                          <h5 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">{item.type === 'Payout' ? 'Electronic Payout' : 'Market Acquisition'}</h5>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.date} • ID: {item.id}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-12">
                       <div className="text-right">
                          <p className={`font-black text-xl ${item.type === 'Payout' ? 'text-slate-900 dark:text-white' : 'text-red-500'}`}>
                            {item.type === 'Purchase' ? '-' : '+'}Rs. {item.amount.toLocaleString()}
                          </p>
                          <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md">
                             {item.status}
                          </span>
                       </div>
                       <button className="p-4 bg-white dark:bg-slate-900 text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-2xl shadow-sm transition-all">
                         <ChevronRight size={22} />
                       </button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <MetricCard title="Awaiting Verification" value="5" change="Priority" icon={<Clock />} color="amber" />
             <MetricCard title="In Transit" value="12" change="Live Fleet" icon={<Truck />} color="blue" />
             <MetricCard title="Finalized Cycles" value="128" change="+12% MoM" icon={<CheckCircle2 />} color="emerald" />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-12 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
               <h3 className="text-3xl font-black text-slate-900 dark:text-white">Active Fulfillment</h3>
               <div className="flex gap-3">
                 <button className="px-6 py-3 bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all text-slate-500">History</button>
                 <button className="px-6 py-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-100 dark:shadow-none">Real-time</button>
               </div>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
               {RECENT_ORDERS.map((order) => (
                 <div key={order.id} className="p-10 flex flex-wrap items-center justify-between gap-8 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <div className="flex items-center gap-8">
                       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                         order.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600' : 
                         order.status === 'Processing' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600'
                       }`}>
                         <Package size={32} />
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{order.item}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {order.id} • {order.date}</p>
                       </div>
                    </div>
                    
                    <div className="flex-1 min-w-[200px] flex items-center gap-16">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isSeller ? 'Partner Node' : 'Distributor'}</p>
                          <p className="font-black text-sm text-slate-700 dark:text-slate-300">{order.partner}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cycle Total</p>
                          <p className="font-black text-sm text-emerald-600">{order.amount}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-8">
                       <span className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                         order.status === 'Completed' ? 'bg-emerald-500 text-white' : 
                         order.status === 'Processing' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'
                       }`}>
                         {order.status}
                       </span>
                       <button className="p-4 bg-white dark:bg-slate-900 text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-2xl border border-slate-100 dark:border-slate-800 transition-all">
                         <ExternalLink size={20} />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
      active 
        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xl' 
        : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
    }`}
  >
    {label}
  </button>
);

const MetricCard = ({ title, value, change, icon, color }: { title: string, value: string, change: string, icon: React.ReactNode, color: string }) => {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800'
  };
  
  return (
    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:-translate-y-2 transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className={`p-5 rounded-2xl transition-colors ${colorMap[color]} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${
          change.startsWith('+') ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 
          'bg-slate-100 dark:bg-slate-800 text-slate-400'
        }`}>
          {change}
        </div>
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em]">{title}</p>
      <h4 className="text-4xl font-black text-slate-900 dark:text-white mt-2 tracking-tighter">{value}</h4>
    </div>
  );
};

const LogItem = ({ role, second }: { role: string, second?: boolean }) => (
  <div className="p-8 bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <img src={`https://picsum.photos/seed/${second ? 'sm' : 'jd'}/60/60`} className="w-12 h-12 rounded-2xl border-4 border-white dark:border-slate-700 shadow-xl group-hover:scale-110 transition-transform" />
        <div>
          <h5 className="font-black text-sm text-slate-900 dark:text-slate-100">{second ? 'GreenTech SL' : 'Aruna Perera'}</h5>
          <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{second ? 'Yesterday' : '2 hours ago'}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {role === "Review" ? (
          Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className={i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />)
        ) : (
          <Activity size={20} className="text-emerald-500" />
        )}
      </div>
    </div>
    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-bold italic">
      {role === "Review" ? '"High-purity HDPE bales received. Verified by Colombo Node."' : '"Waste diverted from Kandy sector: 42kg. Local impact high."'}
    </p>
  </div>
);

export default DashboardPage;
