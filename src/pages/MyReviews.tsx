import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reviewAPI } from '@/services/api';
import type { Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Star, Loader2, Edit, Trash2, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const MyReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getMyReviews();
      setReviews(response.data.reviews);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedReview) return;
    try {
      await reviewAPI.delete(selectedReview._id);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedReview(null);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
          <p className="text-gray-600">Manage your travel reviews and ratings</p>
        </div>

        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews yet</h3>
              <p className="text-gray-500 mb-4">Share your travel experiences with others</p>
              <Link to="/my-bookings">
                <Button>Write a Review</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img 
                          src={`https://source.unsplash.com/100x100/?travel,destination`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{review.destination}</h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating.overall ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setSelectedReview(review);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium">{review.title}</h4>
                    <p className="text-gray-600 mt-1">{review.review}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {review.helpful?.count} found helpful
                    </span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    {review.isVerified && (
                      <Badge>Verified Stay</Badge>
                    )}
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
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>Are you sure you want to delete this review?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyReviews;
