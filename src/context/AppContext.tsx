import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EventItem,
  TicketBooking,
  UserRole,
  CurrencyCode,
  AppTheme,
  LanguageCode,
  PromoCode,
  NotificationItem,
  DisputeItem,
} from '../types';
import { INITIAL_EVENTS, INITIAL_BOOKINGS, INITIAL_PROMOS } from '../data/mockEvents';
import { translations } from '../utils/translations';

interface AppContextType {
  events: EventItem[];
  bookings: TicketBooking[];
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeCurrency: CurrencyCode;
  setActiveCurrency: (cur: CurrencyCode) => void;
  activeLanguage: LanguageCode;
  setActiveLanguage: (lang: LanguageCode) => void;
  activeTheme: AppTheme;
  setActiveTheme: (theme: AppTheme) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (val: boolean) => void;
  currentView: 'home' | 'discover' | 'my-tickets' | 'organizer' | 'admin' | 'scanner';
  setCurrentView: (view: 'home' | 'discover' | 'my-tickets' | 'organizer' | 'admin' | 'scanner') => void;
  selectedEvent: EventItem | null;
  setSelectedEvent: (event: EventItem | null) => void;
  viewTicketModal: TicketBooking | null;
  setViewTicketModal: (ticket: TicketBooking | null) => void;
  checkoutPayload: {
    event: EventItem;
    tierName: string;
    unitPriceRwf: number;
    quantity: number;
    selectedSeats?: string[];
  } | null;
  setCheckoutPayload: (payload: any) => void;
  createBooking: (payload: {
    eventId: string;
    tierName: any;
    quantity: number;
    seats?: string[];
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    amountPaid: number;
    currency: CurrencyCode;
    paymentMethod: any;
    paymentReference: string;
  }) => TicketBooking;
  requestRefund: (ticketNumber: string, reason: string) => boolean;
  cancelBooking: (ticketNumber: string) => boolean;
  createNewEvent: (newEvent: Partial<EventItem>) => EventItem;
  updateEventStatus: (eventId: string, status: EventItem['status']) => void;
  validateTicketByCode: (code: string) => {
    status: 'valid' | 'already_used' | 'invalid';
    ticket?: TicketBooking;
    message: string;
  };
  promos: PromoCode[];
  addPromoCode: (promo: PromoCode) => void;
  disputes: DisputeItem[];
  resolveDispute: (id: string, action: 'approved' | 'rejected') => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Events state with localStorage fallback
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('ep_events_v2');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  // Bookings state with localStorage fallback
  const [bookings, setBookings] = useState<TicketBooking[]>(() => {
    const saved = localStorage.getItem('ep_bookings_v2');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [activeRole, setActiveRole] = useState<UserRole>('customer');
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('RWF');
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>('en');
  const [activeTheme, setActiveTheme] = useState<AppTheme>('purple');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'home' | 'discover' | 'my-tickets' | 'organizer' | 'admin' | 'scanner'>('home');

  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [viewTicketModal, setViewTicketModal] = useState<TicketBooking | null>(null);
  const [checkoutPayload, setCheckoutPayload] = useState<{
    event: EventItem;
    tierName: string;
    unitPriceRwf: number;
    quantity: number;
    selectedSeats?: string[];
  } | null>(null);

  const [promos, setPromos] = useState<PromoCode[]>(INITIAL_PROMOS);
  const [disputes, setDisputes] = useState<DisputeItem[]>([
    {
      id: 'disp-101',
      ticketNumber: 'EP-2026-AMA-10928',
      eventTitle: 'The Kigali Derby: Rayon Sports vs APR FC',
      customerName: 'Jean-Paul Mugisha',
      reason: 'Work schedule emergency - requested refund 5 days ahead.',
      amountRwf: 30000,
      status: 'pending',
      date: '2026-11-10',
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Kigali Derby Tickets Released',
      message: 'Exclusive early VIP seating available for Rayon Sports vs APR FC at Amahoro.',
      timestamp: '10 min ago',
      read: false,
      type: 'event',
    },
    {
      id: 'notif-2',
      title: 'Special 15% Promo Code',
      message: 'Use code KIGALI2026 during checkout to get 15% off any concert ticket.',
      timestamp: '1 hour ago',
      read: false,
      type: 'promo',
    },
  ]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ep_events_v2', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('ep_bookings_v2', JSON.stringify(bookings));
  }, [bookings]);

  // Theme & Dark mode DOM sync
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply color theme class
    root.classList.remove('theme-purple', 'theme-gold', 'theme-blue');
    root.classList.add(`theme-${activeTheme}`);
  }, [isDarkMode, activeTheme]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Translation helper
  const t = (key: string): string => {
    const dict = translations[activeLanguage] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  // Create booking after payment success
  const createBooking = (payload: {
    eventId: string;
    tierName: any;
    quantity: number;
    seats?: string[];
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    amountPaid: number;
    currency: CurrencyCode;
    paymentMethod: any;
    paymentReference: string;
  }): TicketBooking => {
    const event = events.find((e) => e.id === payload.eventId);
    const randNum = Math.floor(10000 + Math.random() * 90000);
    const ticketNum = `EP-2026-KGL-${randNum}`;
    const signHash = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newBooking: TicketBooking = {
      id: `bkg-${Date.now()}`,
      ticketNumber: ticketNum,
      eventId: payload.eventId,
      eventTitle: event ? event.title : 'Premier Event',
      eventDate: event ? event.date : '2026-12-01',
      eventTime: event ? event.time : '19:00',
      eventVenue: event ? event.venue : 'BK Arena Kigali',
      eventCity: event ? event.city : 'Kigali',
      eventImage: event ? event.image : '/src/assets/images/concert_live_stage_1794372546511.jpg',
      tierName: payload.tierName,
      quantity: payload.quantity,
      seats: payload.seats,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      amountPaid: payload.amountPaid,
      currency: payload.currency,
      paymentMethod: payload.paymentMethod,
      paymentReference: payload.paymentReference,
      purchasedAt: new Date().toISOString(),
      status: 'active',
      qrData: `EP:TICKET:${payload.eventId}:${ticketNum}:${payload.tierName}:SEATS-${(payload.seats || []).join(',') || 'GEN'}:SIGN-${signHash}`,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update event sold count
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== payload.eventId) return ev;
        return {
          ...ev,
          tiers: ev.tiers.map((tr) =>
            tr.name === payload.tierName
              ? { ...tr, soldQuantity: tr.soldQuantity + payload.quantity }
              : tr
          ),
        };
      })
    );

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Booking Confirmed!',
        message: `Your ticket ${ticketNum} for "${newBooking.eventTitle}" is ready.`,
        timestamp: 'Just now',
        read: false,
        type: 'ticket',
      },
      ...prev,
    ]);

    return newBooking;
  };

  const requestRefund = (ticketNumber: string, reason: string): boolean => {
    let success = false;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.ticketNumber === ticketNumber) {
          success = true;
          return { ...b, status: 'refund_requested' };
        }
        return b;
      })
    );

    if (success) {
      const b = bookings.find((bk) => bk.ticketNumber === ticketNumber);
      if (b) {
        setDisputes((prev) => [
          {
            id: `disp-${Date.now()}`,
            ticketNumber,
            eventTitle: b.eventTitle,
            customerName: b.customerName,
            reason: reason || 'Customer requested refund via dashboard',
            amountRwf: b.amountPaid,
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
          },
          ...prev,
        ]);
      }
    }
    return success;
  };

  const cancelBooking = (ticketNumber: string): boolean => {
    let success = false;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.ticketNumber === ticketNumber) {
          success = true;
          return { ...b, status: 'cancelled' };
        }
        return b;
      })
    );
    return success;
  };

  const createNewEvent = (newEventData: Partial<EventItem>): EventItem => {
    const fullEvent: EventItem = {
      id: `ev-${Date.now()}`,
      title: newEventData.title || 'Untitled Event',
      subtitle: newEventData.subtitle || 'Live Entertainment',
      category: newEventData.category || 'Concerts',
      date: newEventData.date || '2026-12-25',
      time: newEventData.time || '18:00',
      doorsOpen: newEventData.doorsOpen || '16:00',
      venue: newEventData.venue || 'BK Arena Kigali',
      city: newEventData.city || 'Kigali',
      country: newEventData.country || 'Rwanda',
      image:
        newEventData.image ||
        '/src/assets/images/concert_live_stage_1794372546511.jpg',
      description: newEventData.description || 'Join us for this exciting live experience.',
      highlights: newEventData.highlights || ['Live stage production', 'Standard entry gates'],
      organizer: newEventData.organizer || {
        id: 'org-custom',
        name: 'Event Host Pro',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        contactEmail: 'contact@eventhost.rw',
        phone: '+250 788 000 111',
        eventsOrganized: 1,
      },
      tiers: newEventData.tiers || [
        {
          id: `tr-vip-${Date.now()}`,
          name: 'VIP',
          priceRwf: 40000,
          description: 'VIP admission with reserved lounge access',
          benefits: ['Priority entrance', 'Exclusive lounge access'],
          totalQuantity: 100,
          soldQuantity: 0,
        },
        {
          id: `tr-reg-${Date.now()}`,
          name: 'Regular',
          priceRwf: 10000,
          description: 'General arena admission',
          benefits: ['Numbered stadium seat'],
          totalQuantity: 500,
          soldQuantity: 0,
        },
      ],
      hasSeatingMap: !!newEventData.hasSeatingMap,
      status: 'published',
      refundPolicy: newEventData.refundPolicy || 'Refundable up to 48 hours prior to start.',
      ageRestriction: newEventData.ageRestriction || 'All ages welcome.',
    };

    setEvents((prev) => [fullEvent, ...prev]);
    return fullEvent;
  };

  const updateEventStatus = (eventId: string, status: EventItem['status']) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status } : e))
    );
  };

  // QR scanner validator: marks ticket used, flags duplicates
  const validateTicketByCode = (
    code: string
  ): {
    status: 'valid' | 'already_used' | 'invalid';
    ticket?: TicketBooking;
    message: string;
  } => {
    const cleanCode = code.trim().toUpperCase();
    // Look up by ticketNumber or full QR string
    const match = bookings.find(
      (b) =>
        b.ticketNumber.toUpperCase() === cleanCode ||
        b.qrData.toUpperCase().includes(cleanCode) ||
        cleanCode.includes(b.ticketNumber.toUpperCase())
    );

    if (!match) {
      return {
        status: 'invalid',
        message: 'No matching ticket found in EVENTPRO registry. Entry Denied.',
      };
    }

    if (match.status === 'used') {
      return {
        status: 'already_used',
        ticket: match,
        message: `DUPLICATE ATTEMPT: Ticket was already scanned and admitted at ${match.usedAt || 'earlier session'}. Gate entry blocked.`,
      };
    }

    if (match.status === 'cancelled' || match.status === 'refunded') {
      return {
        status: 'invalid',
        ticket: match,
        message: `TICKET CANCELLED/REFUNDED: This booking is no longer valid. Entry Denied.`,
      };
    }

    // Mark as used right now!
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setBookings((prev) =>
      prev.map((b) =>
        b.id === match.id
          ? {
              ...b,
              status: 'used',
              usedAt: `${new Date().toLocaleDateString()} ${timeString}`,
              validatedBy: 'Gate Scanner #01',
            }
          : b
      )
    );

    return {
      status: 'valid',
      ticket: { ...match, status: 'used', usedAt: timeString },
      message: `VERIFIED & ADMITTED! Pass: ${match.tierName} Tier · ${match.customerName} · ${(match.seats || []).join(', ') || 'Standing Access'}.`,
    };
  };

  const addPromoCode = (promo: PromoCode) => {
    setPromos((prev) => [promo, ...prev]);
  };

  const resolveDispute = (id: string, action: 'approved' | 'rejected') => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: action } : d))
    );

    // If approved, update ticket to refunded
    const targetDispute = disputes.find((d) => d.id === id);
    if (targetDispute && action === 'approved') {
      setBookings((prev) =>
        prev.map((b) =>
          b.ticketNumber === targetDispute.ticketNumber
            ? { ...b, status: 'refunded' }
            : b
        )
      );
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        events,
        bookings,
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
        currentView,
        setCurrentView,
        selectedEvent,
        setSelectedEvent,
        viewTicketModal,
        setViewTicketModal,
        checkoutPayload,
        setCheckoutPayload,
        createBooking,
        requestRefund,
        cancelBooking,
        createNewEvent,
        updateEventStatus,
        validateTicketByCode,
        promos,
        addPromoCode,
        disputes,
        resolveDispute,
        notifications,
        markNotificationRead,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
