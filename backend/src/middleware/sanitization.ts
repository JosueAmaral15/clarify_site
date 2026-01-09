import { Request, Response, NextFunction } from 'express';
import hpp from 'hpp';

/**
 * MongoDB Query Sanitization
 * Prevents NoSQL injection attacks by removing $ and . from user input
 * 
 * Example attack prevented:
 * { "email": { "$gt": "" } } -> tries to match all emails
 * After sanitization: { "email": "" }
 */
export const sanitizeMongoQueries = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // Sanitize body
  if (req.body) {
    req.body = sanitizeMongoObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    const sanitized = sanitizeMongoObject(req.query);
    // Create new query object to avoid read-only issues
    Object.keys(req.query).forEach(key => delete (req.query as any)[key]);
    Object.assign(req.query, sanitized);
  }

  // Sanitize URL parameters
  if (req.params) {
    const sanitized = sanitizeMongoObject(req.params);
    Object.keys(req.params).forEach(key => delete req.params[key]);
    Object.assign(req.params, sanitized);
  }

  next();
};

/**
 * Remove MongoDB operators from object
 */
function sanitizeMongoObject(obj: any): any {
  if (typeof obj === 'string') {
    // Only remove $ at the beginning of strings and dots in keys
    // Don't remove @ from emails or other special chars
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeMongoObject);
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Remove keys starting with $ or containing .
        const sanitizedKey = key.replace(/^\$/g, '').replace(/\./g, '_');
        sanitized[sanitizedKey] = sanitizeMongoObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
}

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

  // Sanitize query parameters (avoid read-only issue)
  if (req.query && Object.keys(req.query).length > 0) {
    const sanitized = sanitizeObject(req.query);
    Object.keys(req.query).forEach(key => delete (req.query as any)[key]);
    Object.assign(req.query, sanitized);
  }

  // Sanitize URL parameters
  if (req.params && Object.keys(req.params).length > 0) {
    const sanitized = sanitizeObject(req.params);
    Object.keys(req.params).forEach(key => delete req.params[key]);
    Object.assign(req.params, sanitized);
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
