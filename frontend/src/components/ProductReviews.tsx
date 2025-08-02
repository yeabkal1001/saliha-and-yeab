import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useReviews, Review } from '../contexts/ReviewContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { Star, ThumbsUp, Verified, MessageSquare } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { getProductReviews, addReview, canUserReview } = useReviews();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const reviewsData = await getProductReviews(parseInt(productId));
        setReviews(reviewsData);
        
        // Calculate average rating
        if (reviewsData.length > 0) {
          const total = reviewsData.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(total / reviewsData.length);
        }
        setTotalReviews(reviewsData.length);
        
        if (user) {
          const canReviewData = await canUserReview(parseInt(productId));
          setCanReview(canReviewData);
        }
      } catch (error) {
        console.error('Failed to load reviews:', error);
      }
    };
    loadReviews();
  }, [productId, user, getProductReviews, canUserReview]);

  const handleSubmitReview = () => {
    if (!user) return;
    
    if (!reviewForm.comment.trim()) {
      toast({
        title: "Review incomplete",
        description: "Please provide a comment for your review.",
        variant: "destructive"
      });
      return;
    }

    addReview(parseInt(productId), {
      rating: reviewForm.rating,
      comment: reviewForm.comment
    });

    toast({
      title: "Review submitted!",
      description: "Thank you for your feedback. Your review has been posted.",
    });

    setIsReviewDialogOpen(false);
    setReviewForm({ rating: 5, comment: '' });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
              </div>
              {averageRating > 0 && (
                <>
                  {renderStars(averageRating, 'lg')}
                  <p className="text-gray-600 mt-2">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
                </>
              )}
            </div>

            {/* Rating Distribution */}
            {totalReviews > 0 && (
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-8">{rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${totalReviews > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <span className="text-sm w-8 text-gray-600">
                      {ratingDistribution[rating as keyof typeof ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write Review Button */}
          {canReview && (
            <div className="mt-6 text-center">
              <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Write a Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Write Your Review</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Rating</Label>
                      <div className="flex items-center gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setReviewForm(prev => ({ ...prev, rating }))}
                            className="p-1"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                rating <= reviewForm.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 hover:text-yellow-400'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {reviewForm.rating} star{reviewForm.rating !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="reviewComment">Your Review</Label>
                      <Textarea
                        id="reviewComment"
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Tell others about your experience with this product"
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleSubmitReview} className="flex-1">
                        Submit Review
                      </Button>
                      <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {review.user.name.charAt(0)}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.user.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating, 'sm')}
                        <span className="text-sm text-gray-600">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {reviews.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-4">Be the first to review this product!</p>
            {canReview && (
              <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Write the First Review</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Write Your Review</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Rating</Label>
                      <div className="flex items-center gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setReviewForm(prev => ({ ...prev, rating }))}
                            className="p-1"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                rating <= reviewForm.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 hover:text-yellow-400'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {reviewForm.rating} star{reviewForm.rating !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="reviewComment">Your Review</Label>
                      <Textarea
                        id="reviewComment"
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Tell others about your experience with this product"
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleSubmitReview} className="flex-1">
                        Submit Review
                      </Button>
                      <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};