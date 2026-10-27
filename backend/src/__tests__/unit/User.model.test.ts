import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../../models/User';

// Mock bcrypt
jest.mock('bcryptjs');

describe('User Model Unit Tests', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/clarify_test');
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    jest.clearAllMocks();
  });

  describe('Password Hashing', () => {
    it('should hash password on save', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');

      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'plainPassword',
        role: 'user',
      });

      await user.save();

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 'salt');
      expect(user.password).toBe('hashedPassword123');
    });

    it('should handle bcrypt genSalt error in pre-save hook', async () => {
      (bcrypt.genSalt as jest.Mock).mockRejectedValue(new Error('GenSalt failed'));

      const user = new User({
        name: 'Test User',
        email: 'error@example.com',
        password: 'plainPassword',
        role: 'user',
      });

      await expect(user.save()).rejects.toThrow('GenSalt failed');
    });

    it('should handle bcrypt hash error in pre-save hook', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hash failed'));

      const user = new User({
        name: 'Test User',
        email: 'error2@example.com',
        password: 'plainPassword',
        role: 'user',
      });

      await expect(user.save()).rejects.toThrow('Hash failed');
    });

    it('should not hash password if not modified', async () => {
      // First create a user with real hashing
      jest.unmock('bcryptjs');
      const bcryptReal = jest.requireActual('bcryptjs');
      (bcrypt.genSalt as jest.Mock).mockImplementation(bcryptReal.genSalt);
      (bcrypt.hash as jest.Mock).mockImplementation(bcryptReal.hash);

      const user = new User({
        name: 'Test User',
        email: 'test3@example.com',
        password: 'plainPassword',
        role: 'user',
      });

      await user.save();
      const hashedPassword = user.password;

      // Mock again for second save
      jest.clearAllMocks();
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHash');

      // Update non-password field
      user.name = 'Updated Name';
      await user.save();

      // Password should not be re-hashed
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(user.password).toBe(hashedPassword);
    });
  });

  describe('comparePassword Method', () => {
    it('should correctly compare matching passwords', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const user = new User({
        name: 'Test User',
        email: 'compare@example.com',
        password: 'hashedPassword',
        role: 'user',
      });

      const result = await user.comparePassword('plainPassword');

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('plainPassword', 'hashedPassword');
    });

    it('should correctly compare non-matching passwords', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const user = new User({
        name: 'Test User',
        email: 'compare2@example.com',
        password: 'hashedPassword',
        role: 'user',
      });

      const result = await user.comparePassword('wrongPassword');

      expect(result).toBe(false);
    });

    it('should handle bcrypt compare error', async () => {
      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error('Compare failed'));

      const user = new User({
        name: 'Test User',
        email: 'compare3@example.com',
        password: 'hashedPassword',
        role: 'user',
      });

      await expect(user.comparePassword('plainPassword')).rejects.toThrow('Password comparison failed');
    });
  });

  describe('User Schema Validation', () => {
    it('should require email', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      const user = new User({
        name: 'Test User',
        password: 'password123',
        role: 'user',
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should require unique email', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      const user1 = new User({
        name: 'User 1',
        email: 'duplicate@example.com',
        password: 'password123',
        role: 'user',
      });
      await user1.save();

      const user2 = new User({
        name: 'User 2',
        email: 'duplicate@example.com',
        password: 'password456',
        role: 'user',
      });

      await expect(user2.save()).rejects.toThrow();
    });

    it('should default isActive to true', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      const user = new User({
        name: 'Test User',
        email: 'default@example.com',
        password: 'password123',
        role: 'user',
      });
      await user.save();

      expect(user.isActive).toBe(true);
    });

    it('should default isDeleted to false', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      const user = new User({
        name: 'Test User',
        email: 'default2@example.com',
        password: 'password123',
        role: 'user',
      });
      await user.save();

      expect(user.isDeleted).toBe(false);
    });
  });
});
