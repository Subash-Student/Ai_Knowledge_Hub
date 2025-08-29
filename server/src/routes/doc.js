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
import { apiLimiter } from '../middleware/apiLimiter.js';

const router = express.Router();

router.post('/', auth,apiLimiter, validateDocInput, createDoc);
router.get('/', auth,apiLimiter, getDocs);
router.get('/:id', auth,apiLimiter, getDoc);
router.put('/:id', auth,apiLimiter, validateDocInput, updateDoc);
router.delete('/:id', auth,apiLimiter, deleteDoc);
router.post('/:id/summarize',apiLimiter, auth, regenerateSummary);
router.post('/:id/tags', auth,apiLimiter, regenerateTags);
router.get('/:id/versions', auth,apiLimiter, getDocVersions);
router.get('/activity/feed/latest',apiLimiter, auth, getLatestActivities);

export default router;