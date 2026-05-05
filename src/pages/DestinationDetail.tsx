import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { destinationAPI, bookingAPI, reviewAPI } from '@/services/api';
import type { Destination, Review } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  MapPin, 
  Star, 
  Calendar, 
  DollarSign, 
  Thermometer,
  Clock,
  Bus,
  Plane,
  Hotel,
  Utensils,
  Camera,
  ArrowLeft,
  Heart,
  Share2,
  Loader2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { CurrencyConverter } from '@/components/CurrencyConverter';
import { WeatherWidget } from '@/components/WeatherWidget';

const DestinationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [searchStep, setSearchStep] = useState(0);

  // Review State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDestination();
    }
  }, [id]);

  const fetchDestination = async () => {
    setIsLoading(true);
    try {
      const response = await destinationAPI.getById(id!);
      setDestination(response.data.destination);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching destination:', error);
      toast.error('Failed to load destination');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanTrip = () => {
    if (!isAuthenticated) {
      toast.info('Please login to plan your trip');
      navigate('/login');
      return;
    }
    navigate('/itinerary-planner', { state: { destination } });
  };

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to book a trip');
      navigate('/login');
      return;
    }
    setIsBooking(true);
    setSearchStep(1);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setSearchStep(2);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSearchStep(3);
      await new Promise(resolve => setTimeout(resolve, 1200));

      const response = await bookingAPI.create({
        destination: destination?._id || '',
        bookingType: 'package',
        travelers: [{ firstName: 'Guest', lastName: 'User' }],
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        totalAmount: destination?.budgetRange?.min || 0,
      });
      navigate(`/payment/${response.data.booking._id}`);
    } catch (error: any) {
      toast.error('Failed to initiate booking: ' + (error.response?.data?.message || error.message));
      setIsBooking(false);
      setSearchStep(0);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Destination not found</h2>
          <Link to="/destinations">
            <Button>Browse Destinations</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (destination) {
      setActiveImage((prev) => (prev + 1) % destination.images.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (destination) {
      setActiveImage((prev) => (prev - 1 + destination.images.length) % destination.images.length);
    }
  };

  const submitReview = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to write a review');
      navigate('/login');
      return;
    }
    if (!reviewTitle || !reviewText) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const response = await reviewAPI.create({
        destination: destination?._id,
        booking: null, // Optional in this context
        rating: {
          overall: reviewRating,
          location: reviewRating,
          amenities: reviewRating,
          valueForMoney: reviewRating,
        },
        title: reviewTitle,
        review: reviewText,
      });
      toast.success('Review submitted successfully!');
      setReviews([response.data.review, ...reviews]);
      setIsReviewModalOpen(false);
      setReviewTitle('');
      setReviewText('');
      setReviewRating(5);
    } catch (error: any) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const searchStepsConfig = [
    { text: "Scanning 400+ airlines...", icon: Plane },
    { text: "Finding best hotel rates...", icon: Hotel },
    { text: "Securing your package...", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Flight Search Simulation Modal */}
      {searchStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
          <div className="text-center p-8 max-w-sm w-full">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                {searchStep === 1 && <Plane className="h-8 w-8 text-blue-600 animate-pulse" />}
                {searchStep === 2 && <Hotel className="h-8 w-8 text-blue-600 animate-pulse" />}
                {searchStep === 3 && <Sparkles className="h-8 w-8 text-blue-600 animate-pulse" />}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchStepsConfig[searchStep - 1].text}
            </h3>
            <p className="text-sm text-gray-500">Please don't close this window.</p>
          </div>
        </div>
      )}

      {/* Full-Screen Lightbox */}
      {isLightboxOpen && destination && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center backdrop-blur-md">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
          >
            <X className="h-8 w-8" />
          </button>
          
          <button 
            onClick={prevImage}
            className="absolute left-4 sm:left-10 text-white/50 hover:text-white p-2"
          >
            <ChevronLeft className="h-12 w-12" />
          </button>
          
          <img 
            src={destination.images[activeImage]?.url} 
            alt="Fullscreen View" 
            className="max-w-[90vw] max-h-[90vh] object-contain select-none"
          />

          <button 
            onClick={nextImage}
            className="absolute right-4 sm:right-10 text-white/50 hover:text-white p-2"
          >
            <ChevronRight className="h-12 w-12" />
          </button>

          {/* Lightbox Thumbnails */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
            {destination.images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setActiveImage(idx); }}
                className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImage === idx ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-[500px]">
        <img
          src={destination.images[activeImage]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200'}
          alt={destination.name}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-700 hover:scale-105"
          onClick={() => setIsLightboxOpen(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Button 
            variant="secondary" 
            size="icon"
            onClick={() => navigate(-1)}
            className="bg-white/90 hover:bg-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="icon"
              className="bg-white/90 hover:bg-white"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon"
              className="bg-white/90 hover:bg-white"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {destination.category.map((cat) => (
                <Badge key={cat} className="bg-white/20 backdrop-blur-sm">
                  {cat}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 animate-fade-in">{destination.name}</h1>
            <div className="flex items-center gap-2 sm:gap-4 text-sm sm:text-lg animate-slide-up">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                {destination.location.city}, {destination.location.country}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                {Number(destination.rating.average).toFixed(1)} ({destination.rating.count} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Image Thumbnails */}
        {destination.images.length > 1 && (
          <div className="hidden md:flex absolute bottom-4 right-4 gap-2">
            {destination.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImage === idx ? 'border-white' : 'border-transparent opacity-70'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 animate-slide-up">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="attractions">Attractions</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">About {destination.name}</h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {destination.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <DollarSign className="h-6 w-6 mx-auto text-green-600 mb-2" />
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="font-semibold">${destination.budgetRange.min}-${destination.budgetRange.max}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Calendar className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                        <p className="text-sm text-gray-500">Best Season</p>
                        <p className="font-semibold">{destination.bestSeason.join(', ')}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Thermometer className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                        <p className="text-sm text-gray-500">Climate</p>
                        <p className="font-semibold">{destination.weather?.climate || 'Moderate'}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Clock className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                        <p className="text-sm text-gray-500">Timezone</p>
                        <p className="font-semibold">Local Time</p>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3">Transportation</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Plane className="h-5 w-5 text-blue-600" />
                        <span>Nearest Airport: {destination.transport?.nearestAirport || 'International Airport'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Bus className="h-5 w-5 text-green-600" />
                        <span>Local Transport: {destination.transport?.localTransport?.join(', ') || 'Taxi, Bus, Metro'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Popular Activities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {destination.activities?.map((activity, idx) => (
                        <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={activity.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200'} 
                              alt={activity.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">{activity.name}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{activity.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-sm">
                              <span className="text-blue-600 font-medium">${activity.price}</span>
                              <span className="text-gray-500">{activity.duration}</span>
                            </div>
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-500 col-span-2">No activities listed yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attractions" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Top Attractions</h2>
                    <div className="space-y-4">
                      {destination.attractions?.map((attraction, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <Camera className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-semibold">{attraction.name}</h3>
                            <p className="text-sm text-gray-600">{attraction.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-sm">
                              <span className="text-gray-500">Type: {attraction.type}</span>
                              {attraction.entryFee && (
                                <span className="text-green-600">Entry: ${attraction.entryFee}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-500">No attractions listed yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold">Traveler Reviews</h2>
                      <Button variant="outline" onClick={() => setIsReviewModalOpen(true)}>Write a Review</Button>
                    </div>
                    <div className="space-y-4">
                      {reviews.length > 0 ? reviews.map((review) => (
                        <div key={review._id} className="border-b pb-4 last:border-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {review.user.firstName[0]}{review.user.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{review.user.firstName} {review.user.lastName}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${i < review.rating.overall ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <h4 className="font-semibold mb-1">{review.title}</h4>
                          <p className="text-gray-600">{review.review}</p>
                        </div>
                      )) : (
                        <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {/* Booking Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-gray-500 mb-1">Starting from</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${destination.budgetRange.min}
                  </p>
                  <p className="text-sm text-gray-500">per person</p>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
                    onClick={handleBookNow}
                    disabled={isBooking}
                  >
                    {isBooking ? <Loader2 className="h-4 w-4 animate-spin" /> : <DollarSign className="h-4 w-4" />}
                    Book Now
                  </Button>
                  <Button 
                    className="w-full gap-2"
                    variant="secondary"
                    onClick={handlePlanTrip}
                  >
                    <Sparkles className="h-4 w-4" />
                    Auto-Plan Trip
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/destinations')}
                  >
                    Browse More
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Hotel className="h-5 w-5 text-gray-400" />
                    <span>Hotels available</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Utensils className="h-5 w-5 text-gray-400" />
                    <span>Restaurant guides</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Bus className="h-5 w-5 text-gray-400" />
                    <span>Transport options</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Widget */}
            <WeatherWidget climate={destination.weather?.climate || 'Moderate'} />

            {/* Currency Converter */}
            <CurrencyConverter usdAmount={destination.budgetRange.min} />

            {/* Accommodations */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Recommended Stays</h3>
                <div className="space-y-3">
                  {destination.accommodations?.slice(0, 3).map((hotel, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{hotel.name}</p>
                        <p className="text-xs text-gray-500">{hotel.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">${hotel.pricePerNight}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{hotel.rating}</span>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500">No accommodations listed.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Write a Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review for {destination?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer transition-colors ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setReviewRating(star)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Brief summary of your experience"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Your Review</label>
              <textarea
                className="w-full p-2 border rounded-md min-h-[100px]"
                placeholder="Tell us about your trip..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
            <Button onClick={submitReview} disabled={isSubmittingReview}>
              {isSubmittingReview ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DestinationDetail;
