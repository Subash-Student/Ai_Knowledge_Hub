import Doc from '../models/Doc.js';
import Version from '../models/Version.js';
import Activity from '../models/Activity.js';
import { summarizeText, generateTags, embedText } from '../services/gemini.js';

// Create document
export const createDoc = async (req, res) => {
  try {
    const { title, content } = req.body;
    const summary = await summarizeText(content);
    const tags = await generateTags(content);
    const embedding = await embedText(`${title}\n${content}`);
    const doc = await Doc.create({ title, content, summary, tags, embedding, createdBy: req.user._id });

    await Activity.create({ action: 'create', docId: doc._id, docTitle: doc.title, userId: req.user._id, userName: req.user.name });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read all documents (optionally filter by tag)
export const getDocs = async (req, res) => {
  try {
    const { tag } = req.query;
    const filter = tag ? { tags: tag } : {};
    const docs = await Doc.find(filter).populate('createdBy', 'name role').sort({ updatedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read one document
export const getDoc = async (req, res) => {
  try {
    const doc = await Doc.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update document (with versioning)
export const updateDoc = async (req, res) => {
  try {
    const doc = await Doc.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    const isOwner = doc.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });

    await Version.create({
      docId: doc._id,
      title: doc.title,
      content: doc.content,
      tags: doc.tags,
      summary: doc.summary,
      editedBy: req.user._id
    });

    const { title, content, tags } = req.body;
    if (title !== undefined) doc.title = title;
    if (content !== undefined) doc.content = content;
    if (tags !== undefined) doc.tags = tags;
    doc.embedding = await embedText(`${doc.title}\n${doc.content}`);
    await doc.save();

    await Activity.create({ action: 'update', docId: doc._id, docTitle: doc.title, userId: req.user._id, userName: req.user.name });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete document
export const deleteDoc = async (req, res) => {
  try {
    const doc = await Doc.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    const isOwner = doc.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });
    await doc.deleteOne();
    await Activity.create({ action: 'delete', docId: doc._id, docTitle: doc.title, userId: req.user._id, userName: req.user.name });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Regenerate summary
export const regenerateSummary = async (req, res) => {
  try {
    const doc = await Doc.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    const isOwner = doc.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });
    doc.summary = await summarizeText(doc.content);
    await doc.save();
    res.json({ summary: doc.summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Regenerate tags
export const regenerateTags = async (req, res) => {
  try {
    const doc = await Doc.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    const isOwner = doc.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });
    doc.tags = await generateTags(doc.content);
    await doc.save();
    res.json({ tags: doc.tags });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get document versions
export const getDocVersions = async (req, res) => {
  try {
    const versions = await Version.find({ docId: req.params.id }).populate('editedBy', 'name').sort({ editedAt: -1 });
    res.json(versions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Activity feed (last 5)
export const getLatestActivities = async (req, res) => {
  try {
    const items = await Activity.find().sort({ createdAt: -1 }).limit(5);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
