import Doc from '../models/Doc.js';
import { embedText } from '../services/gemini.js';

// Cosine similarity function
function cosine(a, b) {
  const len = Math.min(a.length, b.length);
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1;
  return dot / denom;
}

// Text search controller
export const textSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim() === '') {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    const docs = await Doc.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .lean();

    res.json({ success: true, data: docs });
  } catch (err) {
    console.error('Error in textSearch:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Semantic search controller
export const semanticSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim() === '') {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    const qEmb = await embedText(q);
    const docs = await Doc.find(
      {},
      'title content tags summary embedding createdBy updatedAt'
    )
      .populate('createdBy', 'name')
      .lean();

    const scored = docs
      .map(doc => ({
        ...doc,
        semanticScore: parseFloat(cosine(qEmb, doc.embedding || []).toFixed(4)),
      }))
      .sort((a, b) => b.semanticScore - a.semanticScore)
      .slice(0, 20);

    res.json({ success: true, data: scored });
  } catch (err) {
    console.error('Error in semanticSearch:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};