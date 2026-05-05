import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '@/services/api';
import type { Booking } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  CreditCard
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedBooking) return;
    
    try {
      await bookingAPI.cancel(selectedBooking._id, { cancellationReason });
      toast.success('Booking cancelled successfully');
      setCancelDialogOpen(false);
      setCancellationReason('');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filterBookings = (status: string) => {
    if (status === 'all') return bookings;
    return bookings.filter(b => b.status === status);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your travel bookings and reservations</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="overflow-x-auto pb-2 no-scrollbar">
            <TabsList className="inline-flex min-w-full sm:grid sm:w-full sm:grid-cols-5">
              <TabsTrigger value="all" className="whitespace-nowrap px-4">All ({bookings.length})</TabsTrigger>
              <TabsTrigger value="pending" className="whitespace-nowrap px-4">Pending</TabsTrigger>
              <TabsTrigger value="confirmed" className="whitespace-nowrap px-4">Confirmed</TabsTrigger>
              <TabsTrigger value="completed" className="whitespace-nowrap px-4">Completed</TabsTrigger>
              <TabsTrigger value="cancelled" className="whitespace-nowrap px-4">Cancelled</TabsTrigger>
            </TabsList>
          </div>

          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <TabsContent key={status} value={status} className="mt-6">
              <div className="space-y-4">
                {filterBookings(status).length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
                      <p className="text-gray-500 mb-4">
                        {status === 'all' 
                          ? "You haven't made any bookings yet." 
                          : `No ${status} bookings.`}
                      </p>
                      <Link to="/destinations">
                        <Button>Browse Destinations</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  filterBookings(status).map((booking) => (
                    <Card key={booking._id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {/* Destination Image */}
                          <div className="w-full md:w-48 h-48 md:h-auto">
                            <img
                              src={booking.destination?.images?.[0]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400'}
                              alt={booking.destination?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Booking Details */}
                          <div className="flex-1 p-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={getStatusBadge(booking.status)}>
                                    <span className="flex items-center gap-1">
                                      {getStatusIcon(booking.status)}
                                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                  </Badge>
                                  {booking.paymentStatus === 'paid' && (
                                    <Badge className="bg-green-100 text-green-800">
                                      Paid
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="text-xl font-semibold mb-1">
                                  {booking.destination?.name}
                                </h3>
                                <p className="text-gray-600 flex items-center gap-1 mb-2">
                                  <MapPin className="h-4 w-4" />
                                  {booking.destination?.location?.city}, {booking.destination?.location?.country}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Booking ID: {booking.bookingId}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-2xl font-bold text-blue-600">
                                  ${booking.totalAmount}
                                </p>
                                <p className="text-sm text-gray-500">{booking.currency}</p>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t flex flex-wrap items-center gap-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>
                                  {booking.details?.checkIn 
                                    ? new Date(booking.details.checkIn).toLocaleDateString()
                                    : new Date(booking.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="h-4 w-4 text-gray-400" />
                                <span className="capitalize">{booking.bookingType}</span>
                              </div>
                              {booking.confirmationCode && (
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span>Confirmation: {booking.confirmationCode}</span>
                                </div>
                              )}
                            </div>

                            <div className="mt-4 flex gap-2">
                              <Link to={`/destinations/${booking.destination?._id}`}>
                                <Button variant="outline" size="sm" className="gap-1">
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </Button>
                              </Link>
                              
                              {booking.status === 'pending' && booking.paymentStatus !== 'paid' && (
                                <Link to={`/payment/${booking._id}`}>
                                  <Button size="sm" className="gap-1">
                                    <CreditCard className="h-4 w-4" />
                                    Pay Now
                                  </Button>
                                </Link>
                              )}
                              
                              {['pending', 'confirmed'].includes(booking.status) && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="gap-1 text-red-600 hover:text-red-700"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setCancelDialogOpen(true);
                                  }}
                                >
                                  <XCircle className="h-4 w-4" />
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Cancel Dialog */}
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Reason for cancellation</label>
                <textarea
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  placeholder="Please provide a reason..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                Keep Booking
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancel}
                disabled={!cancellationReason}
              >
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyBookings;
