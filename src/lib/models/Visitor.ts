import mongoose, { Schema } from 'mongoose';

const VisitorSchema = new Schema({
  counterId: { type: String, required: true, unique: true, default: 'global' },
  count: { type: Number, required: true, default: 0 }
}, {
  timestamps: true
});

export default mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
