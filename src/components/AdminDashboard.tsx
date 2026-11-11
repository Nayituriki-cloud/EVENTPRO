import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/currency';
import { PromoCode } from '../types';
import {
  ShieldAlert,
  Percent,
  CheckCircle2,
  XCircle,
  Tag,
  Plus,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  FileText,
  Sliders,
  Check,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    events,
    bookings,
    activeCurrency,
    disputes,
    resolveDispute,
    promos,
    addPromoCode,
    updateEventStatus,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'disputes' | 'promos' | 'approvals'>('overview');

  // Promo code form
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(10);
  const [newPromoDesc, setNewPromoDesc] = useState('');

  // Platform Commission Settings
  const [commissionRate, setCommissionRate] = useState(5);
  const [commissionSaved, setCommissionSaved] = useState(false);

  // Financial calculations
  const totalGmvRwf = bookings
    .filter((b) => b.status !== 'cancelled' && b.status !== 'refunded')
    .reduce((sum, b) => sum + b.amountPaid, 0);

  const platformEarningsRwf = Math.round((totalGmvRwf * commissionRate) / 100);

  const duplicateAttemptsCount = 2; // simulated security scans blocked

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;

    addPromoCode({
      code: newPromoCode.trim().toUpperCase(),
      discountPercentage: Number(newPromoDiscount),
      description: newPromoDesc || `${newPromoDiscount}% Platform Discount`,
      minAmountRwf: 5000,
      active: true,
    });

    setNewPromoCode('');
    setNewPromoDesc('');
    alert(`Promo code ${newPromoCode.toUpperCase()} activated successfully!`);
  };

  const handleSaveCommission = () => {
    setCommissionSaved(true);
    setTimeout(() => setCommissionSaved(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <span>Platform Governance</span>
            <span>·</span>
            <span>EVENTPRO Global Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            System Administration & Revenue Analytics
          </h1>
        </div>

        {/* Segmented Control Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#141424] border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview & Revenue
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'disputes'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Disputes & Refunds</span>
            {disputes.filter((d) => d.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('promos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'promos'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Campaigns & Promos
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#141424] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Gross Merchandise Value (GMV)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {formatPrice(totalGmvRwf, activeCurrency)}
          </div>
          <div className="text-[11px] text-slate-400">
            Total verified ticket transactions
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141424] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Platform Commission ({commissionRate}%)</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono tabular-nums">
            {formatPrice(platformEarningsRwf, activeCurrency)}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            Net EVENTPRO Revenue
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141424] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Refund / Dispute Claims</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {disputes.length}
          </div>
          <div className="text-[11px] text-amber-400">
            {disputes.filter((d) => d.status === 'pending').length} pending review
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141424] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Fraud & Duplicate Scans Blocked</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {duplicateAttemptsCount}
          </div>
          <div className="text-[11px] text-emerald-400">
            100% security gate integrity
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Breakdown & Platform Settings */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#141424] border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-display">
                  Platform Commission & Monetization Engine
                </h3>
                <span className="text-xs text-purple-400 font-mono">Real-time Settlement</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                EVENTPRO charges an automated fee on every ticket sold by registered organizers across Rwanda and international territories. All earnings are reconciled instantly via MTN MoMo, Airtel Money, and Visa acquiring banks.
              </p>

              <div className="p-4 bg-[#18182E] border border-slate-800 rounded-xl space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Global Commission Rate (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="0.5"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="flex-1 accent-purple-600"
                  />
                  <span className="font-mono font-bold text-lg text-white w-14 text-right">
                    {commissionRate}%
                  </span>
                  <button
                    onClick={handleSaveCommission}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    {commissionSaved ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{commissionSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Organizer Breakdown */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Top Performing Organizers
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-[#161628] rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Kigali Arena Entertainment Ltd</div>
                      <div className="text-[11px] text-slate-400">Afrobeat Live & BAL Finals</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-white">
                        {formatPrice(7500000, activeCurrency)}
                      </div>
                      <div className="text-[10px] text-emerald-400">Paid out via MTN MoMo</div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#161628] rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Rwanda Football Federation (FERWAFA)</div>
                      <div className="text-[11px] text-slate-400">Kigali Derby at Amahoro</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-white">
                        {formatPrice(4800000, activeCurrency)}
                      </div>
                      <div className="text-[10px] text-emerald-400">Direct Bank of Kigali Wire</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Audit Monitor */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#141424] border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white font-display">
                  Security & Anti-Fraud Logs
                </h3>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-[#18182E] border border-red-500/30 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-red-400">Duplicate QR Entry Intercepted</span>
                    <span className="text-[10px] text-slate-400">Today 18:42</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Ticket #EP-2026-KGL-84920 was scanned at Turnstile Gate B. Already admitted at Gate A at 18:31. Entry rejected immediately.
                  </p>
                </div>

                <div className="p-3 bg-[#18182E] border border-slate-800 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-400">Turnstile Handshake Verified</span>
                    <span className="text-[10px] text-slate-400">Today 17:15</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Amahoro Stadium electronic gate scanners connected with cryptographic key rotation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disputes & Customer Refunds Tab */}
      {activeTab === 'disputes' && (
        <div className="bg-[#141424] border border-slate-800 rounded-2xl overflow-hidden p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Customer Complaint & Refund Claims Management
            </h3>
            <p className="text-xs text-slate-400">
              Review event cancellation requests, reschedule claims, and process instant refunds
            </p>
          </div>

          <div className="divide-y divide-slate-800/80">
            {disputes.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-500">
                No active refund requests in queue.
              </p>
            ) : (
              disputes.map((disp) => (
                <div key={disp.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-purple-400 text-xs">
                        {disp.ticketNumber}
                      </span>
                      <span>·</span>
                      <span className="text-white font-semibold text-xs">{disp.eventTitle}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          disp.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400'
                            : disp.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {disp.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{disp.reason}</p>
                    <div className="text-[11px] text-slate-500">
                      Filed by {disp.customerName} on {disp.date} · Refund amount:{' '}
                      <strong className="text-white font-mono">
                        {formatPrice(disp.amountRwf, activeCurrency)}
                      </strong>
                    </div>
                  </div>

                  {disp.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => resolveDispute(disp.id, 'rejected')}
                        className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => resolveDispute(disp.id, 'approved')}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
                      >
                        Approve & Refund
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Campaigns & Promos Tab */}
      {activeTab === 'promos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Create Promo Code */}
          <div className="lg:col-span-5 bg-[#141424] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white font-display">
                Create Promotional Voucher
              </h3>
            </div>

            <form onSubmit={handleAddPromo} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  Promo Voucher Code
                </label>
                <input
                  type="text"
                  required
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                  placeholder="e.g. KIGALI2026"
                  className="w-full px-3.5 py-2.5 bg-[#0F0F1B] border border-slate-700 rounded-lg text-sm font-mono text-white uppercase focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  Discount Percentage (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={newPromoDiscount}
                  onChange={(e) => setNewPromoDiscount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#0F0F1B] border border-slate-700 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  Voucher Campaign Description
                </label>
                <input
                  type="text"
                  value={newPromoDesc}
                  onChange={(e) => setNewPromoDesc(e.target.value)}
                  placeholder="e.g. 15% discount for early bird ticket buyers"
                  className="w-full px-3.5 py-2.5 bg-[#0F0F1B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Launch Voucher Code</span>
              </button>
            </form>
          </div>

          {/* Active Promo Codes List */}
          <div className="lg:col-span-7 bg-[#141424] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display">
              Active Platform Discount Codes
            </h3>

            <div className="space-y-3">
              {promos.map((p) => (
                <div
                  key={p.code}
                  className="p-4 bg-[#18182E] border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-purple-400 text-sm">
                        {p.code}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        {p.discountPercentage}% OFF
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono">
                    Min order: {formatPrice(p.minAmountRwf, activeCurrency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
