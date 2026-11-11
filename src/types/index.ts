export type EventCategory =
  | 'Concerts'
  | 'Football'
  | 'Basketball'
  | 'Boxing & Martial Arts'
  | 'Other Sports'
  | 'Festivals'
  | 'Conferences'
  | 'Comedy'
  | 'Theater'
  | 'Exhibitions';

export type TicketTierType = 'VIP' | 'Regular' | 'Premium' | 'Standard';

export interface TicketTier {
  id: string;
  name: TicketTierType;
  priceRwf: number;
  description: string;
  benefits: string[];
  totalQuantity: number;
  soldQuantity: number;
}

export interface SeatItem {
  id: string;
  tier: TicketTierType;
  zone: string;
  row: string;
  number: number;
  status: 'available' | 'reserved' | 'taken' | 'selected';
  priceRwf: number;
}

export interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  category: EventCategory;
  date: string; // ISO date string e.g. 2026-11-28
  time: string; // e.g. 19:30
  doorsOpen: string; // e.g. 17:00
  venue: string;
  city: string;
  country: string;
  image: string;
  description: string;
  highlights: string[];
  organizer: {
    id: string;
    name: string;
    verified: boolean;
    avatar: string;
    contactEmail: string;
    phone: string;
    eventsOrganized: number;
  };
  tiers: TicketTier[];
  hasSeatingMap: boolean;
  status: 'published' | 'pending' | 'draft' | 'cancelled';
  featured?: boolean;
  refundPolicy: string;
  ageRestriction: string;
}

export type PaymentMethod = 'mtn_momo' | 'airtel_money' | 'card' | 'bank_transfer';

export interface TicketBooking {
  id: string;
  ticketNumber: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventCity: string;
  eventImage: string;
  tierName: TicketTierType;
  quantity: number;
  seats?: string[]; // e.g. ["Row B - Seat 14"]
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amountPaid: number;
  currency: CurrencyCode;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  purchasedAt: string;
  status: 'active' | 'used' | 'cancelled' | 'refund_requested' | 'refunded';
  qrData: string;
  usedAt?: string;
  validatedBy?: string;
}

export type UserRole = 'customer' | 'organizer' | 'admin';

export type CurrencyCode = 'RWF' | 'USD' | 'EUR';

export type AppTheme = 'purple' | 'gold' | 'blue';

export type LanguageCode = 'en' | 'fr' | 'rw';

export interface PromoCode {
  code: string;
  discountPercentage: number;
  description: string;
  minAmountRwf: number;
  active: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'ticket' | 'promo' | 'security' | 'event';
  actionUrl?: string;
}

export interface DisputeItem {
  id: string;
  ticketNumber: string;
  eventTitle: string;
  customerName: string;
  reason: string;
  amountRwf: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}
