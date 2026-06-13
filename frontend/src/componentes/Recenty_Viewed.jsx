import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

/* ── RecentlyViewedCard ── */
const RecentlyViewedCard = ({ item }) => {
  const [qty, setQty] = useState(0);
  const { addToCart } = useCart();
  const { toggleWishlist, isLiked } = useWishlist();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (qty > 0) {
      addToCart(item, qty);
      setQty(0);
    }
  };

  return (
    <div className="product-card group cursor-pointer flex flex-col h-full bg-background border border-surface-variant" onClick={() => navigate(`/single-product?id=${item._id}`)}>
      <div className="p-4 bg-tertiary-fixed relative aspect-square flex items-center justify-center overflow-hidden border-b border-surface-variant">
        <button
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-black transition-colors flex items-center justify-center shadow-sm"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(item);
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: isLiked(item._id) ? 'red' : 'inherit' }}>
            {isLiked(item._id) ? 'favorite' : 'favorite_border'}
          </span>
        </button>
        <img alt={item.name} className="w-3/4 object-contain mix-blend-multiply" src={item.image} />
      </div>
      <div className="p-sm flex flex-col flex-grow justify-between gap-xs">
        <div className="text-center">
          <div className="flex justify-center items-center gap-1">
            <h3 className="font-label-md text-label-md font-semibold tracking-tighter truncate">{item.name}</h3>
            <span className="flex items-center gap-1" style={{ color: '#000000', fontSize: '12px', fontWeight: 600 }}>★ {item.rating}</span>
          </div>
        </div>
      <div
        className="flex justify-between items-center"
        style={{ paddingTop: '12px', marginTop: '12px', borderTop: '1px solid #f4f4f5' }}
        onClick={(e) => e.stopPropagation()}
      >
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant" style={{ fontWeight: 600 }}>${item.price}</span>
            {item.originalPrice && (
              <span className="line-through" style={{ fontSize: '12px', fontWeight: 500, color: '#848484' }}>${item.originalPrice}</span>
            )}
          </div>
          {qty === 0 ? (
            <button
              style={{ color: '#000000', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#5d5e66')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#000000')}
              aria-label={`Add ${item.name}`}
              onClick={(e) => {
                e.stopPropagation();
                setQty(1);
              }}
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          ) : (
            <div className="flex items-center border border-primary h-8 w-24">
              <button
                aria-label="Decrease quantity"
                className="w-7 h-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setQty(Math.max(0, qty - 1));
                }}
              >
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <span className="flex-grow text-center text-label-md text-primary font-medium">{qty}</span>
              <button
                aria-label="Increase quantity"
                className="w-7 h-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setQty(qty + 1);
                }}
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-black text-white px-2 h-full uppercase text-[10px] hover:bg-gray-800 transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Recenty_Viewed Component ── */
const Recenty_Viewed = () => {
  const viewedRef = useRef(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const location = useLocation(); // re-fetch when URL changes (new product navigated to)

  useEffect(() => {
    // Small delay so single_page.jsx has time to write to localStorage first
    const timer = setTimeout(async () => {
      try {
        const stored = localStorage.getItem('recentlyViewed');
        const ids = stored ? JSON.parse(stored) : [];

        const queryIds = ids.length > 0 ? ids.join(',') : '';
        const url = queryIds
          ? `/products/recently-viewed?ids=${queryIds}`
          : '/products/recently-viewed';

        const { data } = await api.get(url);
        setRecentlyViewed(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching recently viewed', error);
      }
    }, 300); // 300ms after navigation to let localStorage update first

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]); // re-run whenever URL changes

  const scroll = (direction) => {
    if (viewedRef.current) {
      const scrollAmount = viewedRef.current.clientWidth * 0.8;
      viewedRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="bg-surface px-0 md:px-margin-desktop py-xl">
      <div className="max-w-container-max mx-auto flex flex-col gap-lg">
        <div className="flex justify-between items-end border-b border-tertiary pb-sm px-4 md:px-0">
          <h2 className="font-headline-md text-[16px] md:text-[26px] font-bold tracking-tighter uppercase">Recently Viewed</h2>
        </div>
        <div className="relative group mt-6">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white border border-gray-200 shadow-lg rounded-full text-black hover:bg-gray-100 transition-colors hidden md:flex items-center justify-center"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white border border-gray-200 shadow-lg rounded-full text-black hover:bg-gray-100 transition-colors hidden md:flex items-center justify-center"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
          <div ref={viewedRef} className="grid grid-cols-2 gap-0 md:flex md:overflow-x-auto md:gap-6 scrollbar-hide md:snap-x md:snap-mandatory items-stretch" style={{ scrollBehavior: 'smooth', paddingBottom: '16px' }}>
            {recentlyViewed.map((item, idx) => (
              <div key={`${item._id}-${idx}`} className="w-full md:w-[calc(42.5%-12px)] lg:w-[calc(21.25%-18px)] shrink-0 md:snap-start flex">
                <div className="w-full flex-grow">
                  <RecentlyViewedCard item={item} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recenty_Viewed;
