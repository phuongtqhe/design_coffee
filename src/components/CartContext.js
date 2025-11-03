import React, { createContext, useContext, useState, useEffect } from 'react';

// Create CartContext
const CartContext = createContext();

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from sessionStorage on component mount
  useEffect(() => {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to sessionStorage whenever cartItems change
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, options) => {
    const cartItem = {
      id: `${product.id}_${Date.now()}`, // Unique ID for each cart item
      productId: product.id,
      name: product.title || product.name,
      price: product.price,
      image: (product.images && product.images[0]) || "/logo192.png",
      quantity: options.quantity,
      iceLevel: options.iceLevel,
      sugarLevel: options.sugarLevel,
      toppings: options.toppings || [],
      totalPrice: product.price * options.quantity
    };

    setCartItems(prev => [...prev, cartItem]);
  };

  // Update quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
          : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Update toppings
  const updateToppings = (itemId, newToppings) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, toppings: newToppings }
          : item
      )
    );
  };

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Get cart count
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    updateToppings,
    total,
    cartCount,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartContext };