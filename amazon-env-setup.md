# Amazon API Environment Setup

## Required Environment Variables

Add these to your `.env` file:

```bash
# Amazon PA-API 5.0 Configuration
REACT_APP_AMAZON_ACCESS_KEY=your_amazon_access_key_here
REACT_APP_AMAZON_SECRET_KEY=your_amazon_secret_key_here  
REACT_APP_AMAZON_ASSOCIATE_TAG=your_amazon_associate_tag_here
```

## How to Get Amazon Credentials

### 1. Amazon Associate Account
1. Visit: https://affiliate-program.amazon.com
2. Sign up with your website (shopwithus.online)
3. Get approved (may take 1-4 weeks)
4. Note your Associate Tag (e.g., `shopwithus-20`)

### 2. PA-API 5.0 Access
1. From Associate Central, request PA-API access
2. Go to Tools → Product Advertising API
3. Generate Access Keys:
   - Access Key ID → `REACT_APP_AMAZON_ACCESS_KEY`
   - Secret Access Key → `REACT_APP_AMAZON_SECRET_KEY`
   - Associate Tag → `REACT_APP_AMAZON_ASSOCIATE_TAG`

### 3. Testing
```bash
# Add to your .env file
REACT_APP_AMAZON_ACCESS_KEY=AKIA...
REACT_APP_AMAZON_SECRET_KEY=abc123...
REACT_APP_AMAZON_ASSOCIATE_TAG=shopwithus-20
```

## Important Notes
- Keep credentials secure (never commit to git)
- Need 3 qualifying sales within 180 days to maintain access
- Free tier: 8,640 requests per day
- Rate limit: 1 request per second initially
