import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { userInfo } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      fetchWishlist();
    } else {
      const localWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlist(localWishlist);
    }
  }, [userInfo]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/wishlist');
      setWishlist(data.products || []);
      
      // Sync local wishlist if needed
      const localWishlist = JSON.parse(localStorage.getItem('wishlist'));
      if (localWishlist && localWishlist.length > 0) {
        for (let product of localWishlist) {
          const exists = data.products.find(p => p._id === product._id);
          if(!exists) {
            await api.post(`/wishlist/${product._id}`);
          }
        }
        localStorage.removeItem('wishlist');
        const { data: updated } = await api.get('/wishlist');
        setWishlist(updated.products);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product) => {
    if (userInfo) {
      try {
        const { data } = await api.post(`/wishlist/${product._id}`);
        setWishlist(data.products);
      } catch (error) {
        console.error('Error toggling wishlist:', error);
      }
    } else {
      let currentWishlist = [...wishlist];
      const index = currentWishlist.findIndex(p => p._id === product._id);
      
      if (index >= 0) {
        currentWishlist.splice(index, 1);
      } else {
        currentWishlist.push(product);
      }
      
      setWishlist(currentWishlist);
      localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
    }
  };

  const isLiked = (productId) => {
    return wishlist.some(p => p._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        isLiked,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
