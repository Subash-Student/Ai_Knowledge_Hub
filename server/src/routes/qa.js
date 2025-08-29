import express from 'express';
import { auth } from '../middleware/Auth.js';
import { handleQuestion } from '../controllers/questionController.js';

const qaRoutes = express.Router();

qaRoutes.post('/', auth, handleQuestion);

export default qaRoutes;
