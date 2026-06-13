import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import api from './services/api';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './componentes/Navbar';
import Hero_page from './pages/Hero_page';
import Footer from './componentes/footer';
import Signup from './pages/Signup';
import Error from './pages/Error';
import Signin from './pages/signin';
import All_Products from './pages/All_Products';
import Single_Page from './pages/single_page';
import Your_Card from './pages/Your_Card';
import CheckoutPage from './pages/checkOut_page';
import LikePage from './pages/LIke_Page';
import SearchProduct from './pages/search_product';
import MobileBottomMenu from './componentes/MobileBottomMenu';

import AdminPanel from './pages/AdminPanel';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// ... FloatingActions and HomeLayout unchanged ...

const FloatingActions = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll to Top - Left Center */}
      <button 
        onClick={scrollToTop}
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center border transition-all duration-300 ${showScroll ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{
          backgroundColor: '#ffffff',
          color: '#000000',
          borderColor: '#ffffff',
          borderRadius: 0,
          padding: '32px 10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e2e2'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
        aria-label="Scroll to top"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_upward</span>
      </button>

      {/* WhatsApp - Right Center */}
      <a 
        href="https://wa.me/" 
        target="_blank" 
        rel="noreferrer"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center border transition-all duration-300 cursor-pointer"
        style={{
          backgroundColor: '#25D366',
          color: '#ffffff',
          borderColor: '#25D366',
          borderRadius: 0,
          padding: '32px 10px',
          boxShadow: '0 4px 20px rgba(37,211,102,0.3)'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1DA851'; e.currentTarget.style.borderColor = '#1DA851'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#25D366'; e.currentTarget.style.borderColor = '#25D366'; }}
        aria-label="Contact on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
};

// Home page layout (with Navbar, Hero, Footer, FloatingActions)
const HomeLayout = () => (
  <div className="flex flex-col min-h-screen bg-background text-on-background font-body-md antialiased relative">
    <Navbar />
    <Hero_page />
    <Footer />
    <FloatingActions />
  </div>
);

const AppInitializer = ({ children }) => {
  const [status, setStatus] = useState('loading'); // 'loading', 'online', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkStatus = async () => {
      if (!navigator.onLine) {
        setStatus('error');
        setErrorMessage('No Internet Connection. Please turn on your internet.');
        return;
      }
      try {
        await api.get('/products');
        setStatus('online');
      } catch (err) {
        setStatus('error');
        setErrorMessage('Server is not open. Please start the backend server.');
      }
    };

    checkStatus();

    const handleOnline = () => {
      setStatus('loading');
      checkStatus();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] text-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-4"></div>
        <p className="uppercase tracking-widest font-semibold text-[14px]">Connecting to Server...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] text-black px-4 text-center">
        <span className="material-symbols-outlined text-[64px] text-[#ba1a1a] mb-4">cloud_off</span>
        <h1 className="text-[24px] font-bold uppercase tracking-tighter mb-2 text-black">Connection Error</h1>
        <p className="text-[#5d5e66] font-medium mb-6 text-[14px]">{errorMessage}</p>
        <button 
          onClick={() => { setStatus('loading'); window.location.reload(); }}
          className="bg-black text-white px-8 py-3 text-[13px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <AppInitializer>
      <AuthProvider>
        <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomeLayout />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/all-products" element={<All_Products />} />
              <Route path="/single-product" element={<Single_Page />} />
              <Route path="/your-cart" element={<Your_Card />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/likes" element={<LikePage/>} />
              <Route path="/search" element={<SearchProduct />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="*" element={<Error />} />
            </Routes>
            <MobileBottomMenu />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
    </AppInitializer>
  );
}

export default App;
