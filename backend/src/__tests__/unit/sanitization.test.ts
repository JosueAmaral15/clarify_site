import { Request, Response, NextFunction } from 'express';
import { sanitizeInput, sanitizeObject, sanitizeMongoObject } from '../../middleware/sanitization';

describe('Sanitization Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      body: {},
      query: {},
      params: {},
    };
    mockRes = {};
    mockNext = jest.fn();
  });

  describe('sanitizeObject', () => {
    it('should escape HTML tags from string values', () => {
      const input = {
        name: '<script>alert("xss")</script>John',
        bio: '<img src=x onerror=alert(1)>Developer',
      };

      const result = sanitizeObject(input);

      expect(result.name).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;John');
      expect(result.bio).toBe('&lt;img src=x onerror=alert(1)&gt;Developer');
    });

    it('should preserve safe content', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
      };

      const result = sanitizeObject(input);

      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.age).toBe(25);
    });

    it('should handle nested objects', () => {
      const input = {
        user: {
          name: '<b>John</b>',
          profile: {
            bio: '<script>xss</script>Clean bio',
          },
        },
      };

      const result = sanitizeObject(input);

      expect(result.user.name).toBe('&lt;b&gt;John&lt;&#x2F;b&gt;');
      expect(result.user.profile.bio).toBe('&lt;script&gt;xss&lt;&#x2F;script&gt;Clean bio');
    });

    it('should handle arrays', () => {
      const input = {
        tags: ['<script>xss</script>tag1', 'tag2', '<b>tag3</b>'],
      };

      const result = sanitizeObject(input);

      expect(result.tags[0]).toBe('&lt;script&gt;xss&lt;&#x2F;script&gt;tag1');
      expect(result.tags[1]).toBe('tag2');
      expect(result.tags[2]).toBe('&lt;b&gt;tag3&lt;&#x2F;b&gt;');
    });

    it('should escape special characters but preserve @ and dots', () => {
      const input = {
        email: 'user+test@example.com',
        domain: 'sub.example.com',
        html: '<tag>content</tag>',
      };

      const result = sanitizeObject(input);

      expect(result.email).toBe('user+test@example.com');
      expect(result.domain).toBe('sub.example.com');
      expect(result.html).toBe('&lt;tag&gt;content&lt;&#x2F;tag&gt;');
    });

    it('should handle null and undefined values', () => {
      const input = {
        name: 'John',
        middle: null,
        suffix: undefined,
      };

      const result = sanitizeObject(input);

      expect(result.name).toBe('John');
      expect(result.middle).toBeNull();
      expect(result.suffix).toBeUndefined();
    });

    it('should handle empty strings', () => {
      const input = {
        name: '',
        bio: '   ',
      };

      const result = sanitizeObject(input);

      expect(result.name).toBe('');
      expect(result.bio).toBe('   ');
    });

    it('should handle complex XSS attempts by escaping', () => {
      const input = {
        malicious1: '<img src=x onerror="alert(1)">',
        malicious2: '<svg onload=alert(1)>',
        malicious3: 'javascript:alert(1)',
        malicious4: '<iframe src="javascript:alert(1)">',
      };

      const result = sanitizeObject(input);

      // Should escape all malicious HTML/JavaScript
      expect(result.malicious1).toContain('&lt;img');
      expect(result.malicious2).toContain('&lt;svg');
      expect(result.malicious3).toBe('javascript:alert(1)'); // No HTML chars to escape
      expect(result.malicious4).toContain('&lt;iframe');
    });
  });

  describe('sanitizeMongoObject', () => {
    it('should remove $ from beginning of object keys', () => {
      const input = {
        $where: 'malicious code',
        name: 'John',
      };

      const result = sanitizeMongoObject(input);

      expect(result.where).toBe('malicious code');
      expect(result.$where).toBeUndefined();
      expect(result.name).toBe('John');
    });

    it('should replace dots in keys with underscores', () => {
      const input = {
        'user.role': 'admin',
        'account.balance': 1000,
      };

      const result = sanitizeMongoObject(input);

      expect(result['user_role']).toBe('admin');
      expect(result['account_balance']).toBe(1000);
      expect(result['user.role']).toBeUndefined();
    });

    it('should handle nested MongoDB injection attempts', () => {
      const input = {
        user: {
          $gt: '',
          name: 'John',
        },
        query: {
          $where: 'function() { return true; }',
        },
      };

      const result = sanitizeMongoObject(input);

      expect(result.user.gt).toBe('');
      expect(result.user.$gt).toBeUndefined();
      expect(result.query.where).toBeDefined();
      expect(result.query.$where).toBeUndefined();
    });

    it('should handle arrays with MongoDB operators', () => {
      const input = [
        { $set: { role: 'admin' } },
        { name: 'John' },
      ];

      const result = sanitizeMongoObject(input);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0].set).toBeDefined();
      expect(result[0].$set).toBeUndefined();
      expect(result[1].name).toBe('John');
    });

    it('should preserve @ in emails and other safe special chars', () => {
      const input = {
        email: 'user@example.com',
        handle: '@username',
        hashtag: '#trending',
      };

      const result = sanitizeMongoObject(input);

      expect(result.email).toBe('user@example.com');
      expect(result.handle).toBe('@username');
      expect(result.hashtag).toBe('#trending');
    });

    it('should handle primitive values', () => {
      expect(sanitizeMongoObject('string')).toBe('string');
      expect(sanitizeMongoObject(123)).toBe(123);
      expect(sanitizeMongoObject(true)).toBe(true);
      expect(sanitizeMongoObject(null)).toBeNull();
      expect(sanitizeMongoObject(undefined)).toBeUndefined();
    });
  });

  describe('sanitizeInput middleware', () => {
    it('should sanitize request body', () => {
      mockReq.body = {
        name: '<script>alert("xss")</script>John',
        email: 'john@example.com',
      };

      sanitizeInput(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.body.name).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;John');
      expect(mockReq.body.email).toBe('john@example.com');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should sanitize query parameters', () => {
      mockReq.query = {
        search: '<img src=x onerror=alert(1)>test',
        page: '1',
      };

      sanitizeInput(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.query.search).toBe('&lt;img src=x onerror=alert(1)&gt;test');
      expect(mockReq.query.page).toBe('1');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should sanitize URL parameters', () => {
      mockReq.params = {
        id: '<script>xss</script>123',
        slug: 'my<b>post</b>',
      };

      sanitizeInput(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.params.id).toBe('&lt;script&gt;xss&lt;&#x2F;script&gt;123');
      expect(mockReq.params.slug).toBe('my&lt;b&gt;post&lt;&#x2F;b&gt;');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle empty request objects', () => {
      mockReq.body = undefined;
      mockReq.query = {};
      mockReq.params = {};

      sanitizeInput(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle all three inputs simultaneously', () => {
      mockReq.body = { name: '<b>Body</b>' };
      mockReq.query = { search: '<i>Query</i>' };
      mockReq.params = { id: '<u>Param</u>' };

      sanitizeInput(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.body.name).toBe('&lt;b&gt;Body&lt;&#x2F;b&gt;');
      expect(mockReq.query.search).toBe('&lt;i&gt;Query&lt;&#x2F;i&gt;');
      expect(mockReq.params.id).toBe('&lt;u&gt;Param&lt;&#x2F;u&gt;');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should escape HTML in all request inputs', () => {
      mockReq.body = {
        username: '<b>admin</b>',
        bio: '<script>alert(1)</script>Safe text',
      };

      sanitizeInput(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.body.username).toBe('&lt;b&gt;admin&lt;&#x2F;b&gt;');
      expect(mockReq.body.bio).toContain('&lt;script&gt;');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle deeply nested objects', () => {
      mockReq.body = {
        level1: {
          level2: {
            level3: {
              malicious: '<script>xss</script>',
              safe: 'data',
            },
          },
        },
      };

      sanitizeInput(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.body.level1.level2.level3.malicious).toBe('&lt;script&gt;xss&lt;&#x2F;script&gt;');
      expect(mockReq.body.level1.level2.level3.safe).toBe('data');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should always call next() regardless of input', () => {
      sanitizeInput(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
});
