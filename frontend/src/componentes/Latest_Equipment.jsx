import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

/* ── EquipmentCard ── */
const EquipmentCard = ({ item }) => {
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
    <div
      className="group flex flex-col h-full cursor-pointer"
      style={{ backgroundColor: '#ffffff', border: '1px solid #f4f4f5', transition: 'border-color 0.3s', position: 'relative', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#000000')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#f4f4f5')}
      onClick={() => navigate(`/single-product?id=${item._id}`)}
    >
      {/* Badge */}
      {item.badge && (
        <div
          className="absolute top-4 left-4 z-10 uppercase"
          style={{ backgroundColor: '#000000', color: '#ffffff', fontSize: '12px', fontWeight: 500, letterSpacing: '0.02em', padding: '2px 8px' }}
        >
          {item.badge}
        </div>
      )}

      {/* Image */}
      <div
        className="flex items-center justify-center p-1 md:p-md relative"
        style={{ aspectRatio: '1 / 1', backgroundColor: '#f3f3f4', borderBottom: '1px solid #f4f4f5' }}
      >
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
        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
      </div>

      {/* Info */}
      <div className="px-2 py-3 md:p-md flex flex-col flex-grow justify-between">
        <div>
          <div className="flex justify-between items-start" style={{ marginBottom: '4px' }}>
            <h3 className="uppercase text-[9px] md:text-[14px]" style={{ fontWeight: 600, letterSpacing: '0.05em', color: '#000000' }}>
              {item.name}
            </h3>
            <div className="flex items-center gap-1 text-[8px] md:text-[12px]" style={{ color: '#000000', fontWeight: 600 }}>
              ★ {item.rating}
            </div>
          </div>
          <p className="uppercase text-[8px] md:text-[12px] line-clamp-1 md:line-clamp-none" style={{ fontWeight: 500, letterSpacing: '0.02em', color: '#5d5e66', marginBottom: '8px' }}>
            {item.category}
          </p>
        </div>
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0 w-full"
          style={{ paddingTop: '8px', marginTop: 'auto', borderTop: '1px solid #f4f4f5' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-[10px] md:text-[16px]" style={{ fontWeight: 400, color: '#000000' }}>${item.price}</span>
            {item.originalPrice && (
              <span className="line-through text-[8px] md:text-[12px]" style={{ fontWeight: 500, color: '#848484' }}>
                ${item.originalPrice}
              </span>
            )}
          </div>
          <div className="w-full md:w-auto">
            {qty === 0 ? (
              <button
                className="w-full md:w-auto flex justify-center py-1 md:py-0 border border-gray-200 md:border-transparent hover:border-gray-300 md:border-none"
                style={{ color: '#000000', background: 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#5d5e66')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#000000')}
                aria-label={`Add ${item.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setQty(1);
                }}
              >
                <span className="material-symbols-outlined text-[16px] md:text-[24px]">add</span>
              </button>
            ) : (
              <div className="flex items-center border border-primary h-6 w-full md:h-8 md:w-24" onClick={(e) => e.stopPropagation()}>
                <button
                  aria-label="Decrease quantity"
                  className="flex-1 md:w-7 h-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQty(Math.max(0, qty - 1));
                  }}
                >
                  <span className="material-symbols-outlined text-[12px] md:text-sm">remove</span>
                </button>
                <span className="flex-grow text-center text-label-md text-[9px] md:text-[14px] text-primary font-medium">{qty}</span>
                <button
                  aria-label="Increase quantity"
                  className="flex-1 md:w-7 h-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQty(qty + 1);
                  }}
                >
                  <span className="material-symbols-outlined text-[12px] md:text-sm">add</span>
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

/* ── Latest_Equipment Component ── */
const Latest_Equipment = () => {
  const equipmentRef = useRef(null);
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const { data } = await api.get('/products/equipment?limit=6');
        setEquipment(data);
      } catch (error) {
        console.error('Error fetching equipment', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  const scroll = (direction) => {
    if (equipmentRef.current) {
      const scrollAmount = equipmentRef.current.clientWidth * 0.8;
      equipmentRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 px-0 md:px-16 bg-[#f9f9f9]">
      {/* Section Header */}
      <div
        className="flex justify-between items-end max-w-container-max mx-auto px-4 md:px-0"
        style={{ marginBottom: '48px', borderBottom: '1px solid #f4f4f5', paddingBottom: '16px' }}
      >
        <h2 className="font-bold tracking-tighter uppercase text-[16px] md:text-[26px]" style={{ lineHeight: 1.2, letterSpacing: '-0.02em', fontWeight: 600, color: '#000000' }}>
          Latest Equipment
        </h2>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="hidden md:flex md:items-center md:gap-1"
            style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em', color: '#000000', textTransform: 'uppercase', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#5d5e66')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#000000')}
            onClick={() => navigate('/all-products?filter=equipment')}
          >
            View All Inventory <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Equipment Carousel */}
      <div className="relative group max-w-container-max mx-auto">
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
        <div ref={equipmentRef} className="grid grid-cols-2 gap-0 md:flex md:overflow-x-auto md:gap-6 scrollbar-hide md:snap-x md:snap-mandatory items-stretch" style={{ scrollBehavior: 'smooth', paddingBottom: '16px' }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={`skeleton-${idx}`} className="w-full md:w-[calc(42.5%-8px)] lg:w-[calc(21.25%-12px)] shrink-0 md:snap-start flex">
                <div className="w-full flex-grow border border-gray-200 bg-white flex flex-col animate-pulse h-[350px]">
                  <div className="aspect-square bg-gray-200 w-full border-b border-gray-100"></div>
                  <div className="px-2 py-3 md:p-md flex flex-col flex-grow justify-between gap-2">
                    <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                    <div className="h-3 bg-gray-200 w-1/2 rounded mt-1"></div>
                    <div className="mt-auto pt-2 border-t border-gray-100 flex justify-between items-center">
                      <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
                      <div className="h-8 bg-gray-200 w-8 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            equipment.map((item, idx) => (
              <div key={`${item._id}-${idx}`} className="w-full md:w-[calc(42.5%-8px)] lg:w-[calc(21.25%-12px)] shrink-0 md:snap-start flex">
                <div className="w-full flex-grow">
                  <EquipmentCard item={item} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile "View All" button */}
      <div className="mt-12 flex justify-center md:hidden">
        <button
          type="button"
          style={{ border: '1px solid #000000', padding: '12px 24px', fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em', color: '#000000', textTransform: 'uppercase', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f3f4')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          onClick={() => navigate('/all-products?filter=equipment')}
        >
          View All Inventory <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
        </button>
      </div>
    </section>
  );
};

export default Latest_Equipment;
