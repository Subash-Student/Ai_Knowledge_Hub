import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import docRoutes from './routes/doc.js';
import searchRoutes from './routes/search.js';
import qaRoutes from './routes/qa.js';

const app = express();

// ✅ Updated CORS configuration
const allowedOrigins = ['http://localhost:5173', 'https://ai-knowledge-hub-pied.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

// ✅ Routes
app.get('/', (_req, res) => res.send('AI Knowledge Hub API'));
app.use('/api/auth', authRoutes);
app.use('/api/docs', docRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/qa', qaRoutes);

// ✅ Server initialization
const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});