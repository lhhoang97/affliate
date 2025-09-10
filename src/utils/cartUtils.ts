// Simple cart utility functions
export const getGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem('guest_cart') || '[]');
  } catch {
    return [];
  }
};

export const saveGuestCart = (cart: any[]) => {
  localStorage.setItem('guest_cart', JSON.stringify(cart));
};

export const addToGuestCart = (productId: string, quantity: number = 1) => {
  const cart = getGuestCart();
  const existingItem = cart.find((item: any) => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId,
      quantity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  saveGuestCart(cart);
  return cart;
};

export const updateGuestCartQuantity = (itemId: string, quantity: number) => {
  const cart = getGuestCart();
  const itemIndex = cart.findIndex((item: any) => item.id === itemId);
  
  if (itemIndex === -1) {
    throw new Error('Item not found');
  }
  
  if (quantity <= 0) {
    cart.splice(itemIndex, 1);
  } else {
    cart[itemIndex].quantity = quantity;
    cart[itemIndex].updated_at = new Date().toISOString();
  }
  
  saveGuestCart(cart);
  return cart;
};

export const removeFromGuestCart = (itemId: string) => {
  const cart = getGuestCart();
  const filteredCart = cart.filter((item: any) => item.id !== itemId);
  saveGuestCart(filteredCart);
  return filteredCart;
};

export const clearGuestCart = () => {
  localStorage.removeItem('guest_cart');
  return [];
};
