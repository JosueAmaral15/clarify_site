import { Router, Request, Response } from 'express';
import Newsletter from '../models/Newsletter';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { EmailService } from '../services/email.service';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// Rate limiting: 3 subscriptions per hour per IP
const subscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: 'Too many subscription requests. Please try again later.',
  },
});

/**
 * @route   POST /api/newsletter/subscribe
 * @desc    Subscribe to newsletter
 * @access  Public
 */
router.post(
  '/subscribe',
  subscribeLimiter,
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Invalid email address',
          errors: errors.array(),
        });
        return;
      }

      const { email } = req.body;

      // Check if already subscribed
      const existing = await Newsletter.findOne({ email });
      if (existing) {
        if (existing.isActive) {
          res.status(200).json({
            success: true,
            message: 'You are already subscribed to our newsletter!',
          });
          return;
        } else {
          // Re-subscribe
          existing.isActive = true;
          existing.subscribedAt = new Date();
          existing.unsubscribedAt = undefined;
          await existing.save();

          res.status(200).json({
            success: true,
            message: 'Welcome back! You have been re-subscribed.',
          });
          return;
        }
      }

      // Create new subscription
      await Newsletter.create({ email });

      res.status(201).json({
        success: true,
        message: 'Thank you for subscribing! You will receive updates about Clarify releases.',
      });
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to subscribe. Please try again later.',
      });
    }
  }
);

/**
 * @route   POST /api/newsletter/unsubscribe
 * @desc    Unsubscribe from newsletter
 * @access  Public
 */
router.post(
  '/unsubscribe',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Invalid email address',
          errors: errors.array(),
        });
        return;
      }

      const { email } = req.body;

      const subscription = await Newsletter.findOne({ email });
      if (!subscription || !subscription.isActive) {
        res.status(404).json({
          success: false,
          message: 'Subscription not found',
        });
        return;
      }

      subscription.isActive = false;
      subscription.unsubscribedAt = new Date();
      await subscription.save();

      res.status(200).json({
        success: true,
        message: 'You have been unsubscribed successfully. Sorry to see you go!',
      });
    } catch (error: any) {
      console.error('Newsletter unsubscribe error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unsubscribe. Please try again later.',
      });
    }
  }
);

/**
 * @route   POST /api/newsletter/send-release
 * @desc    Send release notification to all active subscribers (Admin only)
 * @access  Private/Admin
 */
router.post(
  '/send-release',
  requireAdmin,
  [
    body('version').trim().notEmpty().withMessage('Version is required'),
    body('releaseNotes').trim().notEmpty().withMessage('Release notes are required'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { version, releaseNotes } = req.body;

      // Get all active subscribers
      const subscribers = await Newsletter.find({ isActive: true }).select('email');

      if (subscribers.length === 0) {
        res.status(200).json({
          success: true,
          message: 'No active subscribers found',
          data: { sent: 0 },
        });
        return;
      }

      // Send emails in batches (to avoid rate limits)
      const batchSize = 50;
      let sent = 0;
      let failed = 0;

      for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize);
        const promises = batch.map(sub =>
          EmailService.sendReleaseNotification(sub.email, version, releaseNotes)
            .then(success => {
              if (success) sent++;
              else failed++;
            })
            .catch(() => failed++)
        );

        await Promise.all(promises);

        // Wait 1 second between batches
        if (i + batchSize < subscribers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      res.status(200).json({
        success: true,
        message: `Release notification sent to ${sent} subscribers`,
        data: {
          total: subscribers.length,
          sent,
          failed,
        },
      });
    } catch (error: any) {
      console.error('Send release notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send notifications',
      });
    }
  }
);

/**
 * @route   GET /api/newsletter/subscribers
 * @desc    Get all subscribers (Admin only)
 * @access  Private/Admin
 */
router.get('/subscribers', requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status = 'active', page = 1, limit = 50 } = req.query;

    const query: any = {};
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const subscribers = await Newsletter.find(query)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Newsletter.countDocuments(query);
    const activeCount = await Newsletter.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: subscribers,
      stats: {
        total,
        active: activeCount,
        inactive: total - activeCount,
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Fetch subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers',
    });
  }
});

export default router;
