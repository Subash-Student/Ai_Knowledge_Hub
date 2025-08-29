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
    if (!q) return res.json([]);
    const docs = await Doc.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Semantic search controller
export const semanticSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const qEmb = await embedText(q);
    const docs = await Doc.find(
      {},
      'title content tags summary embedding createdBy updatedAt'
    ).populate('createdBy', 'name');
    const scored = docs
      .map(d => ({
        doc: d,
        score: cosine(qEmb, d.embedding || [])
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
    res.json(scored.map(s => ({ ...s.doc.toObject(), semanticScore: s.score })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
