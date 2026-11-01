import { NextFunction, Request, Response } from 'express';

export const requireDatabase = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!process.env.MONGODB_URI) {
    res.status(503).json({
      success: false,
      message: 'Database service is unavailable',
    });
    return;
  }

  next();
};
