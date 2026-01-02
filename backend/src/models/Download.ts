import mongoose, { Schema, Document } from 'mongoose';

export interface IDownload extends Document {
  email: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  platform?: string;
}

const DownloadSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Email inválido'
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  platform: {
    type: String,
    enum: ['windows', 'macos', 'linux', 'other'],
    default: 'other'
  }
}, {
  timestamps: true
});

// Índices para otimização de queries
DownloadSchema.index({ email: 1 });
DownloadSchema.index({ timestamp: -1 });

export default mongoose.model<IDownload>('Download', DownloadSchema);
