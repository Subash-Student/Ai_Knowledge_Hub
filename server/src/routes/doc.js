import express from 'express';
import { auth } from '../middleware/Auth.js';
import { validateDocInput } from '../middleware/ValidateDoc.js';
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

const router = express.Router();

router.post('/', auth, validateDocInput, createDoc);
router.get('/', auth, getDocs);
router.get('/:id', auth, getDoc);
router.put('/:id', auth, validateDocInput, updateDoc);
router.delete('/:id', auth, deleteDoc);
router.post('/:id/summarize', auth, regenerateSummary);
router.post('/:id/tags', auth, regenerateTags);
router.get('/:id/versions', auth, getDocVersions);
router.get('/activity/feed/latest', auth, getLatestActivities);

export default router;