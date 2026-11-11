import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/currency';
import { PaymentMethod } from '../types';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  Smartphone,
  Building,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: (ticket: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onSuccess }) => {
  const {
    checkoutPayload,
    activeCurrency,
    createBooking,
    promos,
    t,
  } = useApp();

  if (!checkoutPayload) return null;

  const { event, tierName, unitPriceRwf, quantity, selectedSeats } = checkoutPayload;

  // Form State
  const [customerName, setCustomerName] = useState('Fisc Nayituriki');
  const [customerEmail, setCustomerEmail] = useState('fiscnayituriki@gmail.com');
  const [customerPhone, setCustomerPhone] = useState('+250 788 849 201');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn_momo');

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9821');
  const [cardExp, setCardExp] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('321');

  // MoMo simulation
  const [momoPhone, setMomoPhone] = useState('+250 788 849 201');

  // Promo Code
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPct: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);
  const [issuedTicket, setIssuedTicket] = useState<any>(null);

  // Calculations
  const rawSubtotalRwf = unitPriceRwf * quantity;
  const discountRwf = appliedPromo ? Math.round((rawSubtotalRwf * appliedPromo.discountPct) / 100) : 0;
  const finalTotalRwf = Math.max(0, rawSubtotalRwf - discountRwf);

  const handleApplyPromo = () => {
    setPromoError('');
    const clean = promoInput.trim().toUpperCase();
    const match = promos.find((p) => p.code === clean && p.active);
    if (!match) {
      setPromoError('Invalid or expired promo code.');
      return;
    }
    if (rawSubtotalRwf < match.minAmountRwf) {
      setPromoError(`Requires minimum order of ${formatPrice(match.minAmountRwf, activeCurrency)}`);
      return;
    }
    setAppliedPromo({ code: match.code, discountPct: match.discountPercentage });
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerEmail.trim()) {
      alert('Please fill in attendee contact information.');
      return;
    }

    if (paymentMethod === 'card') {
      // Simulate 3D Secure OTP verification
      setShowOtpModal(true);
      return;
    }

    finalizeTransaction();
  };

  const finalizeTransaction = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowOtpModal(false);

      const refNumber =
        paymentMethod === 'mtn_momo'
          ? `MOMO-RW-${Math.floor(10000000 + Math.random() * 90000000)}`
          : paymentMethod === 'airtel_money'
          ? `AIRTEL-RW-${Math.floor(10000000 + Math.random() * 90000000)}`
          : paymentMethod === 'card'
          ? `CARD-AUTH-${Math.floor(100000 + Math.random() * 900000)}`
          : `BK-WIRE-${Math.floor(1000000 + Math.random() * 9000000)}`;

      const newTicket = createBooking({
        eventId: event.id,
        tierName,
        quantity,
        seats: selectedSeats,
        customerName,
        customerEmail,
        customerPhone: paymentMethod === 'mtn_momo' || paymentMethod === 'airtel_money' ? momoPhone : customerPhone,
        amountPaid: finalTotalRwf,
        currency: activeCurrency,
        paymentMethod,
        paymentReference: refNumber,
      });

      setIssuedTicket(newTicket);
      setPaymentDone(true);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#9333ea', '#3b82f6', '#10b981', '#f59e0b'],
        });
      } catch (err) {
        // ignore
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12121E] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 relative">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#161628]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                {paymentDone ? 'Order Confirmed!' : 'Secure Express Checkout'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{event.title}</span>
                <span>·</span>
                <span className="text-purple-400 font-medium">{tierName} Pass</span>
              </div>
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
        <div className="flex-1 overflow-y-auto p-6">
          {paymentDone && issuedTicket ? (
            /* Success View */
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white font-display">
                  Booking Confirmed!
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
                  Your ticket and scannable QR verification code have been issued and sent to{' '}
                  <span className="text-purple-300 font-medium">{customerEmail}</span>.
                </p>
              </div>

              {/* Quick Ticket Badge Card */}
              <div className="bg-[#18182C] border border-slate-800 rounded-xl p-4 max-w-md mx-auto text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Ticket Number:</span>
                  <span className="font-mono font-bold text-purple-400">{issuedTicket.ticketNumber}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Event:</span>
                  <span className="text-white font-medium">{issuedTicket.eventTitle}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Venue & Time:</span>
                  <span className="text-white font-medium">{issuedTicket.eventVenue} · {issuedTicket.eventTime}</span>
                </div>
                {issuedTicket.seats && issuedTicket.seats.length > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Reserved Seats:</span>
                    <span className="text-emerald-400 font-mono font-semibold">
                      {issuedTicket.seats.join(', ')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400">Amount Paid ({issuedTicket.paymentMethod}):</span>
                  <span className="font-bold text-white tabular-nums">
                    {formatPrice(issuedTicket.amountPaid, activeCurrency)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onSuccess(issuedTicket);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  View & Download Digital Pass
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleStartPayment} className="space-y-6">
              {/* Order Itemized Summary Card */}
              <div className="bg-[#18182C] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={event.image}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{event.title}</h4>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {event.date} · {event.time} · {event.venue}
                    </div>
                    <div className="text-xs text-purple-400 font-medium mt-1">
                      {tierName} Tier · {quantity} {quantity === 1 ? 'ticket' : 'tickets'}
                      {selectedSeats && selectedSeats.length > 0 && ` · Seats: ${selectedSeats.join(', ')}`}
                    </div>
                  </div>
                </div>
                <div className="text-right sm:self-center shrink-0">
                  <div className="text-xs text-slate-400">Unit Price</div>
                  <div className="text-base font-bold text-white tabular-nums">
                    {formatPrice(unitPriceRwf, activeCurrency)}
                  </div>
                </div>
              </div>

              {/* Attendee Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300">
                  1. Attendee Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0F0F1B] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                      placeholder="e.g. Fisc Nayituriki"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Email (for Ticket PDF)</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0F0F1B] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300">
                  2. Select Payment Gateway
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* MTN MoMo */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mtn_momo')}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      paymentMethod === 'mtn_momo'
                        ? 'bg-amber-950/20 border-amber-500 ring-1 ring-amber-500/40 text-amber-200'
                        : 'bg-[#161628] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-amber-400">MTN MoMo</span>
                      <Smartphone className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-2">Mobile Money push</span>
                  </button>

                  {/* Airtel Money */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('airtel_money')}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      paymentMethod === 'airtel_money'
                        ? 'bg-red-950/20 border-red-500 ring-1 ring-red-500/40 text-red-200'
                        : 'bg-[#161628] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-red-400">Airtel</span>
                      <Smartphone className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-2">Instant PIN prompt</span>
                  </button>

                  {/* Visa / Master */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      paymentMethod === 'card'
                        ? 'bg-purple-950/30 border-purple-500 ring-1 ring-purple-500/40 text-purple-200'
                        : 'bg-[#161628] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-purple-400">Card</span>
                      <CreditCard className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-2">Visa / Mastercard</span>
                  </button>

                  {/* Bank Wire */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-blue-950/30 border-blue-500 ring-1 ring-blue-500/40 text-blue-200'
                        : 'bg-[#161628] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-blue-400">Bank</span>
                      <Building className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-2">BK, I&M, Equity</span>
                  </button>
                </div>

                {/* Gateway Inputs */}
                {(paymentMethod === 'mtn_momo' || paymentMethod === 'airtel_money') && (
                  <div className="p-4 bg-[#161628] border border-slate-800 rounded-xl space-y-2">
                    <label className="block text-xs text-slate-300 font-medium">
                      {paymentMethod === 'mtn_momo' ? 'MTN MoMo Registered Number' : 'Airtel Money Registered Number'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={momoPhone}
                        onChange={(e) => setMomoPhone(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 bg-[#0F0F1B] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                        placeholder="+250 788 123 456"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      💡 A direct USSD push prompt will appear on your mobile phone to approve this payment with your secure PIN.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-4 bg-[#161628] border border-slate-800 rounded-xl space-y-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#0F0F1B] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Expires (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#0F0F1B] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">CVC / CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#0F0F1B] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <div className="p-4 bg-[#161628] border border-slate-800 rounded-xl space-y-1 text-xs text-slate-400">
                    <p className="font-semibold text-white">Bank of Kigali / I&M Instant Transfer</p>
                    <p>Account Name: EVENTPRO RWANDA LTD · Acc: 00045-891048-01</p>
                    <p className="text-[11px] text-purple-400 mt-1">Payment will be automatically reconciled in seconds.</p>
                  </div>
                )}
              </div>

              {/* Promo Code Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-purple-400" />
                    <span>Have a Promo Voucher? (Try: KIGALI2026 or EVENTPRO5)</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 bg-[#0F0F1B] border border-slate-800 rounded-lg text-xs font-mono text-white uppercase focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-white transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Code {appliedPromo.code} applied: {appliedPromo.discountPct}% discount!</span>
                  </div>
                )}
                {promoError && (
                  <div className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{promoError}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="bg-[#141424] rounded-xl p-4 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({quantity} tickets)</span>
                  <span className="tabular-nums font-mono">{formatPrice(rawSubtotalRwf, activeCurrency)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedPromo.discountPct}%)</span>
                    <span className="tabular-nums font-mono">-{formatPrice(discountRwf, activeCurrency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Service & Processing Fee</span>
                  <span className="text-emerald-400 font-medium">Free (0 RWF)</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
                  <span className="font-bold text-white">Total Amount</span>
                  <span className="text-lg font-black text-purple-400 tabular-nums">
                    {formatPrice(finalTotalRwf, activeCurrency)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment via {paymentMethod.toUpperCase()}...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay {formatPrice(finalTotalRwf, activeCurrency)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* 3D Secure / USSD Simulation Modal */}
        {showOtpModal && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1A1A2E] border border-purple-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">3D Secure Card Verification</h4>
                <p className="text-xs text-slate-400 mt-1">
                  A 6-digit confirmation passcode was sent to your phone ending in ••201.
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 123456"
                  className="w-full text-center tracking-widest text-lg font-mono py-2.5 bg-[#0F0F1B] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
                <p className="text-[11px] text-slate-500">Test mode: enter any digits or click verify directly</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={finalizeTransaction}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg text-xs shadow-md"
                >
                  Verify & Pay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
