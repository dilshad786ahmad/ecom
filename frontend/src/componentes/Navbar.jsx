import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
        console.error('Error fetching products for navbar', error);
      }
    };
    fetchProducts();
  }, [location.pathname]); // Update when navigating to sync localStorage

  const handleSearchSubmit = (query) => {
    if (!query.trim()) return;
    const term = query.trim();
    const storedRs = JSON.parse(localStorage.getItem('recentSearches')) || [];
    const updatedRs = [term, ...storedRs.filter(t => t.toLowerCase() !== term.toLowerCase())].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRs));
    setRecentSearches(updatedRs);
    
    setIsSearchFocused(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const removeRecentlyViewed = (e, id) => {
    e.stopPropagation(); // prevent navigation
    const storedRv = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    const updatedRv = storedRv.filter(itemId => itemId !== id);
    localStorage.setItem('recentlyViewed', JSON.stringify(updatedRv));
    setRecentlyViewed(prev => prev.filter(item => item._id !== id));
  };

  const searchResults = searchQuery
    ? allProducts.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <>
    <nav className="sticky top-0 w-full dark-hero-nav z-50">
      <div
        className="flex justify-between items-center w-full px-margin-mobile py-4 max-w-container-max mx-auto border-b border-white"
        style={{ paddingLeft: '16px', paddingRight: '16px' }}
      >
        {/* For desktop, override padding */}
        <style>{`
          @media (min-width: 768px) {
            .nav-inner { padding-left: 64px !important; padding-right: 64px !important; }
          }
        `}</style>

        {/* Brand */}
        <div
          className="text-headline-md font-black uppercase tracking-tighter text-white cursor-pointer"
          style={{ fontSize: '24px', letterSpacing: '-0.01em', fontWeight: 900 }}
        >
        <NavLink to="/" >TECHNE</NavLink>
        </div>

        {/* Large Search Bar */}
        {location.pathname !== '/all-products' && (
          <div className="hidden md:flex flex-grow max-w-3xl mx-8 relative">
            <div className="flex w-full bg-[rgba(255,255,255,0.05)] rounded-full items-center px-4 py-3 border border-[rgba(255,255,255,0.1)] transition-colors hover:border-[rgba(255,255,255,0.2)] z-50">
              <span className="material-symbols-outlined text-[#a1a1aa] mr-3 text-[22px]">search</span>
              <input 
                type="text" 
                placeholder="Search equipment..." 
                className="flex-grow bg-transparent text-white outline-none placeholder-[#a1a1aa] text-sm tracking-wide"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(searchQuery);
                  }
                }}
              />
              <div className="flex gap-2">
                <button className="flex items-center justify-center p-1.5 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors group">
                  <span className="material-symbols-outlined text-[#a1a1aa] group-hover:text-white transition-colors text-[20px]">mic</span>
                </button>
                <button className="flex items-center justify-center p-1.5 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors group">
                  <span className="material-symbols-outlined text-[#a1a1aa] group-hover:text-white transition-colors text-[20px]">camera</span>
                </button>
              </div>
            </div>

            {/* Search Dropdown */}
            <div 
              className={`absolute top-[120%] left-[50%] -translate-x-1/2 w-[120%] bg-[#1a1a1a] border border-[#333] shadow-2xl p-6 z-40 flex flex-col gap-6 transition-all duration-300 origin-top ${isSearchFocused ? 'opacity-100 scale-100 translate-y-0 visible pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'}`}
            >
              
              {!searchQuery ? (
                <>
                  {/* Recent Searches */}
                  <div>
                    <h4 className="text-[#a1a1aa] text-xs font-bold uppercase tracking-widest mb-3">Recent Searches</h4>
                    {recentSearches.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term, idx) => (
                          <button key={idx} onClick={() => handleSearchSubmit(term)} className="text-white text-sm bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 hover:bg-[rgba(255,255,255,0.1)] transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-[#a1a1aa]">history</span>
                            {term}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#a1a1aa] text-xs">No recent searches</p>
                    )}
                  </div>

                  {/* Recently Viewed */}
                  <div>
                    <h4 className="text-[#a1a1aa] text-xs font-bold uppercase tracking-widest mb-3">Recently Viewed</h4>
                    {recentlyViewed.length > 0 ? (
                      <div className="flex gap-4">
                        {recentlyViewed.map((item) => (
                          <div key={item._id} className="group relative cursor-pointer flex flex-col gap-1 w-[80px]" onClick={() => navigate(`/single-product?id=${item._id}`)}>
                            <div className="w-[80px] h-[80px] bg-[#ffffff] p-1 flex items-center justify-center relative overflow-hidden border border-[rgba(255,255,255,0.1)] group-hover:border-white transition-colors">
                              <img src={item.image} alt={item.alt || item.name} className="w-full h-full object-contain grayscale mix-blend-multiply transition-transform duration-300 group-hover:scale-105" />
                              <button 
                                onClick={(e) => removeRecentlyViewed(e, item._id)}
                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                              >
                                <span className="material-symbols-outlined text-[12px]">close</span>
                              </button>
                            </div>
                            <div>
                              <p className="text-white text-[9px] font-semibold uppercase tracking-widest truncate">{item.name}</p>
                              <p className="text-[#a1a1aa] text-[9px]">{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#a1a1aa] text-xs">No recently viewed items</p>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <h4 className="text-[#a1a1aa] text-xs font-bold uppercase tracking-widest mb-3">Search Results</h4>
                  {searchResults.length > 0 ? (
                    <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                      {searchResults.map((item, idx) => (
                        <div key={`${item._id}-${idx}`} onClick={() => handleSearchSubmit(item.name)} className="flex items-center gap-4 p-2 hover:bg-[rgba(255,255,255,0.05)] cursor-pointer transition-colors border border-transparent hover:border-[rgba(255,255,255,0.1)]">
                          <div className="w-12 h-12 bg-white p-1 flex-shrink-0 flex items-center justify-center">
                            <img src={item.image} alt={item.alt || item.name} className="w-full h-full object-contain grayscale mix-blend-multiply" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white text-sm font-semibold uppercase tracking-wider">{item.name}</span>
                            <span className="text-[#a1a1aa] text-xs">${item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#a1a1aa] text-sm py-4 text-center">No products found matching "{searchQuery}"</p>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

        {/* Trailing Actions */}
        <div className="flex items-center" style={{ gap: '12px' }}>
          {/* Wishlist Button */}
          <button
            aria-label="wishlist"
            className="hidden md:flex p-2 items-center justify-center text-white transition-colors duration-200 relative"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            onClick={() => navigate('/likes')}
          >
            <span className="material-symbols-outlined">favorite_border</span>
            {wishlist?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] w-4 h-4 flex items-center justify-center font-bold" style={{ fontSize: '10px' }}>
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            aria-label="shopping_cart"
            className="hidden md:flex p-2 items-center justify-center text-white transition-colors duration-200 relative"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            onClick={() => navigate('/your-cart')}
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartItems?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] w-4 h-4 flex items-center justify-center font-bold" style={{ fontSize: '10px' }}>
                {cartItems.length}
              </span>
            )}
          </button>

          {/* Mobile Menu Button - Removed */}

          {/* Auth Button */}
          {userInfo ? (
            <div className="relative flex items-center gap-4">
              {/* Mobile View: Avatar (Not Clickable) */}
              <div className="md:hidden w-8 h-8 rounded-full bg-[#141414] border border-[#ffffff] flex items-center justify-center overflow-hidden shrink-0">
                {userInfo.image ? (
                  <img src={userInfo.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[#ffffff] text-[18px]">person</span>
                )}
              </div>

              {/* Desktop View: Name and Arrow (Clickable) */}
              <button 
                className="hidden md:flex items-center gap-2 text-white text-sm font-semibold tracking-wide hover:text-[#ffffff] transition-colors"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                {userInfo.firstName}
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute top-[120%] right-0 w-[280px] bg-[#1a1a1a] border border-[#333] shadow-2xl z-50 flex flex-col origin-top-right">
                  <div className="flex items-center gap-4 p-4 border-b border-[#333]">
                    <div className="w-12 h-12 rounded-full bg-[#141414] border border-[#ffffff] flex items-center justify-center overflow-hidden shrink-0">
                      {userInfo.image ? (
                        <img src={userInfo.image} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-[#ffffff]">person</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-white text-sm font-bold uppercase tracking-wider truncate">{userInfo.firstName} {userInfo.lastName || ''}</h4>
                      <p className="text-[#a1a1aa] text-[10px] truncate">{userInfo.email}</p>
                      <p className="text-[#a1a1aa] text-[10px] truncate">{userInfo.phone || '+1 234 567 8900'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col py-2">
                    <button onClick={() => { setIsProfileMenuOpen(false); navigate('/orders'); }} className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors text-left uppercase tracking-wider w-full">
                      <span className="material-symbols-outlined text-[#ffffff] text-[18px]">inventory_2</span> My Orders
                    </button>
                    <button onClick={() => { setIsProfileMenuOpen(false); navigate('/likes'); }} className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors text-left uppercase tracking-wider w-full">
                      <span className="material-symbols-outlined text-[#ffffff] text-[18px]">favorite</span> Liked Products
                    </button>
                  </div>
                  <div className="border-t border-[#333] p-4 flex flex-col gap-2">
                    {userInfo.role === 'admin' && (
                      <button
                        className="w-full text-label-md uppercase px-4 py-2 transition-colors border flex items-center justify-center text-black border-white bg-white hover:bg-gray-200 font-semibold text-[12px] tracking-widest"
                        onClick={() => { setIsProfileMenuOpen(false); navigate('/admin'); }}
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      className="w-full text-label-md uppercase px-4 py-2 transition-colors border flex items-center justify-center text-[#ffffff] border-[#ffffff] hover:bg-[#ffffff] hover:text-black font-semibold text-[12px] tracking-widest"
                      onClick={() => { setIsProfileMenuOpen(false); setShowLogoutConfirm(true); }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {/* Mobile View: Account Icon (Not Clickable) */}
              <div className="md:hidden w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white">
                <span className="material-symbols-outlined text-[24px]">account_circle</span>
              </div>
              
              {/* Desktop View: Login Button */}
              <button
                className="hidden md:flex text-label-md uppercase px-4 py-2 transition-colors border items-center justify-center"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  borderColor: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e2e2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                onClick={() => navigate('/signin')}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>

      {/* Logout Confirmation Pop-up */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[9999] transition-all duration-300"
          style={{
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="flex flex-col items-center relative overflow-hidden"
            style={{
              backgroundColor: '#141414',
              border: 'none',
              boxShadow: '0 0 20px 4px rgba(0,0,0,0.6)',
              padding: '40px 36px',
              width: '90%',
              maxWidth: '400px',
              gap: '24px',
            }}
          >
            {/* Top Gold Accent Line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, transparent, #ffffff, transparent)' }}></div>

            <div className="flex flex-col items-center" style={{ gap: '12px' }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '40px', color: '#ffffff', fontVariationSettings: "'FILL' 0, 'wght' 200" }}
              >
                logout
              </span>
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', textAlign: 'center', margin: 0 }}>End Session?</h3>
              <p style={{ color: '#888888', fontSize: '13px', textAlign: 'center', lineHeight: 1.7, margin: 0 }}>
                Are you sure you want to logout? You will need to sign in again.
              </p>
            </div>

            <div className="flex w-full" style={{ gap: '12px', marginTop: '8px' }}>
              <button
                style={{
                  flex: 1,
                  padding: '13px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: 'transparent',
                  color: '#a1a1aa',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a1a1aa'; }}
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '13px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  border: '1px solid #ffffff',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e2e2'; e.currentTarget.style.borderColor = '#e2e2e2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#ffffff'; }}
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                  navigate('/');
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
