export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  avatar?: string;
  phone?: string;
  location?: {
    city: string;
    country: string;
  };
  preferences?: {
    travelStyle: string[];
    budgetRange: {
      min: number;
      max: number;
    };
    preferredDestinations: string[];
    activities: string[];
  };
}

export interface Destination {
  _id: string;
  name: string;
  description: string;
  location: {
    city: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  images: {
    url: string;
    caption?: string;
  }[];
  category: string[];
  bestSeason: string[];
  budgetRange: {
    min: number;
    max: number;
    currency: string;
  };
  rating: {
    average: number;
    count: number;
  };
  activities: {
    name: string;
    description: string;
    price: number;
    duration: string;
    image?: string;
  }[];
  attractions: {
    name: string;
    description: string;
    type: string;
    entryFee?: number;
    openingHours?: string;
  }[];
  accommodations: {
    name: string;
    type: string;
    pricePerNight: number;
    rating: number;
    amenities: string[];
  }[];
  weather?: {
    climate: string;
    bestTimeToVisit: string;
    averageTemperature: {
      summer: number;
      winter: number;
      spring: number;
      autumn: number;
    };
  };
  transport?: {
    nearestAirport: string;
    airportDistance: number;
    localTransport: string[];
  };
  visitCount: number;
  isActive: boolean;
}

export interface Booking {
  _id: string;
  bookingId: string;
  user: string;
  destination: Destination;
  bookingType: 'hotel' | 'transport' | 'package' | 'activity';
  details: {
    hotelName?: string;
    roomType?: string;
    checkIn?: Date;
    checkOut?: Date;
    nights?: number;
    transportType?: string;
    transportCompany?: string;
    departure?: Date;
    arrival?: Date;
    from?: string;
    to?: string;
    passengers?: number;
    activityName?: string;
    activityDate?: Date;
  };
  travelers: {
    name: string;
    age: number;
    type: 'adult' | 'child' | 'infant';
  }[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  confirmationCode?: string;
  createdAt: Date;
}

export interface Itinerary {
  _id: string;
  user: string;
  title: string;
  destination: Destination;
  startDate: Date;
  endDate: Date;
  duration: number;
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  budget: {
    total: number;
    currency: string;
  };
  days: {
    dayNumber: number;
    date: Date;
    activities: {
      time: string;
      title: string;
      description: string;
      type: string;
      location?: string;
      duration: string;
      cost: number;
      bookingRequired: boolean;
      bookingStatus: string;
      notes?: string;
    }[];
    meals: {
      breakfast?: string;
      lunch?: string;
      dinner?: string;
    };
    accommodation?: string;
    transport?: string;
    estimatedCost: number;
  }[];
  aiGenerated: boolean;
  totalEstimatedCost: {
    accommodation: number;
    activities: number;
    transport: number;
    meals: number;
    other: number;
    total: number;
  };
  status: 'draft' | 'planned' | 'booked' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface Review {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  destination: string;
  rating: {
    overall: number;
    accommodation?: number;
    activities?: number;
    transport?: number;
    valueForMoney?: number;
    cleanliness?: number;
  };
  title: string;
  review: string;
  visitDate?: Date;
  travelerType?: string;
  helpful: {
    count: number;
  };
  isVerified: boolean;
  createdAt: Date;
}

export interface Payment {
  _id: string;
  paymentId: string;
  booking: Booking;
  amount: number;
  currency: string;
  paymentMethod: 'upi' | 'card' | 'wallet' | 'netbanking';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  transactionId?: string;
  paidAt?: Date;
  createdAt: Date;
}

export interface Report {
  _id: string;
  reportId: string;
  type: 'booking' | 'payment' | 'destination' | 'technical' | 'other';
  category: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    blocked: number;
  };
  destinations: {
    total: number;
    active: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  revenue: {
    total: number;
    monthly: number;
  };
  reviews: number;
  openReports: number;
}
