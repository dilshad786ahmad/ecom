import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

/* ── ProductCard ── */
const ProductCard = ({ product }) => {
  const [qty, setQty] = useState(0);
  const { addToCart } = useCart();
  const { toggleWishlist, isLiked } = useWishlist();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (qty > 0) {
      addToCart(product, qty);
      setQty(0);
    }
  };

  return (
    <div className="product-card group cursor-pointer flex flex-col h-full" style={{ backgroundColor: '#f9f9f9', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }} onClick={() => navigate(`/single-product?id=${product._id}`)}>
      {/* Image Area */}
      <div
        className="p-1 md:p-4 relative flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#e2e2e3', aspectRatio: '1 / 1', borderBottom: '1px solid #f4f4f5' }}
      >
        <button
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-black transition-colors flex items-center justify-center shadow-sm"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: isLiked(product._id) ? 'red' : 'inherit' }}>
            {isLiked(product._id) ? 'favorite' : 'favorite_border'}
          </span>
        </button>
        {product.badge && (
          <div
            className="absolute top-4 left-4 text-label-sm uppercase px-2 py-1 sharp-border"
            style={{ backgroundColor: '#000000', color: '#ffffff', fontSize: '12px', fontWeight: 500, letterSpacing: '0.02em' }}
          >
            {product.badge}
          </div>
        )}
        <img src={product.image} alt={product.name} className="product-img" />
      </div>

      {/* Info Area */}
      <div className="px-2 py-3 md:p-md flex flex-col flex-grow justify-between gap-sm">
        <div>
          <div className="flex justify-between items-start" style={{ marginBottom: '4px' }}>
            <h3 className="uppercase text-[9px] md:text-[14px]" style={{ fontWeight: 600, letterSpacing: '0.05em', color: '#000000' }}>
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-[8px] md:text-[12px]" style={{ color: '#000000', fontWeight: 600 }}>
              ★ {product.rating}
            </div>
          </div>
          <p className="text-[8px] md:text-[12px] mt-1 line-clamp-2 md:line-clamp-none leading-tight" style={{ fontWeight: 500, letterSpacing: '0.02em', color: '#5d5e66', marginBottom: '8px' }}>
            {product.description}
          </p>
        </div>
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mt-auto pt-sm gap-2 md:gap-0 w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-[11px] md:text-[14px] text-label-md" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="line-through text-[9px] md:text-[12px]" style={{ fontWeight: 500, color: '#848484' }}>
                ${product.originalPrice}
              </span>
            )}
          </div>
          <div className="w-full md:w-auto mt-1 md:mt-0">
            {qty === 0 ? (
              <button 
                className="btn-secondary w-full md:w-auto px-2 py-1.5 md:px-4 md:py-2 text-[9px] md:text-[14px] text-label-md uppercase text-center flex justify-center" 
                style={{ fontWeight: 600 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setQty(1);
                }}
              >
                Add
              </button>
            ) : (
              <div className="flex items-center border border-primary h-7 w-full md:h-9 md:w-24" onClick={(e) => e.stopPropagation()}>
                <button
                  aria-label="Decrease quantity"
                  className="flex-1 md:w-8 h-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQty(Math.max(0, qty - 1));
                  }}
                >
                  <span className="material-symbols-outlined text-[14px] md:text-sm">remove</span>
                </button>
                <span className="flex-grow text-center text-label-md text-[10px] md:text-[14px] text-primary font-medium">{qty}</span>
                <button
                  aria-label="Increase quantity"
                  className="flex-1 md:w-8 h-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQty(qty + 1);
                  }}
                >
                  <span className="material-symbols-outlined text-[14px] md:text-sm">add</span>
                </button>
                <button
                  onClick={handleAddToCart}
                  className="bg-black text-white px-2 h-full uppercase text-[10px] md:text-[12px]"
                >
                  Ok
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Latest_Arrivals Component ── */
const Latest_Arrivals = () => {
  const arrivalsRef = useRef(null);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products/latest-arrivals?limit=6');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching latest arrivals', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const scroll = (direction) => {
    if (arrivalsRef.current) {
      const scrollAmount = arrivalsRef.current.clientWidth * 0.8;
      arrivalsRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="products-section px-0 md:px-16">
      <div className="max-w-container-max mx-auto flex flex-col gap-lg" style={{ gap: '24px' }}>

        {/* Section Header */}
        <div className="flex justify-between items-end pb-md px-4 md:px-0" style={{ borderBottom: '1px solid #000000', paddingBottom: '24px' }}>
          <div>
            <h2 className="font-bold tracking-tighter uppercase text-[16px] md:text-[26px]" style={{ lineHeight: 1.2, letterSpacing: '-0.02em', fontWeight: 600 }}>
              Latest Arrivals
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-label-md uppercase tracking-widest flex items-center transition-colors"
              style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em', gap: '4px' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#5e5e5e')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
              onClick={() => navigate('/all-products?filter=arrivals')}
            >
              View All <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Product Cards Carousel */}
        <div className="relative group">
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
          <div ref={arrivalsRef} className="grid grid-cols-2 gap-0 md:flex md:overflow-x-auto md:gap-6 scrollbar-hide md:snap-x md:snap-mandatory items-stretch" style={{ scrollBehavior: 'smooth', paddingBottom: '16px' }}>
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="w-full md:w-[calc(42.5%-16px)] lg:w-[calc(21.25%-24px)] shrink-0 md:snap-start flex">
                  <div className="w-full flex-grow border border-gray-200 bg-gray-50 flex flex-col animate-pulse h-[350px]">
                    <div className="aspect-square bg-gray-200 w-full"></div>
                    <div className="px-2 py-3 md:p-md flex flex-col flex-grow justify-between gap-2 border-t border-gray-100">
                      <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                      <div className="h-3 bg-gray-200 w-full rounded mt-1"></div>
                      <div className="h-3 bg-gray-200 w-4/5 rounded mt-1"></div>
                      <div className="h-8 bg-gray-200 w-full rounded mt-auto"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              products.map((product, idx) => (
                <div key={`${product._id}-${idx}`} className="w-full md:w-[calc(42.5%-16px)] lg:w-[calc(21.25%-24px)] shrink-0 md:snap-start flex">
                  <div className="w-full flex-grow">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Latest_Arrivals;
