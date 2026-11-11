import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Ticket, QrCode, User, Home, X } from 'lucide-react';

export const MobileAppFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobilePreview, setIsMobilePreview, currentView, setCurrentView } = useApp();

  if (!isMobilePreview) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-6">
      {/* Floating Exit Banner */}
      <div className="mb-4 flex items-center justify-between gap-4 w-full max-w-[420px] px-2 text-xs text-slate-400">
        <span className="font-semibold text-purple-400">EVENTPRO Mobile App Preview</span>
        <button
          onClick={() => setIsMobilePreview(false)}
          className="px-2.5 py-1 rounded bg-slate-800 text-white hover:bg-slate-700 transition-colors flex items-center gap-1"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Frame</span>
        </button>
      </div>

      {/* Phone Chassis */}
      <div className="w-full max-w-[410px] h-[860px] bg-[#0B0B12] rounded-[48px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative ring-1 ring-slate-700">
        {/* Dynamic Island / Speaker Notch */}
        <div className="h-9 w-full bg-[#0B0B12] flex items-center justify-between px-6 pt-1 select-none z-30 shrink-0">
          <span className="text-[11px] font-bold text-white font-mono">09:41</span>
          <div className="w-24 h-4 bg-black rounded-full border border-slate-800 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-white">
            <span>5G</span>
            <div className="w-4 h-2 rounded-sm border border-white flex items-center p-0.5">
              <div className="w-full h-full bg-white rounded-xs" />
            </div>
          </div>
        </div>

        {/* Scrollable App Viewport */}
        <div className="flex-1 overflow-y-auto pb-16">{children}</div>

        {/* Native Mobile Bottom Navigation Bar */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-[#0E0E18]/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-4 z-30 select-none">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center gap-0.5 ${
              currentView === 'home' ? 'text-purple-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => setCurrentView('discover')}
            className={`flex flex-col items-center gap-0.5 ${
              currentView === 'discover' ? 'text-purple-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-[10px]">Discover</span>
          </button>

          <button
            onClick={() => setCurrentView('scanner')}
            className="flex flex-col items-center gap-0.5 text-purple-400"
          >
            <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center -mt-5 shadow-lg shadow-purple-600/40">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-[10px]">Scan</span>
          </button>

          <button
            onClick={() => setCurrentView('my-tickets')}
            className={`flex flex-col items-center gap-0.5 ${
              currentView === 'my-tickets' ? 'text-purple-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span className="text-[10px]">Tickets</span>
          </button>

          <button
            onClick={() => setCurrentView('organizer')}
            className={`flex flex-col items-center gap-0.5 ${
              currentView === 'organizer' ? 'text-purple-400 font-bold' : 'text-slate-400'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[10px]">Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
};
