import { useEffect, useState } from 'react';
import { reviewAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/AdminLayout';
import EmptyState from '@/components/EmptyState';
import { toast } from 'sonner';
import { Star, MessageSquare, Loader2 } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getAll();
      setReviews(response.data.reviews);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  // Admin response handler - can be used for future implementation
  /* const handleAdminResponse = async (reviewId: string, response: string) => {
    try {
      await reviewAPI.adminResponse(reviewId, { response });
      toast.success('Response added successfully');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to add response');
    }
  }; */

  return (
    <>
      <AdminPageHeader title="Review Management" subtitle="Manage user reviews" />
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : reviews.length === 0 ? (
              <EmptyState
                icon={Star}
                title="No reviews yet"
                description="Reviews from travelers will appear here."
              />
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b pb-6 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{review.user?.firstName} {review.user?.lastName}</p>
                          <p className="text-sm text-gray-500">{review.destination?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating.overall ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4 className="font-semibold">{review.title}</h4>
                      <p className="text-gray-600 mt-1">{review.review}</p>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {review.helpful?.count} helpful
                      </span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      {review.isVerified && (
                        <Badge variant="default">Verified</Badge>
                      )}
                    </div>
                    {review.adminResponse?.response && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Admin Response:</p>
                        <p className="text-sm text-blue-700 mt-1">{review.adminResponse.response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
    </>
  );
};

export default AdminReviews;
