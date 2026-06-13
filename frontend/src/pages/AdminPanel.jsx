import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import AdminProductForm from './AdminProductForm';

const AdminPanel = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [popup, setPopup] = useState(null);
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/signin');
      return;
    }
    fetchData();
  }, [userInfo, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes] = await Promise.all([
        api.get('/products'),
        // we can fetch orders and users if we had the APIs implemented, but let's just do products for now
        // since full CRUD on everything might take a lot of code
      ]);
      setProducts(prodRes.data);
    } catch (error) {
      console.error('Error fetching admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = (id) => {
    setPopup({
      message: 'Are you sure you want to delete this product?',
      onConfirm: async () => {
        try {
          await api.delete(`/products/${id}`);
          fetchData();
          setPopup(null);
        } catch (error) {
          setPopup({ message: 'Failed to delete product' });
        }
      }
    });
  };

  if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

  return (
    <div className="flex h-screen bg-[#f5f5f5] text-black font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 text-2xl font-bold tracking-widest border-b border-gray-800">
          ADMIN
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-6 py-3 uppercase tracking-wider text-sm ${activeTab === 'dashboard' ? 'bg-white text-black font-bold' : 'hover:bg-gray-900 text-gray-400'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-6 py-3 uppercase tracking-wider text-sm ${activeTab === 'products' ? 'bg-white text-black font-bold' : 'hover:bg-gray-900 text-gray-400'}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-6 py-3 uppercase tracking-wider text-sm ${activeTab === 'orders' ? 'bg-white text-black font-bold' : 'hover:bg-gray-900 text-gray-400'}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-6 py-3 uppercase tracking-wider text-sm ${activeTab === 'users' ? 'bg-white text-black font-bold' : 'hover:bg-gray-900 text-gray-400'}`}
          >
            Users
          </button>
        </div>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => navigate('/')}
            className="w-full mb-2 bg-gray-800 text-white py-2 uppercase tracking-widest text-xs hover:bg-gray-700"
          >
            Back to Store
          </button>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full bg-red-900 text-white py-2 uppercase tracking-widest text-xs hover:bg-red-800"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold uppercase tracking-widest">
            {activeTab}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold uppercase">{userInfo.firstName} (Admin)</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white p-6 shadow-sm border border-gray-200">
                <div className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total Products</div>
                <div className="text-3xl font-bold">{products.length}</div>
              </div>
              <div className="bg-white p-6 shadow-sm border border-gray-200">
                <div className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total Orders</div>
                <div className="text-3xl font-bold">0</div>
              </div>
              <div className="bg-white p-6 shadow-sm border border-gray-200">
                <div className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total Users</div>
                <div className="text-3xl font-bold">0</div>
              </div>
              <div className="bg-white p-6 shadow-sm border border-gray-200">
                <div className="text-gray-500 text-xs uppercase tracking-widest mb-2">Revenue</div>
                <div className="text-3xl font-bold">$0.00</div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold uppercase tracking-wider">Product Inventory</h3>
                <button 
                  onClick={() => {
                    setEditingProduct(null);
                    setActiveTab('product_form');
                  }}
                  className="bg-black text-white px-4 py-2 uppercase tracking-widest text-xs font-bold hover:bg-gray-800"
                >
                  + Add Product
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500">
                      <th className="p-4 font-semibold">Image</th>
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Price</th>
                      <th className="p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-gray-100 border border-gray-200" />
                        </td>
                        <td className="p-4 font-medium">{p.name}</td>
                        <td className="p-4 text-sm text-gray-500">{p.category}</td>
                        <td className="p-4 font-medium">${p.price}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setEditingProduct(p);
                                setActiveTab('product_form');
                              }}
                              className="text-blue-600 text-xs uppercase font-bold tracking-widest hover:underline"
                            >
                              Edit
                            </button>
                            <button onClick={() => deleteProduct(p._id)} className="text-red-600 text-xs uppercase font-bold tracking-widest hover:underline">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'product_form' && (
            <AdminProductForm 
              product={editingProduct} 
              onSave={() => {
                setActiveTab('products');
                fetchData();
              }}
              onCancel={() => {
                setActiveTab('products');
              }}
            />
          )}

          {activeTab === 'orders' && (
            <div className="text-center py-20 text-gray-500 uppercase tracking-widest text-sm">
              Orders Management Coming Soon
            </div>
          )}

          {activeTab === 'users' && (
            <div className="text-center py-20 text-gray-500 uppercase tracking-widest text-sm">
              Users Management Coming Soon
            </div>
          )}
        </main>
      </div>

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
            <p className="text-gray-500 text-sm mb-6">{popup.message}</p>
            
            <div className="flex gap-4 w-full">
              {popup.onConfirm ? (
                <>
                  <button 
                    onClick={() => setPopup(null)}
                    className="flex-1 py-3 px-4 border border-gray-300 text-black font-bold rounded-[8px] hover:bg-gray-50 transition-colors"
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
                  className="w-full py-3 px-4 bg-black text-white font-bold rounded-[8px] hover:bg-gray-800 transition-colors"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
