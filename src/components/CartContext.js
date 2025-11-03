import React, { createContext, useContext, useState, useEffect } from 'react';

// Create CartContext
const CartContext = createContext();

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from sessionStorage on component mount (safe parse)
  useEffect(() => {
    try {
      const savedCart = sessionStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
    } catch (err) {
      // if parse fails, reset stored cart
      console.error("Failed to parse saved cart:", err);
      sessionStorage.setItem('cart', JSON.stringify([]));
      setCartItems([]);
    }
  }, []);

  // NOTE: we'll still keep sessionStorage in sync via immediate writes inside
  // each mutator (so consumers navigating immediately will see the persisted value)

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

    setCartItems(prev => {
      const next = [...prev, cartItem];
      try { sessionStorage.setItem('cart', JSON.stringify(next)); } catch(e) {console.error(e)}
      return next;
    });
  };

  // Update quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prev => {
      const next = prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
          : item
      );
      try { sessionStorage.setItem('cart', JSON.stringify(next)); } catch(e) {console.error(e)}
      return next;
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const next = prev.filter(item => item.id !== itemId);
      try { sessionStorage.setItem('cart', JSON.stringify(next)); } catch(e) {console.error(e)}
      return next;
    });
  };

  // Update toppings
  const updateToppings = (itemId, newToppings) => {
    setCartItems(prev => {
      const next = prev.map(item =>
        item.id === itemId
          ? { ...item, toppings: newToppings }
          : item
      );
      try { sessionStorage.setItem('cart', JSON.stringify(next)); } catch(e) {console.error(e)}
      return next;
    });
  };

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Get cart count
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Clear cart
  const clearCart = () => {
    setCartItems(() => {
      try { sessionStorage.setItem('cart', JSON.stringify([])); } catch(e) {console.error(e)}
      return [];
    });
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