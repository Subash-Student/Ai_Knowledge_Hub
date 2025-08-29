import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateLogin, validateRegister } from '../middleware/ValidateAuth.js';

const authRoutes = express.Router();

authRoutes.post('/register',validateRegister, register);
authRoutes.post('/login',validateLogin, login);

export default authRoutes;