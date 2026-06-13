import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Similar_Products from '../componentes/Similar_Products';
import Recenty_Viewed from '../componentes/Recenty_Viewed';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/footer';
import api from '../services/api';
import { useCart } from '../context/CartContext';

// detailImages are now fetched from the backend via GET /api/products/:id/detail-images

/* ── Detail Image Card — image only, no label or icon ── */
const DetailCard = ({ img }) => (
  <div className="product-card group cursor-pointer" style={{ backgroundColor: '#e2e2e3' }}>
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{ aspectRatio: '1 / 1' }}
    >
      <img
        src={img.src}
        alt={img.alt}
        className="w-full h-full object-cover grayscale transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  </div>
);

/* ── Star Rating Helper ── */
const StarRating = ({ rating = 5, size = 16 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-xs text-primary">
      {Array.from({ length: full }).map((_, i) => (
        <span
          key={`f-${i}`}
          className="material-symbols-outlined"
          style={{ fontSize: size, fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      ))}
      {half && (
        <span
          className="material-symbols-outlined"
          style={{ fontSize: size, fontVariationSettings: "'FILL' 1" }}
        >
          star_half
        </span>
      )}
    </div>
  );
};

/* ── Single Page Component ── */
const Single_Page = () => {
  const [activeThumb, setActiveThumb] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [detailImages, setDetailImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const productId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    if (!productId) return;

    // Reset state immediately so old product data doesn't bleed through
    setLoading(true);
    setProduct(null);
    setDetailImages([]);
    setActiveThumb(0);
    setQuantity(1);

    const fetchProduct = async () => {
      try {
        // Fetch product data and its detail images in parallel
        const [productRes, detailImgRes] = await Promise.all([
          api.get(`/products/${productId}`),
          api.get(`/products/${productId}/detail-images`),
        ]);
        setProduct(productRes.data);
        setDetailImages(detailImgRes.data || []);
        setLoading(false);

        // Track this product in localStorage for "Recently Viewed" section
        const stored = localStorage.getItem('recentlyViewed');
        const ids = stored ? JSON.parse(stored) : [];
        const updated = [productId, ...ids.filter((id) => id !== productId)].slice(0, 8);
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      } catch (error) {
        console.error('Error fetching product', error);
        setLoading(false);
      }
    };
    fetchProduct();
    // Scroll to top whenever a new product loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/your-cart');
    }
  };

  if (loading) return (
    <div className="flex flex-col min-h-screen bg-background text-on-background antialiased">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-[56px] text-on-surface-variant animate-spin">progress_activity</span>
        <p className="text-label-md uppercase tracking-widest text-on-surface-variant">Loading product...</p>
      </div>
    </div>
  );
  if (!product) return (
    <div className="flex flex-col min-h-screen bg-background text-on-background antialiased">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <p className="text-headline-md text-primary uppercase">Product not found</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background font-body-md antialiased">
      <Navbar />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-lg md:py-xl flex flex-col gap-xl">

        {/* ── Product Hero Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-gutter items-start">

          {/* Center: Hero Image + 4 detail cards below */}
          <div className="flex flex-col gap-md">
            {/* Breadcrumb Path */}
            <div className="flex items-center gap-2 text-label-sm uppercase text-on-surface-variant font-medium tracking-widest mb-2">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <a href="/all-products" className="hover:text-primary transition-colors">Audio</a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-bold">{product.name}</span>
            </div>

            {/* Big hero image */}
            <div className="w-full h-[300px] md:h-[500px] border border-tertiary-fixed bg-surface-container-lowest p-4 relative flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain grayscale transition-all duration-500"
              />
            </div>

            {/* 4 detail image cards */}
            <div className="grid grid-cols-4 gap-2">
              {detailImages.map((img) => (
                <DetailCard key={img.alt} img={img} />
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col gap-lg sticky top-[120px]">

            {/* Rating + Title + Price */}
            <div className="flex flex-col gap-sm">
              <div className="flex items-center gap-xs">
                <StarRating rating={product.rating || 5} size={16} />
                <span className="text-label-sm ml-2 text-on-surface-variant uppercase">
                  {product.rating || 5} (124 REVIEWS)
                </span>
              </div>
              <h1 className="text-headline-lg-mobile md:text-headline-lg uppercase text-primary tracking-tighter">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-sm">
                <span className="text-headline-md text-primary">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-body-lg text-on-surface-variant line-through">${product.originalPrice}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-tertiary-fixed pt-md">
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Key Specs */}
            <div className="flex flex-col gap-sm">
              {[
                { label: 'Category', value: product.category },
                { label: 'Brand', value: product.brand },
                { label: 'Color', value: product.color || 'N/A' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-tertiary-fixed py-2">
                  <span className="text-label-md uppercase text-on-surface-variant">{label}</span>
                  <span className="text-label-sm uppercase text-primary">{value}</span>
                </div>
              ))}
            </div>

            {/* Technical Specifications — dynamic from DB */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="flex flex-col gap-sm mt-md">
                <h3 className="text-label-md uppercase text-primary border-b border-primary pb-2">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-2 gap-y-2">
                  {product.specifications.map(({ label, value }) => (
                    <div key={label} className="contents">
                      <span className="text-label-sm text-on-surface-variant uppercase">
                        {label}
                      </span>
                      <span className="text-label-sm text-primary text-right uppercase">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + CTA Buttons */}
            <div className="flex flex-col gap-sm mt-md">
              {/* Quantity Picker */}
              <div className="flex items-center border border-tertiary-fixed w-max mb-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-primary hover:bg-surface-container-high transition-colors font-bold border-r border-tertiary-fixed"
                >
                  −
                </button>
                <span className="w-12 text-center text-label-md text-primary">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 text-primary hover:bg-surface-container-high transition-colors font-bold border-l border-tertiary-fixed"
                >
                  +
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="w-full py-4 px-6 bg-surface-container-lowest border border-primary text-primary text-label-md uppercase hover:bg-surface-container-high transition-colors text-center"
              >
                Add to Cart
              </button>
              <button 
                onClick={handleAddToCart}
                className="w-full py-4 px-6 bg-primary text-on-primary text-label-md uppercase hover:bg-[#27272A] transition-colors text-center border border-primary"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* detail image cards moved below hero — section removed */}

        {/* ── Customer Reviews ── */}
        <section className="flex flex-col gap-lg pt-xl border-t border-surface-dim">
          <h2 className="text-headline-md uppercase text-primary">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-xl items-start">

            {/* Aggregate Score */}
            <div className="flex flex-col gap-sm border border-surface-dim p-md bg-surface-container-lowest">
              <div className="text-display-lg text-primary leading-none">4.8</div>
              <StarRating rating={4.5} size={20} />
              <span className="text-label-sm uppercase text-on-surface-variant">
                Based on 124 Reviews
              </span>
              <button className="mt-md w-full py-3 px-4 border border-primary text-primary text-label-md uppercase hover:bg-surface-container-high transition-colors text-center">
                Write a Review
              </button>
            </div>

            {/* Individual Reviews */}
            <div className="flex flex-col gap-md">
              {[
                {
                  name: 'Alex M.',
                  rating: 5,
                  date: 'Oct 12, 2023',
                  title: 'Incredible Clarity',
                  body: "The isolation is unparalleled. I've heard details in tracks I've listened to for years that were completely hidden before. The build quality feels like a tank, but they are surprisingly comfortable for long sessions.",
                },
                {
                  name: 'Sarah J.',
                  rating: 4,
                  date: 'Sep 28, 2023',
                  title: 'Heavy but worth it',
                  body: 'They are definitely on the heavier side, which took some getting used to. However, the soundstage is massive for closed-back cans. The minimalist aesthetic is exactly what I was looking for.',
                },
              ].map((review) => (
                <div key={review.name} className="flex flex-col gap-sm border-b border-surface-dim pb-md">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-xs">
                      <span className="text-label-md uppercase text-primary">{review.name}</span>
                      <StarRating rating={review.rating} size={16} />
                    </div>
                    <span className="text-label-sm text-on-surface-variant uppercase">{review.date}</span>
                  </div>
                  <h4 className="text-label-md font-bold uppercase text-primary">{review.title}</h4>
                  <p className="text-body-md text-on-surface-variant">{review.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Similar Products (from componentes/Similar_Products.jsx) ── */}
        <Similar_Products currentProductId={product._id} />

        {/* ── Recently Viewed ── */}
        <Recenty_Viewed currentProductId={product._id} />
      </main>

      <Footer />
    </div>
  );
};

export default Single_Page;
