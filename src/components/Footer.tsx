import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Smartphone, CreditCard, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, activeCurrency, setActiveCurrency, t } = useApp();

  return (
    <footer className="mt-20 border-t border-slate-800 bg-[#0B0B14] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white font-black text-xs">
                EP
              </span>
              <span className="text-lg font-bold text-white font-display">EVENTPRO</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              East Africa's premier digital ticketing and turnstile verification platform. Connecting music fans, sports clubs, artists, and live event enthusiasts.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>Kigali, Rwanda</span>
              <span>·</span>
              <span>Global Operations</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              Event Categories
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('discover')}
                  className="hover:text-white transition-colors"
                >
                  Concerts & Live Performances
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('discover')}
                  className="hover:text-white transition-colors"
                >
                  Rwanda Premier League Football
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('discover')}
                  className="hover:text-white transition-colors"
                >
                  Basketball Africa League (BAL)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('discover')}
                  className="hover:text-white transition-colors"
                >
                  Cultural & Arts Festivals
                </button>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              Platform & Tools
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('my-tickets')}
                  className="hover:text-white transition-colors"
                >
                  My Digital Tickets & Passes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('organizer')}
                  className="hover:text-white transition-colors"
                >
                  Event Organizer Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('scanner')}
                  className="hover:text-white transition-colors"
                >
                  Gate Entry QR Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="hover:text-white transition-colors"
                >
                  Administration & Revenue Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Secure Gateways */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              Supported Payment Gateways
            </h4>
            <p className="text-slate-400 text-xs">
              Instant mobile payment integration with MTN MoMo, Airtel Money, Visa, Mastercard, and Bank Wire.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] text-slate-300">
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">MTN MoMo</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">Airtel Money</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">Visa / Mastercard</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">Bank of Kigali</span>
            </div>
          </div>
        </div>

        {/* Bottom Baseline */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} EVENTPRO Ticketing Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>support@eventpro.rw</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
