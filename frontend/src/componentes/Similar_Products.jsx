import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

/* ── SimilarProductCard ── */
const SimilarProductCard = ({ item }) => {
  const [qty, setQty] = useState(0);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLiked, toggleWishlist } = useWishlist();

  const liked = isLiked(item._id);

  const handleCardClick = () => {
    navigate(`/single-product?id=${item._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (qty > 0) {
      addToCart(item, qty);
      setQty(0);
    }
  };

  return (
    <div
      className="product-card group cursor-pointer flex flex-col h-full bg-background border border-surface-variant"
      onClick={handleCardClick}
    >
      {/* Image Area */}
      <div className="p-4 bg-tertiary-fixed relative aspect-square flex items-center justify-center overflow-hidden border-b border-surface-variant">
        <button
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-black transition-colors flex items-center justify-center shadow-sm"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(item);
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '20px', fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0", color: liked ? '#ba1a1a' : '#000' }}
          >
            favorite
          </span>
        </button>
        <img
          src={item.image}
          alt={item.name}
          className="w-3/4 object-contain mix-blend-multiply grayscale transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Info Area */}
      <div className="p-sm flex flex-col flex-grow justify-between gap-xs">
        {/* Name */}
        <div className="text-center">
          <h3 className="font-label-md text-label-md font-semibold tracking-tighter truncate">{item.name}</h3>
          <p className="text-[10px] text-on-surface-variant mt-0.5 truncate">{item.category}</p>
        </div>

        {/* Price + Cart controls */}
        <div
          className="flex flex-col gap-2"
          style={{ paddingTop: '12px', marginTop: '12px', borderTop: '1px solid #f4f4f5' }}
          onClick={(e) => e.stopPropagation()} // prevent card nav when interacting with controls
        >
          <div className="flex justify-between items-center">
            <span className="font-label-sm text-label-sm text-on-surface-variant" style={{ fontWeight: 600 }}>
              ${item.price}
            </span>

            {qty === 0 ? (
              /* + button */
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
              /* Qty stepper */
              <div className="flex items-center border border-primary h-8 w-24">
                <button
                  aria-label="Decrease quantity"
                  className="w-7 h-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
                  onClick={(e) => { e.stopPropagation(); setQty(Math.max(0, qty - 1)); }}
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="flex-grow text-center text-label-md text-primary font-medium">{qty}</span>
                <button
                  aria-label="Increase quantity"
                  className="w-7 h-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
                  onClick={(e) => { e.stopPropagation(); setQty(qty + 1); }}
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            )}
          </div>

          {/* "Add to Cart" confirm — visible only when qty > 0 */}
          {qty > 0 && (
            <button
              onClick={handleAddToCart}
              className="w-full py-1.5 text-[11px] bg-black text-white uppercase font-bold hover:bg-gray-800 transition-colors tracking-wider"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Similar_Products Section ── */
const Similar_Products = ({ currentProductId }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentProductId) return;
    const fetchProducts = async () => {
      try {
        const { data } = await api.get(`/products/similar/${currentProductId}?limit=4`);
        setSimilarProducts(data);
      } catch (error) {
        console.error('Error fetching similar products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentProductId]);

  if (!loading && similarProducts.length === 0) return null;

  return (
    <section className="flex flex-col gap-md pt-xl border-t border-surface-dim">
      <div className="flex justify-between items-end border-b border-primary pb-2">
        <h2 className="text-headline-md uppercase text-primary">Similar Products</h2>
        <a
          href="/all-products"
          className="text-label-sm uppercase text-on-surface-variant hover:text-primary transition-colors"
        >
          View All
        </a>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-surface-variant">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={`skeleton-${idx}`} className="border-b border-r border-surface-variant">
              <div className="product-card group flex flex-col h-[300px] bg-background animate-pulse">
                <div className="p-4 bg-tertiary-fixed relative aspect-square bg-gray-200"></div>
                <div className="p-sm flex flex-col flex-grow justify-between gap-xs">
                  <div className="h-4 bg-gray-200 w-3/4 rounded mx-auto mb-1"></div>
                  <div className="h-3 bg-gray-200 w-1/2 rounded mx-auto"></div>
                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <div className="h-4 bg-gray-200 w-1/3 rounded"></div>
                    <div className="h-6 bg-gray-200 w-6 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          similarProducts.map((item) => (
            <div key={item._id} className="border-b border-r border-surface-variant">
              <SimilarProductCard item={item} />
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Similar_Products;
