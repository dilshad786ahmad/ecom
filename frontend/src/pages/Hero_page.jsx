import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero_page.css';
import Latest_Arrivals from '../componentes/Latest_Arrivals';
import Scrolling_Gallery from '../componentes/Scrolling_Gallery';
import Banner_one from '../componentes/Banner_one';
import Latest_Equipment from '../componentes/Latest_Equipment';
import Banner from '../componentes/Banner';
import Recenty_Viewed from '../componentes/Recenty_Viewed';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import api from '../services/api';

/* ─────────────────────────────────────────
   Main Hero_page component
───────────────────────────────────────── */
const Hero_page = () => {
  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get('/products');
        setGalleryItems(data.slice(0, 7)); // Fetch subset for hero visuals
        const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching gallery items for hero', error);
      }
    };
    fetchGallery();
  }, []);

  return (
    <main className="flex-grow flex flex-col">

      {/* ── Hero Section ─────────────────────── */}
      <section className="hero-section">
        {/* Background Animated Slider */}
        <div className="hero-bg-slider">
          {/* Row 1 */}
          <div className="hero-bg-track">
            <div className="flex gap-8 pr-8">
              {galleryItems.map((item, i) => (
                <div key={`hb1-r1-${i}`} className="hero-bg-item"><img src={item.image} alt="" /></div>
              ))}
            </div>
            <div className="flex gap-8 pr-8">
              {galleryItems.map((item, i) => (
                <div key={`hb2-r1-${i}`} className="hero-bg-item"><img src={item.image} alt="" /></div>
              ))}
            </div>
          </div>
          {/* Row 2 (Reverse) */}
          <div className="hero-bg-track reverse">
            <div className="flex gap-8 pr-8">
              {[...galleryItems].reverse().map((item, i) => (
                <div key={`hb1-r2-${i}`} className="hero-bg-item"><img src={item.image} alt="" /></div>
              ))}
            </div>
            <div className="flex gap-8 pr-8">
              {[...galleryItems].reverse().map((item, i) => (
                <div key={`hb2-r2-${i}`} className="hero-bg-item"><img src={item.image} alt="" /></div>
              ))}
            </div>
          </div>
          {/* Row 3 */}
          <div className="hero-bg-track">
            <div className="flex gap-8 pr-8">
              {galleryItems.map((item, i) => (
                <div key={`hb1-r3-${i}`} className="hero-bg-item"><img src={item.image} alt="" /></div>
              ))}
            </div>
            <div className="flex gap-8 pr-8">
              {galleryItems.map((item, i) => (
                <div key={`hb2-r3-${i}`} className="hero-bg-item"><img src={item.image} alt="" /></div>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay */}
        <div className="hero-bg-overlay"></div>

        <div className="hero-grid">
          {/* Text Content — left */}
          <div className="flex flex-col gap-md text-left w-full min-w-0" style={{ order: 1, gap: '24px', zIndex: 10 }}>
            <span
              className="text-label-md uppercase tracking-widest"
              style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em', color: '#dadada' }}
            >
              Next-Gen Audio
            </span>

            <div className="w-full max-w-full sm:max-w-[640px] rounded-xl overflow-hidden shadow-2xl mb-2 relative">
              <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                className="w-full h-[200px] sm:h-[350px]"
              >
                {galleryItems.map((item, idx) => (
                  <SwiperSlide key={`hero-swiper-${idx}`}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain sm:object-cover bg-black/20 backdrop-blur-sm" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="flex overflow-x-auto gap-3 mt-2 pb-2 scrollbar-hide w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
              {categories.map((category, idx) => (
                <span
                  key={idx}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(category)}`)}
                  className="flex-shrink-0 px-5 py-2 rounded-full border border-gray-500/50 text-sm font-medium tracking-wide text-white bg-black/40 backdrop-blur-md hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="flex flex-row flex-nowrap justify-start items-center gap-2 md:gap-4 mt-3 w-full">
              <button
                onClick={() => navigate('/all-products')}
                className="uppercase tracking-widest transition-colors border whitespace-nowrap px-4 py-3 md:px-8 md:py-4 text-[10px] md:text-[14px] flex-1 text-center"
                style={{ backgroundColor: '#ffffff', color: '#000000', fontWeight: 600, letterSpacing: '0.05em', borderColor: '#ffffff', borderRadius: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e2e2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                Shop A1 Series
              </button>
              <button
                className="uppercase tracking-widest transition-colors border whitespace-nowrap px-4 py-3 md:px-8 md:py-4 text-[10px] md:text-[14px] flex-1 text-center"
                style={{ backgroundColor: 'transparent', color: '#ffffff', fontWeight: 600, letterSpacing: '0.05em', borderColor: '#ffffff', borderRadius: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                View Specs
              </button>
            </div>
          </div>

          {/* Hero Image Vertical Slider — right */}
          <div className="relative w-full h-full flex justify-center items-center" style={{ order: 2, zIndex: 10 }}>
            <div className="hero-vertical-slider-container w-full max-w-[700px]">
              {/* Column 1 (Slide Up) */}
              <div className="hero-vertical-track">
                {galleryItems.map((item, idx) => (
                  <div key={`vc1-o-${idx}`} className="hero-vertical-item group">
                    <img src={item.image} alt={item.name} />
                  </div>
                ))}
                {galleryItems.map((item, idx) => (
                  <div key={`vc1-d-${idx}`} className="hero-vertical-item group">
                    <img src={item.image} alt={item.name} />
                  </div>
                ))}
              </div>

              {/* Column 2 (Slide Down) */}
              <div className="hero-vertical-track reverse" style={{ marginTop: '-80px' }}>
                {[...galleryItems].reverse().map((item, idx) => (
                  <div key={`vc2-o-${idx}`} className="hero-vertical-item group">
                    <img src={item.image} alt={item.name} />
                  </div>
                ))}
                {[...galleryItems].reverse().map((item, idx) => (
                  <div key={`vc2-d-${idx}`} className="hero-vertical-item group">
                    <img src={item.image} alt={item.name} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <span className="text-label-sm uppercase tracking-widest" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.02em' }}>
            Scroll
          </span>
          <span className="material-symbols-outlined">arrow_downward</span>
        </div>
      </section>

      {/* ── Imported Section Components ── */}
      <Latest_Arrivals />
      <Scrolling_Gallery />
      <Banner_one />
      <Latest_Equipment />
      <Banner />
      <Recenty_Viewed />

    </main>
  );
};

export default Hero_page;
