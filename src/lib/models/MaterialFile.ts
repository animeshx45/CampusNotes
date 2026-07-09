import mongoose, { Schema } from 'mongoose';

const MaterialFileSchema = new Schema({
  fileName: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: String, required: true } // Base64 string of the file data
}, {
  timestamps: true
});

export default mongoose.models.MaterialFile || mongoose.model('MaterialFile', MaterialFileSchema);
