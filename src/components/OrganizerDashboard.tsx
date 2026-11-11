import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/currency';
import { EventItem, TicketTierType } from '../types';
import {
  Calendar,
  DollarSign,
  Ticket,
  Users,
  Plus,
  QrCode,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export const OrganizerDashboard: React.FC = () => {
  const {
    events,
    bookings,
    activeCurrency,
    createNewEvent,
    setCurrentView,
    updateEventStatus,
    t,
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');

  // Form State for Event Creation
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Concerts');
  const [newDate, setNewDate] = useState('2026-12-20');
  const [newTime, setNewTime] = useState('19:00');
  const [newVenue, setNewVenue] = useState('BK Arena Kigali');
  const [newCity, setNewCity] = useState('Kigali');
  const [newImageUrl, setNewImageUrl] = useState('/src/assets/images/concert_live_stage_1794372546511.jpg');
  const [newDescription, setNewDescription] = useState('');
  const [newVipPrice, setNewVipPrice] = useState(45000);
  const [newRegPrice, setNewRegPrice] = useState(10000);
  const [hasMap, setHasMap] = useState(true);

  // Computed Metrics
  const totalTicketsSold = bookings.filter((b) => b.status !== 'cancelled').length;
  const totalRevenueRwf = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.amountPaid, 0);

  // Filtered Attendees
  const filteredBookings = bookings.filter((b) => {
    const matchesEvent = selectedEventFilter === 'all' || b.eventId === selectedEventFilter;
    const matchesSearch =
      b.customerName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      b.ticketNumber.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(attendeeSearch.toLowerCase());
    return matchesEvent && matchesSearch;
  });

  const handleExportCsv = () => {
    const headers = ['Ticket Number', 'Event', 'Attendee Name', 'Email', 'Tier', 'Seats', 'Amount', 'Status'];
    const rows = filteredBookings.map((b) => [
      b.ticketNumber,
      `"${b.eventTitle}"`,
      `"${b.customerName}"`,
      b.customerEmail,
      b.tierName,
      `"${(b.seats || []).join(';')}"`,
      b.amountPaid,
      b.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EVENTPRO_Attendees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newVenue.trim()) {
      alert('Please fill in event title and venue.');
      return;
    }

    createNewEvent({
      title: newTitle,
      subtitle: newSubtitle || 'Live Entertainment Showcase',
      category: newCategory,
      date: newDate,
      time: newTime,
      venue: newVenue,
      city: newCity,
      country: 'Rwanda',
      image: newImageUrl,
      description: newDescription || 'Exclusive live event hosted on EVENTPRO.',
      hasSeatingMap: hasMap,
      tiers: [
        {
          id: `tr-vip-${Date.now()}`,
          name: 'VIP',
          priceRwf: Number(newVipPrice),
          description: 'Front stage VIP access with exclusive lounge & bar access',
          benefits: ['Priority VIP entry', 'Lounge access'],
          totalQuantity: 150,
          soldQuantity: 0,
        },
        {
          id: `tr-reg-${Date.now()}`,
          name: 'Regular',
          priceRwf: Number(newRegPrice),
          description: 'General admission standard seating',
          benefits: ['Numbered stadium seat'],
          totalQuantity: 1000,
          soldQuantity: 0,
        },
      ],
    });

    setShowCreateModal(false);
    alert('Event published successfully!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <span>Organizer Command Center</span>
            <span>·</span>
            <span>Kigali Arena Promotions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            Event Management & Real-Time Sales
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('scanner')}
            className="px-4 py-2.5 rounded-xl bg-[#1C1C32] hover:bg-[#252542] border border-slate-700 text-purple-300 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span>Gate Scanner</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (Single-Elevation, Tabular figures) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#141424] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Gross Sales Volume</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {formatPrice(totalRevenueRwf, activeCurrency)}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            +18.4% vs last period
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141424] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Tickets Sold</span>
            <Ticket className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {totalTicketsSold}
          </div>
          <div className="text-[11px] text-slate-400">
            Across {events.length} published events
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141424] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Gate Turnstile Check-ins</span>
            <QrCode className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {bookings.filter((b) => b.status === 'used').length}
          </div>
          <div className="text-[11px] text-emerald-400">
            Real-time digital QR admissions
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141424] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Events</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {events.filter((e) => e.status === 'published').length}
          </div>
          <div className="text-[11px] text-slate-400">
            Live in Rwanda & East Africa
          </div>
        </div>
      </div>

      {/* Events Roster */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-display">
            Your Active & Upcoming Events
          </h2>
          <span className="text-xs text-slate-400">{events.length} listings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev) => {
            const soldTotal = ev.tiers.reduce((s, t) => s + t.soldQuantity, 0);
            const capTotal = ev.tiers.reduce((s, t) => s + t.totalQuantity, 0);
            const pct = Math.round((soldTotal / Math.max(1, capTotal)) * 100);

            return (
              <div
                key={ev.id}
                className="bg-[#141424] border border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:border-slate-700 transition-colors"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141424] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                      {ev.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{ev.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>{ev.date}</span>
                      <span>·</span>
                      <span className="truncate">{ev.venue}</span>
                    </div>
                  </div>

                  {/* Quota Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Sales Quota</span>
                      <span className="font-mono font-medium text-white">
                        {soldTotal} / {capTotal} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-purple-400 font-semibold">
                      Status: {ev.status.toUpperCase()}
                    </span>
                    <button
                      onClick={() =>
                        updateEventStatus(
                          ev.id,
                          ev.status === 'published' ? 'cancelled' : 'published'
                        )
                      }
                      className="text-slate-400 hover:text-white underline transition-colors"
                    >
                      {ev.status === 'published' ? 'Pause / Cancel' : 'Republish'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendee Roster & Export */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              Attendee Roster & Ticket Verifications
            </h2>
            <p className="text-xs text-slate-400">
              Live customer records and turnstile admission status
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-[#1C1C32] hover:bg-[#252542] border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={attendeeSearch}
              onChange={(e) => setAttendeeSearch(e.target.value)}
              placeholder="Search by attendee name, email, or ticket ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#141424] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={selectedEventFilter}
            onChange={(e) => setSelectedEventFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#141424] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Events</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>

        {/* Attendees Table */}
        <div className="bg-[#141424] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#18182C] border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Ticket ID</th>
                  <th className="px-5 py-3.5">Attendee</th>
                  <th className="px-5 py-3.5">Event</th>
                  <th className="px-5 py-3.5">Tier & Seats</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Gateway</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                      No attendee bookings match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-purple-400 font-bold whitespace-nowrap">
                        {b.ticketNumber}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-white">{b.customerName}</div>
                        <div className="text-[11px] text-slate-400">{b.customerEmail}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 max-w-xs truncate">
                        {b.eventTitle}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-semibold text-white">{b.tierName}</span>
                        {b.seats && b.seats.length > 0 && (
                          <span className="block text-[11px] text-slate-400">
                            {b.seats.join(', ')}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-white tabular-nums whitespace-nowrap">
                        {formatPrice(b.amountPaid, activeCurrency)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 uppercase text-[11px]">
                        {b.paymentMethod}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : b.status === 'used'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Event Wizard Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12121E] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#161628]">
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  Publish New Event
                </h3>
                <p className="text-xs text-slate-400">
                  Configure event details, ticket tiers, and arena seating
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Kigali Symphony Live in Concert"
                  className="w-full px-3.5 py-2.5 bg-[#0F0F1B] border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0F0F1B] border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Concerts">Music Concerts</option>
                    <option value="Football">Football Match</option>
                    <option value="Basketball">Basketball Game</option>
                    <option value="Boxing & Martial Arts">Boxing & Martial Arts</option>
                    <option value="Festivals">Festivals & Culture</option>
                    <option value="Conferences">Conferences & Tech</option>
                    <option value="Comedy">Comedy Showcase</option>
                    <option value="Theater">Theater & Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    required
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    placeholder="e.g. BK Arena Kigali"
                    className="w-full px-3.5 py-2.5 bg-[#0F0F1B] border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0F0F1B] border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">Show Time</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0F0F1B] border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0F0F1B] border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">
                    VIP Ticket Price (RWF)
                  </label>
                  <input
                    type="number"
                    value={newVipPrice}
                    onChange={(e) => setNewVipPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#0F0F1B] border border-slate-700 rounded-lg text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">
                    Regular Ticket Price (RWF)
                  </label>
                  <input
                    type="number"
                    value={newRegPrice}
                    onChange={(e) => setNewRegPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#0F0F1B] border border-slate-700 rounded-lg text-sm text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  Event Poster Asset
                </label>
                <select
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0F0F1B] border border-slate-700 rounded-lg text-xs text-white"
                >
                  <option value="/src/assets/images/concert_live_stage_1794372546511.jpg">
                    Concert Live Stage (Cinematic lasers)
                  </option>
                  <option value="/src/assets/images/football_stadium_match_1794372546830.jpg">
                    Football Stadium Match (Amahoro stadium)
                  </option>
                  <option value="/src/assets/images/basketball_arena_game_1794372548018.jpg">
                    Basketball Arena Game (BK Arena)
                  </option>
                  <option value="/src/assets/images/festival_cultural_crowd_1794372547739.jpg">
                    Cultural Arts Festival (Celebration)
                  </option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="mapCheck"
                  checked={hasMap}
                  onChange={(e) => setHasMap(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded bg-[#0F0F1B] border-slate-700"
                />
                <label htmlFor="mapCheck" className="text-xs text-slate-300">
                  Enable Interactive Arena/Stadium Seating Map for seat selection
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md"
                >
                  Publish Event Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
