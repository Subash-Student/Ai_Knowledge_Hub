import express from 'express';
import { auth } from '../middleware/Auth.js';
import { handleQuestion } from '../controllers/questionController.js';
import { apiLimiter } from '../middleware/apiLimiter.js';

const qaRoutes = express.Router();

qaRoutes.post('/', auth,apiLimiter, handleQuestion);

export default qaRoutes;
