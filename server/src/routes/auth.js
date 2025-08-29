import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateLogin, validateRegister } from '../middleware/ValidateAuth.js';
import { apiLimiter } from '../middleware/apiLimiter.js';

const authRoutes = express.Router();

authRoutes.post('/register',apiLimiter, validateRegister, register);
authRoutes.post('/login',apiLimiter,validateLogin, login);

export default authRoutes;