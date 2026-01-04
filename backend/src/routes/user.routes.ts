import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteAccount
} from '../controllers/user.controller';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// GET /api/users/me - Get current user profile
router.get('/me', getCurrentUser);

// PUT /api/users/me - Update profile (name, avatar)
router.put('/me', updateProfile);

// PUT /api/users/me/password - Change password
router.put('/me/password', changePassword);

// DELETE /api/users/me - Delete account (soft delete)
router.delete('/me', deleteAccount);

export default router;
