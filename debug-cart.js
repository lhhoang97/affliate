console.log('🔍 Debug Cart Data');
console.log('==================');

// Check localStorage
const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
console.log('📦 Guest Cart from localStorage:', guestCart);

// Check each item
guestCart.forEach((item, index) => {
  console.log(`\n📋 Item ${index + 1}:`);
  console.log('  ID:', item.id);
  console.log('  Product ID:', item.productId);
  console.log('  Quantity:', item.quantity);
  console.log('  Bundle Option:', item.bundleOption);
  console.log('  Created:', item.created_at);
});

// Check if bundle options exist
const hasBundleOptions = guestCart.some(item => item.bundleOption);
console.log('\n🎯 Has Bundle Options:', hasBundleOptions);

// Check bundle types
const bundleTypes = guestCart.map(item => item.bundleOption?.type || 'none');
console.log('🎯 Bundle Types:', bundleTypes);

// Check total items
const totalItems = guestCart.reduce((sum, item) => sum + item.quantity, 0);
console.log('🎯 Total Items:', totalItems);

// Check total price (if bundle options exist)
let totalPrice = 0;
let totalSavings = 0;

guestCart.forEach(item => {
  if (item.bundleOption) {
    totalPrice += item.bundleOption.discountedPrice;
    totalSavings += (item.bundleOption.originalPrice - item.bundleOption.discountedPrice);
  } else {
    // Fallback to basic pricing
    totalPrice += (item.quantity * 150); // Default price
  }
});

console.log('🎯 Total Price:', totalPrice);
console.log('🎯 Total Savings:', totalSavings);

console.log('\n✅ Debug Complete!');
