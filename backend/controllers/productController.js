import Product from '../models/Product.js';

// ─────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────

/**
 * Build a mongoose filter from common query params:
 *   ?q=       → name regex search
 *   ?category=→ exact category match
 *   ?brand=   → exact brand match
 *   ?badge=   → exact badge match
 */
const buildFilter = (query) => {
  const filter = {};

  if (query.q) {
    filter.name = { $regex: query.q, $options: 'i' };
  }
  if (query.category) filter.category = query.category;
  if (query.brand) filter.brand = query.brand;
  if (query.badge) filter.badge = query.badge;

  return filter;
};

// ─────────────────────────────────────────────────────────
//  GET /api/products
//  Public — returns all products with optional filters
// ─────────────────────────────────────────────────────────
export const getProducts = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
//  GET /api/products/latest-arrivals
//  Public — products flagged as isLatestArrival, max 8
// ─────────────────────────────────────────────────────────
export const getLatestArrivals = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.find({ isLatestArrival: true })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
//  GET /api/products/featured
//  Public — products flagged as isFeatured
// ─────────────────────────────────────────────────────────
export const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const products = await Product.find({ isFeatured: true })
      .sort({ rating: -1 })
      .limit(limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
//  GET /api/products/equipment
//  Public — products flagged as isEquipment (accessories / gear)
// ─────────────────────────────────────────────────────────
export const getEquipment = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const products = await Product.find({ isEquipment: true })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
//  GET /api/products/similar/:id
//  Public — products in the same category, excluding this product
//           Falls back to any products if category has < 4
// ─────────────────────────────────────────────────────────
export const getSimilarProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const product = await Product.findById(req.params.id).select('category');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Primary: same category, not this product
    let similar = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .sort({ rating: -1 })
      .limit(limit);

    // Fallback: top-rated products from any category
    if (similar.length < limit) {
      const ids = [product._id, ...similar.map((p) => p._id)];
      const extra = await Product.find({ _id: { $nin: ids } })
        .sort({ rating: -1 })
        .limit(limit - similar.length);
      similar = [...similar, ...extra];
    }

    res.json(similar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
//  GET /api/products/recently-viewed
//  Public — accepts ?ids=id1,id2,id3 (comma-separated)
//           Returns those products in requested order
// ─────────────────────────────────────────────────────────
export const getRecentlyViewed = async (req, res) => {
  try {
    const rawIds = req.query.ids || '';
    const ids = rawIds
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
      .slice(0, 8); // max 8

    if (ids.length === 0) {
      // If no IDs provided return last 4 added products as fallback
      const fallback = await Product.find().sort({ createdAt: -1 }).limit(4);
      return res.json(fallback);
    }

    const products = await Product.find({ _id: { $in: ids } });

    // Preserve the requested order
    const ordered = ids
      .map((id) => products.find((p) => p._id.toString() === id))
      .filter(Boolean);

    res.json(ordered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
//  GET /api/products/categories
//  Public — distinct list of all category names
// ─────────────────────────────────────────────────────────
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
//  GET /api/products/:id
//  Public — single product by id
// ─────────────────────────────────────────────────────────
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
//  GET /api/products/:id/detail-images
//  Public — only the detailImages array for a product
// ─────────────────────────────────────────────────────────
export const getProductDetailImages = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('detailImages');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product.detailImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
//  POST /api/products
//  Private/Admin — create a new product
// ─────────────────────────────────────────────────────────
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      brand,
      category,
      countInStock,
      badge,
      color,
      colorSwatch,
      originalPrice,
      tags,
      specifications,
      isLatestArrival,
      isFeatured,
      isEquipment,
      isSimilarProduct,
    } = req.body;

    const image = req.files && req.files['image'] ? req.files['image'][0].path : '';
    
    let detailImages = [];
    if (req.files && req.files['detailImages']) {
      detailImages = req.files['detailImages'].map((file) => ({
        src: file.path,
        alt: name,
        label: ''
      }));
    }

    const product = new Product({
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
      badge,
      color,
      colorSwatch,
      originalPrice,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [],
      specifications: specifications ? JSON.parse(specifications) : [],
      isLatestArrival: isLatestArrival === 'true' || isLatestArrival === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isEquipment: isEquipment === 'true' || isEquipment === true,
      isSimilarProduct: isSimilarProduct === 'true' || isSimilarProduct === true,
      detailImages,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
//  PUT /api/products/:id
//  Private/Admin — update a product
// ─────────────────────────────────────────────────────────
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      brand,
      category,
      countInStock,
      badge,
      color,
      colorSwatch,
      originalPrice,
      tags,
      specifications,
      isLatestArrival,
      isFeatured,
      isEquipment,
      isSimilarProduct,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.countInStock = countInStock ?? product.countInStock;
    product.badge = badge ?? product.badge;
    product.color = color ?? product.color;
    product.colorSwatch = colorSwatch ?? product.colorSwatch;
    product.originalPrice = originalPrice ?? product.originalPrice;

    if (tags !== undefined) {
      product.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    }
    if (specifications !== undefined) {
      product.specifications = typeof specifications === 'string'
        ? JSON.parse(specifications)
        : specifications;
    }
    if (isLatestArrival !== undefined) product.isLatestArrival = isLatestArrival === 'true' || isLatestArrival === true;
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (isEquipment !== undefined) product.isEquipment = isEquipment === 'true' || isEquipment === true;
    if (isSimilarProduct !== undefined) product.isSimilarProduct = isSimilarProduct === 'true' || isSimilarProduct === true;

    if (req.files && req.files['image']) {
      product.image = req.files['image'][0].path;
    }

    if (req.files && req.files['detailImages']) {
      product.detailImages = req.files['detailImages'].map((file) => ({
        src: file.path,
        alt: product.name,
        label: ''
      }));
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
//  DELETE /api/products/:id
//  Private/Admin — delete a product
// ─────────────────────────────────────────────────────────
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
