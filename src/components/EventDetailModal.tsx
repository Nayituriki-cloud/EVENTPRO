import React, { useState } from 'react';
import { EventItem, TicketTierType } from '../types';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/currency';
import { InteractiveSeatingMap } from './InteractiveSeatingMap';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Users,
  Share2,
  Sparkles,
  Armchair,
  Info,
} from 'lucide-react';

interface EventDetailModalProps {
  event: EventItem;
  onClose: () => void;
  onBook: (tierName: TicketTierType, quantity: number, selectedSeats?: string[]) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onBook,
}) => {
  const { activeCurrency, t } = useApp();
  const [selectedTier, setSelectedTier] = useState<TicketTierType>(
    event.tiers[0]?.name || 'Regular'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [showSeatingMap, setShowSeatingMap] = useState<boolean>(false);
  const [chosenSeats, setChosenSeats] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const activeTierObj = event.tiers.find((t) => t.name === selectedTier) || event.tiers[0];
  const unitPriceRwf = activeTierObj ? activeTierObj.priceRwf : 10000;
  const totalPriceRwf = unitPriceRwf * quantity;

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Check out ${event.title} at ${event.venue} on EVENTPRO! ${window.location.href}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmSeatsFromMap = (seats: any[], _total: number) => {
    setShowSeatingMap(false);
    const seatLabels = seats.map((s) => `Row ${s.row} - Seat ${s.number}`);
    setChosenSeats(seatLabels);
    setQuantity(seats.length);
    // Auto-select highest tier among chosen seats
    if (seats.some((s) => s.tier === 'VIP')) setSelectedTier('VIP');
    else if (seats.some((s) => s.tier === 'Premium')) setSelectedTier('Premium');
    else setSelectedTier('Regular');
  };

  const handleProceedToCheckout = () => {
    onBook(selectedTier, quantity, chosenSeats.length > 0 ? chosenSeats : undefined);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-[#12121E] border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 relative">
          {/* Header Bar */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 hover:bg-black/80 transition-colors"
              title="Share event"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content Scroll */}
          <div className="flex-1 overflow-y-auto">
            {/* Hero Image Showcase */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12121E] via-[#12121E]/50 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                {/* Quiet unboxed metadata */}
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1.5 uppercase tracking-wider">
                  <span>{event.category}</span>
                  <span>·</span>
                  <span>{event.city}, {event.country}</span>
                  <span>·</span>
                  <span>Verified Organizer</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display leading-tight text-balance">
                  {event.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  {event.subtitle}
                </p>
              </div>
            </div>

            {/* Quick Metadata Bar */}
            <div className="px-6 py-4 bg-[#161628] border-y border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <div className="text-slate-400">Date</div>
                  <div className="font-semibold text-white">{event.date}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <div className="text-slate-400">Show Time</div>
                  <div className="font-semibold text-white">{event.time} (Doors {event.doorsOpen})</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <div className="text-slate-400">Venue</div>
                  <div className="font-semibold text-white truncate">{event.venue}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-slate-400">Digital Entry</div>
                  <div className="font-semibold text-emerald-400">Instant QR Pass</div>
                </div>
              </div>
            </div>

            {/* 2-Column Split: Details & Purchase Module */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Details (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-2">About This Event</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Highlights */}
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">Event Highlights & Experience</h3>
                  <div className="space-y-2">
                    {event.highlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Organizer Card */}
                <div className="p-4 rounded-xl bg-[#161628] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={event.organizer.avatar}
                      alt={event.organizer.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-purple-500/30"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white">{event.organizer.name}</h4>
                        {event.organizer.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {event.organizer.eventsOrganized} events hosted · Verified Organizer
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Support Hotline</span>
                    <span className="text-xs font-mono text-purple-400 font-medium">
                      {event.organizer.phone}
                    </span>
                  </div>
                </div>

                {/* Policies & Restrictions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#151525] border border-slate-800/80 rounded-xl space-y-1">
                    <div className="font-semibold text-slate-200">Cancellation & Refund</div>
                    <div className="text-slate-400">{event.refundPolicy}</div>
                  </div>
                  <div className="p-3 bg-[#151525] border border-slate-800/80 rounded-xl space-y-1">
                    <div className="font-semibold text-slate-200">Age & Entry Policy</div>
                    <div className="text-slate-400">{event.ageRestriction}</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contiguous Purchase Module (5 cols) */}
              <div className="lg:col-span-5">
                <div className="bg-[#18182E] border border-purple-500/30 rounded-2xl p-5 space-y-5 shadow-xl sticky top-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-sm font-bold text-white">Select Ticket Category</span>
                    {event.hasSeatingMap && (
                      <button
                        onClick={() => setShowSeatingMap(true)}
                        className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Armchair className="w-3.5 h-3.5" />
                        <span>Interactive Map</span>
                      </button>
                    )}
                  </div>

                  {/* Tier Radio Options */}
                  <div className="space-y-2.5">
                    {event.tiers.map((tier) => {
                      const isSelected = selectedTier === tier.name;
                      const remaining = tier.totalQuantity - tier.soldQuantity;

                      return (
                        <div
                          key={tier.id}
                          onClick={() => {
                            setSelectedTier(tier.name);
                            setChosenSeats([]);
                          }}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-purple-950/30 border-purple-500 ring-1 ring-purple-500/50'
                              : 'bg-[#141424] border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-white">
                              {tier.name} Pass
                            </span>
                            <span className="font-bold text-purple-400 text-sm tabular-nums">
                              {formatPrice(tier.priceRwf, activeCurrency)}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                            {tier.description}
                          </p>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
                            <span>{remaining} seats left</span>
                            {isSelected && (
                              <span className="text-purple-400 font-semibold">Selected</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Seating Map Banner Callout */}
                  {event.hasSeatingMap && (
                    <div className="p-3 bg-purple-900/20 border border-purple-500/20 rounded-xl flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-purple-200">
                          {chosenSeats.length > 0
                            ? `Seats: ${chosenSeats.join(', ')}`
                            : 'Want specific arena seat numbers?'}
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Choose exact rows & numbers on the visual floor plan.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowSeatingMap(true)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs rounded-lg transition-colors whitespace-nowrap shrink-0"
                      >
                        {chosenSeats.length > 0 ? 'Edit Seats' : 'Pick Seats'}
                      </button>
                    </div>
                  )}

                  {/* Quantity Stepper (if not locked by chosenSeats) */}
                  {chosenSeats.length === 0 && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-300 font-medium">Quantity</span>
                      <div className="flex items-center gap-3 bg-[#121220] border border-slate-800 px-3 py-1 rounded-lg">
                        <button
                          disabled={quantity <= 1}
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="text-slate-400 hover:text-white disabled:opacity-30 text-base font-bold w-5"
                        >
                          -
                        </button>
                        <span className="font-mono text-sm font-bold text-white w-4 text-center">
                          {quantity}
                        </span>
                        <button
                          disabled={quantity >= 6}
                          onClick={() => setQuantity((q) => Math.min(6, q + 1))}
                          className="text-slate-400 hover:text-white disabled:opacity-30 text-base font-bold w-5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Price Baseline */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Total Price</span>
                      <div className="text-xl font-black text-white tabular-nums">
                        {formatPrice(totalPriceRwf, activeCurrency)}
                      </div>
                    </div>
                    <button
                      onClick={handleProceedToCheckout}
                      className="px-6 py-3 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
                    >
                      <span>Checkout Now</span>
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Seating Map Modal */}
      {showSeatingMap && (
        <InteractiveSeatingMap
          event={event}
          onClose={() => setShowSeatingMap(false)}
          onConfirmSeats={handleConfirmSeatsFromMap}
        />
      )}
    </>
  );
};
