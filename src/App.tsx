import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EventCard } from './components/EventCard';
import { EventDetailModal } from './components/EventDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { TicketViewModal } from './components/TicketViewModal';
import { GateScannerModal } from './components/GateScannerModal';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { MyBookingsPage } from './components/MyBookingsPage';
import { Footer } from './components/Footer';
import { MobileAppFrame } from './components/MobileAppFrame';
import { EventItem, TicketTierType } from './types';
import {
  Sparkles,
  Flame,
  Calendar,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Zap,
} from 'lucide-react';

function MainAppContent() {
  const {
    events,
    currentView,
    setCurrentView,
    selectedEvent,
    setSelectedEvent,
    viewTicketModal,
    setViewTicketModal,
    checkoutPayload,
    setCheckoutPayload,
    activeRole,
    t,
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Must be published
      if (ev.status !== 'published') return false;

      const matchesSearch =
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' || ev.category === selectedCategory;

      const matchesLoc =
        selectedLocation === 'all' ||
        ev.venue.toLowerCase().includes(selectedLocation.toLowerCase());

      return matchesSearch && matchesCat && matchesLoc;
    });
  }, [events, searchQuery, selectedCategory, selectedLocation]);

  const featuredEvents = useMemo(() => {
    return events.filter((e) => e.featured && e.status === 'published');
  }, [events]);

  const handleOpenEvent = (event: EventItem) => {
    setSelectedEvent(event);
  };

  const handleStartBooking = (
    tierName: TicketTierType,
    quantity: number,
    selectedSeats?: string[]
  ) => {
    if (!selectedEvent) return;
    const tier = selectedEvent.tiers.find((t) => t.name === tierName) || selectedEvent.tiers[0];
    const unitPrice = tier ? tier.priceRwf : 10000;

    setCheckoutPayload({
      event: selectedEvent,
      tierName,
      unitPriceRwf: unitPrice,
      quantity,
      selectedSeats,
    });
    setSelectedEvent(null);
  };

  const handleCheckoutSuccess = (ticket: any) => {
    setViewTicketModal(ticket);
  };

  return (
    <MobileAppFrame>
      <div className="min-h-screen flex flex-col bg-[#0B0B12] text-slate-100">
        <Navbar />

        <main className="flex-1">
          {/* VIEW: HOME */}
          {currentView === 'home' && (
            <div className="space-y-12 sm:space-y-16">
              <HeroSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                onExploreClick={() => {
                  const el = document.getElementById('events-anchor');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* Featured Premier Showcase Section */}
              {featuredEvents.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                        <Flame className="w-3.5 h-3.5 text-purple-400" />
                        <span>High-Demand Showcases</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white font-display mt-0.5">
                        Premier Arena & Stadium Events
                      </h2>
                    </div>

                    <button
                      onClick={() => setCurrentView('discover')}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 3-Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredEvents.slice(0, 3).map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onSelect={handleOpenEvent}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Full Discovery Anchor */}
              <section id="events-anchor" className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                      Explore All Upcoming Events
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Showing {filteredEvents.length} events matching your selections
                    </p>
                  </div>

                  {(selectedCategory !== 'all' ||
                    selectedLocation !== 'all' ||
                    searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedLocation('all');
                        setSearchQuery('');
                      }}
                      className="text-xs text-purple-400 hover:text-white underline self-start sm:self-auto"
                    >
                      Reset all filters
                    </button>
                  )}
                </div>

                {filteredEvents.length === 0 ? (
                  <div className="py-16 text-center space-y-3 bg-[#141424] border border-slate-800 rounded-2xl p-8">
                    <p className="text-sm font-semibold text-white">
                      No events found matching your search.
                    </p>
                    <p className="text-xs text-slate-400">
                      Try searching for "BK Arena", "Derby", "Afrobeat", or "Rayon".
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedLocation('all');
                        setSearchQuery('');
                      }}
                      className="mt-2 px-4 py-2 bg-purple-600 rounded-lg text-xs font-semibold text-white"
                    >
                      Show All Events
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onSelect={handleOpenEvent}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Trust & Guarantee Banner */}
              <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
                <div className="bg-[#141426] border border-slate-800 rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">100% Guaranteed Authentic Tickets</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Direct integration with Rwandan sporting federations, artists, and venues ensures zero fake passes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Instant Turnstile QR Codes</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        No paper tickets needed. Walk straight through turnstiles using your smartphone QR code or PDF pass.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Mobile Money & Card Checkout</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        One-click payment via MTN MoMo, Airtel Money, Visa, and Mastercard with instant booking confirmation.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* VIEW: DISCOVER */}
          {currentView === 'discover' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  <span>Explore Catalog</span>
                  <span>·</span>
                  <span>All Categories</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
                  Discover Events & Live Entertainment
                </h1>
              </div>

              {/* Filter controls */}
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by event name, artist, club, or venue..."
                  className="flex-1 px-4 py-2.5 bg-[#141424] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2.5 bg-[#141424] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Concerts">Music Concerts</option>
                  <option value="Football">Football Matches</option>
                  <option value="Basketball">Basketball Games</option>
                  <option value="Boxing & Martial Arts">Boxing & Martial Arts</option>
                  <option value="Festivals">Festivals & Culture</option>
                  <option value="Conferences">Conferences & Tech</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Theater">Theater</option>
                </select>

                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-2.5 bg-[#141424] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Venues</option>
                  <option value="BK Arena Kigali">BK Arena Kigali</option>
                  <option value="Amahoro National Stadium">Amahoro Stadium</option>
                  <option value="Kigali Convention Centre">Kigali Convention Centre</option>
                  <option value="Kigali Cultural Village">Kigali Cultural Village</option>
                  <option value="Intare Conference Arena">Intare Arena</option>
                </select>
              </div>

              {/* Event grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onSelect={handleOpenEvent}
                  />
                ))}
              </div>
            </div>
          )}

          {/* VIEW: MY TICKETS */}
          {currentView === 'my-tickets' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
              <MyBookingsPage />
            </div>
          )}

          {/* VIEW: ORGANIZER HUB */}
          {currentView === 'organizer' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
              <OrganizerDashboard />
            </div>
          )}

          {/* VIEW: ADMIN PANEL */}
          {currentView === 'admin' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
              <AdminDashboard />
            </div>
          )}

          {/* VIEW: GATE SCANNER STANDALONE */}
          {currentView === 'scanner' && (
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
              <GateScannerModal onClose={() => setCurrentView('home')} />
            </div>
          )}
        </main>

        <Footer />

        {/* Global Modals */}
        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onBook={handleStartBooking}
          />
        )}

        {checkoutPayload && (
          <CheckoutModal
            onClose={() => setCheckoutPayload(null)}
            onSuccess={handleCheckoutSuccess}
          />
        )}

        {viewTicketModal && (
          <TicketViewModal
            ticket={viewTicketModal}
            onClose={() => setViewTicketModal(null)}
          />
        )}
      </div>
    </MobileAppFrame>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
