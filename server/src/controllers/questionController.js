import Doc from '../models/Doc.js';
import { embedText, answerQuestion } from '../services/gemini.js';

// Cosine similarity helper remains unchanged
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

export const handleQuestion = async (req, res) => {
  try {
    const { question, docId } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Valid question is required',
      });
    }

    if (!docId) {
      return res.status(400).json({
        success: false,
        message: 'Document ID is required',
      });
    }

    // Fetch the specific document by ID with necessary fields
    const doc = await Doc.findById(docId, 'title content embedding').lean();
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Embed the question text
    const qEmb = await embedText(question);

    // Calculate cosine similarity score between question embedding and doc embedding (optional here, but keeping workflow)
    const score = cosine(qEmb, doc.embedding || []);

    // Compose context from this single chosen doc
    const context = `# ${doc.title}\n${doc.content}`;

    console.log({ question, context, score });

    // Get answer from AI service
    const answer = await answerQuestion(question, context);

    // Return response tailored for frontend
    res.json({
      success: true,
      answer,
      sources: [
        {
          id: doc._id,
          title: doc.title,
          score: parseFloat(score.toFixed(4)),
        },
      ],
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
