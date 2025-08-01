import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useReviews } from '../contexts/ReviewContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { Star, ThumbsUp, Verified, MessageSquare } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { getProductReviews, addReview, canUserReview, getAverageRating, getTotalReviews, markHelpful } = useReviews();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  const reviews = getProductReviews(productId);
  const averageRating = getAverageRating(productId);
  const totalReviews = getTotalReviews(productId);
  const canReview = user ? canUserReview(productId, user.id) : false;

  const handleSubmitReview = () => {
    if (!user) return;
    
    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      toast({
        title: "Review incomplete",
        description: "Please provide both a title and comment for your review.",
        variant: "destructive"
      });
      return;
    }

    addReview({
      productId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: reviewForm.rating,
      title: reviewForm.title,
      comment: reviewForm.comment,
      verified: true // In real app, this would be based on purchase history
    });

    toast({
      title: "Review submitted!",
      description: "Thank you for your feedback. Your review has been posted.",
    });

    setIsReviewDialogOpen(false);
    setReviewForm({ rating: 5, title: '', comment: '' });
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
                      <Label htmlFor="reviewTitle">Review Title</Label>
                      <Input
                        id="reviewTitle"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Summarize your experience"
                      />
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
                    {review.userAvatar ? (
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {review.userName.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.userName}</span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <Verified className="w-3 h-3 mr-1" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating, 'sm')}
                        <span className="text-sm text-gray-600">
                          {review.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h4 className="font-medium mb-2">{review.title}</h4>
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markHelpful(review.id)}
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Helpful ({review.helpful})
                        </Button>
                      </div>
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
                      <Label htmlFor="reviewTitle">Review Title</Label>
                      <Input
                        id="reviewTitle"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Summarize your experience"
                      />
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