'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('ankerhub-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        localStorage.removeItem('ankerhub-cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ankerhub-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          toast.error('Cannot add more than available stock');
          return prev;
        }
        toast.success('Cart updated');
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: newQty } : item
        );
      }
      if (quantity > product.stock) {
        toast.error('Cannot add more than available stock');
        return prev;
      }
      toast.success('Added to cart');
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url || '',
          stock: product.stock,
          quantity,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
    toast.success('Removed from cart');
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => {
        if (item._id === productId) {
          if (quantity > item.stock) {
            toast.error('Cannot exceed available stock');
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCoupon(null);
    setCouponDiscount(0);
    localStorage.removeItem('ankerhub-cart');
  }, []);

  const applyCoupon = useCallback(
    async (code, token) => {
      try {
        const res = await fetch('/api/coupons/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code, subtotal }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Invalid coupon');
        }

        setCoupon(data.coupon);
        setCouponDiscount(data.discount);
        toast.success(`Coupon applied! You save PKR ${data.discount}`);
        return data;
      } catch (error) {
        toast.error(error.message);
        throw error;
      }
    },
    []
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setCouponDiscount(0);
    toast.success('Coupon removed');
  }, []);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 5000 ? 0 : 200;
  const total = subtotal - couponDiscount + shippingCost;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        shippingCost,
        coupon,
        couponDiscount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
