import mongoose, { Document, Schema } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  unsubscribedAt?: Date;
}

const NewsletterSchema = new Schema<INewsletter>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  unsubscribedAt: {
    type: Date,
  },
});

// Index for faster queries
NewsletterSchema.index({ email: 1, isActive: 1 });

const Newsletter = mongoose.model<INewsletter>('Newsletter', NewsletterSchema);

export default Newsletter;
