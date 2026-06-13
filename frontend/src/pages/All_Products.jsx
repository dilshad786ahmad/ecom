import { useState, useMemo, useEffect } from 'react';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/footer';
import api from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

/* ── Product Card ── */
const ProductCard = ({ product }) => {
  const [qty, setQty] = useState(0);
  const { addToCart } = useCart();
  const { toggleWishlist, isLiked } = useWishlist();
  const navigate = useNavigate();

  const liked = isLiked(product._id);

  // Navigate to single product page
  const handleCardClick = () => {
    navigate(`/single-product?id=${product._id}`);
  };

  // Add selected qty to cart then reset qty counter
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (qty > 0) {
      addToCart(product, qty);
      setQty(0);
    }
  };

  return (
    <div
      className="group border border-tertiary-fixed bg-surface-container-lowest hover:border-primary transition-colors relative overflow-hidden flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-sm left-sm bg-tertiary text-on-tertiary font-label-sm text-label-sm px-sm py-xs uppercase z-10 text-[9px] md:text-[11px]">
          {product.badge}
        </div>
      )}

      {/* Wishlist button */}
      <button
        className="absolute top-sm right-sm text-primary hover:text-error transition-colors z-20"
        onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
      >
        <span
          className="material-symbols-outlined text-[18px] md:text-[20px]"
          style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0", color: liked ? '#ba1a1a' : undefined }}
        >
          favorite
        </span>
      </button>

      {/* Product Image */}
      <div className="aspect-square bg-surface-container-low relative overflow-hidden flex items-center justify-center p-1 md:p-md">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
        />
      </div>

      {/* Info */}
      <div className="px-2 py-2 md:p-md flex-grow flex flex-col justify-between border-t border-tertiary-fixed">
        {/* Category + Brand tags */}
        <div className="flex items-center gap-1 mb-1 flex-wrap">
          {product.category && (
            <span className="text-[7px] md:text-[10px] uppercase tracking-wider bg-surface-container px-1.5 py-0.5 text-on-surface-variant border border-tertiary-fixed">
              {product.category}
            </span>
          )}
          {product.brand && (
            <span className="text-[7px] md:text-[10px] uppercase tracking-wider bg-primary/10 px-1.5 py-0.5 text-primary border border-primary/20">
              {product.brand}
            </span>
          )}
        </div>

        <div>
          <div className="flex justify-between items-start mb-xs">
            <h3 className="font-label-md text-[9px] md:text-[14px] uppercase text-primary leading-tight pr-1">{product.name}</h3>
            <div className="flex items-center gap-xs text-[8px] md:text-[12px] shrink-0">
              <span className="text-on-surface-variant font-medium">★ {product.rating}</span>
            </div>
          </div>
          <p className="font-body-md text-[8px] md:text-[12px] text-on-surface-variant mb-2 line-clamp-2 leading-tight">
            {product.description}
          </p>
        </div>

        {/* Color swatch */}
        {product.colorSwatch && (
          <div className="flex items-center gap-1 mb-1">
            <div
              className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border border-outline-variant"
              style={{ backgroundColor: product.colorSwatch }}
            />
            <span className="text-[7px] md:text-[10px] text-on-surface-variant">{product.color}</span>
          </div>
        )}

        {/* Price + Add to Cart */}
        <div
          className="flex flex-col md:flex-row justify-between items-center mt-auto pt-sm gap-2 md:gap-0 border-t border-tertiary-fixed mt-2"
          onClick={(e) => e.stopPropagation()} // stop card click from firing inside this area
        >
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-[11px] md:text-[14px] text-label-md" style={{ fontWeight: 600, letterSpacing: '0.05em', color: '#000000' }}>
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
              /* + button — shows initially */
              <button
                className="p-1 hover:bg-surface-container-low transition-colors w-full md:w-auto flex justify-center border border-gray-200 md:border-transparent"
                onClick={(e) => { e.stopPropagation(); setQty(1); }}
              >
                <span className="material-symbols-outlined text-[16px] md:text-[20px] text-primary">add</span>
              </button>
            ) : (
              /* Qty stepper + Add to Cart button */
              <div className="flex items-center border border-primary h-7 w-full md:h-8 md:w-auto bg-surface-container-lowest">
                <button
                  aria-label="Decrease quantity"
                  className="w-7 h-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors border-r border-primary/30"
                  onClick={(e) => { e.stopPropagation(); setQty(Math.max(0, qty - 1)); }}
                >
                  <span className="material-symbols-outlined text-[12px] md:text-sm">remove</span>
                </button>
                <span className="w-7 text-center text-[9px] md:text-[13px] text-primary font-semibold">{qty}</span>
                <button
                  aria-label="Increase quantity"
                  className="w-7 h-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors border-l border-primary/30"
                  onClick={(e) => { e.stopPropagation(); setQty(qty + 1); }}
                >
                  <span className="material-symbols-outlined text-[12px] md:text-sm">add</span>
                </button>
                {/* Add to Cart confirm button */}
                <button
                  onClick={handleAddToCart}
                  className="bg-black text-white px-2 md:px-3 h-full uppercase font-semibold text-[9px] md:text-[11px] hover:bg-gray-800 transition-colors whitespace-nowrap border-l border-black"
                >
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Filter Section (reusable for sidebar + drawer) ── */
const FilterSection = ({ title, items, selected, onToggle }) => (
  <div className="border-t border-tertiary-fixed pt-4 md:pt-md">
    <h3 className="font-label-md text-label-md uppercase mb-3 md:mb-sm text-[11px]">{title}</h3>
    <div className="flex flex-col gap-2 md:gap-sm">
      {items.map((item) => {
        const value = typeof item === 'string' ? item : item.label;
        const isChecked = selected.includes(value);
        return (
          <label key={value} className="flex items-center gap-3 md:gap-sm cursor-pointer group">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(value)}
              className="form-checkbox h-4 w-4 text-primary border-primary rounded-none focus:ring-primary focus:ring-offset-0 bg-transparent cursor-pointer"
            />
            {typeof item !== 'string' && item.swatch && (
              <div
                className="w-3 h-3 rounded-full border border-outline-variant shrink-0"
                style={{ backgroundColor: item.swatch }}
              />
            )}
            <span className={`font-body-md text-body-md text-sm transition-colors ${isChecked ? 'text-primary font-semibold' : 'group-hover:text-primary'}`}>
              {value}
            </span>
          </label>
        );
      })}
    </div>
  </div>
);

/* ── All_Products Page ── */
const All_Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ALL_CATEGORIES, setALL_CATEGORIES] = useState([]);
  const [ALL_BRANDS, setALL_BRANDS] = useState([]);
  const ALL_COLORS = [
    { label: 'Black',  swatch: '#1a1a1a' },
    { label: 'White',  swatch: '#f5f5f5' },
    { label: 'Silver', swatch: '#C0C0C0' },
    { label: 'Slate',  swatch: '#708090' },
  ];

  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setAllProducts(data);
        setALL_CATEGORIES([...new Set(data.map((p) => p.category))].sort());
        setALL_BRANDS([...new Set(data.map((p) => p.brand))].sort());
        
        // Handle filter query param
        const queryParams = new URLSearchParams(location.search);
        const filterParam = queryParams.get('filter');
        if (filterParam === 'equipment') {
          // just an example to set something if coming from equipment
          // maybe select some categories
        }
      } catch (error) {
        console.error('Error fetching products', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [location]);

  const [search, setSearch]           = useState('');
  const [isSortOpen, setIsSortOpen]   = useState(false);
  const [selectedSort, setSelectedSort] = useState('Newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /* Active filter state */
  const [selCategories, setSelCategories] = useState([]);
  const [selBrands, setSelBrands]         = useState([]);
  const [selColors, setSelColors]         = useState([]);

  const sortOptions = ['Newest', 'Price: High to Low', 'Price: Low to High'];

  /* ── Toggle helpers ── */
  const toggle = (setter) => (val) =>
    setter((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);

  /* ── Derived: filtered + sorted products ── */
  const displayed = useMemo(() => {
    let list = allProducts;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.brand || '').toLowerCase().includes(q)
      );
    }
    if (selCategories.length) list = list.filter((p) => selCategories.includes(p.category));
    if (selBrands.length)     list = list.filter((p) => selBrands.includes(p.brand));
    if (selColors.length)     list = list.filter((p) => selColors.includes(p.color));

    if (selectedSort === 'Price: High to Low') {
      list = [...list].sort((a, b) => parseFloat(String(b.price).replace(/[^0-9.]/g, '')) - parseFloat(String(a.price).replace(/[^0-9.]/g, '')));
    } else if (selectedSort === 'Price: Low to High') {
      list = [...list].sort((a, b) => parseFloat(String(a.price).replace(/[^0-9.]/g, '')) - parseFloat(String(b.price).replace(/[^0-9.]/g, '')));
    }
    return list;
  }, [allProducts, search, selCategories, selBrands, selColors, selectedSort]);

  /* ── Active filter chips ── */
  const activeFilters = [
    ...selCategories.map((v) => ({ label: v, type: 'cat' })),
    ...selBrands.map((v) => ({ label: v, type: 'brand' })),
    ...selColors.map((v) => ({ label: v, type: 'color' })),
  ];

  const removeFilter = (f) => {
    if (f.type === 'cat')   setSelCategories((p) => p.filter((v) => v !== f.label));
    if (f.type === 'brand') setSelBrands((p)     => p.filter((v) => v !== f.label));
    if (f.type === 'color') setSelColors((p)     => p.filter((v) => v !== f.label));
  };

  const clearAll = () => { setSelCategories([]); setSelBrands([]); setSelColors([]); setSearch(''); };

  return (
    <div className="bg-background text-on-background min-h-screen antialiased flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <style>{`
        .filter-sidebar::-webkit-scrollbar { width: 4px; }
        .filter-sidebar::-webkit-scrollbar-track { background: transparent; }
        .filter-sidebar::-webkit-scrollbar-thumb { background: #e2e2e3; border-radius: 4px; }
        .filter-sidebar::-webkit-scrollbar-thumb:hover { background: #1b1b1b; }
        .mobile-filter-drawer::-webkit-scrollbar { width: 4px; }
        .mobile-filter-drawer::-webkit-scrollbar-thumb { background: #e2e2e3; border-radius: 4px; }
      `}</style>

      {/* Mobile Filter Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsFilterOpen(false)}
      />

      {/* Mobile Filter Drawer */}
      <div
        className={`mobile-filter-drawer fixed inset-y-0 left-0 z-50 w-[82%] max-w-[300px] bg-background flex flex-col shadow-2xl transition-transform duration-300 md:hidden ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ paddingBottom: '70px' }}
      >
        <div className="flex justify-between items-center px-5 py-4 border-b border-tertiary-fixed shrink-0">
          <h2 className="font-label-md uppercase text-primary text-[15px] tracking-wider">Filters</h2>
          <button onClick={() => setIsFilterOpen(false)} className="text-primary hover:text-error transition-colors">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto px-5 py-4 flex flex-col gap-1">
          <FilterSection title="Categories" items={ALL_CATEGORIES} selected={selCategories} onToggle={toggle(setSelCategories)} />
          <FilterSection title="Brand"      items={ALL_BRANDS}     selected={selBrands}     onToggle={toggle(setSelBrands)} />
          <FilterSection title="Color"      items={ALL_COLORS}     selected={selColors}     onToggle={toggle(setSelColors)} />

          {/* Price Range */}
          <div className="border-t border-tertiary-fixed pt-4">
            <h3 className="font-label-md text-label-md uppercase mb-3 text-[11px]">Price Range</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">$</span>
                <input type="number" placeholder="Min" className="w-full bg-surface-container-lowest border border-outline-variant text-sm py-1.5 pl-5 pr-2 rounded-none placeholder:text-on-surface-variant/50 outline-none focus:border-primary" />
              </div>
              <span className="text-on-surface-variant">—</span>
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">$</span>
                <input type="number" placeholder="Max" className="w-full bg-surface-container-lowest border border-outline-variant text-sm py-1.5 pl-5 pr-2 rounded-none placeholder:text-on-surface-variant/50 outline-none focus:border-primary" />
              </div>
            </div>
            <input type="range" min="0" max="3000" className="w-full h-1 bg-surface-container-high appearance-none cursor-pointer accent-primary" />
          </div>

          {/* Clear All */}
          <div className="border-t border-tertiary-fixed pt-4">
            <button
              onClick={() => { clearAll(); setIsFilterOpen(false); }}
              className="w-full bg-[#ba1a1a] text-white hover:opacity-90 transition-all py-2.5 font-label-md text-label-md uppercase tracking-wider rounded-none text-sm"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-0 md:px-margin-desktop pt-md mt-6 flex flex-col md:flex-row gap-gutter flex-grow">

        {/* ── Left Sidebar Filter – Desktop only ── */}
        <aside className="filter-sidebar hidden md:flex w-[30%] lg:w-[22%] flex-shrink-0 flex-col gap-0 sticky top-[120px] h-[calc(100vh-120px)] overflow-y-auto pb-lg pr-sm">

          {/* Breadcrumbs */}
          <div className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest flex items-center gap-xs mb-md">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span className="opacity-50">/</span>
            <span className="text-primary">All Products</span>
          </div>

          {/* Results count */}
          <div className="text-[11px] text-on-surface-variant mb-2">
            <span className="font-semibold text-primary">{displayed.length}</span> of {allProducts.length} products
          </div>

          <FilterSection title="CATEGORIES" items={ALL_CATEGORIES} selected={selCategories} onToggle={toggle(setSelCategories)} />
          <FilterSection title="BRAND"      items={ALL_BRANDS}     selected={selBrands}     onToggle={toggle(setSelBrands)} />
          <FilterSection title="COLOR"      items={ALL_COLORS}     selected={selColors}     onToggle={toggle(setSelColors)} />

          {/* Price Range */}
          <div className="border-t border-tertiary-fixed pt-md">
            <h3 className="font-label-md text-label-md uppercase mb-sm">PRICE RANGE</h3>
            <div className="flex flex-col gap-sm">
              <div className="flex items-center gap-xs">
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-label-sm">$</span>
                  <input type="number" placeholder="Min" className="w-full bg-surface-container-lowest border border-outline-variant text-body-md py-1.5 pl-5 pr-2 focus:ring-1 focus:ring-primary rounded-none placeholder:text-on-surface-variant/50 outline-none" />
                </div>
                <span className="text-tertiary-fixed-dim">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-label-sm">$</span>
                  <input type="number" placeholder="Max" className="w-full bg-surface-container-lowest border border-outline-variant text-body-md py-1.5 pl-5 pr-2 focus:ring-1 focus:ring-primary rounded-none placeholder:text-on-surface-variant/50 outline-none" />
                </div>
              </div>
              <input type="range" min="0" max="3000" className="w-full h-1 bg-surface-container-high appearance-none cursor-pointer accent-primary" />
            </div>
          </div>

          {/* Rating */}
          <div className="border-t border-tertiary-fixed pt-md">
            <h3 className="font-label-md text-label-md uppercase mb-sm">RATING</h3>
            <div className="flex flex-col gap-xs">
              {[5, 4].map((stars) => (
                <button key={stars} className="flex items-center gap-xs group">
                  <div className="flex text-primary">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: s <= stars ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                    ))}
                  </div>
                  <span className="text-label-sm text-on-surface-variant group-hover:text-primary transition-colors">
                    {stars === 5 ? '(5.0)' : '& Up'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="border-t border-tertiary-fixed pt-md">
            <h3 className="font-label-md text-label-md uppercase mb-sm">AVAILABILITY</h3>
            <div className="flex flex-col gap-sm">
              {['In Stock', 'Out of Stock'].map((opt) => (
                <label key={opt} className="flex items-center gap-sm cursor-pointer group">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-primary border-primary rounded-none focus:ring-primary focus:ring-offset-0 bg-transparent cursor-pointer" />
                  <span className="font-body-md text-body-md group-hover:text-primary transition-colors">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear All */}
          <div className="border-t border-tertiary-fixed pt-lg mt-auto">
            <button
              onClick={clearAll}
              className="w-full bg-[#ba1a1a] text-white hover:opacity-90 transition-all duration-200 py-sm font-label-md text-label-md uppercase tracking-wider rounded-none"
            >
              Clear All
            </button>
          </div>
        </aside>

        {/* ── Right Product Grid ── */}
        <section className="w-full md:w-[70%] lg:w-[78%] pb-xl">

          {/* Search Bar */}
          <div className="mb-3 px-4 md:px-0">
            <div className="relative flex items-center w-full">
              <span className="material-symbols-outlined absolute left-sm text-on-surface-variant pointer-events-none">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, category, brand..."
                className="w-full bg-surface-container-lowest border border-outline-variant py-sm pl-10 pr-md font-label-md text-label-md uppercase focus:ring-1 focus:ring-primary focus:border-primary rounded-none placeholder:text-on-surface-variant/50 outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter / Sort / Grid Row */}
          <div className="flex justify-between items-center mb-2 pb-sm border-b border-tertiary-fixed px-4 md:px-0">
            {/* Desktop active filter chips */}
            <div className="hidden md:flex items-center gap-2 flex-wrap flex-1 min-w-0">
              {activeFilters.length > 0 ? (
                <>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase shrink-0">Filters:</span>
                  {activeFilters.map((f) => (
                    <span key={`${f.type}-${f.label}`} className="bg-surface-container-low text-on-surface font-label-sm text-[11px] px-2 py-1 flex items-center gap-1 border border-tertiary-fixed">
                      {f.label}
                      <button onClick={() => removeFilter(f)} className="hover:text-error transition-colors ml-0.5">
                        <span className="material-symbols-outlined text-[12px]">close</span>
                      </button>
                    </span>
                  ))}
                  <button onClick={clearAll} className="text-[11px] text-[#ba1a1a] uppercase font-semibold hover:underline">
                    Clear All
                  </button>
                </>
              ) : (
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  {displayed.length} Products
                </span>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden flex items-center gap-1 text-primary font-label-md text-[11px] uppercase border border-outline-variant px-3 py-1.5 bg-surface-container-lowest relative"
            >
              <span className="material-symbols-outlined text-[15px]">tune</span>
              Filter
              {activeFilters.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-on-primary text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeFilters.length}
                </span>
              )}
            </button>

            <div className="flex items-center gap-sm ml-auto">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Sort By:</span>
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-1 bg-transparent border-none text-primary font-label-md text-label-md uppercase cursor-pointer focus:outline-none"
                >
                  {selectedSort}
                  <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                <div className={`absolute right-0 top-full mt-2 w-52 bg-surface-container-lowest border border-tertiary-fixed shadow-lg z-30 transition-all duration-300 ease-in-out origin-top-right ${isSortOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  <ul className="flex flex-col py-2">
                    {sortOptions.map((option) => (
                      <li key={option}>
                        <button
                          onClick={() => { setSelectedSort(option); setIsSortOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-label-sm font-label-sm uppercase transition-colors ${selectedSort === option ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-container-low hover:text-primary'}`}
                        >
                          {option}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex md:hidden items-center gap-2 flex-wrap px-4 mb-3">
              {activeFilters.map((f) => (
                <span key={`${f.type}-${f.label}`} className="bg-surface-container-low text-on-surface text-[10px] px-2 py-1 flex items-center gap-1 border border-tertiary-fixed">
                  {f.label}
                  <button onClick={() => removeFilter(f)} className="hover:text-error">
                    <span className="material-symbols-outlined text-[11px]">close</span>
                  </button>
                </span>
              ))}
              <button onClick={clearAll} className="text-[10px] text-[#ba1a1a] uppercase font-semibold">Clear</button>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-0 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="border border-tertiary-fixed bg-surface-container-lowest flex flex-col animate-pulse">
                  <div className="aspect-square bg-surface-container-high w-full"></div>
                  <div className="px-2 py-2 md:p-md flex-grow flex flex-col gap-2 border-t border-tertiary-fixed">
                    <div className="h-3 bg-surface-container-high w-1/4 rounded"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-surface-container-high w-1/2 rounded"></div>
                      <div className="h-3 bg-surface-container-high w-1/6 rounded"></div>
                    </div>
                    <div className="h-3 bg-surface-container-high w-full rounded mt-1"></div>
                    <div className="h-3 bg-surface-container-high w-3/4 rounded"></div>
                    <div className="mt-auto pt-sm flex justify-between items-center border-t border-tertiary-fixed mt-2">
                      <div className="h-4 bg-surface-container-high w-1/4 rounded"></div>
                      <div className="h-8 bg-surface-container-high w-8 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <span className="material-symbols-outlined text-[48px] text-[#ba1a1a]">error</span>
              <p className="text-[20px] font-semibold uppercase text-[#ba1a1a]">Failed to Load Products</p>
              <p className="text-[14px] text-secondary">The server might be offline or reloading. Please try again.</p>
              <button onClick={() => window.location.reload()} className="mt-2 px-6 py-2 bg-primary text-on-primary text-[13px] font-bold uppercase tracking-widest hover:bg-on-surface-variant transition-colors">
                Retry
              </button>
            </div>
          ) : displayed.length > 0 ? (
            <div className="grid grid-cols-2 gap-0 lg:grid-cols-3">
              {displayed.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant">search_off</span>
              <p className="text-on-surface-variant font-label-md uppercase tracking-wider">No products match your filters.</p>
              <button onClick={clearAll} className="text-primary text-sm uppercase font-semibold hover:underline">Clear Filters</button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default All_Products;
