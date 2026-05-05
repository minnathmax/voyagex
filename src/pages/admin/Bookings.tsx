import { useEffect, useState } from 'react';
import { bookingAPI } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/AdminLayout';
import EmptyState from '@/components/EmptyState';
import { toast } from 'sonner';
import { Search, Loader2, Calendar, DollarSign, User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getAll();
      setBookings(response.data.bookings);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await bookingAPI.updateStatus(bookingId, { status: newStatus });
      toast.success('Booking status updated');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.destination?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <>
      <AdminPageHeader title="Booking Management" subtitle="Manage all bookings" />
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title={searchQuery || statusFilter !== 'all' ? 'No bookings match your filters' : 'No bookings yet'}
                description={searchQuery || statusFilter !== 'all' ? 'Try clearing search or status filters.' : 'Bookings will appear here once users start booking trips.'}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Booking ID</th>
                      <th className="text-left py-3 px-4">User</th>
                      <th className="text-left py-3 px-4">Destination</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{booking.bookingId}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            {booking.user?.firstName} {booking.user?.lastName}
                          </div>
                        </td>
                        <td className="py-3 px-4">{booking.destination?.name}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            {booking.totalAmount}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusBadge(booking.status)}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Select 
                            value={booking.status} 
                            onValueChange={(value) => handleStatusChange(booking._id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
    </>
  );
};

export default AdminBookings;
