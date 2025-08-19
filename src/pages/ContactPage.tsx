import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  AccessTime,
  Send,
  CheckCircle
} from '@mui/icons-material';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    setSnackbar({
      open: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      severity: 'success'
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const contactInfo = [
    {
      icon: <Email />,
      title: 'Email Us',
      details: ['support@reviewhub.com', 'info@reviewhub.com'],
      description: 'We typically respond within 24 hours'
    },
    {
      icon: <Phone />,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      description: 'Monday - Friday, 9 AM - 6 PM EST'
    },
    {
      icon: <LocationOn />,
      title: 'Visit Us',
      details: ['123 Business Street', 'New York, NY 10001'],
      description: 'By appointment only'
    }
  ];

  const faqs = [
    {
      question: 'How can I submit a product review?',
      answer: 'You can submit a product review by logging into your account and navigating to the product page. Click on "Write a Review" and follow the prompts.'
    },
    {
      question: 'How long does it take to get a response?',
      answer: 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.'
    },
    {
      question: 'Can I request a review for a specific product?',
      answer: 'Yes! If you\'d like us to review a specific product, please send us an email with the product details and we\'ll consider it for our review schedule.'
    },
    {
      question: 'How do I report an issue with the website?',
      answer: 'If you encounter any technical issues, please email us at support@reviewhub.com with details about the problem and we\'ll address it promptly.'
    }
  ];

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
            Contact Us
          </Typography>
          <Typography variant="h5" sx={{ color: '#6c757d', mb: 4, maxWidth: 800, mx: 'auto' }}>
            Have questions, feedback, or need assistance? We're here to help! 
            Get in touch with our team and we'll respond as soon as possible.
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 6 }}>
          {/* Contact Form */}
          <Card sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
              Send us a Message
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
                <TextField
                  fullWidth
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Box>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                multiline
                rows={6}
                variant="outlined"
                placeholder="Tell us how we can help you..."
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Send />}
                sx={{
                  backgroundColor: '#007bff',
                  '&:hover': { backgroundColor: '#0056b3' },
                  px: 4,
                  py: 1.5
                }}
              >
                Send Message
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {contactInfo.map((info, index) => (
              <Card key={index} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: '#007bff', mr: 2 }}>
                    {info.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {info.title}
                  </Typography>
                </Box>
                {info.details.map((detail, detailIndex) => (
                  <Typography key={detailIndex} variant="body1" sx={{ mb: 0.5, color: '#6c757d' }}>
                    {detail}
                  </Typography>
                ))}
                <Typography variant="body2" sx={{ color: '#6c757d', mt: 1, fontStyle: 'italic' }}>
                  {info.description}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Office Hours */}
        <Box sx={{ mt: 8 }}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
              Office Hours
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTime sx={{ color: '#007bff', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Customer Support
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#6c757d', mb: 1 }}>
                  Monday - Friday: 9:00 AM - 6:00 PM EST
                </Typography>
                <Typography variant="body1" sx={{ color: '#6c757d', mb: 1 }}>
                  Saturday: 10:00 AM - 4:00 PM EST
                </Typography>
                <Typography variant="body1" sx={{ color: '#6c757d' }}>
                  Sunday: Closed
                </Typography>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircle sx={{ color: '#007bff', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Response Time
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#6c757d', mb: 1 }}>
                  Email: Within 24 hours
                </Typography>
                <Typography variant="body1" sx={{ color: '#6c757d', mb: 1 }}>
                  Phone: Immediate during business hours
                </Typography>
                <Typography variant="body1" sx={{ color: '#6c757d' }}>
                  Live Chat: Available during business hours
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* FAQs */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 6, textAlign: 'center' }}>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {faqs.map((faq, index) => (
              <Card key={index} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                  {faq.question}
                </Typography>
                <Typography variant="body1" sx={{ color: '#6c757d', lineHeight: 1.6 }}>
                  {faq.answer}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;
