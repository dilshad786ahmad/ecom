import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/footer';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

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

/* ── Product Card ── */
const SearchProductCard = ({ product, gridView }) => {
  const [qty, setQty] = useState(0);
  const navigate = useNavigate();

  if (!gridView) {
    // List View
    return (
      <article
        className="group bg-surface-container-lowest flex flex-row hover:bg-surface transition-colors duration-300 border-b border-surface-variant"
        onClick={(e) => { if (qty === 0) navigate(`/single-product?id=${product._id}`); }}
        style={{ cursor: qty === 0 ? 'pointer' : 'default' }}
      >
        <div className="w-[160px] md:w-[200px] flex-shrink-0 bg-surface flex items-center justify-center p-4">
          <img
            src={product.image}
            alt={product.alt}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            style={{ mixBlendMode: 'multiply', aspectRatio: '1/1' }}
          />
        </div>
        <div className="flex flex-col flex-grow p-4 md:p-6 justify-between gap-2">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h2 className="text-on-background uppercase font-semibold text-[16px] md:text-[18px] tracking-tight">
                {product.name}
              </h2>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-[16px] text-on-background">{product.price}</p>
                {product.originalPrice && (
                  <p className="text-[12px] text-on-surface-variant line-through">{product.originalPrice}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 text-[12px] text-on-surface-variant mt-1">
              <span className="text-on-background">★</span> {product.rating || '4.8'}
              <span className="ml-2 text-[11px] bg-surface-container px-2 py-0.5">{product.brand}</span>
              <span className="text-[11px] bg-surface-container px-2 py-0.5">{product.category}</span>
            </div>
            <p className="text-[13px] text-on-surface-variant mt-2">{product.description}</p>
          </div>
          <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
            {qty === 0 ? (
              <button
                className="bg-primary text-on-primary text-[12px] font-bold uppercase tracking-widest px-5 py-2 hover:bg-on-surface-variant transition-colors"
                onClick={() => setQty(1)}
              >
                Add to Bag
              </button>
            ) : (
              <div className="flex items-center border border-primary h-9">
                <button className="w-9 h-full flex items-center justify-center text-primary hover:bg-surface-container" onClick={() => setQty(Math.max(0, qty - 1))}>
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="px-4 text-[13px] font-medium text-primary">{qty}</span>
                <button className="w-9 h-full flex items-center justify-center text-primary hover:bg-surface-container" onClick={() => setQty(qty + 1)}>
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Grid View
  return (
    <article
      className="group bg-surface-container-lowest flex flex-col hover:bg-surface transition-colors duration-300 border border-tertiary-fixed"
      onClick={() => { if (qty === 0) navigate(`/single-product?id=${product._id}`); }}
      style={{ cursor: qty === 0 ? 'pointer' : 'default' }}
    >
      <div className="relative w-full overflow-hidden bg-surface flex items-center justify-center p-6" style={{ aspectRatio: '4/5' }}>
        {product.badge && (
          <span className="absolute top-3 left-3 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 z-10">
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.alt}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow gap-2 border-t border-tertiary-fixed">
        <div className="flex justify-between items-start">
          <h2 className="text-on-background uppercase font-semibold text-[15px] tracking-tight">{product.name}</h2>
          <span className="text-[13px] font-bold text-on-background">{product.price}</span>
        </div>
        <div className="flex items-center gap-1 text-[12px] text-on-surface-variant">
          <span className="text-on-background">★</span> {product.rating || '4.8'}
          {product.originalPrice && <span className="ml-1 line-through text-[11px]">{product.originalPrice}</span>}
        </div>
        <p className="text-[12px] text-on-surface-variant line-clamp-2 flex-grow">{product.description}</p>
        <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
          {qty === 0 ? (
            <button
              className="w-full bg-primary text-on-primary text-[11px] font-bold uppercase tracking-widest py-2 hover:bg-on-surface-variant transition-colors"
              onClick={() => setQty(1)}
            >
              Add to Bag
            </button>
          ) : (
            <div className="flex items-center border border-primary h-9 w-full">
              <button className="w-9 h-full flex items-center justify-center text-primary hover:bg-surface-container" onClick={() => setQty(Math.max(0, qty - 1))}>
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>
              <span className="flex-grow text-center text-[12px] font-medium text-primary">{qty}</span>
              <button className="w-9 h-full flex items-center justify-center text-primary hover:bg-surface-container" onClick={() => setQty(qty + 1)}>
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

/* ── Search Product Page ── */
const SearchProduct = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const ALL_CATEGORIES = useMemo(() => [...new Set(allProducts.map((p) => p.category))].sort(), [allProducts]);
  const ALL_BRANDS     = useMemo(() => [...new Set(allProducts.map((p) => p.brand))].sort(), [allProducts]);
  const ALL_COLORS = [
    { label: 'Black',  swatch: '#1a1a1a' },
    { label: 'White',  swatch: '#f5f5f5' },
    { label: 'Silver', swatch: '#C0C0C0' },
    { label: 'Slate',  swatch: '#708090' },
  ];

  const [localQuery, setLocalQuery] = useState(query);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Relevance');

  /* Active filter state */
  const [selCategories, setSelCategories] = useState([]);
  const [selBrands, setSelBrands]         = useState([]);
  const [selColors, setSelColors]         = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setAllProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const sortOptions = ['Relevance', 'Newest', 'Price: High to Low', 'Price: Low to High', 'Rating'];

  /* ── Toggle helpers ── */
  const toggle = (setter) => (val) =>
    setter((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);

  const parsePrice = (p) => parseFloat(p.replace(/[$,]/g, '')) || 0;

  const filteredProducts = useMemo(() => {
    let list = query
      ? allProducts.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || (p.category || '').toLowerCase().includes(query.toLowerCase()) || (p.brand || '').toLowerCase().includes(query.toLowerCase()))
      : allProducts;

    if (selCategories.length) list = list.filter((p) => selCategories.includes(p.category));
    if (selBrands.length)     list = list.filter((p) => selBrands.includes(p.brand));
    if (selColors.length)     list = list.filter((p) => selColors.includes(p.color));

    if (selectedSort === 'Price: Low to High') list = [...list].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    else if (selectedSort === 'Price: High to Low') list = [...list].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    else if (selectedSort === 'Rating') list = [...list].sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'));
    else if (selectedSort === 'Newest') list = [...list].reverse();

    return list;
  }, [query, selCategories, selBrands, selColors, selectedSort]);

  const relatedProducts = useMemo(() => {
    return allProducts.filter((p) => !filteredProducts.find((f) => f._id === p._id && f.name === p.name)).slice(0, 4);
  }, [filteredProducts]);

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

  const clearAll = () => { setSelCategories([]); setSelBrands([]); setSelColors([]); };

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
          
          <div className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest flex items-center gap-xs mb-md">
            <span className="text-primary">Search Results for "{query}"</span>
          </div>

          <div className="text-[11px] text-on-surface-variant mb-2">
            <span className="font-semibold text-primary">{filteredProducts.length}</span> results found
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
            <form 
              onSubmit={(e) => { e.preventDefault(); navigate(`/search?q=${encodeURIComponent(localQuery)}`); }}
              className="w-full flex items-stretch"
            >
              <div className="relative flex items-center flex-grow">
                <span className="material-symbols-outlined absolute left-sm text-on-surface-variant pointer-events-none">search</span>
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-surface-container-lowest border border-outline-variant py-sm pl-10 pr-md font-label-md text-label-md uppercase focus:ring-1 focus:ring-primary focus:border-primary rounded-none placeholder:text-on-surface-variant/50 outline-none"
                />
              </div>
              <button type="submit" className="bg-primary text-on-primary px-6 py-sm flex items-center justify-center font-bold tracking-widest text-[13px] uppercase hover:bg-on-surface-variant transition-colors ml-2">
                Search
              </button>
            </form>
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
                  {filteredProducts.length} Products
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
              {/* Grid Toggle */}
              <div className="flex border border-outline overflow-hidden mr-4 hidden md:flex">
                <button
                  onClick={() => setGridView(true)}
                  className={`py-1 px-2 transition-colors flex items-center justify-center ${gridView ? 'bg-primary text-on-primary' : 'bg-surface text-on-surface-variant hover:bg-surface-container'}`}
                  aria-label="Grid view"
                >
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                </button>
                <button
                  onClick={() => setGridView(false)}
                  className={`py-1 px-2 transition-colors flex items-center justify-center ${!gridView ? 'bg-primary text-on-primary' : 'bg-surface text-on-surface-variant hover:bg-surface-container'}`}
                  aria-label="List view"
                >
                  <span className="material-symbols-outlined text-[16px]">view_list</span>
                </button>
              </div>

              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase hidden md:inline">Sort By:</span>
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-1 bg-transparent border-none text-primary font-label-md text-[11px] md:text-label-md uppercase cursor-pointer focus:outline-none"
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
            <div className={gridView ? 'grid grid-cols-2 gap-0 lg:grid-cols-3' : 'flex flex-col gap-0'}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <article key={`skeleton-${idx}`} className={`bg-surface-container-lowest border ${gridView ? 'border-tertiary-fixed flex flex-col' : 'border-b border-surface-variant flex flex-row'} animate-pulse`}>
                  <div className={`${gridView ? 'w-full aspect-[4/5]' : 'w-[160px] md:w-[200px] h-full'} bg-surface-container-high shrink-0`}></div>
                  <div className={`flex flex-col flex-grow ${gridView ? 'p-4 gap-2 border-t border-tertiary-fixed' : 'p-4 md:p-6 gap-2 justify-between'}`}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="h-5 bg-surface-container-high w-2/3 rounded"></div>
                      <div className="h-5 bg-surface-container-high w-1/4 rounded"></div>
                    </div>
                    <div className="h-3 bg-surface-container-high w-1/3 rounded mt-1"></div>
                    <div className="h-3 bg-surface-container-high w-full rounded mt-2"></div>
                    <div className="h-3 bg-surface-container-high w-4/5 rounded mt-1"></div>
                    <div className="h-8 bg-surface-container-high w-full rounded mt-auto"></div>
                  </div>
                </article>
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
          ) : filteredProducts.length > 0 ? (
            <div className={gridView ? 'grid grid-cols-2 gap-0 lg:grid-cols-3' : 'flex flex-col gap-0'}>
              {filteredProducts.map((product, idx) => (
                <SearchProductCard key={`${product._id}-${idx}`} product={product} gridView={gridView} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant">search_off</span>
              <p className="text-[20px] font-semibold uppercase text-on-surface-variant">No Products Found</p>
              <p className="text-[14px] text-secondary">Try adjusting your filters or search term.</p>
              <button onClick={clearAll} className="mt-2 px-6 py-2 bg-primary text-on-primary text-[13px] font-bold uppercase tracking-widest hover:bg-on-surface-variant transition-colors">
                Clear Filters
              </button>
            </div>
          )}

          {/* ── Related Products ── */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 px-4 md:px-0">
              <div className="border-b border-on-background pb-4 mb-8">
                <h2 className="text-[22px] font-bold uppercase tracking-tight">Related Products</h2>
              </div>
              <div className={gridView ? 'grid grid-cols-2 gap-0 lg:grid-cols-3' : 'flex flex-col gap-0'}>
                {relatedProducts.map((product, idx) => (
                  <SearchProductCard key={`related-${product._id}-${idx}`} product={product} gridView={gridView} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SearchProduct;
