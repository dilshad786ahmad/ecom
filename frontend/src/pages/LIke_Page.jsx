import { useState } from 'react';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/footer';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

/* ── FavoriteCard (same style as Latest Arrivals but with Add to Bag + Remove) ── */
const FavoriteCard = ({ product, onRemove }) => {
  const [qty, setQty] = useState(0);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (qty > 0) {
      addToCart(product, qty);
      setQty(0);
    }
  };

  return (
    <article className="group bg-surface-container-lowest flex flex-row md:flex-col hover:bg-surface transition-colors duration-300">
      {/* Image Area */}
      <div
        className="relative w-[120px] md:w-full flex-shrink-0 overflow-hidden bg-surface flex items-center justify-center p-2 md:p-lg"
        style={{ aspectRatio: '4/5' }}
      >
        <button
          aria-label="Remove from favorites"
          className="absolute top-1 right-1 md:top-md md:right-md text-on-surface-variant hover:text-error transition-colors z-10"
          onClick={() => onRemove(product)}
        >
          <span
            className="material-symbols-outlined text-[16px] md:text-[24px]"
            style={{ fontVariationSettings: "'FILL' 1", color: 'red' }}
          >
            favorite
          </span>
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>

      {/* Info Area */}
      <div className="p-3 md:p-md flex flex-col flex-grow justify-between gap-1 md:gap-sm">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h2
              className="font-headline-md text-on-background uppercase text-[13px] md:text-[20px]"
              style={{ fontWeight: 600, letterSpacing: '-0.01em' }}
            >
              {product.name}
            </h2>
            <span
              className="font-label-md text-on-surface-variant text-[12px] md:text-[14px]"
              style={{ fontWeight: 600, letterSpacing: '0.05em' }}
            >
              ${product.price}
            </span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant mb-1 md:mb-sm text-[11px] md:text-[14px]" style={{ fontWeight: 600 }}>
            ★ {product.rating || '4.8'}
          </div>
          <p className="font-body-md text-on-surface-variant mb-2 md:mb-md text-[11px] md:text-[16px] line-clamp-2 md:line-clamp-none leading-snug">
            {product.description}
          </p>
        </div>

        {/* Add to Bag button / Qty counter */}
        {qty === 0 ? (
          <button
            className="w-full bg-primary text-on-primary font-label-md uppercase tracking-widest py-1.5 md:py-sm px-2 md:px-md hover:bg-on-surface-variant transition-colors duration-200 text-[10px] md:text-[14px]"
            onClick={() => setQty(1)}
          >
            ADD TO BAG
          </button>
        ) : (
          <div className="flex items-center border border-primary h-7 md:h-10 w-full mt-auto">
            <button
              aria-label="Decrease quantity"
              className="w-7 md:w-10 h-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
              onClick={() => setQty(Math.max(0, qty - 1))}
            >
              <span className="material-symbols-outlined text-[14px] md:text-sm">remove</span>
            </button>
            <span className="flex-grow text-center text-[11px] md:text-label-md text-primary font-medium">
              {qty}
            </span>
            <button
              aria-label="Increase quantity"
              className="w-7 md:w-10 h-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
              onClick={() => setQty(qty + 1)}
            >
              <span className="material-symbols-outlined text-[14px] md:text-sm">add</span>
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-3 h-full uppercase text-[10px] md:text-[12px]"
            >
              Ok
            </button>
          </div>
        )}

        {/* Remove button */}
        <button
          className="w-full bg-transparent text-on-surface-variant font-label-md uppercase tracking-widest py-1.5 md:py-sm px-2 md:px-md border border-outline hover:bg-surface-container transition-colors duration-200 text-[10px] md:text-[14px] mt-1 md:mt-0"
          onClick={() => onRemove(product)}
        >
          REMOVE
        </button>
      </div>
    </article>
  );
};

/* ── Like Page ── */
const LikePage = () => {
  const { wishlist: wishlistItems, toggleWishlist } = useWishlist();

  const handleRemove = (product) => {
    toggleWishlist(product);
  };

  return (
    <div className="bg-surface-container-low text-on-background antialiased min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-xl pt-10">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-baseline border-b border-surface-variant pb-4">
          <h1
            className="text-on-background uppercase"
            style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 }}
          >
            FAVORITES
          </h1>
          <span
            className="font-label-md text-on-surface-variant uppercase tracking-widest mt-sm md:mt-0"
            style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em' }}
          >
            {wishlistItems?.length || 0} Item{wishlistItems?.length !== 1 ? 's' : ''} Saved
          </span>
        </header>

        {/* Empty State */}
        {!wishlistItems || wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-xl gap-md text-center">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '64px' }}>
              favorite_border
            </span>
            <p className="font-headline-md text-headline-md text-on-surface-variant uppercase">
              No Favorites Yet
            </p>
            <p className="font-body-md text-body-md text-secondary">
              Items you like will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
            {wishlistItems.map((product) => (
              <FavoriteCard key={product._id} product={product} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LikePage;
