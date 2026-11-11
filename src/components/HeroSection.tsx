import React from 'react';
import { useApp } from '../context/AppContext';
import { EventCategory } from '../types';
import { Search, MapPin, Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  onExploreClick,
}) => {
  const { t } = useApp();

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Events' },
    { id: 'Concerts', label: 'Concerts & Live' },
    { id: 'Football', label: 'Football Matches' },
    { id: 'Basketball', label: 'Basketball Games' },
    { id: 'Festivals', label: 'Festivals & Culture' },
    { id: 'Boxing & Martial Arts', label: 'Combat Sports' },
    { id: 'Conferences', label: 'Conferences' },
    { id: 'Comedy', label: 'Comedy & Theater' },
  ];

  return (
    <div className="relative pt-6 pb-12 sm:pb-16 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-80 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Hero Split Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 tracking-wider uppercase">
            <span>Rwanda & East Africa Premier Ticketing</span>
            <span>·</span>
            <span>Digital QR Turnstiles</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.08] text-balance">
            Discover Events. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-300">
              Book Tickets.
            </span>{' '}
            Experience More.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            The modern booking gateway for concerts at BK Arena, premier football derbies at Amahoro Stadium, continental basketball championships, and cultural celebrations with instant Mobile Money & Card payment.
          </p>
        </div>

        {/* Search & Filter Command Strip */}
        <div className="mt-8 p-3 sm:p-4 bg-[#141424] border border-slate-800 rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concerts, teams (Rayon/APR), artists, venues..."
              className="w-full pl-10 pr-4 py-3 bg-[#0C0C16] border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Location Selector */}
          <div className="relative sm:w-56 flex items-center">
            <MapPin className="w-4 h-4 text-purple-400 absolute left-3.5 pointer-events-none" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-[#0C0C16] border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 appearance-none"
            >
              <option value="all">All Locations (Rwanda & Global)</option>
              <option value="BK Arena Kigali">BK Arena Kigali</option>
              <option value="Amahoro National Stadium">Amahoro Stadium</option>
              <option value="Kigali Convention Centre">Kigali Convention Centre</option>
              <option value="Kigali Cultural Village">Kigali Cultural Village</option>
            </select>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onExploreClick}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>Explore Events</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Category Segmented Buttons */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/20'
                    : 'bg-[#141424] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
