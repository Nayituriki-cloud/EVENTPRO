import React from 'react';
import { EventItem } from '../types';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/currency';
import { Calendar, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const { activeCurrency } = useApp();

  const lowestPrice = Math.min(...event.tiers.map((t) => t.priceRwf));
  const totalRemaining = event.tiers.reduce(
    (acc, t) => acc + (t.totalQuantity - t.soldQuantity),
    0
  );

  return (
    <div
      onClick={() => onSelect(event)}
      className="group bg-[#141424] border border-slate-800 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-950/20 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Visual Showcase (65-75% visual weight) */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
          <img
            src={event.image}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141424] via-transparent to-transparent opacity-90" />

          {/* Quiet Category Overlay */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-bold text-white uppercase tracking-wider">
              {event.category}
            </span>
          </div>

          {event.hasSeatingMap && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-0.5 rounded-md bg-purple-900/80 backdrop-blur-md text-[10px] font-semibold text-purple-200 border border-purple-500/30">
                Seating Map
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          {/* Unboxed Metadata with · separator */}
          <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium">
            <span>{event.city}</span>
            <span aria-hidden="true">·</span>
            <span>{event.venue}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">{event.date}</span>
          </div>

          <h3 className="text-base font-bold text-white font-display line-clamp-1 group-hover:text-purple-300 transition-colors">
            {event.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {event.subtitle}
          </p>
        </div>
      </div>

      {/* Card Footer: Price Baseline & Action */}
      <div className="px-5 py-4 bg-[#161628]/60 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
            Starting from
          </span>
          <span className="text-sm font-extrabold text-white font-mono tabular-nums">
            {formatPrice(lowestPrice, activeCurrency)}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(event);
          }}
          className="px-3.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all group-hover:bg-purple-600 group-hover:text-white"
        >
          <span>Book Tickets</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
