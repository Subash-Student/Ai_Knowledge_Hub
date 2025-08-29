import express from 'express';
import { auth } from '../middleware/Auth.js';
import {
  createDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  regenerateSummary,
  regenerateTags,
  getDocVersions,
  getLatestActivities
} from '../controllers/docController.js';

const docRoutes = express.Router();

docRoutes.post('/', auth, createDoc);
docRoutes.get('/', auth, getDocs);
docRoutes.get('/:id', auth, getDoc);
docRoutes.put('/:id', auth, updateDoc);
docRoutes.delete('/:id', auth, deleteDoc);
docRoutes.post('/:id/summarize', auth, regenerateSummary);
docRoutes.post('/:id/tags', auth, regenerateTags);
docRoutes.get('/:id/versions', auth, getDocVersions);
docRoutes.get('/activity/feed/latest', auth, getLatestActivities);

export default docRoutes;
