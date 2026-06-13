import express from 'express';
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getDashboardStats,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/stats').get(protect, admin, getDashboardStats);

router.route('/users')
  .get(protect, admin, getAllUsers);

router.route('/users/:id')
  .delete(protect, admin, deleteUser);

router.route('/users/:id/role')
  .put(protect, admin, updateUserRole);

export default router;
