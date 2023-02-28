const { body, validationResult } = require('express-validator');
// Validate username
exports.userSignupValidator = [
  body('username').notEmpty().withMessage('Username is required.'),
  body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long.'),
  // Validate email
  body('email').notEmpty().withMessage('Email is required.'),
  body('email').isEmail().withMessage('Invalid email address.'),
  // Validate password
  body('password').notEmpty().withMessage('Password is required.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
];
