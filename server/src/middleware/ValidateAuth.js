import { body, validationResult } from 'express-validator';

// Helper to handle validation errors
const handleValidation = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      return res.status(422).json({
        message: firstError.msg,
      });
    }

    next();
  };
};

// Regex patterns
const nameRegex = /^[a-zA-Z][a-zA-Z\s.'-]{1,49}$/;
// Starts with a letter, allows spaces, dots, apostrophes, hyphens, 2–50 chars

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Covers most valid email formats, avoids common edge-case failures

// Register validation
export const validateRegister = handleValidation([
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .matches(nameRegex).withMessage('Name must be 2–50 characters and contain only letters, spaces, and basic punctuation'),

  body('email')
    .trim()
    .matches(emailRegex).withMessage('Valid email is required'),

  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
]);

// Login validation
export const validateLogin = handleValidation([
  body('email')
    .trim()
    .matches(emailRegex).withMessage('Valid email is required'),

    body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
]);