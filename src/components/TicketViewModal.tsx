import React, { useState } from 'react';
import { TicketBooking } from '../types';
import { TicketQrCode } from './TicketQrCode';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/currency';
import {
  X,
  Download,
  Share2,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Sparkles,
} from 'lucide-react';

interface TicketViewModalProps {
  ticket: TicketBooking;
  onClose: () => void;
}

export const TicketViewModal: React.FC<TicketViewModalProps> = ({ ticket, onClose }) => {
  const { activeCurrency, requestRefund, setCurrentView, t } = useApp();
  const [copied, setCopied] = useState(false);
  const [showRefundPrompt, setShowRefundPrompt] = useState(false);
  const [refundReason, setRefundReason] = useState('Change of personal travel plans');
  const [refundSuccess, setRefundSuccess] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Ticket: ${ticket.eventTitle} on EVENTPRO`,
          text: `I'm attending ${ticket.eventTitle} at ${ticket.eventVenue}! Grab your tickets on EVENTPRO.`,
          url: window.location.href,
        });
      } catch (e) {
        // user aborted
      }
    } else {
      navigator.clipboard.writeText(
        `EVENTPRO Ticket Pass: ${ticket.ticketNumber} for ${ticket.eventTitle} at ${ticket.eventVenue}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefundSubmit = () => {
    const ok = requestRefund(ticket.ticketNumber, refundReason);
    if (ok) {
      setRefundSuccess(true);
      setTimeout(() => {
        setShowRefundPrompt(false);
      }, 1500);
    }
  };

  const handleTestInScanner = () => {
    onClose();
    setCurrentView('scanner');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12121E] border border-slate-800 rounded-3xl w-full max-w-md max-h-[95vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 relative">
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between bg-[#161628] no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-purple-400 uppercase">
              Digital Entry Pass
            </span>
            <span className="text-slate-600">·</span>
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                ticket.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : ticket.status === 'used'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}
            >
              {ticket.status.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Pass Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center">
          <div className="w-full bg-[#18182C] border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl relative ticket-print-wrapper">
            {/* Ticket Header Banner */}
            <div className="relative h-32 w-full overflow-hidden">
              <img
                src={ticket.eventImage}
                alt={ticket.eventTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18182C] via-[#18182C]/60 to-transparent" />
              <div className="absolute top-3 left-4 flex items-center gap-2">
                <div className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black tracking-wider text-white uppercase">
                  EVENTPRO PASS
                </div>
              </div>
              <div className="absolute bottom-2 left-4 right-4">
                <span className="text-xs font-semibold text-purple-400">
                  {ticket.tierName} TICKET
                </span>
                <h3 className="text-lg font-bold text-white font-display truncate">
                  {ticket.eventTitle}
                </h3>
              </div>
            </div>

            {/* Event Info Details */}
            <div className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{ticket.eventDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{ticket.eventTime}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">{ticket.eventVenue}, {ticket.eventCity}</span>
                </div>
              </div>

              {/* Seats Badge */}
              {ticket.seats && ticket.seats.length > 0 && (
                <div className="bg-purple-950/40 border border-purple-500/30 rounded-lg p-2.5 text-xs flex items-center justify-between">
                  <span className="text-purple-300 font-medium">Assigned Seats:</span>
                  <span className="font-mono font-bold text-white text-right">
                    {ticket.seats.join(', ')}
                  </span>
                </div>
              )}

              {/* Attendee Info */}
              <div className="bg-[#121222] rounded-lg p-2.5 text-[11px] text-slate-400 flex justify-between">
                <div>
                  <span className="block text-slate-500 text-[10px]">ATTENDEE</span>
                  <span className="font-medium text-slate-200">{ticket.customerName}</span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-500 text-[10px]">TICKET ID</span>
                  <span className="font-mono font-bold text-purple-400">{ticket.ticketNumber}</span>
                </div>
              </div>
            </div>

            {/* Tear-off Notch Divider */}
            <div className="relative flex items-center my-1">
              <div className="w-4 h-8 bg-[#12121E] rounded-r-full -ml-2 border-r border-slate-800" />
              <div className="flex-1 border-b-2 border-dashed border-slate-700/60 mx-2" />
              <div className="w-4 h-8 bg-[#12121E] rounded-l-full -mr-2 border-l border-slate-800" />
            </div>

            {/* QR Code Section */}
            <div className="p-5 flex flex-col items-center text-center space-y-3">
              <TicketQrCode value={ticket.qrData} size={160} />
              <p className="text-[11px] text-slate-400 max-w-xs">
                Scan this high-contrast QR token at turnstile scanners or gate staff handheld devices.
              </p>
              <div className="font-mono text-[10px] text-slate-500 tracking-wider">
                PAY-REF: {ticket.paymentReference}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full mt-4 space-y-2 no-print">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-purple-600/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save / Print PDF</span>
              </button>
              <button
                onClick={handleShare}
                className="py-2.5 px-3 rounded-xl bg-[#1C1C30] hover:bg-[#252540] border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Link Copied!' : 'Share Pass'}</span>
              </button>
            </div>

            {/* Organizer Gate Scanner Quick Test Button */}
            <button
              onClick={handleTestInScanner}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-purple-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Test Ticket in Gate Scanner & Validator</span>
            </button>

            {/* Refund trigger */}
            {ticket.status === 'active' && (
              <div className="text-center pt-1">
                <button
                  onClick={() => setShowRefundPrompt(true)}
                  className="text-[11px] text-slate-500 hover:text-red-400 transition-colors underline"
                >
                  Request Cancellation or Refund
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Refund Dialog */}
        {showRefundPrompt && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md p-6 flex flex-col justify-center items-center text-center space-y-4 z-50">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            {refundSuccess ? (
              <div className="space-y-2">
                <h4 className="font-bold text-white text-base">Refund Requested</h4>
                <p className="text-xs text-slate-300">
                  Your request has been filed with EVENTPRO Admin. Funds will be returned to your original payment method.
                </p>
              </div>
            ) : (
              <div className="space-y-3 w-full">
                <h4 className="font-bold text-white text-base">Confirm Refund Request</h4>
                <p className="text-xs text-slate-400">
                  Amount to be credited: {formatPrice(ticket.amountPaid, activeCurrency)}
                </p>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Reason for cancellation..."
                  className="w-full h-20 p-2.5 bg-[#0F0F1B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRefundPrompt(false)}
                    className="flex-1 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                  >
                    Keep Ticket
                  </button>
                  <button
                    onClick={handleRefundSubmit}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-md"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
