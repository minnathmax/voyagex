import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI, paymentAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CreditCard, Lock, Loader2, ArrowLeft, MapPin, DollarSign } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Payment = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

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
      toast.error('Failed to load booking');
      navigate('/my-bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiryDate || !cardDetails.cvv) {
      toast.error('Please fill in all card details');
      return;
    }

    setIsProcessing(true);
    try {
      await paymentAPI.process({
        bookingId: booking._id,
        paymentMethod,
        paymentDetails: cardDetails,
      });
      toast.success('Payment successful!');
      navigate(`/billing/${booking._id}`);
    } catch (error: any) {
      toast.error('Payment failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
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
      <div className="container mx-auto px-4 max-w-4xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="wallet">Wallet</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Card Number</Label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                        maxLength={16}
                      />
                    </div>
                    <div>
                      <Label>Card Holder Name</Label>
                      <Input
                        placeholder="John Doe"
                        value={cardDetails.cardHolder}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, cardHolder: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Expiry Date</Label>
                        <Input
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label>CVV</Label>
                        <Input
                          type="password"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div>
                    <Label>UPI ID</Label>
                    <Input placeholder="yourname@upi" />
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Lock className="h-4 w-4" />
                  <span>Your payment is secured with 256-bit SSL encryption</span>
                </div>

                <Button 
                  className="w-full"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay ${booking?.totalAmount}</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={booking?.destination?.images?.[0]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200'}
                    alt=""
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{booking?.destination?.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      {booking?.destination?.location?.city}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID</span>
                    <span className="font-medium">{booking?.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="capitalize">{booking?.bookingType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travelers</span>
                    <span>{booking?.travelers?.length || 1}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-5 w-5" />
                      {booking?.totalAmount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
