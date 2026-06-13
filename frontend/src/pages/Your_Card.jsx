import { useNavigate } from 'react-router-dom';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/footer';
import Customer_viewds from '../componentes/Customer_viewds';
import { useCart } from '../context/CartContext';


/* ── CartItem Component ── */
const CartItem = ({ item, onUpdateQty, onRemove }) => (
  <div className="flex py-3 md:py-md border-b border-surface-container-high gap-3 md:gap-md items-start">
    {/* Image */}
    <div className="w-20 h-20 md:w-32 md:aspect-square bg-surface-container-lowest border border-surface-container-high flex-shrink-0 flex items-center justify-center p-1 md:p-sm">
      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
    </div>
    {/* Info */}
    <div className="flex-grow flex flex-col justify-between gap-2">
      <div>
        <h3 className="text-[11px] md:text-headline-md text-primary uppercase mb-0.5 font-bold tracking-wide">{item.name}</h3>
        <p className="text-[10px] md:text-body-md text-secondary leading-tight">{item.category || 'Product'}</p>
      </div>
      {/* Qty + Price row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center border border-primary h-7 md:h-10 w-20 md:w-28 flex-shrink-0">
          <button
            aria-label="Decrease quantity"
            className="flex-1 h-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
            onClick={() => onUpdateQty(item.product, Math.max(1, item.qty - 1))}
          >
            <span className="material-symbols-outlined text-[12px] md:text-sm">remove</span>
          </button>
          <input
            aria-label="Quantity"
            className="w-full h-full text-center text-[11px] md:text-label-md text-primary border-none focus:ring-0 p-0 bg-transparent"
            style={{ MozAppearance: 'textfield', WebkitAppearance: 'none' }}
            min="1"
            type="number"
            value={item.qty}
            readOnly
          />
          <button
            aria-label="Increase quantity"
            className="flex-1 h-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
            onClick={() => onUpdateQty(item.product, item.qty + 1)}
          >
            <span className="material-symbols-outlined text-[12px] md:text-sm">add</span>
          </button>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-[11px] md:text-label-md text-primary tracking-wider font-semibold">
            ${(item.price * item.qty).toFixed(2)}
          </p>
          <button
            aria-label="Remove item"
            className="text-secondary hover:text-primary transition-colors"
            onClick={() => onRemove(item.product)}
          >
            <span className="material-symbols-outlined text-[18px] md:text-xl">close</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ── Your_Card Page ── */
const Your_Card = () => {
  // cartItems shape from CartContext: { product (id), name, image, price, qty, category? }
  const { cartItems, updateCartItem, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  const updateQty = (productId, newQty) => {
    updateCartItem(productId, newQty);
  };

  const removeItem = (productId) => {
    removeFromCart(productId);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background font-body-md antialiased">
      <Navbar />

      <main className="flex-grow pt-4 md:pt-20 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto pb-xl">
        {/* Breadcrumbs */}
        <div className="pt-md pb-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest flex items-center gap-xs">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span className="opacity-50">/</span>
          <span className="text-primary">Your Cart</span>
        </div>

        {/* Page Title */}
        <div className="pb-xs">
          <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary uppercase pb-xs">
            Shipping Cart
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-gutter">
          {/* ── Cart Items ── */}
          <div className="w-full lg:w-2/3 flex flex-col gap-0">
            {/* Column Headers */}
            <div className="hidden sm:flex items-center py-sm border-b-2 border-primary">
              <span className="text-label-md text-primary uppercase tracking-widest flex-grow">Item</span>
              <span className="text-label-md text-primary uppercase tracking-widest w-28 text-center">Quantity</span>
              <span className="text-label-md text-primary uppercase tracking-widest w-24 text-right">Total</span>
            </div>
            {loading ? (
              <div className="py-xl text-center flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-[48px] text-secondary animate-spin">progress_activity</span>
                <p className="text-body-md text-secondary uppercase tracking-wider">Loading your cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="py-xl text-center">
                <span className="material-symbols-outlined text-[64px] text-secondary mb-md">shopping_cart</span>
                <p className="text-headline-md text-primary uppercase mb-sm">Your cart is empty</p>
                <p className="text-body-md text-secondary">Add items to get started.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItem
                  key={item.product}
                  item={item}
                  onUpdateQty={updateQty}
                  onRemove={removeItem}
                />
              ))
            )}
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="w-full lg:w-1/3 mt-lg lg:mt-0">
            <div className="bg-surface-container-lowest border border-primary p-md sticky top-28">
              <h2 className="text-label-md text-primary uppercase border-b border-surface-container-high pb-sm mb-md tracking-widest">
                ORDER SUMMARY
              </h2>

              <div className="flex flex-col gap-sm mb-md">
                <div className="flex justify-between text-body-md text-secondary">
                  <span>Subtotal</span>
                  <span className="text-primary font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-body-md text-secondary">
                  <span>Shipping</span>
                  <span className="text-primary font-medium">Calculated at next step</span>
                </div>
                <div className="flex justify-between text-body-md text-secondary">
                  <span>Taxes</span>
                  <span className="text-primary font-medium">Calculated at next step</span>
                </div>
              </div>

              <div className="border-t border-surface-container-high pt-sm mb-lg flex justify-between items-center">
                <span className="text-headline-md text-primary uppercase">TOTAL</span>
                <span className="text-headline-md text-primary tracking-wider">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex flex-col gap-sm">
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary text-on-primary text-label-md h-12 uppercase tracking-widest hover:bg-surface-tint transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center gap-sm"
                >
                  PLACE ORDER
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <button 
                  onClick={() => navigate('/all-products')}
                  className="w-full bg-transparent border border-primary text-primary text-label-md h-12 uppercase tracking-widest hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center gap-sm"
                >
                  CONTINUE SHOPPING
                  <span className="material-symbols-outlined text-sm">shopping_bag</span>
                </button>
              </div>

              <div className="mt-md text-center">
                <p className="text-label-sm text-secondary uppercase tracking-wider mb-sm">Secure Payment</p>
                <div className="flex justify-center gap-sm text-secondary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Cross-sell: Customers Also Viewed ── */}
        <Customer_viewds />
      </main>

      <Footer />
    </div>
  );
};

export default Your_Card;
