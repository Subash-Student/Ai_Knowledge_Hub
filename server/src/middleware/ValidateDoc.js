import { body, validationResult } from 'express-validator';

const handleValidation = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((v) => v.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(422).json({
      success: false,
      message: firstError.msg,
    });
  }
  next();
};

// Regex: no symbols, only letters, numbers, spaces
const titleRegex = /^[a-zA-Z0-9 ]{1,100}$/;

export const validateDocInput = handleValidation([
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .matches(titleRegex).withMessage('Title must not contain symbols'),

  body('content')
    .trim()
    .notEmpty().withMessage('Content is required'),
]);