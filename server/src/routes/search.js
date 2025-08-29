import express from 'express';
import { auth } from '../middleware/Auth.js';
import { textSearch, semanticSearch } from '../controllers/searchController.js';
import { apiLimiter } from '../middleware/apiLimiter.js';

const searchRoutes = express.Router();

searchRoutes.get('/text',apiLimiter, auth, textSearch);
searchRoutes.get('/semantic',apiLimiter, auth, semanticSearch);

export default searchRoutes;
