import express from 'express';
import { getUserProfile, updateUserProfile, getAddresses, addAddress, editAddress, deleteAddress } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('image'), updateUserProfile);

router.route('/addresses')
  .get(protect, getAddresses)
  .post(protect, addAddress);

router.route('/addresses/:id')
  .put(protect, editAddress)
  .delete(protect, deleteAddress);

export default router;
