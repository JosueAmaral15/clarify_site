import mongoose from 'mongoose';
import connectDB from '../../config/database';

describe('Database configuration', () => {
  const originalMongoURI = process.env.MONGODB_URI;
  const originalVercel = process.env.VERCEL;

  afterEach(() => {
    if (originalMongoURI === undefined) {
      delete process.env.MONGODB_URI;
    } else {
      process.env.MONGODB_URI = originalMongoURI;
    }

    if (originalVercel === undefined) {
      delete process.env.VERCEL;
    } else {
      process.env.VERCEL = originalVercel;
    }

    jest.restoreAllMocks();
  });

  it('keeps a Vercel function alive when MongoDB is not configured', async () => {
    delete process.env.MONGODB_URI;
    process.env.VERCEL = '1';

    const connectSpy = jest.spyOn(mongoose, 'connect');
    const exitSpy = jest.spyOn(process, 'exit');
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    await connectDB();

    expect(connectSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();
  });
});
