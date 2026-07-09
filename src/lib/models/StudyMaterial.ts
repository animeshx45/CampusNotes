import mongoose, { Schema } from 'mongoose';

const StudyMaterialSchema = new Schema({
  title: { type: String, required: true },
  subject: { type: String, default: 'General' },
  description: { type: String, required: true },
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  type: { type: String, required: true },
  fileUrl: { type: String, required: true },
  author: { type: String, required: true },
  uploaderId: { type: String, required: true },
  downloadCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  folderFiles: {
    type: [{
      name: { type: String, required: true },
      fileUrl: { type: String, required: true },
      type: { type: String, required: true }
    }],
    default: undefined
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      const anyRet = ret as any;
      anyRet.id = anyRet._id.toString();
      delete anyRet._id;
      delete anyRet.__v;
    }
  }
});

export default mongoose.models.StudyMaterial || mongoose.model('StudyMaterial', StudyMaterialSchema);
