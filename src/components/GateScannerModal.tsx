import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  History,
  ScanLine,
  UserCheck,
} from 'lucide-react';

export const GateScannerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { validateTicketByCode, bookings } = useApp();
  const [inputCode, setInputCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    status: 'valid' | 'already_used' | 'invalid';
    message: string;
    ticket?: any;
    timestamp?: string;
  } | null>(null);

  const [scanLogs, setScanLogs] = useState<
    Array<{
      code: string;
      status: 'valid' | 'already_used' | 'invalid';
      message: string;
      time: string;
    }>
  >([]);

  const handleValidate = (codeToTest?: string) => {
    const target = codeToTest || inputCode;
    if (!target.trim()) return;

    const result = validateTicketByCode(target);
    const now = new Date().toLocaleTimeString();

    setScanResult({
      ...result,
      timestamp: now,
    });

    setScanLogs((prev) => [
      {
        code: target,
        status: result.status,
        message: result.message,
        time: now,
      },
      ...prev.slice(0, 9),
    ]);

    if (!codeToTest) {
      setInputCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12121E] border border-slate-800 rounded-3xl w-full max-w-xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#161628]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ScanLine className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Gate Entry Scanner & QR Validator
              </h2>
              <p className="text-xs text-slate-400">
                Turnstile validation engine preventing duplicate ticket admissions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Virtual Camera Viewfinder & Laser Simulation */}
          <div className="relative w-full h-48 rounded-2xl bg-[#090912] border-2 border-dashed border-purple-500/40 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-purple-500/5" />
            {/* Animated Laser beam */}
            <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse shadow-[0_0_12px_#ef4444]" />

            <QrCode className="w-16 h-16 text-purple-500/40 mb-2" />
            <div className="text-xs font-mono text-purple-300">
              OPTICAL QR SCANNER ACTIVE
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Position attendee QR code within the viewfinder frame
            </div>
          </div>

          {/* Manual Input & Fast Test Tokens */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Scan or Enter Ticket ID / QR Payload
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
                placeholder="e.g. EP-2026-KGL-84920"
                className="flex-1 px-4 py-2.5 bg-[#0F0F1B] border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-purple-500 uppercase"
              />
              <button
                onClick={() => handleValidate()}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
              >
                Scan Ticket
              </button>
            </div>

            {/* Quick Test Chips from actual bookings */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-400 block">
                Quick Test using available tickets:
              </span>
              <div className="flex flex-wrap gap-2">
                {bookings.slice(0, 4).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleValidate(b.ticketNumber)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#1A1A2E] hover:bg-[#252542] border border-slate-700 text-slate-300 transition-colors flex items-center gap-1.5"
                  >
                    <span>{b.ticketNumber}</span>
                    <span
                      className={`text-[9px] px-1 rounded ${
                        b.status === 'used'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {b.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Validation Result Box */}
          {scanResult && (
            <div
              className={`p-4 rounded-2xl border transition-all ${
                scanResult.status === 'valid'
                  ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-200'
                  : scanResult.status === 'already_used'
                  ? 'bg-red-950/30 border-red-500/60 text-red-200'
                  : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {scanResult.status === 'valid' && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {scanResult.status === 'already_used' && (
                  <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                )}
                {scanResult.status === 'invalid' && (
                  <XCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                )}

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">
                      {scanResult.status === 'valid'
                        ? 'ACCESS GRANTED · ADMIT ATTENDEE'
                        : scanResult.status === 'already_used'
                        ? 'SECURITY ALERT · DUPLICATE REJECTED'
                        : 'ACCESS DENIED · INVALID PASS'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {scanResult.timestamp}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{scanResult.message}</p>

                  {scanResult.ticket && (
                    <div className="pt-2 mt-2 border-t border-slate-800/80 text-[11px] space-y-1 text-slate-300">
                      <div>
                        <strong>Event:</strong> {scanResult.ticket.eventTitle}
                      </div>
                      <div>
                        <strong>Attendee:</strong> {scanResult.ticket.customerName} (
                        {scanResult.ticket.tierName} Tier)
                      </div>
                      {scanResult.ticket.seats && (
                        <div>
                          <strong>Seats:</strong> {scanResult.ticket.seats.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Verification Logs */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>Recent Turnstile Activity</span>
              </span>
              <span>{scanLogs.length} scans</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {scanLogs.length === 0 ? (
                <div className="text-xs text-slate-500 italic py-2">
                  No scans logged yet in this session.
                </div>
              ) : (
                scanLogs.map((log, index) => (
                  <div
                    key={index}
                    className="p-2 rounded-lg bg-[#0F0F1B] border border-slate-800/60 flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          log.status === 'valid'
                            ? 'bg-emerald-400'
                            : log.status === 'already_used'
                            ? 'bg-red-400'
                            : 'bg-amber-400'
                        }`}
                      />
                      <span className="font-mono text-slate-300">{log.code}</span>
                    </div>
                    <span className="text-slate-400">{log.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
