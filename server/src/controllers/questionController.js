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
    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Valid question is required',
      });
    }

    const qEmb = await embedText(question);
    const docs = await Doc.find({}, 'title content embedding').lean();

    if (!docs.length) {
      return res.status(404).json({
        success: false,
        message: 'No documents available for context',
      });
    }

    const ranked = docs
      .map(doc => ({
        doc,
        score: cosine(qEmb, doc.embedding || []),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const context = ranked
      .map(r => `# ${r.doc.title}\n${r.doc.content}`)
      .join('\n\n');

    const answer = await answerQuestion(question, context);

    res.json({
      success: true,
      answer,
      sources: ranked.map(r => ({
        id: r.doc._id,
        title: r.doc.title,
        score: parseFloat(r.score.toFixed(4)),
      })),
    });
  } catch (err) {
    console.error('Error in handleQuestion:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};