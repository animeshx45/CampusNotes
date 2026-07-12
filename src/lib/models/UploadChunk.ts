import mongoose, { Schema } from 'mongoose';

const UploadChunkSchema = new Schema({
  sessionId: { type: String, required: true },
  chunkIndex: { type: Number, required: true },
  data: { type: Buffer, required: true },
}, {
  timestamps: true
});

// Compound index for fast chunk lookup
UploadChunkSchema.index({ sessionId: 1, chunkIndex: 1 }, { unique: true });

// Auto-delete abandoned chunks after 2 hours
UploadChunkSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7200 });

export default mongoose.models.UploadChunk || mongoose.model('UploadChunk', UploadChunkSchema);
