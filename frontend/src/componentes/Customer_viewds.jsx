import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

/* ── Cross-sell Card ── */
const CrossSellCard = ({ product }) => {
  const [qty, setQty] = useState(0);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLiked, toggleWishlist } = useWishlist();

  const liked = isLiked(product._id);

  const handleCardClick = () => {
    navigate(`/single-product?id=${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (qty > 0) {
      addToCart(product, qty);
      setQty(0);
    }
  };

  return (
    <div 
      className="product-card group cursor-pointer flex flex-col h-full bg-background border border-surface-variant"
      onClick={handleCardClick}
    >
      <div className="p-4 bg-tertiary-fixed relative aspect-square flex items-center justify-center overflow-hidden border-b border-surface-variant">
        {product.badge && (
          <div className="absolute top-4 left-4 z-20 bg-primary text-on-primary font-label-sm px-2 py-1 uppercase tracking-widest" style={{ fontSize: '10px' }}>
            {product.badge}
          </div>
        )}
        <button
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-black transition-colors flex items-center justify-center shadow-sm"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
        >
          <span 
            className="material-symbols-outlined" 
            style={{ fontSize: '20px', fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0", color: liked ? '#ba1a1a' : '#000' }}
          >
            {liked ? 'favorite' : 'favorite_border'}
          </span>
        </button>
        <img
          src={product.image}
          alt={product.alt || product.name}
          className="w-3/4 object-contain mix-blend-multiply grayscale transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-sm flex flex-col flex-grow justify-between gap-xs">
        <div className="text-center">
          <div className="flex justify-center items-center gap-1">
            <h3 className="font-label-md text-label-md font-semibold tracking-tighter truncate">{product.name}</h3>
            {product.rating && <span className="flex items-center gap-1" style={{ color: '#000000', fontSize: '12px', fontWeight: 600 }}>★ {product.rating}</span>}
          </div>
        </div>
        <div className="flex flex-col gap-2" style={{ paddingTop: '12px', marginTop: '12px', borderTop: '1px solid #f4f4f5' }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant" style={{ fontWeight: 600 }}>${product.price}</span>
            </div>
            {qty === 0 ? (
              <button
                style={{ color: '#000000', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#5d5e66')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#000000')}
                aria-label={`Add ${product.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setQty(1);
                }}
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            ) : (
              <div className="flex items-center border border-primary h-8 w-20" onClick={(e) => e.stopPropagation()}>
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
          {qty > 0 && (
            <button
              onClick={handleAddToCart}
              className="w-full py-1 text-xs bg-primary text-on-primary uppercase font-bold hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Customer_viewds Component ── */
const Customer_viewds = ({ currentProductId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        // Get some random/different products
        const filtered = data.filter(p => p._id !== currentProductId).sort(() => 0.5 - Math.random()).slice(0, 4);
        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching cross-sell products", error);
      }
    };
    fetchProducts();
  }, [currentProductId]);

  if (products.length === 0) return null;

  return (
    <div className="mt-xl pt-xl border-t border-surface-container-high">
      <h2 className="text-headline-md uppercase text-primary mb-lg tracking-tight">
        CUSTOMERS ALSO VIEWED
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 md:gap-gutter">
        {products.map((product) => (
          <CrossSellCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Customer_viewds;
