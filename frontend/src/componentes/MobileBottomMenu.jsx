import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const MobileBottomMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  const [allProducts, setAllProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setAllProducts(data);
        
        const storedRv = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        const rvProducts = storedRv.map(id => data.find(p => p._id === id)).filter(Boolean);
        setRecentlyViewed(rvProducts.slice(0, 4));

        const storedRs = JSON.parse(localStorage.getItem('recentSearches')) || [];
        setRecentSearches(storedRs.slice(0, 5));
      } catch (error) {
        console.error('Error fetching products for mobile menu', error);
      }
    };
    fetchProducts();
  }, [location.pathname]);

  const handleSearchSubmit = (query) => {
    if (!query.trim()) return;
    const term = query.trim();
    const storedRs = JSON.parse(localStorage.getItem('recentSearches')) || [];
    const updatedRs = [term, ...storedRs.filter(t => t.toLowerCase() !== term.toLowerCase())].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRs));
    setRecentSearches(updatedRs);
    
    setIsSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const removeRecentlyViewed = (e, id) => {
    e.stopPropagation();
    const storedRv = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    const updatedRv = storedRv.filter(itemId => itemId !== id);
    localStorage.setItem('recentlyViewed', JSON.stringify(updatedRv));
    setRecentlyViewed(prev => prev.filter(item => item._id !== id));
  };

  const searchResults = searchQuery
    ? allProducts.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const ALL_CATEGORIES = [...new Set(allProducts.map((p) => p.category).filter(Boolean))].sort();

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    setIsSearchOpen(false);
    setIsCategoryOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Search Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-[#000000] text-white transition-transform duration-300 ${isSearchOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ paddingBottom: '70px', paddingTop: '80px' }}
      >
        <div className="flex flex-col h-full pt-4">
          <div className="flex items-center px-4 pb-4 border-b border-[#333]">
            <div className="flex w-full bg-[rgba(255,255,255,0.05)] rounded-full items-center px-4 py-3 border border-[rgba(255,255,255,0.1)]">
              <span className="material-symbols-outlined text-[#a1a1aa] mr-3 text-[20px]">search</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search equipment..."
                className="flex-grow bg-transparent text-white outline-none placeholder-[#a1a1aa] text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(searchQuery);
                  }
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <span className="material-symbols-outlined text-[#a1a1aa] text-[20px]">close</span>
                </button>
              )}
            </div>
            <button
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
              className="ml-4 text-xs font-bold uppercase tracking-wider text-[#a1a1aa] hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {!searchQuery ? (
              <div className="flex flex-col gap-8">
                <div>
                  <h4 className="text-[#a1a1aa] text-xs font-bold uppercase tracking-widest mb-4">Recent Searches</h4>
                  {recentSearches.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSearchSubmit(term)}
                          className="text-white text-sm bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] px-4 py-2 hover:bg-[rgba(255,255,255,0.1)] transition-colors flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[16px] text-[#a1a1aa]">history</span>
                          {term}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#a1a1aa] text-sm">No recent searches</p>
                  )}
                </div>
                <div>
                  <h4 className="text-[#a1a1aa] text-xs font-bold uppercase tracking-widest mb-4">Recently Viewed</h4>
                  {recentlyViewed.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                      {recentlyViewed.map((item) => (
                        <div
                          key={item._id}
                          className="cursor-pointer relative group flex flex-col gap-2 w-[100px]"
                          onClick={() => { setIsSearchOpen(false); navigate(`/single-product?id=${item._id}`); }}
                        >
                          <div className="w-[100px] h-[100px] bg-white p-2 flex items-center justify-center border border-[rgba(255,255,255,0.1)] relative">
                            <img src={item.image} alt={item.alt} className="w-full h-full object-contain grayscale mix-blend-multiply" />
                            <button 
                              onClick={(e) => removeRecentlyViewed(e, item._id)}
                              className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black md:opacity-100"
                            >
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </div>
                          <div>
                            <p className="text-white text-[10px] font-semibold uppercase tracking-widest truncate">{item.name}</p>
                            <p className="text-[#a1a1aa] text-[10px] mt-1">{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#a1a1aa] text-sm">No recently viewed items</p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-[#a1a1aa] text-xs font-bold uppercase tracking-widest mb-4">Search Results</h4>
                {searchResults.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {searchResults.map((item, idx) => (
                      <div
                        key={`${item._id}-${idx}`}
                        onClick={() => handleSearchSubmit(item.name)}
                        className="flex items-center gap-4 p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] cursor-pointer"
                      >
                        <div className="w-14 h-14 bg-white p-2 flex-shrink-0 flex items-center justify-center">
                          <img src={item.image} alt={item.alt || item.name} className="w-full h-full object-contain grayscale mix-blend-multiply" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-white text-sm font-semibold uppercase tracking-wider">{item.name}</span>
                          <span className="text-[#a1a1aa] text-xs">${item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#a1a1aa] text-sm py-8 text-center">No products found matching "{searchQuery}"</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-[#000000] text-white transition-transform duration-300 ${isCategoryOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ paddingBottom: '70px', paddingTop: '80px' }}
      >
        <div className="flex flex-col h-full pt-4">
          <div className="flex items-center justify-between px-6 pb-4 border-b border-[#333]">
            <h2 className="text-lg font-bold uppercase tracking-widest text-white">Categories</h2>
            <button
              onClick={() => setIsCategoryOpen(false)}
              className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] hover:text-white transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
              Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-4">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setIsCategoryOpen(false); navigate(`/search?q=${encodeURIComponent(cat)}`); }}
                  className="text-left w-full text-white text-sm bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-4 hover:bg-[rgba(255,255,255,0.1)] transition-colors uppercase tracking-wider flex justify-between items-center"
                >
                  {cat}
                  <span className="material-symbols-outlined text-[#a1a1aa] text-[18px]">chevron_right</span>
                </button>
              ))}
              
              {/* Liked Products moved to Category Menu */}
              <button
                onClick={() => { setIsCategoryOpen(false); navigate('/likes'); }}
                className="text-left w-full text-white text-sm bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-4 hover:bg-[rgba(255,255,255,0.1)] transition-colors uppercase tracking-wider flex justify-between items-center mt-2"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ffffff]">favorite</span>
                  Liked Products
                </div>
                <div className="flex items-center gap-2">
                  {wishlist?.length > 0 && <span className="bg-white text-black text-[10px] px-2 py-0.5 rounded-full font-bold">{wishlist.length}</span>}
                  <span className="material-symbols-outlined text-[#a1a1aa] text-[18px]">chevron_right</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-[#000000] text-white transition-transform duration-300 ${isProfileOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ paddingBottom: '70px', paddingTop: '80px' }}
      >
        <div className="flex flex-col h-full pt-4">
          <div className="flex items-center justify-between px-6 pb-4 border-b border-[#333]">
            <h2 className="text-lg font-bold uppercase tracking-widest text-white">My Profile</h2>
            <button
              onClick={() => setIsProfileOpen(false)}
              className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] hover:text-white transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
              Close
            </button>
          </div>
          
          {userInfo ? (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="w-24 h-24 rounded-full bg-[#1a1a1a] flex items-center justify-center border-2 border-[#ffffff] overflow-hidden">
                  {userInfo.image ? (
                    <img src={userInfo.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[48px] text-[#ffffff]">person</span>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-1">
                    {userInfo.firstName} {userInfo.lastName || ''}
                  </h3>
                  <p className="text-sm text-[#a1a1aa] mb-1">{userInfo.email}</p>
                  <p className="text-sm text-[#a1a1aa]">{userInfo.phone || '+1 234 567 8900'}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => { setIsProfileOpen(false); navigate('/orders'); }}
                  className="w-full text-left text-white text-sm bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-4 hover:bg-[rgba(255,255,255,0.1)] transition-colors uppercase tracking-wider flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#ffffff]">inventory_2</span>
                    My Orders
                  </div>
                  <span className="material-symbols-outlined text-[#a1a1aa] text-[18px]">chevron_right</span>
                </button>
                
                {userInfo.role === 'admin' && (
                  <button
                    onClick={() => { setIsProfileOpen(false); navigate('/admin'); }}
                    className="w-full text-center text-black font-bold text-sm bg-white p-4 mt-2 uppercase tracking-wider transition-colors hover:bg-gray-200"
                  >
                    Admin Dashboard
                  </button>
                )}

                <button
                  onClick={() => { setIsProfileOpen(false); logout(); navigate('/'); }}
                  className="w-full text-center text-[#000000] font-bold text-sm bg-[#ffffff] p-4 mt-2 uppercase tracking-wider transition-colors hover:bg-[#e2e2e2]"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
              <span className="material-symbols-outlined text-[64px] text-[#333]">account_circle</span>
              <p className="text-[#a1a1aa] text-center mb-4">Please log in to view your profile.</p>
              <button
                onClick={() => { setIsProfileOpen(false); navigate('/signin'); }}
                className="px-8 py-3 bg-[#ffffff] text-black font-bold uppercase tracking-wider text-sm transition-colors hover:bg-[#e2e2e2]"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div 
        className="md:hidden fixed bottom-0 left-0 w-full bg-[#000000] text-[#a1a1aa] z-[9999] flex justify-around items-center py-3 border-t border-[#333333]"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={() => { setIsSearchOpen(false); setIsCategoryOpen(false); setIsProfileOpen(false); navigate('/'); }}
          className={`flex flex-col items-center transition-colors ${location.pathname === '/' && !isSearchOpen && !isCategoryOpen && !isProfileOpen ? 'text-white' : 'hover:text-white'}`}
        >
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="text-[10px] mt-1 font-semibold tracking-wider">Home</span>
        </button>

        <button
          onClick={() => { setIsCategoryOpen(false); setIsProfileOpen(false); setIsSearchOpen(true); }}
          className={`flex flex-col items-center transition-colors ${isSearchOpen ? 'text-white' : 'hover:text-white'}`}
        >
          <span className="material-symbols-outlined text-[24px]">search</span>
          <span className="text-[10px] mt-1 font-semibold tracking-wider">Search</span>
        </button>

        <button
          onClick={() => { setIsSearchOpen(false); setIsCategoryOpen(false); setIsProfileOpen(false); navigate('/your-cart'); }}
          className={`flex flex-col items-center transition-colors relative ${location.pathname === '/your-cart' && !isSearchOpen && !isCategoryOpen && !isProfileOpen ? 'text-white' : 'hover:text-white'}`}
        >
          <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
          {cartItems?.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-white text-black text-[9px] w-[14px] h-[14px] flex items-center justify-center font-bold rounded-full">
              {cartItems.length}
            </span>
          )}
          <span className="text-[10px] mt-1 font-semibold tracking-wider">Cart</span>
        </button>

        <button
          onClick={() => { setIsSearchOpen(false); setIsProfileOpen(false); setIsCategoryOpen(true); }}
          className={`flex flex-col items-center transition-colors ${isCategoryOpen ? 'text-white' : 'hover:text-white'}`}
        >
          <span className="material-symbols-outlined text-[24px]">category</span>
          <span className="text-[10px] mt-1 font-semibold tracking-wider">Category</span>
        </button>

        <button
          onClick={() => { 
            setIsSearchOpen(false); 
            setIsCategoryOpen(false); 
            setIsProfileOpen(true);
          }}
          className={`flex flex-col items-center transition-colors ${isProfileOpen ? 'text-white' : 'hover:text-white'}`}
        >
          <span className="material-symbols-outlined text-[24px]">person</span>
          <span className="text-[10px] mt-1 font-semibold tracking-wider">Profile</span>
        </button>
      </div>
    </>
  );
};

export default MobileBottomMenu;
