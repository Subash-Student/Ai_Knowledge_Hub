import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from"dotenv";
dotenv.config()

const getClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY missing');
  }
  // The library usage may vary; adjust to your installed version.
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

export async function embedText(text) {
  const genAI = getClient();
  // Example: model name for embeddings; change if needed.
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text || '');
  return result.embedding.values;
}

export async function summarizeText(text) {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Summarize the document briefly (3-5 sentences).\n\nDOC:\n${text}`;
  const res = await model.generateContent(prompt);
  return res.response.text();
}

export async function generateTags(text) {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Read the document and output 5-10 short, lowercase tags as a comma-separated list (no extra words).\n\nDOC:\n${text}`;
  const res = await model.generateContent(prompt);
  const raw = res.response.text();
  return raw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
}

export async function answerQuestion(question, context) {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const prompt = `You are a helpful assistant answering questions using ONLY the provided context from team documents.
If the answer isn't in the context, say you don't have enough information.
Return concise, factual answers.

QUESTION:
${question}

CONTEXT:
${context}`;
  const res = await model.generateContent(prompt);
  return res.response.text();
}
