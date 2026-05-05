import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { destinationAPI } from '@/services/api';
import type { Destination } from '@/types';
import { 
  Search, 
  MapPin, 
  Star, 
  ArrowRight, 
  Sparkles,
  Calendar,
  Shield,
  Headphones,
  Plane,
  Palmtree,
  Mountain,
  Building2,
  Tent,
  AlertCircle
} from 'lucide-react';

const Home = () => {
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([]);
  const [featuredDestinations, setFeaturedDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/destinations?search=${encodeURIComponent(q)}` : '/destinations');
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const [popularRes, featuredRes] = await Promise.all([
        destinationAPI.getPopular(),
        destinationAPI.getFeatured()
      ]);
      setPopularDestinations(popularRes.data.destinations);
      setFeaturedDestinations(featuredRes.data.destinations);
      setBackendError(false);
    } catch (error: any) {
      console.error('Error fetching destinations:', error);
      if (error.code === 'ERR_NETWORK' || !error.response) {
        setBackendError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { name: 'Beach', icon: Palmtree, color: 'bg-blue-100 text-blue-600' },
    { name: 'Mountain', icon: Mountain, color: 'bg-green-100 text-green-600' },
    { name: 'City', icon: Building2, color: 'bg-purple-100 text-purple-600' },
    { name: 'Adventure', icon: Tent, color: 'bg-orange-100 text-orange-600' },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Algorithmic Planning',
      description: 'Get personalized travel recommendations based on your preferences and travel history.',
    },
    {
      icon: Calendar,
      title: 'Smart Itineraries',
      description: 'Create day-by-day itineraries automatically with our intelligent trip planner.',
    },
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Book with confidence using our secure payment system and verified partners.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Our travel experts are available round the clock to assist you.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center animate-slide-up">
          <Badge className="mb-4 bg-white/20 text-white border-0 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 mr-1" />
            Smart Algorithmic Planning
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Discover Your Next
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Adventure
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            Plan, book, and explore the world with personalized recommendations 
            powered by our intelligent travel engine.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Where do you want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-14 bg-white border-0 text-gray-900 placeholder:text-gray-500 rounded-lg w-full"
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-8 w-full sm:w-auto">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.name} 
                to={`/destinations?category=${category.name.toLowerCase()}`}
              >
                <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-white/50 dark:border-slate-800/50 group">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-lg dark:text-slate-100">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Backend Error Message */}
      {backendError && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-1">Backend Server Not Connected</h3>
                    <p className="text-amber-700 text-sm mb-3">
                      To see destinations and use login/signup features, you need to:
                    </p>
                    <ol className="text-amber-700 text-sm list-decimal list-inside space-y-1">
                      <li>Set up MongoDB Atlas (free cloud database)</li>
                      <li>Run the backend server locally</li>
                    </ol>
                    <p className="mt-3 text-amber-800 text-sm">
                      See <span className="font-mono">SETUP.md</span> in the repo for full instructions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Destinations</h2>
            <Link to="/destinations">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularDestinations.map((destination) => (
                <Link key={destination._id} to={`/destinations/${destination._id}`}>
                  <Card className="overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-white/50 dark:border-slate-800/50">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={destination.images[0]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-white/90 text-gray-900">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {Number(destination.rating.average).toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1 dark:text-slate-100">{destination.name}</h3>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {destination.location.city}, {destination.location.country}
                      </div>
                      <p className="text-blue-600 font-semibold">
                        ${destination.budgetRange.min} - ${destination.budgetRange.max}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose VoyageX?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge AI technology with travel expertise to deliver 
              unforgettable experiences tailored just for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={feature.title} className="text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-white/50 dark:border-slate-800/50" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-4 animate-float">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 dark:text-slate-100">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDestinations.slice(0, 3).map((destination) => (
              <Link key={destination._id} to={`/destinations/${destination._id}`}>
                <Card className="overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border-white/50 dark:border-slate-800/50">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={destination.images[0]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{destination.name}</h3>
                      <p className="text-sm opacity-90">
                        {destination.location.city}, {destination.location.country}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust VoyageX for their adventures. 
            Create your account today and get personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                <Plane className="h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
            <Link to="/destinations">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                Explore Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
