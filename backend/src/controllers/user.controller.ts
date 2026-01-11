import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// GET /api/users/me - Get current user
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const user = await User.findById(authReq.user.userId).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/users/me - Update profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { name, avatar } = req.body;

    // Validation
    if (name && (name.length < 2 || name.length > 100)) {
      res.status(400).json({ message: 'Name must be between 2 and 100 characters' });
      return;
    }

    if (avatar && !avatar.startsWith('http')) {
      res.status(400).json({ message: 'Avatar must be a valid URL' });
      return;
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      authReq.user.userId,
      { 
        ...(name && { name }),
        ...(avatar && { avatar })
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/users/me/password - Change password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Current password and new password are required' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ message: 'New password must be at least 8 characters' });
      return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      res.status(400).json({ 
        message: 'Password must contain uppercase, lowercase, number, and special character' 
      });
      return;
    }

    // Get user with password
    const user = await User.findById(authReq.user.userId).select('+password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }

    // Hash new password
    const saltRounds = process.env.NODE_ENV === 'test' ? 4 : 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/users/me - Delete account (soft delete)
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ message: 'Password is required to delete account' });
      return;
    }

    // Get user with password
    const user = await User.findById(authReq.user.userId).select('+password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }

    // Soft delete: Mark as deleted instead of removing
    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
