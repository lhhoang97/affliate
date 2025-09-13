import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import {
  Business,
  People,
  EmojiEvents,
  TrendingUp,
  Security,
  Support
} from '@mui/icons-material';

const AboutUsPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      avatar: 'https://picsum.photos/150/150?random=601',
      bio: '10+ years experience in e-commerce and digital marketing'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      avatar: 'https://picsum.photos/150/150?random=602',
      bio: 'Expert in technology and product development'
    },
    {
      name: 'Mike Chen',
      role: 'Head of Operations',
      avatar: 'https://picsum.photos/150/150?random=603',
      bio: 'Specialized in business operations and customer success'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers', icon: <People /> },
    { number: '1000+', label: 'Products Reviewed', icon: <EmojiEvents /> },
    { number: '95%', label: 'Customer Satisfaction', icon: <TrendingUp /> },
    { number: '24/7', label: 'Support Available', icon: <Support /> }
  ];

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
            About ReviewHub
          </Typography>
          <Typography variant="h5" sx={{ color: '#6c757d', mb: 4, maxWidth: 800, mx: 'auto' }}>
            We're on a mission to help consumers make informed decisions through honest, 
            comprehensive product reviews and recommendations.
          </Typography>
        </Box>

        {/* Mission & Vision */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
            <Card sx={{ height: '100%', p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Business sx={{ fontSize: 40, color: '#007bff', mr: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  Our Mission
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#6c757d' }}>
                To provide consumers with reliable, unbiased product reviews and recommendations 
                that help them make confident purchasing decisions. We believe in transparency, 
                honesty, and putting our users first.
              </Typography>
            </Card>
            <Card sx={{ height: '100%', p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ fontSize: 40, color: '#007bff', mr: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  Our Vision
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#6c757d' }}>
                To become the most trusted platform for product reviews and recommendations, 
                empowering millions of consumers worldwide to make better purchasing decisions 
                through comprehensive, honest, and reliable information.
              </Typography>
            </Card>
          </Box>
        </Box>

        {/* Stats */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}>
            Our Impact
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
            {stats.map((stat, index) => (
              <Card key={index} sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                <Box sx={{ color: '#007bff', mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 1 }}>
                  {stat.number}
                </Typography>
                <Typography variant="body1" sx={{ color: '#6c757d' }}>
                  {stat.label}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Values */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}>
            Our Values
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Security sx={{ fontSize: 50, color: '#007bff', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Trust & Transparency
              </Typography>
              <Typography variant="body1" sx={{ color: '#6c757d' }}>
                We believe in complete transparency in our reviews and recommendations. 
                Our users can trust that our opinions are honest and unbiased.
              </Typography>
            </Card>
            <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <People sx={{ fontSize: 50, color: '#007bff', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                User-First Approach
              </Typography>
              <Typography variant="body1" sx={{ color: '#6c757d' }}>
                Every decision we make is centered around providing value to our users. 
                Their success and satisfaction are our top priorities.
              </Typography>
            </Card>
            <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <EmojiEvents sx={{ fontSize: 50, color: '#007bff', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Quality & Excellence
              </Typography>
              <Typography variant="body1" sx={{ color: '#6c757d' }}>
                We strive for excellence in everything we do, from the quality of our 
                reviews to the user experience we provide.
              </Typography>
            </Card>
          </Box>
        </Box>

        {/* Team */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}>
            Meet Our Team
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {teamMembers.map((member, index) => (
              <Card key={index} sx={{ textAlign: 'center', p: 4, height: '100%' }}>
                <Avatar
                  src={member.avatar}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 3 }}
                />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {member.name}
                </Typography>
                <Chip 
                  label={member.role} 
                  color="primary" 
                  sx={{ mb: 2 }}
                />
                <Typography variant="body1" sx={{ color: '#6c757d' }}>
                  {member.bio}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Story */}
        <Box sx={{ mb: 8 }}>
          <Card sx={{ p: 6 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
              Our Story
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#6c757d', mb: 4 }}>
              ReviewHub was founded in 2023 with a simple yet powerful vision: to help consumers 
              navigate the overwhelming world of online shopping by providing honest, comprehensive 
              product reviews and recommendations.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#6c757d', mb: 4 }}>
              What started as a small team of passionate individuals has grown into a trusted 
              platform serving thousands of users daily. We've reviewed thousands of products 
              across hundreds of categories, always maintaining our commitment to honesty and 
              transparency.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#6c757d' }}>
              Today, we continue to expand our reach and improve our services, always staying 
              true to our core values and mission. We're excited about the future and committed 
              to helping even more consumers make confident purchasing decisions.
            </Typography>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUsPage;
