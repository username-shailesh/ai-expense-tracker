/**
 * Authentication Controller
 * Handles user signup, login, and authentication logic
 * Security: Uses password hashing (crypto module in Node.js)
 */

import { RequestHandler } from 'express';
import { UserDB } from '../services/db';
import { createToken } from '../utils/jwt';
import { APIError } from '../middleware/errorHandler';
import { scryptSync, randomBytes } from 'crypto';

/**
 * Hash password using scrypt (built-in crypto)
 */
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify password
 */
function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  const hashVerify = scryptSync(password, salt, 64).toString('hex');
  return hash === hashVerify;
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * POST /api/auth/signup
 * Create new user account
 */
// Currency symbols mapping
const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  CNY: '¥',
  SEK: 'kr',
  NZD: 'NZ$',
};

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, name, monthlyBudgetLimit, currency } = req.body;

    // Validation
    if (!email || !password || !name) {
      throw new APIError(400, 'Email, password, and name are required');
    }

    if (!isValidEmail(email)) {
      throw new APIError(400, 'Invalid email format');
    }

    if (password.length < 6) {
      throw new APIError(400, 'Password must be at least 6 characters');
    }

    // Check if user already exists
    const existingUser = await UserDB.findByEmail(email);
    if (existingUser) {
      throw new APIError(409, 'Email already registered');
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Default currency to USD if not provided
    const selectedCurrency = currency || 'USD';
    const currencySymbol = currencySymbols[selectedCurrency] || '$';

    // Create user
    const user = await UserDB.create({
      email,
      password: hashedPassword,
      name,
      monthlyBudgetLimit: monthlyBudgetLimit || 5000,
      currency: selectedCurrency,
      currencySymbol: currencySymbol,
    });

    // Generate token
    const token = createToken(user._id!, user.email);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        monthlyBudgetLimit: user.monthlyBudgetLimit,
        currency: user.currency,
        currencySymbol: user.currencySymbol,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      throw new APIError(400, 'Email and password are required');
    }

    // Find user
    const user = await UserDB.findByEmail(email);
    if (!user) {
      throw new APIError(401, 'Invalid email or password');
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      throw new APIError(401, 'Invalid email or password');
    }

    // Generate token
    const token = createToken(user._id!, user.email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        monthlyBudgetLimit: user.monthlyBudgetLimit,
        currency: user.currency,
        currencySymbol: user.currencySymbol,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Get current user info (requires authentication)
 */
export const getCurrentUser: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new APIError(401, 'Not authenticated');
    }

    const user = await UserDB.findById(req.userId);
    if (!user) {
      throw new APIError(404, 'User not found');
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        monthlyBudgetLimit: user.monthlyBudgetLimit,
        currency: user.currency,
        currencySymbol: user.currencySymbol,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/update-budget
 * Update user's monthly budget limit
 */
export const updateBudgetLimit: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new APIError(401, 'Not authenticated');
    }

    const { monthlyBudgetLimit } = req.body;

    if (!monthlyBudgetLimit || monthlyBudgetLimit <= 0) {
      throw new APIError(400, 'Valid monthly budget limit is required');
    }

    const user = await UserDB.update(req.userId, { monthlyBudgetLimit });

    res.json({
      message: 'Budget limit updated',
      monthlyBudgetLimit: user?.monthlyBudgetLimit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/update-currency
 * Update user's currency preference
 */
export const updateCurrency: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new APIError(401, 'Not authenticated');
    }

    const { currency } = req.body;

    if (!currency) {
      throw new APIError(400, 'Currency is required');
    }

    const currencySymbol = currencySymbols[currency] || '$';

    const user = await UserDB.update(req.userId, {
      currency,
      currencySymbol,
    });

    res.json({
      message: 'Currency updated successfully',
      currency: user?.currency,
      currencySymbol: user?.currencySymbol,
    });
  } catch (error) {
    next(error);
  }
};
