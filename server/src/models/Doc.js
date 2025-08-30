import mongoose from 'mongoose';

const docSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  summary: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  embedding: { type: [Number], default: [] }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

docSchema.index({ title: 'text', content: 'text' });





export default mongoose.model('Doc', docSchema);
