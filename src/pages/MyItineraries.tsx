import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { itineraryAPI } from '@/services/api';
import type { Itinerary } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar, MapPin, Users, DollarSign, Sparkles, Loader2, Eye, Trash2, Plane, Clock, Utensils, BedDouble, Printer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const MyItineraries = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [viewItinerary, setViewItinerary] = useState<Itinerary | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await itineraryAPI.getMyItineraries();
      setItineraries(response.data.itineraries);
    } catch (error) {
      toast.error('Failed to load itineraries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItinerary) return;
    try {
      await itineraryAPI.delete(selectedItinerary._id);
      toast.success('Itinerary deleted');
      fetchItineraries();
    } catch (error) {
      toast.error('Failed to delete itinerary');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItinerary(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      planned: 'bg-blue-100 text-blue-800',
      booked: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Itineraries</h1>
            <p className="text-gray-600">View and manage your travel plans</p>
          </div>
          <Link to="/itinerary-planner">
            <Button className="gap-2">
              <Sparkles className="h-4 w-4" />
              Create New
            </Button>
          </Link>
        </div>

        {itineraries.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Plane className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No itineraries yet</h3>
              <p className="text-gray-500 mb-4">Create your first travel plan with our AI</p>
              <Link to="/itinerary-planner">
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Plan a Trip
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {itineraries.map((itinerary, idx) => (
              <Card key={itinerary._id} className="overflow-hidden animate-slide-up" style={{ animationDelay: `${idx * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}>
                <div className="relative h-48">
                  <img
                    src={itinerary.destination?.images?.[0]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400'}
                    alt={itinerary.destination?.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusBadge(itinerary.status)}>
                      {itinerary.status}
                    </Badge>
                  </div>
                  {itinerary.aiGenerated && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-purple-600 text-white">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Auto-Planned
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{itinerary.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {itinerary.destination?.name}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {itinerary.duration} days
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      {itinerary.travelers.adults + itinerary.travelers.children} travelers
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      Est. ${itinerary.totalEstimatedCost?.total?.toFixed(0) || itinerary.budget?.total}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-1"
                      onClick={() => setViewItinerary(itinerary)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        setSelectedItinerary(itinerary);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Itinerary</DialogTitle>
            <DialogDescription>Are you sure you want to delete this itinerary?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewItinerary} onOpenChange={(open) => !open && setViewItinerary(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between no-print">
            <DialogTitle className="text-2xl">{viewItinerary?.title}</DialogTitle>
            <Button variant="outline" size="sm" className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 mr-8" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Print / PDF
            </Button>
          </DialogHeader>
          {viewItinerary && (
            <div className="mt-4">
              <div className="relative border-l-2 border-blue-200 ml-3 md:ml-6 pl-6 md:pl-8 space-y-8 py-4">
                {viewItinerary.days?.map((day: any, idx: number) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[35px] md:-left-[43px] top-6 w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-600 border-4 border-white shadow-sm transition-transform group-hover:scale-125 group-hover:bg-indigo-600" />
                    
                    <Card className="bg-white/95 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden">
                      <CardHeader className="pb-3 border-b bg-slate-50/50">
                        <CardTitle className="text-lg flex items-center justify-between text-slate-800">
                          <span className="flex items-center gap-2 font-bold">
                            <span className="text-blue-600">Day {day.dayNumber}</span>
                          </span>
                          <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                            {new Date(day.date).toLocaleDateString()}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        {day.activities?.map((activity: any, actIdx: number) => (
                          <div key={actIdx} className="flex gap-4 p-3 hover:bg-blue-50/50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                            <div className="flex-shrink-0 w-16 text-center">
                              <div className="bg-blue-100 text-blue-700 text-xs font-bold py-1 px-2 rounded-md mb-1 inline-block">
                                {activity.time}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800">{activity.title}</h4>
                              <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                              <div className="flex items-center gap-3 mt-2 text-xs font-medium">
                                <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                  <Clock className="h-3 w-3" /> {activity.duration}
                                </span>
                                {activity.cost > 0 && (
                                  <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                    <DollarSign className="h-3 w-3" /> {activity.cost}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="flex gap-4 pt-3 mt-2 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <Utensils className="h-4 w-4 text-orange-500" />
                            <span>Meals Included</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <BedDouble className="h-4 w-4 text-indigo-500" />
                            <span>{day.accommodation}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyItineraries;
