import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminProductForm = ({ product, onSave, onCancel }) => {
  const isEditing = Boolean(product);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    originalPrice: '',
    countInStock: '',
    badge: '',
    color: '',
    colorSwatch: '',
    tags: '',
    isLatestArrival: false,
    isFeatured: false,
    isEquipment: false,
    isSimilarProduct: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [detailImagesFiles, setDetailImagesFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        category: product.category || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        countInStock: product.countInStock || '',
        badge: product.badge || '',
        color: product.color || '',
        colorSwatch: product.colorSwatch || '',
        tags: product.tags ? product.tags.join(', ') : '',
        isLatestArrival: product.isLatestArrival || false,
        isFeatured: product.isFeatured || false,
        isEquipment: product.isEquipment || false,
        isSimilarProduct: product.isSimilarProduct || false,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleDetailImagesChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 4); // Max 4
      setDetailImagesFiles(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (imageFile) {
      data.append('image', imageFile);
    }
    
    if (detailImagesFiles.length > 0) {
      detailImagesFiles.forEach((file) => {
        data.append('detailImages', file);
      });
    }

    try {
      if (isEditing) {
        await api.put(`/products/${product._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      onSave(); // Trigger refetch and close form
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold uppercase tracking-wider text-lg">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-black uppercase text-xs font-bold tracking-widest">
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Name *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Brand *</label>
            <input list="brand-options" required type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" placeholder="Select or type a brand" />
            <datalist id="brand-options">
              <option value="Sony" />
              <option value="Canon" />
              <option value="Nikon" />
              <option value="Apple" />
              <option value="Samsung" />
              <option value="Bose" />
              <option value="Sennheiser" />
              <option value="Logitech" />
              <option value="Rode" />
            </datalist>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Category *</label>
            <input list="category-options" required type="text" name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" placeholder="Select or type a category" />
            <datalist id="category-options">
              <option value="Cameras" />
              <option value="Headphones" />
              <option value="Microphones" />
              <option value="Keyboards" />
              <option value="Lenses" />
              <option value="Accessories" />
            </datalist>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Price *</label>
            <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Original Price</label>
            <input type="number" step="0.01" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Count in Stock *</label>
            <input required type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description *</label>
          <textarea required name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black"></textarea>
        </div>

        {/* Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 border border-gray-200">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Primary Image {isEditing ? '' : '*'}</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" required={!isEditing} />
            {isEditing && product.image && !imageFile && (
              <img src={product.image} alt="Current" className="mt-2 h-20 object-contain border border-gray-300 bg-white p-1" />
            )}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Sub Images (Up to 4)</label>
            <input type="file" accept="image/*" multiple onChange={handleDetailImagesChange} className="w-full text-sm" />
            <p className="text-xs text-gray-500 mt-1">Note: Uploading new sub-images will replace existing ones.</p>
            {isEditing && product.detailImages?.length > 0 && detailImagesFiles.length === 0 && (
              <div className="flex gap-2 mt-2">
                {product.detailImages.map((img, i) => (
                  <img key={i} src={img.src} alt="Sub" className="h-12 w-12 object-contain border border-gray-300 bg-white p-1" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Badge (e.g. NEW, SALE)</label>
            <input type="text" name="badge" value={formData.badge} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Color Name</label>
            <input type="text" name="color" value={formData.color} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Color Hex (e.g. #000000)</label>
            <input type="text" name="colorSwatch" value={formData.colorSwatch} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Tags (Comma separated)</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="wireless, gaming, rgb" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
          </div>
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-6 border-t border-gray-200 pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isLatestArrival" checked={formData.isLatestArrival} onChange={handleChange} className="w-4 h-4 accent-black" />
            <span className="text-sm font-semibold">Latest Arrival</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 accent-black" />
            <span className="text-sm font-semibold">Featured Product</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isEquipment" checked={formData.isEquipment} onChange={handleChange} className="w-4 h-4 accent-black" />
            <span className="text-sm font-semibold">Equipment / Accessory</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isSimilarProduct" checked={formData.isSimilarProduct} onChange={handleChange} className="w-4 h-4 accent-black" />
            <span className="text-sm font-semibold">Similar Product</span>
          </label>
        </div>

        <div className="border-t border-gray-200 pt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`bg-black text-white px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
