import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  action: { type: String, enum: ['create', 'update', 'delete'], required: true },
  docId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doc' },
  docTitle: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Activity', activitySchema);
