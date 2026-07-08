import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  branch: { type: String, default: null },
  semester: { type: Number, default: null },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      const anyRet = ret as any;
      anyRet.id = anyRet._id.toString();
      delete anyRet._id;
      delete anyRet.password;
      delete anyRet.__v;
    }
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
