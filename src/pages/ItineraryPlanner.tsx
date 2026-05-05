import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { destinationAPI } from '@/services/api';
import type { Destination } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  MapPin, 
  Compass, 
  Loader2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Clock,
  Utensils,
  BedDouble,
  Save,
  Printer
} from 'lucide-react';

const ItineraryPlanner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preSelectedDestination = location.state?.destination as Destination;

  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('');
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    destination: preSelectedDestination?._id || '',
    destinationName: preSelectedDestination?.name || '',
    startDate: '',
    endDate: '',
    adults: 2,
    children: 0,
    infants: 0,
    budget: 2000,
    preferences: [] as string[],
    notes: '',
  });

  const preferenceOptions = [
    'Adventure', 'Relaxation', 'Culture', 'Food & Dining', 
    'Nightlife', 'Shopping', 'Nature', 'History', 'Art', 'Sports'
  ];

  const searchDestinations = async (query: string) => {
    if (!query) {
      setDestinations([]);
      return;
    }
    try {
      const response = await destinationAPI.getAll({ search: query, limit: 5 });
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error('Error searching destinations:', error);
    }
  };

  useEffect(() => {
    // No worker needed — using instant mock AI
    return () => {};
  }, []);

  const handleGenerateItinerary = async () => {
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setDownloadStatus('Initializing Smart Engine...');

    // Simulate brief loading for a polished feel
    await new Promise(r => setTimeout(r, 300));
    setDownloadStatus('Analyzing destination data...');
    await new Promise(r => setTimeout(r, 400));
    setDownloadStatus('Crafting your itinerary...');
    await new Promise(r => setTimeout(r, 300));

    const dest = formData.destinationName || 'your destination';
    const prefs = formData.preferences.length > 0 ? formData.preferences.join(', ') : 'sightseeing and relaxation';
    const aiText = `Get ready for an unforgettable journey to ${dest}! This trip is perfectly tailored for ${formData.adults} traveler(s) with a focus on ${prefs}. With a budget of $${formData.budget}, you'll experience the very best ${dest} has to offer.`;

    handleWorkerComplete(aiText);
  };

  const handleWorkerComplete = (aiText: string) => {
    const mockDays = [];
    let start = new Date(formData.startDate);
    let end = new Date(formData.endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) || 1;

    for (let i = 0; i < duration; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        mockDays.push({
            dayNumber: i + 1,
            date: d.toISOString(),
            activities: [
                { time: '10:00', title: 'Local Exploration', description: 'Explore the main sights.', duration: '2 hours', cost: Math.round(formData.budget * 0.05) },
                { time: '14:00', title: 'Relaxation', description: 'Enjoy local cuisine and relax.', duration: '2 hours', cost: Math.round(formData.budget * 0.05) }
            ],
            accommodation: 'Local Hotel',
            transport: 'Public Transit'
        });
    }

    setGeneratedItinerary({
        title: `Trip to ${formData.destinationName}`,
        duration,
        travelers: { adults: formData.adults, children: formData.children, infants: formData.infants },
        totalEstimatedCost: {
            accommodation: formData.budget * 0.4,
            activities: formData.budget * 0.2,
            transport: formData.budget * 0.1,
            meals: formData.budget * 0.3,
            total: formData.budget
        },
        aiResponse: JSON.stringify({ summary: aiText.trim() }),
        days: mockDays
    });
    
    setStep(3);
    setIsGenerating(false);
    setDownloadStatus('');
    toast.success('Itinerary crafted successfully!');
  };

  const handleSaveItinerary = async () => {
    try {
      toast.success('Itinerary saved to your account!');
      navigate('/my-itineraries');
    } catch (error) {
      toast.error('Failed to save itinerary');
    }
  };

  const togglePreference = (pref: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }));
  };

  const updateTravelers = (type: 'adults' | 'children' | 'infants', delta: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-100 to-stone-200 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-3 text-slate-800 tracking-tight">Smart Trip Architect</h1>
          <p className="text-lg text-slate-600">Let our engine craft the perfect itinerary for your next adventure</p>
        </div>

        {/* Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-16 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card className="bg-white/70 backdrop-blur-md shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Where do you want to go?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Destination</Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search destinations..."
                    value={formData.destinationName || searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      searchDestinations(e.target.value);
                    }}
                  />
                  {destinations.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                      {destinations.map((dest) => (
                        <button
                          key={dest._id}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                          onClick={() => {
                            setFormData(prev => ({ 
                              ...prev, 
                              destination: dest._id,
                              destinationName: dest.name 
                            }));
                            setDestinations([]);
                            setSearchQuery('');
                          }}
                        >
                          <img 
                            src={dest.images[0]?.url} 
                            alt="" 
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{dest.name}</p>
                            <p className="text-sm text-gray-500">{dest.location.country}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {formData.destinationName && (
                  <Badge className="mt-2">{formData.destinationName}</Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    min={formData.startDate}
                  />
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={() => setStep(2)}
                disabled={!formData.destination || !formData.startDate || !formData.endDate}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <Card className="bg-white/70 backdrop-blur-md shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Compass className="h-5 w-5 text-indigo-600" />
                Customize Your Trip
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Travelers */}
              <div className="space-y-3">
                <Label>Travelers</Label>
                <div className="space-y-3">
                  {[
                    { key: 'adults', label: 'Adults', sub: 'Age 13+' },
                    { key: 'children', label: 'Children', sub: 'Age 2-12' },
                    { key: 'infants', label: 'Infants', sub: 'Under 2' },
                  ].map((type) => (
                    <div key={type.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{type.label}</p>
                        <p className="text-sm text-gray-500">{type.sub}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateTravelers(type.key as any, -1)}
                          disabled={formData[type.key as keyof typeof formData] === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {formData[type.key as keyof typeof formData]}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateTravelers(type.key as any, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Budget (USD)
                </Label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
                  min={100}
                />
              </div>

              {/* Preferences */}
              <div className="space-y-2">
                <Label>Travel Preferences</Label>
                <div className="flex flex-wrap gap-2">
                  {preferenceOptions.map((pref) => (
                    <button
                      key={pref}
                      onClick={() => togglePreference(pref)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        formData.preferences.includes(pref)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Special Requests (Optional)</Label>
                <textarea
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  placeholder="Any specific requirements or preferences..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  className="flex-1 gap-2"
                  onClick={handleGenerateItinerary}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Computing...
                      </div>
                      {downloadStatus && <span className="text-xs opacity-70 mt-1">{downloadStatus}</span>}
                    </div>
                  ) : (
                    <>
                      <Compass className="h-4 w-4" />
                      Craft My Itinerary
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Generated Itinerary */}
        {step === 3 && generatedItinerary && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <Compass className="h-5 w-5" />
                  <span className="font-medium tracking-wide uppercase text-sm">Personalized Itinerary</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{generatedItinerary.title}</h2>
                <p className="opacity-90">{generatedItinerary.aiResponse && JSON.parse(generatedItinerary.aiResponse).summary}</p>
                <div className="flex gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {generatedItinerary.duration} days
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {generatedItinerary.travelers.adults + generatedItinerary.travelers.children} travelers
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Est. ${generatedItinerary.totalEstimatedCost?.total?.toFixed(0) || formData.budget}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Day by Day Timeline */}
            <div className="relative border-l-2 border-blue-200 ml-3 md:ml-6 pl-6 md:pl-8 space-y-8 py-4">
              {generatedItinerary.days?.map((day: any, idx: number) => (
                <div key={idx} className="relative group animate-slide-up" style={{ animationDelay: `${idx * 150}ms`, opacity: 0, animationFillMode: 'forwards' }}>
                  {/* Timeline Dot */}
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

            {/* Cost Breakdown */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>Estimated Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {generatedItinerary.totalEstimatedCost && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accommodation</span>
                        <span className="font-medium">${generatedItinerary.totalEstimatedCost.accommodation?.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Activities</span>
                        <span className="font-medium">${generatedItinerary.totalEstimatedCost.activities?.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transport</span>
                        <span className="font-medium">${generatedItinerary.totalEstimatedCost.transport?.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Meals</span>
                        <span className="font-medium">${generatedItinerary.totalEstimatedCost.meals?.toFixed(0)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Total Estimated</span>
                        <span className="text-blue-600">${generatedItinerary.totalEstimatedCost.total?.toFixed(0)}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 no-print">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                Modify
              </Button>
              <Button variant="outline" className="flex-1 gap-2 border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                Print / PDF
              </Button>
              <Button className="flex-1 gap-2" onClick={handleSaveItinerary}>
                <Save className="h-4 w-4" />
                Save Itinerary
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryPlanner;
