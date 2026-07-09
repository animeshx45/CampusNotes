import mongoose, { Schema } from 'mongoose';

const ForumReplySchema = new Schema({
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  likes: { type: [String], default: [] },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      const anyRet = ret as any;
      anyRet.id = anyRet._id?.toString();
      delete anyRet._id;
      delete anyRet.__v;
    }
  }
});

const ForumPostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  branch: { type: String, required: true },
  likes: { type: [String], default: [] },
  replies: [ForumReplySchema],
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      const anyRet = ret as any;
      anyRet.id = anyRet._id?.toString();
      delete anyRet._id;
      delete anyRet.__v;
    }
  }
});

export default mongoose.models.ForumPost || mongoose.model('ForumPost', ForumPostSchema);
