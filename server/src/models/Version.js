import mongoose from 'mongoose';

const versionSchema = new mongoose.Schema({
  docId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doc', required: true },
  title: String,
  content: String,
  tags: [String],
  summary: String,
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  editedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Version', versionSchema);
