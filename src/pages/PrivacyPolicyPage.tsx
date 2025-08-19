import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Security,
  CheckCircle,
  Info,
  Warning,
  Email,
  Phone
} from '@mui/icons-material';

const PrivacyPolicyPage: React.FC = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'Personal information (name, email, address) when you create an account',
        'Payment information when you make purchases',
        'Usage data and analytics to improve our services',
        'Cookies and similar technologies for website functionality',
        'Communication data when you contact our support team'
      ]
    },
    {
      title: 'How We Use Your Information',
      content: [
        'To provide and maintain our services',
        'To process transactions and send order confirmations',
        'To send you updates, marketing communications, and newsletters',
        'To respond to your inquiries and provide customer support',
        'To improve our website and user experience',
        'To comply with legal obligations and prevent fraud'
      ]
    },
    {
      title: 'Information Sharing and Disclosure',
      content: [
        'We do not sell, trade, or rent your personal information to third parties',
        'We may share information with trusted service providers who assist us in operating our website',
        'We may disclose information if required by law or to protect our rights',
        'We may share aggregated, non-personal information for analytics purposes'
      ]
    },
    {
      title: 'Data Security',
      content: [
        'We implement appropriate security measures to protect your personal information',
        'We use encryption to secure data transmission',
        'We regularly review and update our security practices',
        'We limit access to personal information to authorized personnel only'
      ]
    },
    {
      title: 'Your Rights and Choices',
      content: [
        'You can access, update, or delete your personal information',
        'You can opt-out of marketing communications',
        'You can request a copy of your personal data',
        'You can withdraw consent for data processing',
        'You can lodge a complaint with supervisory authorities'
      ]
    },
    {
      title: 'Cookies and Tracking Technologies',
      content: [
        'We use cookies to enhance your browsing experience',
        'Essential cookies are required for website functionality',
        'Analytics cookies help us understand how you use our site',
        'Marketing cookies may be used for personalized advertising',
        'You can control cookie settings through your browser preferences'
      ]
    }
  ];

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
            Privacy Policy
          </Typography>
          <Typography variant="h6" sx={{ color: '#6c757d', mb: 4 }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{ color: '#6c757d', maxWidth: 800, mx: 'auto' }}>
            At ReviewHub, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.
          </Typography>
        </Box>

        {/* Quick Summary */}
        <Card sx={{ mb: 6, p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Quick Summary
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ color: '#28a745', mr: 1 }} />
                What We Do
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#28a745', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Collect only necessary information" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#28a745', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Use data to improve our services" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#28a745', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Protect your information with encryption" />
                </ListItem>
              </List>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
                <Warning sx={{ color: '#ffc107', mr: 1 }} />
                What We Don't Do
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Warning sx={{ color: '#ffc107', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Sell your personal information" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Warning sx={{ color: '#ffc107', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Share data with unauthorized parties" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Warning sx={{ color: '#ffc107', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Use data for unrelated purposes" />
                </ListItem>
              </List>
            </Box>
          </Box>
        </Card>

        {/* Detailed Sections */}
        {sections.map((section, index) => (
          <Card key={index} sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: '#2c3e50' }}>
                {section.title}
              </Typography>
              <List>
                {section.content.map((item, itemIndex) => (
                  <ListItem key={itemIndex} sx={{ pl: 0 }}>
                    <ListItemIcon>
                      <Info sx={{ color: '#007bff' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item}
                      primaryTypographyProps={{ 
                        sx: { 
                          color: '#6c757d',
                          lineHeight: 1.6
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}

        {/* Data Retention */}
        <Card sx={{ mb: 6, p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Data Retention
          </Typography>
          <Typography variant="body1" sx={{ color: '#6c757d', lineHeight: 1.8, mb: 3 }}>
            We retain your personal information only for as long as necessary to fulfill the purposes 
            outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Account Information
              </Typography>
              <Typography variant="body2" sx={{ color: '#6c757d' }}>
                Retained until you delete your account or request deletion
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Transaction Data
              </Typography>
              <Typography variant="body2" sx={{ color: '#6c757d' }}>
                Retained for 7 years for tax and legal compliance
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Analytics Data
              </Typography>
              <Typography variant="body2" sx={{ color: '#6c757d' }}>
                Retained for 2 years for service improvement
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Marketing Data
              </Typography>
              <Typography variant="body2" sx={{ color: '#6c757d' }}>
                Retained until you unsubscribe or request removal
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* International Transfers */}
        <Card sx={{ mb: 6, p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            International Data Transfers
          </Typography>
          <Typography variant="body1" sx={{ color: '#6c757d', lineHeight: 1.8, mb: 3 }}>
            Your information may be transferred to and processed in countries other than your own. 
            We ensure that such transfers comply with applicable data protection laws and implement 
            appropriate safeguards to protect your personal information.
          </Typography>
          <Typography variant="body1" sx={{ color: '#6c757d', lineHeight: 1.8 }}>
            If you are located in the European Economic Area (EEA), we ensure that your personal 
            information receives an adequate level of protection when transferred outside the EEA.
          </Typography>
        </Card>

        {/* Children's Privacy */}
        <Card sx={{ mb: 6, p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Children's Privacy
          </Typography>
          <Typography variant="body1" sx={{ color: '#6c757d', lineHeight: 1.8 }}>
            Our services are not intended for children under the age of 13. We do not knowingly 
            collect personal information from children under 13. If you are a parent or guardian 
            and believe that your child has provided us with personal information, please contact 
            us immediately, and we will take steps to remove such information from our records.
          </Typography>
        </Card>

        {/* Changes to Privacy Policy */}
        <Card sx={{ mb: 6, p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Changes to This Privacy Policy
          </Typography>
          <Typography variant="body1" sx={{ color: '#6c757d', lineHeight: 1.8, mb: 3 }}>
            We may update this Privacy Policy from time to time to reflect changes in our practices 
            or for other operational, legal, or regulatory reasons. We will notify you of any 
            material changes by posting the new Privacy Policy on this page and updating the 
            "Last updated" date.
          </Typography>
          <Typography variant="body1" sx={{ color: '#6c757d', lineHeight: 1.8 }}>
            We encourage you to review this Privacy Policy periodically to stay informed about 
            how we protect your information.
          </Typography>
        </Card>

        {/* Contact Information */}
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" sx={{ color: '#6c757d', lineHeight: 1.8, mb: 3 }}>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1, color: '#007bff' }} />
                Email
              </Typography>
              <Typography variant="body1" sx={{ color: '#6c757d' }}>
                privacy@reviewhub.com
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ mr: 1, color: '#007bff' }} />
                Phone
              </Typography>
              <Typography variant="body1" sx={{ color: '#6c757d' }}>
                +1 (555) 123-4567
              </Typography>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default PrivacyPolicyPage;
