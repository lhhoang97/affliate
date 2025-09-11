// Debug script to clear cart and test
console.log('Clearing guest cart...');
localStorage.removeItem('guest_cart');
console.log('Guest cart cleared!');
console.log('Current localStorage:', localStorage.getItem('guest_cart'));
