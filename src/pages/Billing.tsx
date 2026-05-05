import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, CheckCircle2, Download, Printer, MapPin, Calendar, Users, DollarSign } from 'lucide-react';

const Billing = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await bookingAPI.getById(bookingId!);
      setBooking(response.data.booking);
    } catch (error) {
      toast.error('Failed to load invoice');
      navigate('/my-bookings');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 print:bg-white print:py-0">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex justify-between items-center mb-8 print:hidden">
          <button 
            onClick={() => navigate('/my-bookings')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Bookings
          </button>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              Print Invoice
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <Card className="border-t-4 border-t-green-500 shadow-xl print:shadow-none print:border-none">
          <CardHeader className="pb-0 text-center flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</CardTitle>
            <p className="text-gray-500">Your booking has been confirmed. A copy of this receipt has been sent to your email.</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex justify-between items-end border-b pb-6 mb-6">
              <div>
                <h1 className="text-2xl font-black text-blue-600 tracking-tight uppercase">VOYAGEX</h1>
                <p className="text-sm text-gray-500 mt-1">Official Booking Receipt</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-600 uppercase">Invoice #</p>
                <p className="font-mono font-medium">{booking?.bookingId || `INV-${Date.now()}`}</p>
                <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Billed To:</p>
                <p className="font-medium text-gray-900">Guest User</p>
                <p className="text-sm text-gray-600">guest@example.com</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Destination:</p>
                <p className="font-medium text-gray-900 flex items-center justify-end gap-1">
                  {booking?.destination?.name}
                  <MapPin className="h-4 w-4 text-gray-400" />
                </p>
                <p className="text-sm text-gray-600">{booking?.destination?.location?.city}, {booking?.destination?.location?.country}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg border p-6 mb-8">
              <h3 className="font-semibold text-lg mb-4 border-b pb-2">Trip Details</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Dates:</span>
                </div>
                <div className="font-medium text-right">
                  {new Date(booking?.startDate || Date.now()).toLocaleDateString()} - {new Date(booking?.endDate || Date.now() + 86400000*7).toLocaleDateString()}
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>Travelers:</span>
                </div>
                <div className="font-medium text-right capitalize">
                  {booking?.travelers?.length || 1} Person(s)
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">Type:</span>
                </div>
                <div className="font-medium text-right capitalize">
                  {booking?.bookingType} Package
                </div>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 font-semibold text-gray-600">Description</th>
                  <th className="text-right py-3 font-semibold text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4">
                    <p className="font-medium">{booking?.destination?.name} Tour Package</p>
                    <p className="text-sm text-gray-500">Includes accommodation, guided tours, and standard meals</p>
                  </td>
                  <td className="text-right py-4 font-medium">${(booking?.totalAmount * 0.85).toFixed(2)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4">
                    <p className="font-medium">Taxes & Fees</p>
                    <p className="text-sm text-gray-500">Service charge and local taxes (15%)</p>
                  </td>
                  <td className="text-right py-4 font-medium">${(booking?.totalAmount * 0.15).toFixed(2)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="text-xl font-bold bg-gray-50">
                  <td className="py-4 px-4 text-right rounded-l-lg">Total Paid</td>
                  <td className="text-right py-4 px-4 text-blue-600 rounded-r-lg flex justify-end items-center gap-1">
                    <DollarSign className="h-5 w-5" />
                    {booking?.totalAmount?.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="text-center text-sm text-gray-500 border-t pt-8">
              <p>Thank you for choosing VoyageX! If you have any questions about your booking,</p>
              <p>please contact our support team at support@voyagex.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
