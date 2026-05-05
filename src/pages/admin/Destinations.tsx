import { useEffect, useState } from 'react';
import { destinationAPI } from '@/services/api';
import type { Destination } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/AdminLayout';
import EmptyState from '@/components/EmptyState';
import { toast } from 'sonner';
import { Search, Loader2, Plus, Edit, Trash2, MapPin, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const AdminDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await destinationAPI.getAll({ limit: 100 });
      setDestinations(response.data.destinations);
    } catch (error) {
      toast.error('Failed to load destinations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDestination) return;
    try {
      await destinationAPI.delete(selectedDestination._id);
      toast.success('Destination deleted successfully');
      fetchDestinations();
    } catch (error) {
      toast.error('Failed to delete destination');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDestination(null);
    }
  };

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.location.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AdminPageHeader
        title="Destination Management"
        subtitle="Manage travel destinations"
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Destination
          </Button>
        }
      />
        <Card>
          <CardContent className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredDestinations.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title={searchQuery ? 'No destinations match your search' : 'No destinations yet'}
                description={searchQuery ? 'Try a different keyword.' : 'Create your first destination to get started.'}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDestinations.map((dest) => (
                  <Card key={dest._id} className="overflow-hidden">
                    <div className="relative h-40">
                      <img
                        src={dest.images[0]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400'}
                        alt={dest.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={dest.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {dest.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{dest.name}</h3>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {dest.location.city}, {dest.location.country}
                      </div>
                      <div className="flex items-center gap-4 text-sm mb-3">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {Number(dest.rating.average).toFixed(1)}
                        </span>
                        <span className="text-gray-500">{dest.visitCount} visits</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setSelectedDestination(dest);
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
          </CardContent>
        </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Destination</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedDestination?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDestinations;
