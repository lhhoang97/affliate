import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SimpleSlider from '../components/SimpleSlider';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../types';

const HomePage: React.FC = () => {
  const { products, loading } = useProducts();
  const navigate = useNavigate();

  // Sample products data for testing
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: '10KG ANYCUBIC 1.75mm PLA 3D Printer Filament Bundles',
      description: 'High-quality 3D printer filament for professional printing',
      price: 65,
      originalPrice: 246,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=200&fit=crop',
      rating: 4.5,
      reviewCount: 128,
      category: 'Electronics',
      brand: 'ANYCUBIC',
      retailer: 'AliExpress',
      inStock: true,
      features: ['High Quality', 'Multiple Colors', '1.75mm Diameter'],
      specifications: { 'Material': 'PLA', 'Diameter': '1.75mm', 'Weight': '10KG' },
      images: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=200&fit=crop'],
      tags: ['3D Printing', 'Filament', 'PLA'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Wireless Bluetooth Earbuds with Noise Cancellation',
      description: 'Premium wireless earbuds with active noise cancellation',
      price: 29.99,
      originalPrice: 89.99,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=200&fit=crop',
      rating: 4.3,
      reviewCount: 89,
      category: 'Electronics',
      brand: 'TechAudio',
      retailer: 'Amazon',
      inStock: true,
      features: ['Noise Cancellation', 'Wireless', 'Long Battery Life'],
      specifications: { 'Battery Life': '8 hours', 'Connectivity': 'Bluetooth 5.0' },
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=200&fit=crop'],
      tags: ['Audio', 'Wireless', 'Earbuds'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'Smart Fitness Watch with Heart Rate Monitor',
      description: 'Advanced fitness tracking with heart rate monitoring',
      price: 79.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop',
      rating: 4.7,
      reviewCount: 156,
      category: 'Electronics',
      brand: 'FitTech',
      retailer: 'Best Buy',
      inStock: true,
      features: ['Heart Rate Monitor', 'GPS', 'Water Resistant'],
      specifications: { 'Battery Life': '7 days', 'Water Resistance': '5ATM' },
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop'],
      tags: ['Fitness', 'Smartwatch', 'Health'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '4',
      name: 'Portable Bluetooth Speaker Waterproof',
      description: 'Waterproof portable speaker with amazing sound quality',
      price: 34.99,
      originalPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=200&fit=crop',
      rating: 4.2,
      reviewCount: 67,
      category: 'Electronics',
      brand: 'SoundWave',
      retailer: 'Walmart',
      inStock: true,
      features: ['Waterproof', 'Portable', 'Long Battery'],
      specifications: { 'Battery Life': '12 hours', 'Water Resistance': 'IPX7' },
      images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=200&fit=crop'],
      tags: ['Audio', 'Portable', 'Waterproof'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '5',
      name: 'Gaming Mechanical Keyboard RGB Backlit',
      description: 'Professional gaming keyboard with RGB lighting',
      price: 89.99,
      originalPrice: 149.99,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=200&fit=crop',
      rating: 4.6,
      reviewCount: 234,
      category: 'Electronics',
      brand: 'GameTech',
      retailer: 'Newegg',
      inStock: true,
      features: ['RGB Lighting', 'Mechanical Switches', 'Programmable Keys'],
      specifications: { 'Switch Type': 'Cherry MX Red', 'Backlight': 'RGB' },
      images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=200&fit=crop'],
      tags: ['Gaming', 'Keyboard', 'RGB'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '6',
      name: '4K Ultra HD Smart TV 55 inch',
      description: 'Stunning 4K resolution with smart features',
      price: 399.99,
      originalPrice: 699.99,
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=200&fit=crop',
      rating: 4.8,
      reviewCount: 445,
      category: 'Electronics',
      brand: 'ViewTech',
      retailer: 'Target',
      inStock: true,
      features: ['4K Resolution', 'Smart TV', 'HDR'],
      specifications: { 'Screen Size': '55 inch', 'Resolution': '4K UHD' },
      images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=200&fit=crop'],
      tags: ['TV', '4K', 'Smart TV'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '7',
      name: 'Wireless Charging Pad Fast Charger',
      description: 'Fast wireless charging pad for all devices',
      price: 19.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=400&h=200&fit=crop',
      rating: 4.1,
      reviewCount: 78,
      category: 'Electronics',
      brand: 'ChargeTech',
      retailer: 'Amazon',
      inStock: true,
      features: ['Fast Charging', 'Universal', 'LED Indicator'],
      specifications: { 'Power Output': '15W', 'Compatibility': 'Qi Standard' },
      images: ['https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=400&h=200&fit=crop'],
      tags: ['Charging', 'Wireless', 'Fast Charging'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '8',
      name: 'Professional Camera DSLR Kit',
      description: 'Professional DSLR camera with lens kit',
      price: 599.99,
      originalPrice: 999.99,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=200&fit=crop',
      rating: 4.9,
      reviewCount: 567,
      category: 'Electronics',
      brand: 'PhotoPro',
      retailer: 'B&H Photo',
      inStock: true,
      features: ['24MP Sensor', '4K Video', 'Dual Card Slots'],
      specifications: { 'Sensor': '24MP APS-C', 'Video': '4K 30fps' },
      images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=200&fit=crop'],
      tags: ['Camera', 'DSLR', 'Professional'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '9',
      name: 'Robot Vacuum Cleaner with Mapping',
      description: 'Smart robot vacuum with advanced mapping technology',
      price: 199.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=200&fit=crop',
      rating: 4.4,
      reviewCount: 189,
      category: 'Home',
      brand: 'CleanBot',
      retailer: 'Costco',
      inStock: true,
      features: ['Smart Mapping', 'App Control', 'Auto Return'],
      specifications: { 'Battery Life': '120 minutes', 'Suction': '2000Pa' },
      images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=200&fit=crop'],
      tags: ['Robot', 'Vacuum', 'Smart Home'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '10',
      name: 'Gaming Mouse RGB 16000 DPI',
      description: 'High-precision gaming mouse with RGB lighting',
      price: 39.99,
      originalPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=200&fit=crop',
      rating: 4.5,
      reviewCount: 123,
      category: 'Electronics',
      brand: 'GameTech',
      retailer: 'Micro Center',
      inStock: true,
      features: ['16000 DPI', 'RGB Lighting', 'Programmable Buttons'],
      specifications: { 'DPI': '16000', 'Buttons': '7 Programmable' },
      images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=200&fit=crop'],
      tags: ['Gaming', 'Mouse', 'RGB'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '11',
      name: 'Air Fryer Digital 5.8L Capacity',
      description: 'Large capacity air fryer with digital controls',
      price: 69.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop',
      rating: 4.3,
      reviewCount: 234,
      category: 'Home',
      brand: 'KitchenPro',
      retailer: 'Walmart',
      inStock: true,
      features: ['5.8L Capacity', 'Digital Display', '8 Presets'],
      specifications: { 'Capacity': '5.8L', 'Power': '1700W' },
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop'],
      tags: ['Kitchen', 'Air Fryer', 'Digital'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '12',
      name: 'Wireless Gaming Headset with Mic',
      description: 'Premium wireless gaming headset with microphone',
      price: 49.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop',
      rating: 4.2,
      reviewCount: 89,
      category: 'Electronics',
      brand: 'AudioTech',
      retailer: 'Best Buy',
      inStock: true,
      features: ['Wireless', 'Noise Cancelling Mic', 'Surround Sound'],
      specifications: { 'Battery Life': '20 hours', 'Connectivity': '2.4GHz' },
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop'],
      tags: ['Gaming', 'Headset', 'Wireless'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '13',
      name: 'Smart Home Security Camera System',
      description: 'Complete home security system with smart cameras',
      price: 149.99,
      originalPrice: 299.99,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
      rating: 4.6,
      reviewCount: 178,
      category: 'Home',
      brand: 'SecureHome',
      retailer: 'Home Depot',
      inStock: true,
      features: ['1080p HD', 'Night Vision', 'Motion Detection'],
      specifications: { 'Resolution': '1080p', 'Storage': 'Cloud + Local' },
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop'],
      tags: ['Security', 'Camera', 'Smart Home'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '14',
      name: 'Electric Standing Desk Adjustable',
      description: 'Electric adjustable standing desk for home office',
      price: 299.99,
      originalPrice: 499.99,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop',
      rating: 4.7,
      reviewCount: 156,
      category: 'Home',
      brand: 'OfficePro',
      retailer: 'IKEA',
      inStock: true,
      features: ['Electric Adjustment', 'Memory Presets', 'Cable Management'],
      specifications: { 'Height Range': '28-48 inches', 'Weight Capacity': '300 lbs' },
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop'],
      tags: ['Office', 'Standing Desk', 'Adjustable'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '15',
      name: 'Portable Power Bank 20000mAh',
      description: 'High capacity portable power bank for all devices',
      price: 24.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=400&h=200&fit=crop',
      rating: 4.1,
      reviewCount: 67,
      category: 'Electronics',
      brand: 'PowerTech',
      retailer: 'Amazon',
      inStock: true,
      features: ['20000mAh', 'Fast Charging', 'Multiple Ports'],
      specifications: { 'Capacity': '20000mAh', 'Output': '18W Fast Charging' },
      images: ['https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=400&h=200&fit=crop'],
      tags: ['Power Bank', 'Portable', 'Fast Charging'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '16',
      name: 'Smart LED Light Bulbs Pack of 4',
      description: 'Smart LED bulbs with app control and voice commands',
      price: 19.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=200&fit=crop',
      rating: 4.0,
      reviewCount: 45,
      category: 'Home',
      brand: 'LightSmart',
      retailer: 'Target',
      inStock: true,
      features: ['App Control', 'Voice Commands', 'Color Changing'],
      specifications: { 'Wattage': '9W', 'Lumens': '800lm', 'Color Temperature': '2700K-6500K' },
      images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=200&fit=crop'],
      tags: ['Smart Home', 'LED', 'Lighting'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '17',
      name: 'Wireless Car Charger Mount',
      description: 'Wireless charging mount for car dashboard',
      price: 29.99,
      originalPrice: 59.99,
      image: 'https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=400&h=200&fit=crop',
      rating: 4.3,
      reviewCount: 89,
      category: 'Automotive',
      brand: 'CarTech',
      retailer: 'AutoZone',
      inStock: true,
      features: ['Wireless Charging', 'Auto Clamp', '360° Rotation'],
      specifications: { 'Charging Speed': '10W', 'Compatibility': 'All Phones' },
      images: ['https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=400&h=200&fit=crop'],
      tags: ['Car', 'Charging', 'Mount'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '18',
      name: 'Smart Coffee Maker WiFi Enabled',
      description: 'Smart coffee maker with WiFi connectivity and app control',
      price: 89.99,
      originalPrice: 159.99,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop',
      rating: 4.4,
      reviewCount: 123,
      category: 'Home',
      brand: 'CoffeeTech',
      retailer: 'Bed Bath & Beyond',
      inStock: true,
      features: ['WiFi Connected', 'App Control', 'Programmable'],
      specifications: { 'Capacity': '12 cups', 'Connectivity': 'WiFi + Bluetooth' },
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop'],
      tags: ['Coffee', 'Smart Home', 'WiFi'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '19',
      name: 'Bluetooth Beanie with Speakers',
      description: 'Warm beanie with built-in Bluetooth speakers',
      price: 19.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop',
      rating: 3.9,
      reviewCount: 34,
      category: 'Fashion',
      brand: 'WearTech',
      retailer: 'Amazon',
      inStock: true,
      features: ['Built-in Speakers', 'Warm Material', 'Bluetooth 5.0'],
      specifications: { 'Battery Life': '6 hours', 'Connectivity': 'Bluetooth 5.0' },
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop'],
      tags: ['Fashion', 'Audio', 'Winter'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '20',
      name: 'Smart Door Lock Keyless Entry',
      description: 'Smart door lock with keyless entry and app control',
      price: 129.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
      rating: 4.5,
      reviewCount: 89,
      category: 'Home',
      brand: 'LockSmart',
      retailer: 'Lowe\'s',
      inStock: true,
      features: ['Keyless Entry', 'App Control', 'Auto Lock'],
      specifications: { 'Battery Life': '1 year', 'Connectivity': 'WiFi + Bluetooth' },
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop'],
      tags: ['Smart Home', 'Security', 'Door Lock'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    }
  ];

  // Remove useEffect since we're using ProductContext now

  // Create sections from actual products
  const justForYouDeals = products.filter(p => p.category === 'Electronics').slice(0, 8);
  const hotDeals = products.filter(p => p.price < 100).slice(0, 8);
  const trendingDeals = products.filter(p => p.rating > 4.5).slice(0, 8);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <Typography variant="h6" sx={{ color: '#6b7280' }}>
          Loading amazing products...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        
        {/* Just For You Section */}
        {justForYouDeals.length > 0 && (
          <SimpleSlider
            products={justForYouDeals}
            title="Just For You"
            onProductClick={handleProductClick}
          />
        )}

        {/* Hot Deals Section */}
        {hotDeals.length > 0 && (
          <SimpleSlider
            products={hotDeals}
            title="Hot Deals"
            onProductClick={handleProductClick}
          />
        )}

        {/* Trending Deals Section */}
        {trendingDeals.length > 0 && (
          <SimpleSlider
            products={trendingDeals}
            title="Trending Deals"
            onProductClick={handleProductClick}
          />
        )}

        {/* Fallback when no products */}
        {products.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: 'white',
            borderRadius: 3,
            border: '1px solid #e5e7eb'
          }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                color: '#1a1a1a',
                mb: 2
              }}
            >
              No Products Available
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#6b7280',
                mb: 4
              }}
            >
              Check back later for amazing deals!
            </Typography>
          </Box>
        )}

      </Container>
    </Box>
  );
};

export default HomePage;