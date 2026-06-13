import mongoose from 'mongoose';

// Sub-schema for detail images (gallery images shown on single product page)
const detailImageSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  { _id: false }
);

// Sub-schema for technical specifications
const specSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },

    // Category — used to group products (Cameras, Headphones, Keyboards, etc.)
    category: { type: String, required: true },

    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },

    // Primary product image
    image: { type: String, required: true },

    // Optional badge label e.g. "New", "Sale", "PRE-ORDER"
    badge: { type: String },

    color: { type: String },
    colorSwatch: { type: String },

    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },

    // Gallery / detail images shown below the hero on the single product page
    detailImages: { type: [detailImageSchema], default: [] },

    // Technical specs shown in the spec table on single product page
    specifications: { type: [specSchema], default: [] },

    // Search / filter tags
    tags: { type: [String], default: [] },

    // Section flags — used by dedicated API endpoints
    isLatestArrival: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },

    // True for "equipment" (gear/accessories) as opposed to main products
    isEquipment: { type: Boolean, default: false },

    // Explicit flag for similar products
    isSimilarProduct: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Index for fast category + section queries
productSchema.index({ category: 1 });
productSchema.index({ isLatestArrival: 1 });
productSchema.index({ isFeatured: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
