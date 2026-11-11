import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/currency';
import { TicketBooking } from '../types';
import { TicketQrCode } from './TicketQrCode';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Download,
  AlertCircle,
  ExternalLink,
  Search,
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { bookings, activeCurrency, setViewTicketModal, setCurrentView, t } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'used' | 'refunded'>('all');
  const [search, setSearch] = useState('');

  const filtered = bookings.filter((b) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'active'
        ? b.status === 'active'
        : filter === 'used'
        ? b.status === 'used'
        : b.status === 'cancelled' || b.status === 'refund_requested' || b.status === 'refunded';

    const matchesSearch =
      b.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
      b.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.eventVenue.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Title & Filter strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <span>Customer Portal</span>
            <span>·</span>
            <span>Digital Wallet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            My Tickets & Booking History
          </h1>
        </div>

        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-[#141424] border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'active'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active ({bookings.filter((b) => b.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('used')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'used'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Attended ({bookings.filter((b) => b.status === 'used').length})
          </button>
          <button
            onClick={() => setFilter('refunded')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'refunded'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Refunds
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ticket by event name, venue or ticket ID..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#141424] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Bookings Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-[#141424] border border-slate-800 rounded-2xl p-8">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-white">No Tickets Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              You haven't booked any events in this category yet. Explore upcoming concerts, matches, and festivals!
            </p>
          </div>
          <button
            onClick={() => setCurrentView('discover')}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
          >
            Discover Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-[#141424] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="p-5 space-y-4">
                {/* Header status bar */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-purple-400">
                    {ticket.ticketNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      ticket.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : ticket.status === 'used'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Event summary split */}
                <div className="flex gap-4">
                  <img
                    src={ticket.eventImage}
                    alt={ticket.eventTitle}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="space-y-1 flex-1">
                    <h3 className="text-base font-bold text-white line-clamp-1">
                      {ticket.eventTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>{ticket.eventDate} · {ticket.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      <span className="truncate">{ticket.eventVenue}</span>
                    </div>
                  </div>
                </div>

                {/* Seat & Tier callout */}
                <div className="p-3 bg-[#18182E] rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Tier: </span>
                    <span className="font-bold text-white">{ticket.tierName} Access</span>
                    {ticket.seats && ticket.seats.length > 0 && (
                      <span className="block text-emerald-400 font-mono text-[11px] mt-0.5">
                        {ticket.seats.join(', ')}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">PAID</span>
                    <span className="font-mono font-bold text-white tabular-nums">
                      {formatPrice(ticket.amountPaid, activeCurrency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div className="px-5 py-3.5 bg-[#18182C] border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {ticket.status === 'active' ? 'Ready for Turnstile Gate' : 'Archived Pass'}
                </span>
                <button
                  onClick={() => setViewTicketModal(ticket)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-purple-600/20"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>View Pass & QR</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
