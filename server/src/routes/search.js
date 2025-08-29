import express from 'express';
import { auth } from '../middleware/Auth.js';
import { textSearch, semanticSearch } from '../controllers/searchController.js';

const searchRoutes = express.Router();

searchRoutes.get('/text', auth, textSearch);
searchRoutes.get('/semantic', auth, semanticSearch);

export default searchRoutes;
