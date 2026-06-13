import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { userInfo } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      fetchCart();
    } else {
      const localCart = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartItems(localCart);
    }
  }, [userInfo]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCartItems(data.cartItems || []);
      // Sync local cart to server if needed
      const localCart = JSON.parse(localStorage.getItem('cartItems'));
      if (localCart && localCart.length > 0) {
        for (let item of localCart) {
          await api.post('/cart', { productId: item.product, ...item });
        }
        localStorage.removeItem('cartItems');
        const { data: updatedCart } = await api.get('/cart');
        setCartItems(updatedCart.cartItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, qty = 1) => {
    const item = {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      qty,
    };

    if (userInfo) {
      try {
        await api.post('/cart', { productId: product._id, ...item });
        fetchCart();
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      const existingCart = [...cartItems];
      const existItem = existingCart.find((x) => x.product === item.product);
      if (existItem) {
        existItem.qty += Number(qty);
      } else {
        existingCart.push(item);
      }
      setCartItems(existingCart);
      localStorage.setItem('cartItems', JSON.stringify(existingCart));
    }
  };

  const updateCartItem = async (id, qty) => {
    if (userInfo) {
      try {
        await api.put(`/cart/${id}`, { qty });
        fetchCart();
      } catch (error) {
        console.error('Error updating cart item:', error);
      }
    } else {
      const existingCart = [...cartItems];
      const item = existingCart.find((x) => x.product === id);
      if (item) {
        item.qty = Number(qty);
        setCartItems(existingCart);
        localStorage.setItem('cartItems', JSON.stringify(existingCart));
      }
    }
  };

  const removeFromCart = async (id) => {
    if (userInfo) {
      try {
        await api.delete(`/cart/${id}`);
        fetchCart();
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      const existingCart = cartItems.filter((x) => x.product !== id);
      setCartItems(existingCart);
      localStorage.setItem('cartItems', JSON.stringify(existingCart));
    }
  };

  const clearCart = async () => {
    if (userInfo) {
      try {
        await api.delete('/cart');
        setCartItems([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('cartItems');
    }
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        cartTotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
