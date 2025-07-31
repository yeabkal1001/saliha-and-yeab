import React, { createContext, useContext, useState, ReactNode } from 'react';
import api from '../lib/api';

interface User {
  id: number;
  name: string;
}

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: User;
}

interface ProductRating {
  average_rating: number;
  total_reviews: number;
}

interface ReviewContextType {
  getProductReviews: (productId: number) => Promise<Review[]>;
  addReview: (productId: number, reviewData: { rating: number; comment: string }) => Promise<void>;
  canUserReview: (productId: number) => Promise<boolean>;
  getProductRating: (productId: number) => Promise<ProductRating>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};

interface ReviewProviderProps {
  children: ReactNode;
}

export const ReviewProvider: React.FC<ReviewProviderProps> = ({ children }) => {
  const getProductReviews = async (productId: number): Promise<Review[]> => {
    const response = await api.get(`/api/v1/products/${productId}/reviews`);
    return response.data.reviews;
  };

  const addReview = async (productId: number, reviewData: { rating: number; comment: string }) => {
    await api.post(`/api/v1/products/${productId}/reviews`, reviewData);
  };

  const canUserReview = async (productId: number): Promise<boolean> => {
    try {
      const response = await api.get(`/api/v1/products/${productId}/can_review`);
      return response.data.can_review;
    } catch (error) {
      return false;
    }
  };

  const getProductRating = async (productId: number): Promise<ProductRating> => {
    const response = await api.get(`/api/v1/products/${productId}/rating`);
    return response.data.rating;
  };

  const value = {
    getProductReviews,
    addReview,
    canUserReview,
    getProductRating,
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
}; 