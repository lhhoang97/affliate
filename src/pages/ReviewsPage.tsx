import React, { useState } from 'react';
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
  Tab
} from '@mui/material';
import {
  Star,
  ThumbUp,
  ThumbDown,
  Verified,
  Help,
  Send
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubmitReview = () => {
    // Here you would submit the review to your backend
    console.log('Submitting review:', { selectedRating, reviewText, reviewTitle });
    setReviewDialogOpen(false);
    setSelectedRating(5);
    setReviewText('');
    setReviewTitle('');
  };

  const mockReviews = [
    {
      id: 1,
      productName: 'iPhone 15 Pro',
      productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100',
      rating: 5,
      title: 'Excellent phone, amazing camera!',
      content: 'This is by far the best iPhone I\'ve ever owned. The camera quality is outstanding and the performance is lightning fast. Battery life is also impressive.',
      author: 'John D.',
      date: '2024-01-15',
      verified: true,
      helpful: 45,
      notHelpful: 2,
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200']
    },
    {
      id: 2,
      productName: 'Samsung Galaxy S24',
      productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100',
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
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
      rating: 5,
      title: 'Best noise-canceling headphones ever!',
      content: 'These headphones are absolutely incredible. The noise cancellation is mind-blowing and the sound quality is exceptional. Worth every penny.',
      author: 'Mike R.',
      date: '2024-01-10',
      verified: true,
      helpful: 67,
      notHelpful: 1,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200']
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Star sx={{ fontSize: 40 }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
              Product Reviews
            </Typography>
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
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
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

        {/* Reviews List */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            {mockReviews.map((review) => (
              <Card key={review.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Avatar src={review.productImage} sx={{ width: 60, height: 60 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {review.productName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Rating value={review.rating} size="small" readOnly />
                        <Typography variant="body2" color="text.secondary">
                          by {review.author}
                        </Typography>
                        {review.verified && (
                          <Chip
                            icon={<Verified />}
                            label="Verified Purchase"
                            size="small"
                            color="success"
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(review.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {review.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {review.content}
                  </Typography>

                  {review.images.length > 0 && (
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
                    >
                      Helpful ({review.helpful})
                    </Button>
                    <Button
                      startIcon={<ThumbDown />}
                      size="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      Not Helpful ({review.notHelpful})
                    </Button>
                    <Button size="small" sx={{ color: 'text.secondary' }}>
                      Report
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
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
              <InputLabel>Product Category</InputLabel>
              <Select
                value="electronics"
                label="Product Category"
              >
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
                <MenuItem value="home">Home & Garden</MenuItem>
                <MenuItem value="sports">Sports & Outdoors</MenuItem>
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
    </Box>
  );
};

export default ReviewsPage;
