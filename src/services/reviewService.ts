import { supabase } from '../utils/supabaseClient';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  title: string;
  content: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  content: string;
  is_verified_purchase?: boolean;
  images?: string[];
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  verified_purchases: number;
  with_images: number;
}

// Get reviews for a specific product
export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles!reviews_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching product reviews:', error);
      return [];
    }

    return data?.map((review: any) => ({
      id: review.id,
      product_id: review.product_id,
      user_id: review.user_id,
      user_name: review.profiles?.full_name || 'Anonymous',
      user_avatar: review.profiles?.avatar_url,
      rating: review.rating,
      title: review.title,
      content: review.content,
      is_verified_purchase: review.is_verified_purchase,
      is_approved: review.is_approved,
      helpful_count: review.helpful_count,
      images: review.images || [],
      created_at: review.created_at,
      updated_at: review.updated_at
    })) || [];
  } catch (err) {
    console.error('Error fetching product reviews:', err);
    return [];
  }
}

// Get all reviews (for admin)
export async function getAllReviews(): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles!reviews_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all reviews:', error);
      return [];
    }

    return data?.map((review: any) => ({
      id: review.id,
      product_id: review.product_id,
      user_id: review.user_id,
      user_name: review.profiles?.full_name || 'Anonymous',
      user_avatar: review.profiles?.avatar_url,
      rating: review.rating,
      title: review.title,
      content: review.content,
      is_verified_purchase: review.is_verified_purchase,
      is_approved: review.is_approved,
      helpful_count: review.helpful_count,
      images: review.images || [],
      created_at: review.created_at,
      updated_at: review.updated_at
    })) || [];
  } catch (err) {
    console.error('Error fetching all reviews:', err);
    return [];
  }
}

// Get reviews by user
export async function getUserReviews(userId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles!reviews_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user reviews:', error);
      return [];
    }

    return data?.map((review: any) => ({
      id: review.id,
      product_id: review.product_id,
      user_id: review.user_id,
      user_name: review.profiles?.full_name || 'Anonymous',
      user_avatar: review.profiles?.avatar_url,
      rating: review.rating,
      title: review.title,
      content: review.content,
      is_verified_purchase: review.is_verified_purchase,
      is_approved: review.is_approved,
      helpful_count: review.helpful_count,
      images: review.images || [],
      created_at: review.created_at,
      updated_at: review.updated_at
    })) || [];
  } catch (err) {
    console.error('Error fetching user reviews:', err);
    return [];
  }
}

// Create a new review
export async function createReview(reviewData: CreateReviewData): Promise<Review | null> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id: reviewData.product_id,
        user_id: reviewData.user_id,
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
        is_verified_purchase: reviewData.is_verified_purchase || false,
        images: reviewData.images || [],
        is_approved: false, // Reviews need approval by default
        helpful_count: 0
      })
      .select(`
        *,
        profiles!reviews_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error creating review:', error);
      throw error;
    }

    return {
      id: data.id,
      product_id: data.product_id,
      user_id: data.user_id,
      user_name: data.profiles?.full_name || 'Anonymous',
      user_avatar: data.profiles?.avatar_url,
      rating: data.rating,
      title: data.title,
      content: data.content,
      is_verified_purchase: data.is_verified_purchase,
      is_approved: data.is_approved,
      helpful_count: data.helpful_count,
      images: data.images || [],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (err) {
    console.error('Error creating review:', err);
    throw err;
  }
}

// Update review approval status (admin only)
export async function updateReviewApproval(reviewId: string, isApproved: boolean): Promise<Review | null> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .update({ 
        is_approved: isApproved,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select(`
        *,
        profiles!reviews_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error updating review approval:', error);
      throw error;
    }

    return {
      id: data.id,
      product_id: data.product_id,
      user_id: data.user_id,
      user_name: data.profiles?.full_name || 'Anonymous',
      user_avatar: data.profiles?.avatar_url,
      rating: data.rating,
      title: data.title,
      content: data.content,
      is_verified_purchase: data.is_verified_purchase,
      is_approved: data.is_approved,
      helpful_count: data.helpful_count,
      images: data.images || [],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (err) {
    console.error('Error updating review approval:', err);
    throw err;
  }
}

// Mark review as helpful
export async function markReviewHelpful(reviewId: string): Promise<Review | null> {
  try {
    // First get current helpful count
    const { data: currentReview, error: fetchError } = await supabase
      .from('reviews')
      .select('helpful_count')
      .eq('id', reviewId)
      .single();

    if (fetchError) {
      console.error('Error fetching current review:', fetchError);
      throw fetchError;
    }

    // Update helpful count
    const { data, error } = await supabase
      .from('reviews')
      .update({ 
        helpful_count: (currentReview.helpful_count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select(`
        *,
        profiles!reviews_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error marking review helpful:', error);
      throw error;
    }

    return {
      id: data.id,
      product_id: data.product_id,
      user_id: data.user_id,
      user_name: data.profiles?.full_name || 'Anonymous',
      user_avatar: data.profiles?.avatar_url,
      rating: data.rating,
      title: data.title,
      content: data.content,
      is_verified_purchase: data.is_verified_purchase,
      is_approved: data.is_approved,
      helpful_count: data.helpful_count,
      images: data.images || [],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (err) {
    console.error('Error marking review helpful:', err);
    throw err;
  }
}

// Get review statistics for a product
export async function getProductReviewStats(productId: string): Promise<ReviewStats | null> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating, is_verified_purchase, images')
      .eq('product_id', productId)
      .eq('is_approved', true);

    if (error) {
      console.error('Error fetching review stats:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return {
        total_reviews: 0,
        average_rating: 0,
        rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        verified_purchases: 0,
        with_images: 0
      };
    }

    const totalReviews = data.length;
    const averageRating = data.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews;
    
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    data.forEach((review: any) => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });

    const verifiedPurchases = data.filter((review: any) => review.is_verified_purchase).length;
    const withImages = data.filter((review: any) => review.images && review.images.length > 0).length;

    return {
      total_reviews: totalReviews,
      average_rating: Math.round(averageRating * 10) / 10,
      rating_distribution: ratingDistribution,
      verified_purchases: verifiedPurchases,
      with_images: withImages
    };
  } catch (err) {
    console.error('Error fetching review stats:', err);
    return null;
  }
}

// Get recent reviews (for homepage)
export async function getRecentReviews(limit: number = 10): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles!reviews_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent reviews:', error);
      return [];
    }

    return data?.map((review: any) => ({
      id: review.id,
      product_id: review.product_id,
      user_id: review.user_id,
      user_name: review.profiles?.full_name || 'Anonymous',
      user_avatar: review.profiles?.avatar_url,
      rating: review.rating,
      title: review.title,
      content: review.content,
      is_verified_purchase: review.is_verified_purchase,
      is_approved: review.is_approved,
      helpful_count: review.helpful_count,
      images: review.images || [],
      created_at: review.created_at,
      updated_at: review.updated_at
    })) || [];
  } catch (err) {
    console.error('Error fetching recent reviews:', err);
    return [];
  }
}

// Delete a review (admin only)
export async function deleteReview(reviewId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  } catch (err) {
    console.error('Error deleting review:', err);
    throw err;
  }
}
