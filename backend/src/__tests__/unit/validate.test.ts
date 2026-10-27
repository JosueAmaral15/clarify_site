import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate';

describe('Validate Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('Successful Validation', () => {
    it('should call next() for valid data', async () => {
      const schema = z.object({
        name: z.string(),
        email: z.string().email(),
      });

      mockReq.body = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const middleware = validate(schema);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should handle optional fields correctly', async () => {
      const schema = z.object({
        name: z.string(),
        age: z.number().optional(),
      });

      mockReq.body = {
        name: 'Jane Doe',
      };

      const middleware = validate(schema);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Validation Errors', () => {
    it('should return 400 for invalid data', async () => {
      const schema = z.object({
        email: z.string().email(),
      });

      mockReq.body = {
        email: 'not-an-email',
      };

      const middleware = validate(schema);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Validation failed',
          errors: expect.any(Array),
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return multiple errors for multiple fields', async () => {
      const schema = z.object({
        name: z.string().min(3),
        email: z.string().email(),
        age: z.number().min(18),
      });

      mockReq.body = {
        name: 'AB',
        email: 'invalid',
        age: 15,
      };

      const middleware = validate(schema);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      const jsonCall = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall.errors).toHaveLength(3);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should format error fields correctly', async () => {
      const schema = z.object({
        user: z.object({
          profile: z.object({
            email: z.string().email(),
          }),
        }),
      });

      mockReq.body = {
        user: {
          profile: {
            email: 'invalid',
          },
        },
      };

      const middleware = validate(schema);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      const jsonCall = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall.errors[0].field).toBe('user.profile.email');
    });
  });

  describe('Non-Zod Errors', () => {
    it('should return 500 for unexpected errors', async () => {
      // Create a schema that will throw a non-Zod error
      const schema = {
        parseAsync: jest.fn().mockRejectedValue(new Error('Unexpected error')),
      } as any;

      mockReq.body = { test: 'data' };

      const middleware = validate(schema);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle null error', async () => {
      const schema = {
        parseAsync: jest.fn().mockRejectedValue(null),
      } as any;

      mockReq.body = { test: 'data' };

      const middleware = validate(schema);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
      });
    });

    it('should handle undefined error', async () => {
      const schema = {
        parseAsync: jest.fn().mockRejectedValue(undefined),
      } as any;

      mockReq.body = { test: 'data' };

      const middleware = validate(schema);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty body', async () => {
      const schema = z.object({
        name: z.string(),
      });

      mockReq.body = {};

      const middleware = validate(schema);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle extra fields not in schema', async () => {
      const schema = z.object({
        name: z.string(),
      });

      mockReq.body = {
        name: 'John',
        extra: 'field',
        another: 'value',
      };

      const middleware = validate(schema);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      // Should pass because Zod ignores extra fields by default
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle strict schema that rejects extra fields', async () => {
      const schema = z.object({
        name: z.string(),
      }).strict();

      mockReq.body = {
        name: 'John',
        extra: 'field',
      };

      const middleware = validate(schema);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
