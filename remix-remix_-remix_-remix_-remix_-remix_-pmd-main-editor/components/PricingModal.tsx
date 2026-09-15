import React, { useState } from 'react';
import { useAuth } from './AuthContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CREDIT_PACKS = [
  {
    id: 'pack_starter',
    name: 'Starter Pack',
    credits: 50,
    price: 'CA$25',
    unitPrice: 'CA$0.50 / edit',
    popular: false,
    description: 'Perfect for single property listings and quick touchups.'
  },
  {
    id: 'pack_pro',
    name: 'Pro Agent Pack',
    credits: 200,
    price: 'CA$77',
    unitPrice: 'CA$0.39 / edit',
    popular: true,
    description: 'Most popular for active producing agents and listing coordinators.'
  },
  {
    id: 'pack_agency',
    name: 'Brokerage / Media Pack',
    credits: 600,
    price: 'CA$175',
    unitPrice: 'CA$0.29 / edit',
    popular: false,
    description: 'High volume pack with priority queueing and lowest per-photo cost.'
  }
];

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const { profile, addCredits } = useAuth();
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulatePurchase = async (pack: typeof CREDIT_PACKS[0]) => {
    setPurchasing(pack.id);
    try {
      // In production with Stripe, this calls /api/stripe/checkout-session
      // For immediate preview experience, we grant credits and log the transaction
      await new Promise(r => setTimeout(r, 700));
      await addCredits(pack.credits, `Purchased ${pack.name} (${pack.credits} Credits)`);
      setSuccessNotice(`Successfully credited ${pack.credits} credits to your account!`);
      setTimeout(() => {
        setSuccessNotice(null);
      }, 4000);
    } catch (err: any) {
      alert("Purchase failed: " + err.message);
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            Instant Credit Top-Up
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Choose Your Credit Pack
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Credits never expire. Use them across virtual staging, sunny skies, decluttering, 360 panorama restyling, and video reels.
          </p>
          {profile && (
            <div className="mt-3 inline-block px-3 py-1 bg-slate-800/80 rounded-lg text-xs text-slate-300 font-semibold border border-slate-700">
              Current balance: <span className="text-cyan-400 font-bold">{profile.credits.toLocaleString()} credits</span>
            </div>
          )}
        </div>

        {successNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0 text-emerald-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
              <span>{successNotice}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all ${
                pack.popular
                  ? 'bg-gradient-to-b from-slate-850 to-slate-900 border-2 border-cyan-500 shadow-xl shadow-cyan-500/10'
                  : 'bg-slate-950/70 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-lg font-black text-white">{pack.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1 min-h-[32px]">{pack.description}</p>

                <div className="my-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{pack.price}</span>
                    <span className="text-xs text-slate-400 font-medium">CAD</span>
                  </div>
                  <div className="text-xs font-bold text-cyan-400 mt-1">
                    {pack.credits} Credits <span className="text-slate-500 font-normal">({pack.unitPrice})</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800/80 pt-4 mb-6">
                  <li className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                    <span>Virtual Staging & Style Swap (1-2 credits)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                    <span>Sunny Skies & Declutter (1 credit)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                    <span>360 Panoramic Virtual Staging (3 credits)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                    <span>AI Video Reels & Transformations</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSimulatePurchase(pack)}
                disabled={purchasing === pack.id}
                className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98] cursor-pointer ${
                  pack.popular
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-cyan-500/20'
                    : 'bg-slate-800 hover:bg-slate-750 text-white border border-slate-700'
                }`}
              >
                {purchasing === pack.id ? 'Processing...' : `Buy ${pack.credits} Credits`}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            <span>Secured Stripe-ready payment processing. Instant credit replenishment.</span>
          </div>
          <div className="text-slate-500">
            Need a custom volume or brokerage API plan? Contact support@pmddigitalmedia.com
          </div>
        </div>
      </div>
    </div>
  );
};
