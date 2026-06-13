import { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CheckoutPage = () => {
  const { cartTotal } = useCart();
  const { userInfo } = useAuth();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [popup, setPopup] = useState(null);
  const [currentAddressId, setCurrentAddressId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    label: '',
    fullName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  useEffect(() => {
    if (userInfo) {
      fetchAddresses();
    }
  }, [userInfo]);

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get('/users/addresses');
      setAddresses(data);
      if (data.length > 0 && !selectedAddress) {
        setSelectedAddress(data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditMode(false);
    setCurrentAddressId(null);
    setFormData({
      label: 'HOME',
      fullName: userInfo?.firstName || '',
      phone: userInfo?.phone || '',
      email: userInfo?.email || '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (address) => {
    setEditMode(true);
    setCurrentAddressId(address._id);
    setFormData({
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      email: address.email,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/users/addresses/${currentAddressId}`, formData);
      } else {
        await api.post('/users/addresses', formData);
      }
      setIsModalOpen(false);
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      setPopup({ message: 'Failed to save address.' });
    }
  };

  const deleteAddress = (id) => {
    setPopup({
      message: 'Are you sure you want to remove this address?',
      onConfirm: async () => {
        try {
          await api.delete(`/users/addresses/${id}`);
          fetchAddresses();
          setPopup(null);
        } catch (error) {
          console.error('Error deleting address:', error);
          setPopup({ message: 'Failed to delete address.' });
        }
      }
    });
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow flex justify-center w-full px-margin-mobile md:px-margin-desktop pb-xl pt-4 md:pt-28">
        <div className="max-w-container-max w-full">
          {/* Breadcrumbs */}
          <div className="pt-xs pb-sm text-label-sm font-label-sm text-secondary uppercase tracking-widest flex items-center gap-xs">
            <a href="/your-cart" className="hover:text-primary transition-colors">Your Cart</a>
            <span className="opacity-50">/</span>
            <span className="text-primary">Checkout</span>
          </div>

          <div className="mb-lg">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">Checkout</h1>
            <p className="font-body-md text-body-md text-secondary">Step 2 of 3: Shipping Address</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-gutter">
            {/* Left Column: Addresses */}
            <div className="flex-grow lg:w-2/3 flex flex-col gap-md">
              <h2 className="font-headline-md text-headline-md text-primary">Saved Addresses</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {addresses.map((address) => (
                  <div 
                    key={address._id}
                    className={`bg-surface-container-lowest p-md cursor-pointer relative transition-colors duration-200 ${selectedAddress === address._id ? 'border-2 border-primary' : 'border border-outline-variant hover:border-primary'}`}
                    onClick={() => setSelectedAddress(address._id)}
                  >
                    <div className={`absolute top-md right-md ${selectedAddress === address._id ? '' : 'hidden'}`}>
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <h3 className="font-label-md text-label-md text-primary mb-sm">{address.label}</h3>
                    <p className="font-body-md text-body-md text-on-surface mb-xs">{address.fullName}</p>
                    <p className="font-body-md text-body-md text-secondary">{address.street}</p>
                    <p className="font-body-md text-body-md text-secondary mb-md">{address.city}, {address.state} {address.zipCode}</p>
                    <div className="flex gap-sm mt-auto">
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEditModal(address); }}
                        className="font-label-md text-label-md text-secondary hover:text-primary transition-colors"
                      >
                        EDIT
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteAddress(address._id); }}
                        className="font-label-md text-label-md text-secondary hover:text-primary transition-colors"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                ))}
                
                {addresses.length === 0 && (
                  <div className="col-span-full py-xl text-center text-secondary border border-dashed border-outline-variant">
                    No saved addresses found. Please add a new address.
                  </div>
                )}
              </div>
              
              <button 
                onClick={openAddModal}
                className="flex items-center justify-center gap-sm p-md border border-outline-variant hover:border-primary bg-surface-container-lowest font-label-md text-label-md text-primary transition-colors duration-200 mt-sm w-full md:w-auto self-start"
              >
                <span className="material-symbols-outlined">add</span>
                ADD NEW ADDRESS
              </button>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:w-1/3 mt-lg lg:mt-0">
              <div className="bg-surface-container p-md border border-surface-variant sticky top-[100px]">
                <h2 className="font-headline-md text-headline-md text-primary mb-md">Order Summary</h2>
                <div className="flex flex-col gap-sm mb-md border-b border-surface-variant pb-md">
                  <div className="flex justify-between font-body-md text-body-md text-on-surface">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-body-md text-body-md text-on-surface">
                    <span>Shipping</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-body-md text-body-md text-on-surface">
                    <span>Estimated Tax</span>
                    <span>${(cartTotal * 0.09).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-headline-md text-headline-md text-primary mb-lg">
                  <span>Total</span>
                  <span>${(cartTotal * 1.09).toFixed(2)}</span>
                </div>
                <img 
                  alt="Decorative image for order context." 
                  className="w-full h-auto mb-lg border border-outline-variant opacity-80 mix-blend-multiply grayscale" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgL_LrDExWtTodvisxaZ2AT0WcPiHadGIi1fdSuPm1kMEUbIXQWY9JQoRjHeCbADBfLTfv-UE1Xutszj4DDwxz9oaXdby486AOIFfdOZjTgOkXwCzBaIxbi4REDDDX-DgkyhlM8vL3Z1gyQ6KU0FFgaRTK1NCAuXyI_xhLQ47qPDnDoUDpOHdIlG1Bv5HwyHJ_E9Dfd8zjJvBqSB1hVG598Rt25mib-YH0xU-rqy8aKAddTaogDgXAffz9UgK4uGqgaKBGIbBhbTc" 
                />
                <button 
                  disabled={!selectedAddress}
                  className={`w-full ${selectedAddress ? 'bg-primary text-on-primary hover:bg-surface-tint' : 'bg-surface-variant text-secondary cursor-not-allowed'} py-sm px-md font-label-md text-label-md transition-colors duration-200 rounded-none h-12 flex items-center justify-center uppercase tracking-widest`}
                >
                  PROCEED TO PAYMENT
                </button>
                <p className="font-label-sm text-label-sm text-secondary flex justify-center items-center mt-sm uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px] align-middle mr-xs" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                  Secure encrypted checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Add/Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[12px] p-6 w-full max-w-[480px] relative shadow-2xl">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Address' : 'Add New Address'}</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Label (e.g. HOME)</label>
                <input type="text" name="label" value={formData.label} onChange={handleInputChange} placeholder="HOME" className="w-full border border-gray-300 rounded-[8px] p-3 text-black outline-none focus:border-black transition-colors placeholder:text-gray-400" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" className="w-full border border-gray-300 rounded-[8px] p-3 text-black outline-none focus:border-black transition-colors placeholder:text-gray-400" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 9876543210" className="w-full border border-gray-300 rounded-[8px] p-3 text-black outline-none focus:border-black transition-colors placeholder:text-gray-400" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="w-full border border-gray-300 rounded-[8px] p-3 text-black outline-none focus:border-black transition-colors placeholder:text-gray-400" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Street Address</label>
                <input type="text" name="street" value={formData.street} onChange={handleInputChange} placeholder="123 Street, Area" className="w-full border border-gray-300 rounded-[8px] p-3 text-black outline-none focus:border-black transition-colors placeholder:text-gray-400" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Kolkata" className="w-full border border-gray-300 rounded-[8px] p-3 text-black outline-none focus:border-black transition-colors placeholder:text-gray-400" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="West Bengal" className="w-full border border-gray-300 rounded-[8px] p-3 text-black outline-none focus:border-black transition-colors placeholder:text-gray-400" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Zip Code</label>
                  <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="700001" className="w-full border border-gray-300 rounded-[8px] p-3 text-black outline-none focus:border-black transition-colors placeholder:text-gray-400" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Country</label>
                  <input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="India" className="w-full border border-gray-300 rounded-[8px] p-3 text-black outline-none focus:border-black transition-colors placeholder:text-gray-400" required />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#1a1a1a] text-white font-semibold rounded-[8px] py-4 mt-2 hover:bg-black transition-colors">
                {editMode ? 'Update Address' : 'Save & Continue'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Custom Popup Modal */}
      {popup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[12px] p-6 w-full max-w-[400px] shadow-2xl flex flex-col items-center text-center">
            {popup.onConfirm ? (
              <span className="material-symbols-outlined text-[48px] text-[#ff4444] mb-4">warning</span>
            ) : (
              <span className="material-symbols-outlined text-[48px] text-primary mb-4">info</span>
            )}
            <h3 className="text-lg font-bold text-black mb-2">
              {popup.onConfirm ? 'Confirm Action' : 'Notice'}
            </h3>
            <p className="text-secondary font-body-md mb-6">{popup.message}</p>
            
            <div className="flex gap-4 w-full">
              {popup.onConfirm ? (
                <>
                  <button 
                    onClick={() => setPopup(null)}
                    className="flex-1 py-3 px-4 border border-outline-variant text-black font-bold rounded-[8px] hover:bg-surface-variant transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={popup.onConfirm}
                    className="flex-1 py-3 px-4 bg-[#ff4444] text-white font-bold rounded-[8px] hover:bg-[#cc0000] transition-colors"
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setPopup(null)}
                  className="w-full py-3 px-4 bg-primary text-on-primary font-bold rounded-[8px] hover:bg-surface-tint transition-colors"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CheckoutPage;
