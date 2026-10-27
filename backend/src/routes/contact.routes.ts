import { Router, Request, Response } from 'express';
import Contact from '../models/Contact';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { EmailService } from '../services/email.service';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Rate limiting: 5 messages per hour per IP (disabled in test environment)
const contactLimiter = process.env.NODE_ENV === 'test'
  ? (_req: Request, _res: Response, next: any) => next() // No rate limit in tests
  : rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5,
      message: {
        success: false,
        message: 'Too many contact requests. Please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

// Validation rules
const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Subject must be between 3 and 200 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters'),
];

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 */
router.post(
  '/',
  contactLimiter,
  contactValidation,
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { name, email, subject, message } = req.body;

      // Get IP and User-Agent
      const ipAddress =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
        req.socket.remoteAddress ||
        'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      // Create contact entry
      const contact = await Contact.create({
        name,
        email,
        subject,
        message,
        ipAddress,
        userAgent,
        status: 'new',
      });

      // Send emails (async, don't block response)
      Promise.all([
        EmailService.sendContactAutoReply(email, name),
        EmailService.notifyAdminNewContact({ name, email, subject, message }),
      ]).catch(err => console.error('Failed to send contact emails:', err));

      res.status(201).json({
        success: true,
        message: 'Thank you for contacting us! We will respond within 24-48 hours.',
        data: {
          id: contact._id,
          createdAt: contact.createdAt,
        },
      });
    } catch (error: any) {
      console.error('Contact submission error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit contact form. Please try again later.',
      });
    }
  }
);

/**
 * @route   GET /api/contact
 * @desc    Get all contact messages (admin only)
 * @access  Private/Admin
 */
router.get('/', requireAuth, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-ipAddress -userAgent');

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Fetch contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
    });
  }
});

export default router;
