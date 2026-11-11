import React, { useState, useMemo } from 'react';
import { EventItem, SeatItem } from '../types';
import { generateSeatingLayout } from '../data/seatingData';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/currency';
import { X, Check } from 'lucide-react';

interface InteractiveSeatingMapProps {
  event: EventItem;
  onClose: () => void;
  onConfirmSeats: (seats: SeatItem[], totalRwf: number) => void;
}

export const InteractiveSeatingMap: React.FC<InteractiveSeatingMapProps> = ({
  event,
  onClose,
  onConfirmSeats,
}) => {
  const { activeCurrency, t } = useApp();
  const rawSeats = useMemo(() => generateSeatingLayout(event.id), [event.id]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);

  const handleSeatClick = (seat: SeatItem) => {
    if (seat.status === 'taken' || seat.status === 'reserved') return;

    setSelectedSeatIds((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((id) => id !== seat.id);
      } else {
        if (prev.length >= 6) {
          alert('Maximum 6 seats per transaction.');
          return prev;
        }
        return [...prev, seat.id];
      }
    });
  };

  const selectedSeats = useMemo(() => {
    return rawSeats.filter((s) => selectedSeatIds.includes(s.id));
  }, [rawSeats, selectedSeatIds]);

  const totalAmountRwf = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + s.priceRwf, 0);
  }, [selectedSeats]);

  // Group by rows
  const rowsMap = useMemo(() => {
    const map: Record<string, SeatItem[]> = {};
    rawSeats.forEach((seat) => {
      if (!map[seat.row]) map[seat.row] = [];
      map[seat.row].push(seat);
    });
    return map;
  }, [rawSeats]);

  const rowsKeys = Object.keys(rowsMap);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12121E] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
              <span>{event.venue}</span>
              <span>·</span>
              <span>Interactive Stadium & Arena Map</span>
            </div>
            <h2 className="text-xl font-bold text-white font-display mt-0.5">
              Select Your Reserved Seats
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Seating Legend */}
        <div className="px-6 py-3 bg-[#181828] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-purple-600 inline-block border border-purple-400" />
              <span>VIP ({formatPrice(50000, activeCurrency)})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-blue-600 inline-block border border-blue-400" />
              <span>Premium ({formatPrice(25000, activeCurrency)})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-indigo-600 inline-block border border-indigo-400" />
              <span>Regular ({formatPrice(10000, activeCurrency)})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500 inline-block ring-2 ring-emerald-300" />
              <span className="text-emerald-400 font-medium">Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-800 inline-block border border-slate-700 opacity-60" />
              <span className="text-slate-500">Occupied</span>
            </div>
          </div>
          <span className="text-slate-400">Click seats to add/remove (Max 6)</span>
        </div>

        {/* Interactive Map Visual */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          {/* Stage / Pitch Header */}
          <div className="w-full max-w-lg mb-8">
            <div className="h-10 bg-gradient-to-r from-purple-900/60 via-purple-600/40 to-purple-900/60 border border-purple-500/30 rounded-lg flex items-center justify-center text-xs font-bold tracking-widest text-purple-200 uppercase shadow-inner">
              {event.category === 'Football'
                ? '⚽ Central Pitch & Player Benches'
                : event.category === 'Basketball'
                ? '🏀 Hardwood Court & Hoop A'
                : '🎤 Main Stage & Acoustical Center'}
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-40 mt-1" />
          </div>

          {/* Seat Grid */}
          <div className="space-y-3 w-full max-w-xl">
            {rowsKeys.map((row) => {
              const seats = rowsMap[row];
              return (
                <div key={row} className="flex items-center justify-center gap-2 sm:gap-3">
                  <span className="w-6 text-center text-xs font-bold text-slate-400 font-mono">
                    {row}
                  </span>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {seats.slice(0, 6).map((seat) => {
                      const isSelected = selectedSeatIds.includes(seat.id);
                      const isTaken = seat.status === 'taken';

                      let colorClass = 'bg-slate-700 hover:bg-slate-600 text-white';
                      if (seat.tier === 'VIP') colorClass = 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/40';
                      else if (seat.tier === 'Premium') colorClass = 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/40';
                      else if (seat.tier === 'Regular') colorClass = 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/40';

                      if (isSelected) {
                        colorClass = 'bg-emerald-500 text-white ring-2 ring-emerald-300 font-bold scale-110';
                      } else if (isTaken) {
                        colorClass = 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50';
                      }

                      return (
                        <button
                          key={seat.id}
                          disabled={isTaken}
                          onClick={() => handleSeatClick(seat)}
                          title={`${seat.tier} - Row ${seat.row}, Seat ${seat.number} (${formatPrice(seat.priceRwf, activeCurrency)})`}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md text-[10px] font-mono font-medium transition-all flex items-center justify-center ${colorClass}`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : seat.number}
                        </button>
                      );
                    })}
                  </div>

                  {/* Aisle Divider */}
                  <div className="w-4 h-6 flex items-center justify-center">
                    <span className="w-0.5 h-full bg-slate-800" />
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {seats.slice(6).map((seat) => {
                      const isSelected = selectedSeatIds.includes(seat.id);
                      const isTaken = seat.status === 'taken';

                      let colorClass = 'bg-slate-700 hover:bg-slate-600 text-white';
                      if (seat.tier === 'VIP') colorClass = 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/40';
                      else if (seat.tier === 'Premium') colorClass = 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/40';
                      else if (seat.tier === 'Regular') colorClass = 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/40';

                      if (isSelected) {
                        colorClass = 'bg-emerald-500 text-white ring-2 ring-emerald-300 font-bold scale-110';
                      } else if (isTaken) {
                        colorClass = 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50';
                      }

                      return (
                        <button
                          key={seat.id}
                          disabled={isTaken}
                          onClick={() => handleSeatClick(seat)}
                          title={`${seat.tier} - Row ${seat.row}, Seat ${seat.number} (${formatPrice(seat.priceRwf, activeCurrency)})`}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md text-[10px] font-mono font-medium transition-all flex items-center justify-center ${colorClass}`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : seat.number}
                        </button>
                      );
                    })}
                  </div>

                  <span className="w-6 text-center text-xs font-bold text-slate-400 font-mono">
                    {row}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            Outer Grandstand Concourse · Gate 2 & Gate 4
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#161626] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs text-slate-400">
              {selectedSeats.length === 0 ? (
                <span>No seats selected yet</span>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-white">
                    {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}:
                  </span>
                  {selectedSeats.map((s) => (
                    <span
                      key={s.id}
                      className="inline-block bg-purple-900/40 text-purple-200 border border-purple-500/30 px-2 py-0.5 rounded text-xs font-mono"
                    >
                      {s.row}{s.number} ({s.tier})
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-lg font-bold text-white tabular-nums mt-0.5">
              {formatPrice(totalAmountRwf, activeCurrency)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              disabled={selectedSeats.length === 0}
              onClick={() => onConfirmSeats(selectedSeats, totalAmountRwf)}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-600/30 whitespace-nowrap"
            >
              Confirm & Book ({selectedSeats.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
