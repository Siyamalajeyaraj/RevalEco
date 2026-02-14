
import React, { useState } from 'react';
import { 
  Trash2, CreditCard, Truck, ShieldCheck, 
  ChevronRight, Apple, Landmark, Wallet, ArrowLeft
} from 'lucide-react';
import { CartItem } from '../types';
import { Link } from 'react-router-dom';

interface CartPageProps {
  cart: CartItem[];
  removeFromCart: (id: string) => void;
  onClear: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, removeFromCart, onClear }) => {
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('Credit / Debit');
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  const shipping = subtotal > 0 ? 1500.00 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-600 animate-float">
          <Truck size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 font-medium">Start adding some recyclable materials to make a difference!</p>
        <Link 
          to="/marketplace" 
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all uppercase text-xs tracking-widest"
        >
          Explore Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-4 mb-16">
        <StepIcon active={step >= 1} label="Cart" number={1} />
        <div className={`w-12 h-1 ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-200'} rounded-full`} />
        <StepIcon active={step >= 2} label="Logistic" number={2} />
        <div className={`w-12 h-1 ${step >= 3 ? 'bg-emerald-600' : 'bg-slate-200'} rounded-full`} />
        <StepIcon active={step >= 3} label="Settlement" number={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-slate-900">Shopping Ledger</h2>
                <button onClick={onClear} className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline">Clear all</button>
              </div>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex gap-6 hover:shadow-xl transition-all">
                    <img src={item.image} className="w-28 h-28 rounded-2xl object-cover shadow-md" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">{item.title}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest">{item.category}</p>
                      <div className="flex justify-between items-end mt-4">
                        <div className="text-xs font-bold text-slate-500">
                          <span className="opacity-60 uppercase tracking-tighter">Qty: </span>
                          <span className="text-slate-900 dark:text-white">{item.cartQuantity} {item.unit}</span>
                        </div>
                        <span className="font-black text-lg text-emerald-600">Rs. {(item.price * item.cartQuantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10">
              <h2 className="text-3xl font-black text-slate-900">Logistic Matrix</h2>
              <div className="grid grid-cols-2 gap-6">
                <input placeholder="First Name" className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" />
                <input placeholder="Last Name" className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" />
                <input placeholder="Transit Hub / Address" className="col-span-2 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" />
                <input placeholder="City" className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" />
                <input placeholder="Postal Code" className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" />
              </div>
              <div className="p-8 bg-emerald-600 rounded-[2.5rem] text-white flex items-center gap-6 shadow-2xl">
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
                  <Truck size={32} />
                </div>
                <div>
                  <h4 className="font-black text-xl">Eco-Electric Transit</h4>
                  <p className="text-sm text-emerald-100/80 font-medium">Verified zero-emission delivery fleet.</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10">
              <h2 className="text-3xl font-black text-slate-900">Settlement Protocol</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PaymentOption icon={<CreditCard />} label="Credit / Debit" selected={selectedPayment === 'Credit / Debit'} onClick={() => setSelectedPayment('Credit / Debit')} />
                <PaymentOption icon={<Truck />} label="Cash on Delivery" selected={selectedPayment === 'Cash on Delivery'} onClick={() => setSelectedPayment('Cash on Delivery')} />
                <PaymentOption icon={<Landmark />} label="Direct Bank" selected={selectedPayment === 'Direct Bank'} onClick={() => setSelectedPayment('Direct Bank')} />
                <PaymentOption icon={<Wallet />} label="Reval Credits" selected={selectedPayment === 'Reval Credits'} onClick={() => setSelectedPayment('Reval Credits')} />
              </div>
              {selectedPayment === 'Credit / Debit' && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
                  <div className="relative">
                    <input placeholder="Card Identity Number" className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-black" />
                    <CreditCard className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <input placeholder="EXPIRY" className="p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-black" />
                    <input placeholder="CCV" className="p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-black" />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-10 border-t border-slate-50">
             <button 
                onClick={() => setStep(Math.max(1, step - 1))}
                className={`flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button 
                onClick={() => step < 3 ? setStep(step + 1) : alert('Order Placed Successfully!')}
                className="bg-emerald-600 text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all flex items-center gap-3"
              >
                {step === 3 ? 'Finalize Order' : 'Next Step'}
                <ChevronRight size={15} />
              </button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl sticky top-8 transition-colors">
            <h3 className="text-2xl font-black mb-8 text-slate-900 dark:text-white">Summary</h3>
            <div className="space-y-5 mb-8">
              <div className="flex justify-between text-slate-500 font-bold">
                <span className="uppercase text-[10px] tracking-widest">Net Total</span>
                <span className="text-slate-900 dark:text-white">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-bold">
                <span className="uppercase text-[10px] tracking-widest">Eco Logistic</span>
                <span className="text-slate-900 dark:text-white">Rs. {shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-bold">
                <span className="uppercase text-[10px] tracking-widest">Network Fee</span>
                <span className="text-slate-900 dark:text-white">Rs. 0.00</span>
              </div>
              <div className="h-px bg-slate-50 dark:bg-slate-800 my-6" />
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Grand Total</span>
                <span className="text-3xl font-black text-emerald-600 tracking-tighter">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-3xl flex items-center gap-4 border border-emerald-100 dark:border-emerald-900/30">
              <ShieldCheck className="text-emerald-600" size={24} />
              <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-black leading-relaxed uppercase tracking-widest">
                Protected by <strong>RevalEco Secure Buyer Protocol</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StepIcon = ({ active, label, number }: { active: boolean, label: string, number: number }) => (
  <div className="flex flex-col items-center gap-3">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${
      active ? 'bg-emerald-600 text-white scale-110 shadow-2xl' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
    }`}>
      {number}
    </div>
    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
      {label}
    </span>
  </div>
);

const PaymentOption = ({ icon, label, selected, onClick }: { icon: React.ReactNode, label: string, selected?: boolean, onClick?: () => void }) => (
  <button onClick={onClick} className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${
    selected
      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100'
      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:border-slate-200'
  }`}>
    <div className={`${selected ? 'text-emerald-600' : 'text-slate-400'}`}>
      {icon}
    </div>
    <span className="font-black text-xs uppercase tracking-widest">{label}</span>
  </button>
);

export default CartPage;
