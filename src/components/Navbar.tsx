import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, CurrencyCode, LanguageCode, AppTheme } from '../types';
import {
  Ticket,
  QrCode,
  Globe,
  Coins,
  Palette,
  Smartphone,
  User,
  ChevronDown,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    activeRole,
    setActiveRole,
    activeCurrency,
    setActiveCurrency,
    activeLanguage,
    setActiveLanguage,
    activeTheme,
    setActiveTheme,
    isDarkMode,
    toggleDarkMode,
    isMobilePreview,
    setIsMobilePreview,
    bookings,
    t,
  } = useApp();

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const activeTicketsCount = bookings.filter((b) => b.status === 'active').length;

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B12]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setCurrentView('home')}
          className="text-xl font-extrabold tracking-tight text-white font-display whitespace-nowrap shrink-0 flex items-center gap-2 group text-left"
        >
          <span className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform">
            EP
          </span>
          <span className="text-white group-hover:text-purple-300 transition-colors">
            EVENTPRO
          </span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wide uppercase">
          <button
            onClick={() => setCurrentView('discover')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentView === 'discover' ? 'text-purple-400' : 'text-slate-400'
            }`}
          >
            {t('discover')}
          </button>
          <button
            onClick={() => setCurrentView('discover')}
            className="text-slate-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {t('concerts')}
          </button>
          <button
            onClick={() => setCurrentView('discover')}
            className="text-slate-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {t('sports')}
          </button>
          <button
            onClick={() => setCurrentView('discover')}
            className="text-slate-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {t('festivals')}
          </button>
          <button
            onClick={() => setCurrentView('my-tickets')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 hover:text-white ${
              currentView === 'my-tickets' ? 'text-purple-400' : 'text-slate-400'
            }`}
          >
            <span>{t('myTickets')}</span>
            {activeTicketsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-purple-600 text-white rounded-full text-[10px] font-mono">
                {activeTicketsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area & Quick Settings Dropdown */}
        <div className="flex items-center gap-3 shrink-0 relative">
          {/* Quick Role & Preferences Popover Button */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsMenu((prev) => !prev)}
              className="px-3 py-1.5 rounded-lg bg-[#141424] hover:bg-[#1A1A2E] border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="capitalize">{activeRole}</span>
              <span className="text-slate-500">·</span>
              <span className="font-mono text-purple-400">{activeCurrency}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showSettingsMenu && (
              <div
                className="absolute right-0 mt-2 w-72 bg-[#121220] border border-slate-800 rounded-2xl shadow-2xl p-4 space-y-4 z-50 text-xs text-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Role Switcher */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase">
                    <span>Active Platform Role</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-[#0A0A12] rounded-lg">
                    {(['customer', 'organizer', 'admin'] as UserRole[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setActiveRole(role);
                          if (role === 'organizer') setCurrentView('organizer');
                          else if (role === 'admin') setCurrentView('admin');
                          else setCurrentView('home');
                        }}
                        className={`py-1.5 rounded-md text-[11px] font-semibold capitalize transition-all ${
                          activeRole === role
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency & Language */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Currency</label>
                    <select
                      value={activeCurrency}
                      onChange={(e) => setActiveCurrency(e.target.value as CurrencyCode)}
                      className="w-full bg-[#0A0A12] border border-slate-800 rounded-lg py-1.5 px-2 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="RWF">RWF (Rwanda)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Language</label>
                    <select
                      value={activeLanguage}
                      onChange={(e) => setActiveLanguage(e.target.value as LanguageCode)}
                      className="w-full bg-[#0A0A12] border border-slate-800 rounded-lg py-1.5 px-2 text-white text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="rw">Kinyarwanda</option>
                    </select>
                  </div>
                </div>

                {/* Theme Switcher (as specified in Section 15 of user prompt) */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block font-semibold uppercase">
                    Theme Scheme (Prompt #15)
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => setActiveTheme('purple')}
                      className={`p-1.5 rounded-lg border text-center transition-all ${
                        activeTheme === 'purple'
                          ? 'border-purple-500 bg-purple-950/40 text-purple-200'
                          : 'border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block text-[10px] font-bold">Purple</span>
                    </button>
                    <button
                      onClick={() => setActiveTheme('gold')}
                      className={`p-1.5 rounded-lg border text-center transition-all ${
                        activeTheme === 'gold'
                          ? 'border-amber-500 bg-amber-950/40 text-amber-200'
                          : 'border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block text-[10px] font-bold">Gold</span>
                    </button>
                    <button
                      onClick={() => setActiveTheme('blue')}
                      className={`p-1.5 rounded-lg border text-center transition-all ${
                        activeTheme === 'blue'
                          ? 'border-blue-500 bg-blue-950/40 text-blue-200'
                          : 'border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block text-[10px] font-bold">Blue</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Preview Frame Toggle */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-300 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                    <span>Mobile App View</span>
                  </span>
                  <button
                    onClick={() => setIsMobilePreview(!isMobilePreview)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      isMobilePreview
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isMobilePreview ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => setCurrentView('scanner')}
            className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-md shadow-purple-600/30 whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gate Scanner</span>
            <span className="sm:hidden">Scan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
