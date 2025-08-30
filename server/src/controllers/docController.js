import Doc from '../models/Doc.js';
import Version from '../models/Version.js';
import Activity from '../models/Activity.js';
import { summarizeText, generateTags, embedText } from '../services/gemini.js';


// Helper: Check if user can edit/delete
const canEditOrDelete = (user, doc) => {
  return doc.createdBy.toString() === user._id.toString() || user.role === 'admin';
};

// Helper: Log activity
const logActivity = async ({ action, doc, user }) => {
  await Activity.create({
    action,
    docId: doc._id,
    docTitle: doc.title,
    userId: user._id,
    userName: user.name,
  });
};

// Create document
export const createDoc = async (req, res) => {
  try {
    const { title, content } = req.body;
    const summary = await summarizeText(content);
    const tags = await generateTags(content);
    const embedding = await embedText(`${title}\n${content}`);

    const doc = await Doc.create({
      title,
      content,
      summary,
      tags,
      embedding,
      createdBy: req.user._id,
    });

    await logActivity({ action: 'create', doc, user: req.user });
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error('Error in createDoc:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Read all documents (with optional tag filter + pagination)
export const getDocs = async (req, res) => {
  try {
    const { tag, page = 1, limit = 10 } = req.query;
    const filter = tag ? { tags: tag } : {};
    const skip = (page - 1) * limit;

    const docs = await Doc.find(filter)
      .lean()
      .populate('createdBy', 'name role')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ success: true, data: docs });
  } catch (err) {
    console.error('Error in getDocs:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Read one document
export const getDoc = async (req, res) => {
  try {
    const doc = await Doc.findById(req.params.id)
      .populate('createdBy', 'name role');  // <-- populate creator's name and role

    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, data: doc });
  } catch (err) {
    console.error('Error in getDoc:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// Update document
export const updateDoc = async (req, res) => {
  try {
    const doc = await Doc.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    if (!canEditOrDelete(req.user, doc)) return res.status(403).json({ success: false, message: 'Only Admin or Author Can Edit' });

    const { title, content, tags } = req.body;
    const hasChanges = title || content || tags;

    if (hasChanges) {
      await Version.create({
        docId: doc._id,
        title: doc.title,
        content: doc.content,
        tags: doc.tags,
        summary: doc.summary,
        editedBy: req.user._id,
      });
    }

    if (title !== undefined) doc.title = title;
    if (content !== undefined) doc.content = content;
    if (tags !== undefined) doc.tags = tags;

    doc.embedding = await embedText(`${doc.title}\n${doc.content}`);
    await doc.save();

    await logActivity({ action: 'update', doc, user: req.user });
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error('Error in updateDoc:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete document
export const deleteDoc = async (req, res) => {
  try {
    const doc = await Doc.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    if (!canEditOrDelete(req.user, doc)) return res.status(403).json({ success: false, message: 'Only Admin or Author Can Delete' });

    await doc.deleteOne();
    await logActivity({ action: 'delete', doc, user: req.user });
    res.json({ success: true });
  } catch (err) {
    console.error('Error in deleteDoc:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Regenerate summary
export const regenerateSummary = async (req, res) => {
  try {
    const doc = await Doc.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    if (!canEditOrDelete(req.user, doc)) return res.status(403).json({ success: false, message: 'Only Admin or Author Can Edit' });

    doc.summary = await summarizeText(doc.content);
    await doc.save();
    res.json({ success: true, summary: doc.summary });
  } catch (err) {
    console.error('Error in regenerateSummary:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Regenerate tags
export const regenerateTags = async (req, res) => {
  try {
    const doc = await Doc.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    if (!canEditOrDelete(req.user, doc)) return res.status(403).json({ success: false, message: 'Only Admin or Author Can Edit' });

    doc.tags = await generateTags(doc.content);
    await doc.save();
    res.json({ success: true, tags: doc.tags });
  } catch (err) {
    console.error('Error in regenerateTags:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get document versions
export const getDocVersions = async (req, res) => {
  try {
    const versions = await Version.find({ docId: req.params.id })
      .populate('editedBy', 'name')
      .sort({ editedAt: -1 });

    res.json({ success: true, data: versions });
  } catch (err) {
    console.error('Error in getDocVersions:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Activity feed
export const getLatestActivities = async (req, res) => {
  try {
    const items = await Activity.find().sort({ createdAt: -1 }).limit(5);
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('Error in getLatestActivities:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


(async () => {
  try {
    await Doc.init(); // This creates indexes defined in schema if absent
    console.log("Text index on Doc collection ensured");
  } catch (err) {
    console.error("Failed to create text indexes on Doc:", err);
  }
})();