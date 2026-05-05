import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { destinationAPI } from '@/services/api';
import type { Destination } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import EmptyState from '@/components/EmptyState';
import { 
  Search, 
  MapPin, 
  Star, 
  X,
  SlidersHorizontal
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Destinations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    country: searchParams.get('country') || '',
    minBudget: searchParams.get('minBudget') || '',
    maxBudget: searchParams.get('maxBudget') || '',
    sortBy: searchParams.get('sortBy') || 'rating',
  });

  useEffect(() => {
    fetchCategoriesAndCountries();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchDestinations();
    }, 300);
    return () => clearTimeout(t);
  }, [filters, currentPage]);

  const fetchCategoriesAndCountries = async () => {
    try {
      const [categoriesRes, countriesRes] = await Promise.all([
        destinationAPI.getCategories(),
        destinationAPI.getCountries()
      ]);
      setCategories(categoriesRes.data.categories);
      setCountries(countriesRes.data.countries);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const fetchDestinations = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 12,
        sortBy: filters.sortBy,
        order: 'desc'
      };

      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.country) params.country = filters.country;
      if (filters.minBudget) params.minBudget = filters.minBudget;
      if (filters.maxBudget) params.maxBudget = filters.maxBudget;

      const response = await destinationAPI.getAll(params);
      console.log('API Response:', response.data);
      setDestinations(response.data?.destinations || []);
      setTotalPages(response.data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setDestinations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    // Treat 'all' (Select sentinel) as cleared
    const normalized = value === 'all' ? '' : value;
    setFilters(prev => ({ ...prev, [key]: normalized }));
    setCurrentPage(1);

    const newParams = new URLSearchParams(searchParams);
    if (normalized) {
      newParams.set(key, normalized);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      country: '',
      minBudget: '',
      maxBudget: '',
      sortBy: 'rating',
    });
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = filters.category || filters.country || filters.minBudget || filters.maxBudget;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-100 to-stone-200 dark:from-slate-950 dark:via-zinc-900 dark:to-stone-950 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold mb-3 text-slate-800 dark:text-slate-100 tracking-tight">Explore Destinations</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Discover amazing places around the world</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search destinations..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="visitCount">Most Popular</SelectItem>
                <SelectItem value="budgetRange.min">Price: Low to High</SelectItem>
                <SelectItem value="budgetRange.max">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1">
                      Active
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select 
                      value={filters.category || 'all'} 
                      onValueChange={(value) => handleFilterChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Country</label>
                    <Select 
                      value={filters.country || 'all'} 
                      onValueChange={(value) => handleFilterChange('country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Budget Range</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min $"
                        value={filters.minBudget}
                        onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max $"
                        value={filters.maxBudget}
                        onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                      />
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={clearFilters}
                    >
                      <X className="h-4 w-4" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <Badge variant="secondary" className="gap-1">
                  Category: {filters.category}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('category', '')}
                  />
                </Badge>
              )}
              {filters.country && (
                <Badge variant="secondary" className="gap-1">
                  Country: {filters.country}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('country', '')}
                  />
                </Badge>
              )}
              {(filters.minBudget || filters.maxBudget) && (
                <Badge variant="secondary" className="gap-1">
                  Budget: ${filters.minBudget || '0'} - ${filters.maxBudget || '∞'}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => {
                      handleFilterChange('minBudget', '');
                      handleFilterChange('maxBudget', '');
                    }}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Destinations Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No destinations found"
            description="Try adjusting your filters or clearing your search."
            action={hasActiveFilters || filters.search ? (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" /> Clear filters
              </Button>
            ) : undefined}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {destinations.map((destination) => (
                <Link key={destination._id} to={`/destinations/${destination._id}`}>
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/50 dark:border-slate-800/50 hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={destination.images[0]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
                        <Badge className="bg-white/90 text-gray-900 shadow-sm backdrop-blur-sm">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {Number(destination.rating.average).toFixed(1)}
                        </Badge>
                        {destination.rating.average >= 4.8 && (
                          <Badge className="bg-orange-500/90 text-white shadow-sm backdrop-blur-sm border-0">
                            🔥 Trending
                          </Badge>
                        )}
                      </div>
                      {destination.category[0] && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-indigo-600/90 text-white shadow-sm backdrop-blur-sm border-0 capitalize tracking-wide">
                            {destination.category[0]}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1 dark:text-slate-100">{destination.name}</h3>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {destination.location.city}, {destination.location.country}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                        {destination.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-blue-600 font-semibold">
                          ${destination.budgetRange.min} - ${destination.budgetRange.max}
                        </p>
                        <span className="text-xs text-gray-500">
                          {destination.rating.count} reviews
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Destinations;
