const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Amazon service (simplified version)
const AMAZON_CONFIG = {
  accessKey: process.env.REACT_APP_AMAZON_ACCESS_KEY,
  secretKey: process.env.REACT_APP_AMAZON_SECRET_KEY,
  associateTag: process.env.REACT_APP_AMAZON_ASSOCIATE_TAG,
  region: 'us-east-1',
  host: 'webservices.amazon.com',
  endpoint: '/paapi5/searchitems'
};

// Bulk import configuration
const BULK_IMPORT_CONFIG = {
  keywords: [
    'iPhone 15',
    'Samsung Galaxy S24',
    'MacBook Pro',
    'iPad Pro',
    'AirPods Pro',
    'Sony WH-1000XM5',
    'Nintendo Switch',
    'PlayStation 5',
    'Xbox Series X',
    'Apple Watch Series 9',
    'Samsung Galaxy Watch',
    'Dell XPS 13',
    'HP Spectre x360',
    'Microsoft Surface Pro',
    'Canon EOS R5',
    'Sony A7R V',
    'Nikon Z9',
    'GoPro Hero 12',
    'DJI Mavic 3',
    'Tesla Model 3 accessories'
  ],
  categories: [
    'Electronics',
    'Computers',
    'VideoGames',
    'Camera',
    'WearableTechnology',
    'MobileApps'
  ],
  maxResultsPerKeyword: 15,
  delayBetweenRequests: 2000 // 2 seconds delay
};

// Simple crypto implementation for browser compatibility
const crypto = {
  createHmac: (algorithm, key) => ({
    update: (data) => ({
      digest: (encoding) => {
        const str = (typeof key === 'string' ? key : key.toString()) + data;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
      }
    })
  }),
  createHash: (algorithm) => ({
    update: (data) => ({
      digest: (encoding) => {
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
          const char = data.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
      }
    })
  })
};

class BulkAmazonImporter {
  constructor() {
    this.totalImported = 0;
    this.totalErrors = 0;
    this.importedProducts = [];
  }

  async generateSignature(stringToSign, dateStamp) {
    const kDate = crypto.createHmac('sha256', 'AWS4' + AMAZON_CONFIG.secretKey).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(AMAZON_CONFIG.region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update('ProductAdvertisingAPI').digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
    
    return crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
  }

  async createAuthHeaders(payload) {
    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = timestamp.substring(0, 8);
    
    const canonicalHeaders = [
      'content-encoding:amz-1.0',
      'content-type:application/json; charset=utf-8',
      `host:${AMAZON_CONFIG.host}`,
      `x-amz-date:${timestamp}`,
      `x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems`
    ].join('\n');

    const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target';
    const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');
    
    const canonicalRequest = [
      'POST',
      AMAZON_CONFIG.endpoint,
      '',
      canonicalHeaders + '\n',
      signedHeaders,
      payloadHash
    ].join('\n');

    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${AMAZON_CONFIG.region}/ProductAdvertisingAPI/aws4_request`;
    const stringToSign = [
      algorithm,
      timestamp,
      credentialScope,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');

    const signature = await this.generateSignature(stringToSign, dateStamp);
    const authorization = `${algorithm} Credential=${AMAZON_CONFIG.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return {
      'Authorization': authorization,
      'Content-Encoding': 'amz-1.0',
      'Content-Type': 'application/json; charset=utf-8',
      'Host': AMAZON_CONFIG.host,
      'X-Amz-Date': timestamp,
      'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems'
    };
  }

  async searchProducts(keywords, category, maxResults) {
    try {
      console.log(`🔍 Searching: "${keywords}" in ${category} (${maxResults} results)`);
      
      const payload = {
        Keywords: keywords,
        Resources: [
          'Images.Primary.Large',
          'Images.Primary.Medium', 
          'ItemInfo.Title',
          'ItemInfo.Features',
          'ItemInfo.ProductGroup',
          'ItemInfo.Brand',
          'Offers.Listings.Price',
          'CustomerReviews.Count',
          'CustomerReviews.StarRating'
        ],
        SearchIndex: category,
        ItemCount: maxResults,
        PartnerTag: AMAZON_CONFIG.associateTag,
        PartnerType: 'Associates',
        Marketplace: 'www.amazon.com'
      };

      const payloadString = JSON.stringify(payload);
      const headers = await this.createAuthHeaders(payloadString);

      const response = await fetch(`https://${AMAZON_CONFIG.host}${AMAZON_CONFIG.endpoint}`, {
        method: 'POST',
        headers,
        body: payloadString
      });

      if (!response.ok) {
        throw new Error(`Amazon API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.SearchResult?.Items) {
        return data.SearchResult.Items.map((item) => ({
          ASIN: item.ASIN,
          title: item.ItemInfo?.Title?.DisplayValue || '',
          price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount ? {
            displayAmount: item.Offers.Listings[0].Price.DisplayAmount,
            amount: item.Offers.Listings[0].Price.Amount || 0,
            currency: item.Offers.Listings[0].Price.Currency || 'USD'
          } : undefined,
          images: item.Images?.Primary ? {
            primary: {
              large: { URL: item.Images.Primary.Large?.URL || '' },
              medium: { URL: item.Images.Primary.Medium?.URL || '' }
            }
          } : undefined,
          detailPageURL: item.DetailPageURL || '',
          features: item.ItemInfo?.Features?.DisplayValues || [],
          brand: item.ItemInfo?.Brand?.DisplayValue || '',
          customerReviews: item.CustomerReviews ? {
            count: item.CustomerReviews.Count || 0,
            starRating: {
              value: item.CustomerReviews.StarRating?.Value || 0
            }
          } : undefined
        }));
      }

      return [];
    } catch (error) {
      console.error(`❌ Search error for "${keywords}":`, error.message);
      return [];
    }
  }

  normalizeAmazonProduct(amazonProduct, category) {
    const affiliateLink = `https://www.amazon.com/dp/${amazonProduct.ASIN}?tag=${AMAZON_CONFIG.associateTag}`;
    
    return {
      name: amazonProduct.title,
      price: amazonProduct.price?.amount || 0,
      original_price: amazonProduct.price?.amount || 0,
      image: amazonProduct.images?.primary?.large?.URL || amazonProduct.images?.primary?.medium?.URL || '',
      description: amazonProduct.features?.join('\n') || '',
      category: category,
      brand: amazonProduct.brand || 'Amazon',
      rating: amazonProduct.customerReviews?.starRating?.value || 0,
      review_count: amazonProduct.customerReviews?.count || 0,
      external_url: amazonProduct.detailPageURL,
      affiliate_link: affiliateLink,
      retailer: 'Amazon',
      source: 'amazon',
      asin: amazonProduct.ASIN,
      in_stock: true,
      features: amazonProduct.features || [],
      specifications: {},
      images: [amazonProduct.images?.primary?.large?.URL || amazonProduct.images?.primary?.medium?.URL || ''],
      tags: [category, 'Amazon', amazonProduct.brand || 'Unknown'].filter(Boolean)
    };
  }

  async importProductsToSupabase(keywords, category, maxResults) {
    try {
      const amazonProducts = await this.searchProducts(keywords, category, maxResults);
      
      if (amazonProducts.length === 0) {
        console.log(`⚠️  No products found for: ${keywords}`);
        return 0;
      }

      console.log(`✅ Found ${amazonProducts.length} products for: ${keywords}`);

      // Normalize products for Supabase
      const normalizedProducts = amazonProducts.map(product => 
        this.normalizeAmazonProduct(product, category)
      );

      // Insert into Supabase
      const { data, error } = await supabase
        .from('products')
        .insert(normalizedProducts)
        .select();

      if (error) {
        console.error(`❌ Supabase insert error for "${keywords}":`, error);
        throw error;
      }

      console.log(`✅ Imported ${data?.length || 0} products for: ${keywords}`);
      return data?.length || 0;

    } catch (error) {
      console.error(`❌ Import error for "${keywords}":`, error.message);
      this.totalErrors++;
      return 0;
    }
  }

  async bulkImport() {
    console.log('🚀 Starting bulk Amazon import...');
    console.log(`📋 Keywords: ${BULK_IMPORT_CONFIG.keywords.length}`);
    console.log(`📂 Categories: ${BULK_IMPORT_CONFIG.categories.length}`);
    console.log(`🔢 Max results per keyword: ${BULK_IMPORT_CONFIG.maxResultsPerKeyword}`);
    console.log('');

    for (let i = 0; i < BULK_IMPORT_CONFIG.keywords.length; i++) {
      const keyword = BULK_IMPORT_CONFIG.keywords[i];
      const category = BULK_IMPORT_CONFIG.categories[i % BULK_IMPORT_CONFIG.categories.length];
      
      console.log(`\n📦 [${i + 1}/${BULK_IMPORT_CONFIG.keywords.length}] Processing: ${keyword}`);
      
      const imported = await this.importProductsToSupabase(
        keyword, 
        category, 
        BULK_IMPORT_CONFIG.maxResultsPerKeyword
      );
      
      this.totalImported += imported;
      
      // Delay between requests to respect rate limits
      if (i < BULK_IMPORT_CONFIG.keywords.length - 1) {
        console.log(`⏳ Waiting ${BULK_IMPORT_CONFIG.delayBetweenRequests/1000}s before next request...`);
        await new Promise(resolve => setTimeout(resolve, BULK_IMPORT_CONFIG.delayBetweenRequests));
      }
    }

    console.log('\n🎉 Bulk import completed!');
    console.log(`✅ Total imported: ${this.totalImported} products`);
    console.log(`❌ Total errors: ${this.totalErrors}`);
    console.log(`📊 Success rate: ${((this.totalImported / (this.totalImported + this.totalErrors)) * 100).toFixed(1)}%`);
  }
}

// Run bulk import
async function main() {
  try {
    const importer = new BulkAmazonImporter();
    await importer.bulkImport();
  } catch (error) {
    console.error('❌ Bulk import failed:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = BulkAmazonImporter;

