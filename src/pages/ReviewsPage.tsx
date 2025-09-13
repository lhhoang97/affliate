import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Rating,
  Avatar,
  Chip,
  Button,
  Grid,
  Divider,
  LinearProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Star,
  ThumbUp,
  ThumbDown,
  Verified,
  Help,
  Send,
  VolumeUp,
  VolumeOff,
  PlayArrow,
  Pause,
  Refresh,
  Image as ImageIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { 
  getAllReviews, 
  createReview, 
  markReviewHelpful,
  Review,
  CreateReviewData 
} from '../services/reviewService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reviews-tabpanel-${index}`}
      aria-labelledby={`reviews-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ReviewsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [currentReadingId, setCurrentReadingId] = useState<number | null>(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await getAllReviews();
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setSnackbar({ open: true, message: 'Failed to load reviews', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubmitReview = async () => {
    if (!user || !reviewTitle || !reviewText || !selectedProduct) {
      setSnackbar({ open: true, message: 'Please fill in all required fields', severity: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const reviewData: CreateReviewData = {
        product_id: selectedProduct,
        user_id: user.id,
        rating: selectedRating,
        title: reviewTitle,
        content: reviewText,
        is_verified_purchase: false // This would be determined by checking if user has purchased the product
      };

      await createReview(reviewData);
      setSnackbar({ open: true, message: 'Review submitted successfully! It will be reviewed before publishing.', severity: 'success' });
      
      // Reset form
      setReviewDialogOpen(false);
      setSelectedRating(5);
      setReviewText('');
      setReviewTitle('');
      setSelectedProduct('');
      
      // Reload reviews
      await loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      setSnackbar({ open: true, message: 'Failed to submit review', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await markReviewHelpful(reviewId);
      setSnackbar({ open: true, message: 'Thank you for your feedback!', severity: 'success' });
      await loadReviews(); // Reload to update helpful count
    } catch (error) {
      console.error('Error marking review helpful:', error);
      setSnackbar({ open: true, message: 'Failed to mark review as helpful', severity: 'error' });
    }
  };

  // Text-to-Speech functions
  const speak = (text: string, reviewId: number) => {
    if (!speechEnabled) return;
    
    // Stop any current speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Set voice (prefer English)
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    utterance.onstart = () => {
      setIsReading(true);
      setCurrentReadingId(reviewId);
    };
    
    utterance.onend = () => {
      setIsReading(false);
      setCurrentReadingId(null);
    };
    
    utterance.onerror = () => {
      setIsReading(false);
      setCurrentReadingId(null);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setCurrentReadingId(null);
  };

  const toggleSpeech = () => {
    if (isReading) {
      stopSpeaking();
    } else {
      setSpeechEnabled(!speechEnabled);
    }
  };

  const handleReadReview = (review: any) => {
    const textToRead = `${review.title}. ${review.content}`;
    speak(textToRead, review.id);
  };

  const mockReviews = [
    {
      id: 1,
      productName: 'iPhone 15 Pro',
      productImage: 'https://picsum.photos/100/100?random=201',
      rating: 5,
      title: 'Excellent phone, amazing camera!',
      content: 'This is by far the best iPhone I\'ve ever owned. The camera quality is outstanding and the performance is lightning fast. Battery life is also impressive.',
      author: 'John D.',
      date: '2024-01-15',
      verified: true,
      helpful: 45,
      notHelpful: 2,
      images: ['https://picsum.photos/200/200?random=201']
    },
    {
      id: 2,
      productName: 'Samsung Galaxy S24',
      productImage: 'https://picsum.photos/100/100?random=202',
      rating: 4,
      title: 'Great phone with some minor issues',
      content: 'Overall a great phone. The display is beautiful and the performance is good. However, the battery life could be better and the camera sometimes struggles in low light.',
      author: 'Sarah M.',
      date: '2024-01-12',
      verified: true,
      helpful: 23,
      notHelpful: 5,
      images: []
    },
    {
      id: 3,
      productName: 'Sony WH-1000XM5',
      productImage: 'https://picsum.photos/100/100?random=203',
      rating: 5,
      title: 'Best noise-canceling headphones ever!',
      content: 'These headphones are absolutely incredible. The noise cancellation is mind-blowing and the sound quality is exceptional. Worth every penny.',
      author: 'Mike R.',
      date: '2024-01-10',
      verified: true,
      helpful: 67,
      notHelpful: 1,
      images: ['https://picsum.photos/200/200?random=203']
    }
  ];

  const ratingStats = {
    total: 1250,
    average: 4.6,
    distribution: [
      { rating: 5, count: 750, percentage: 60 },
      { rating: 4, count: 300, percentage: 24 },
      { rating: 3, count: 120, percentage: 10 },
      { rating: 2, count: 50, percentage: 4 },
      { rating: 1, count: 30, percentage: 2 }
    ]
  };

  return (
    <Box sx={{ backgroundColor: '#f3f3f3', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Star sx={{ fontSize: 40 }} />
              <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
                Product Reviews
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadReviews}
              disabled={loading}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderColor: 'rgba(255, 255, 255, 0.5)'
                }
              }}
            >
              Refresh
            </Button>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Honest reviews from real customers
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Overall Rating Summary */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#B12704' }}>
                  {ratingStats.average}
                </Typography>
                <Rating value={ratingStats.average} precision={0.1} size="large" readOnly />
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Based on {ratingStats.total} reviews
                </Typography>
              </Box>
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '2 / -1' } }}>
                <Typography variant="h6" gutterBottom>
                  Rating Distribution
                </Typography>
                {ratingStats.distribution.map((item) => (
                  <Box key={item.rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ minWidth: 60 }}>
                      {item.rating} stars
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      sx={{
                        flexGrow: 1,
                        mx: 2,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#febd69'
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ minWidth: 40 }}>
                      {item.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="reviews tabs">
            <Tab label="All Reviews" />
            <Tab label="Verified Purchases" />
            <Tab label="With Photos" />
            <Tab label="Critical Reviews" />
          </Tabs>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={() => setReviewDialogOpen(true)}
            sx={{
              backgroundColor: '#febd69',
              color: '#131921',
              '&:hover': { backgroundColor: '#f3a847' }
            }}
          >
            Write a Review
          </Button>
          <Button variant="outlined">
            Filter Reviews
          </Button>
        </Box>

        {/* Text-to-Speech Controls */}
        <Card sx={{ mb: 4, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              🔊 Audio Reading:
            </Typography>
            
            <Button
              variant={speechEnabled ? "contained" : "outlined"}
              size="small"
              startIcon={speechEnabled ? <VolumeUp /> : <VolumeOff />}
              onClick={toggleSpeech}
            >
              {speechEnabled ? 'Enabled' : 'Disabled'}
            </Button>
            
            {speechEnabled && (
              <>
                <Typography variant="body2" color="text.secondary">
                  Speed:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSpeechRate(Math.max(0.5, speechRate - 0.25))}
                    disabled={speechRate <= 0.5}
                  >
                    -
                  </Button>
                  <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'center' }}>
                    {speechRate}x
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSpeechRate(Math.min(2, speechRate + 0.25))}
                    disabled={speechRate >= 2}
                  >
                    +
                  </Button>
                </Box>
              </>
            )}
            
            {isReading && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={stopSpeaking}
                startIcon={<Pause />}
              >
                Stop All
              </Button>
            )}
          </Box>
        </Card>

        {/* Reviews List */}
        <TabPanel value={tabValue} index={0}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography>Loading reviews...</Typography>
            </Box>
          ) : reviews.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No reviews yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Be the first to write a review!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
              {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Avatar 
                      src={review.user_avatar} 
                      sx={{ width: 60, height: 60 }}
                    >
                      {review.user_name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {review.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Rating value={review.rating} size="small" readOnly />
                        <Typography variant="body2" color="text.secondary">
                          by {review.user_name}
                        </Typography>
                        {review.is_verified_purchase && (
                          <Chip
                            icon={<Verified />}
                            label="Verified Purchase"
                            size="small"
                            color="success"
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(review.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {review.title}
                      </Typography>
                      <Typography variant="body1">
                        {review.content}
                      </Typography>
                    </Box>
                    
                    {/* Read Review Button */}
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={currentReadingId === parseInt(review.id) ? <Pause /> : <PlayArrow />}
                      onClick={() => {
                        if (currentReadingId === parseInt(review.id)) {
                          stopSpeaking();
                        } else {
                          handleReadReview(review);
                        }
                      }}
                      sx={{ ml: 2, minWidth: 'auto' }}
                    >
                      {currentReadingId === parseInt(review.id) ? 'Stop' : 'Read'}
                    </Button>
                  </Box>

                  {review.images && review.images.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review ${index + 1}`}
                          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                        />
                      ))}
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      startIcon={<ThumbUp />}
                      size="small"
                      sx={{ color: 'text.secondary' }}
                      onClick={() => handleMarkHelpful(review.id)}
                    >
                      Helpful ({review.helpful_count})
                    </Button>
                    <Button
                      startIcon={<ThumbDown />}
                      size="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      Not Helpful
                    </Button>
                    <Button size="small" sx={{ color: 'text.secondary' }}>
                      Report
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Verified Purchase Reviews
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Reviews from customers who have purchased this product
          </Typography>
          {/* Same reviews but filtered for verified purchases */}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Reviews with Photos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Reviews that include customer photos
          </Typography>
          {/* Same reviews but filtered for those with images */}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Critical Reviews (1-2 stars)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Reviews with 1 or 2 star ratings
          </Typography>
          {/* Same reviews but filtered for low ratings */}
        </TabPanel>
      </Container>

      {/* Write Review Dialog */}
      <Dialog 
        open={reviewDialogOpen} 
        onClose={() => setReviewDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              fullWidth
              label="Review Title"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="Summarize your experience"
            />
            
            <Box>
              <Typography variant="body2" gutterBottom>
                Overall Rating
              </Typography>
              <Rating
                value={selectedRating}
                onChange={(event, newValue) => {
                  setSelectedRating(newValue || 5);
                }}
                size="large"
              />
            </Box>

            <TextField
              fullWidth
              label="Your Review"
              multiline
              rows={6}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this product..."
            />

            <FormControl fullWidth>
              <InputLabel>Product</InputLabel>
              <Select
                value={selectedProduct}
                label="Product"
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <MenuItem value="1">Samsung Galaxy S21</MenuItem>
                <MenuItem value="2">iPhone 13 Pro</MenuItem>
                <MenuItem value="3">MacBook Pro M2</MenuItem>
                <MenuItem value="4">Sony WH-1000XM4</MenuItem>
                <MenuItem value="5">Nintendo Switch</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitReview} 
            variant="contained"
            disabled={!reviewTitle || !reviewText}
            sx={{
              backgroundColor: '#febd69',
              color: '#131921',
              '&:hover': { backgroundColor: '#f3a847' }
            }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewsPage;
