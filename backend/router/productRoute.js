import express from 'express';
import {
  getProducts,
  getProductById,
  getProductDetailImages,
  getLatestArrivals,
  getFeaturedProducts,
  getEquipment,
  getSimilarProducts,
  getRecentlyViewed,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// ── Public collection endpoints ──────────────────────────
// IMPORTANT: named sub-routes MUST be declared BEFORE /:id
// to avoid Express matching them as IDs.

router.get('/latest-arrivals', getLatestArrivals);
router.get('/featured', getFeaturedProducts);
router.get('/equipment', getEquipment);
router.get('/recently-viewed', getRecentlyViewed);
router.get('/categories', getCategories);
router.get('/similar/:id', getSimilarProducts);

// ── Base collection (with optional ?q / ?category filters) ──
router.route('/')
  .get(getProducts)
  .post(protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'detailImages', maxCount: 4 }]), createProduct);

// ── Single product ────────────────────────────────────────
router.get('/:id/detail-images', getProductDetailImages);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'detailImages', maxCount: 4 }]), updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
