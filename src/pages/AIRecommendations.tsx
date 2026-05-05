import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Sparkles, MapPin, Star, Lightbulb, Loader2, ArrowRight, Plane } from 'lucide-react';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await aiAPI.getRecommendations();
      setRecommendations(response.data.recommendations);
    } catch (error) {
      toast.error('Failed to load recommendations');
    } finally {
      setIsLoading(false);
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
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-100 text-purple-800">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <h1 className="text-3xl font-bold mb-2">Personalized For You</h1>
          <p className="text-gray-600">Based on your preferences and travel history</p>
        </div>

        {/* Destinations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            Recommended Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations?.destinations?.map((dest: any, idx: number) => (
              <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={`https://source.unsplash.com/400x300/?${dest.name},travel`}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/90 text-gray-900">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      4.5
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{dest.name}</h3>
                  <p className="text-gray-500 text-sm">{dest.country}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {dest.highlights?.slice(0, 2).map((h: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">{h}</Badge>
                    ))}
                  </div>
                  <Link to="/destinations">
                    <Button variant="outline" size="sm" className="w-full mt-4 gap-1">
                      Explore <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )) || (
              <Card className="col-span-3 p-8 text-center">
                <Plane className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No recommendations available yet. Start exploring destinations!</p>
              </Card>
            )}
          </div>
        </div>

        {/* Activities */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Recommended Activities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommendations?.activities?.map((activity: string, idx: number) => (
              <Card key={idx} className="text-center p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium text-sm">{activity}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              Travel Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations?.tips?.map((tip: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm">{idx + 1}</span>
                  </div>
                  <p className="text-blue-100">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">Ready to plan your trip?</h3>
          <Link to="/itinerary-planner">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Create AI Itinerary
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
