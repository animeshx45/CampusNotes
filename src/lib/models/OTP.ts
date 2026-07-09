import mongoose, { Schema } from 'mongoose';

const OTPSchema = new Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true }
}, {
  timestamps: true
});

// Add a TTL index to automatically delete expired documents
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.OTP || mongoose.model('OTP', OTPSchema);
