import { Request, Response, NextFunction } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

/**
 * MongoDB Query Sanitization
 * Prevents NoSQL injection attacks by removing $ and . from user input
 * 
 * Example attack prevented:
 * { "email": { "$gt": "" } } -> tries to match all emails
 * After sanitization: { "email": "" }
 */
export const sanitizeMongoQueries = mongoSanitize({
  replaceWith: '_', // Replace $ and . with _
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️  Sanitized key: ${key} in request from ${req.ip}`);
  },
});

/**
 * HTTP Parameter Pollution (HPP) Protection
 * Prevents attacks using duplicate parameters
 * 
 * Example attack prevented:
 * ?sort=price&sort=-price -> causes error
 * After protection: ?sort=-price (uses last value)
 */
export const preventParameterPollution = hpp({
  whitelist: [
    // Allow arrays for these parameters
    'sort',
    'fields',
    'page',
    'limit',
  ],
});

/**
 * XSS Protection Middleware
 * Sanitizes user input to prevent cross-site scripting
 */
export const sanitizeInput = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // Sanitize body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

/**
 * Recursively sanitize an object
 * Removes potentially dangerous HTML/JavaScript
 */
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Sanitize a string by escaping HTML special characters
 */
function sanitizeString(str: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Security Headers Middleware
 * Additional security headers beyond Helmet
 */
export const securityHeaders = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Enable XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Feature policy (restrict browser features)
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );

  next();
};
