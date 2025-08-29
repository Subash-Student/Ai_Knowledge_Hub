import Doc from '../models/Doc.js';
import { embedText, answerQuestion } from '../services/gemini.js';

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

// Controller for answering questions
export const handleQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required' });

    const qEmb = await embedText(question);
    const docs = await Doc.find({}, 'title content embedding');
    const ranked = docs
      .map(d => ({ d, s: cosine(qEmb, d.embedding || []) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 5);

    const context = ranked.map(r => `# ${r.d.title}\n${r.d.content}`).join('\n\n');
    const answer = await answerQuestion(question, context);

    res.json({
      answer,
      sources: ranked.map(r => ({ id: r.d._id, title: r.d.title, score: r.s }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
