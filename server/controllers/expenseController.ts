/**
 * Expense Controller
 * Handles expense creation, reading, updating, and deletion
 * Features:
 * - AI-powered categorization
 * - Date-wise daily aggregation
 * - Monthly expense calculation
 * - Overspending alerts
 */

import { RequestHandler } from 'express';
import { ExpenseDB, UserDB } from '../services/db';
import { categorizeExpense, generateMonthlyInsights, checkBudgetAlert } from '../services/ai';
import { APIError } from '../middleware/errorHandler';
import { ExpenseInput, ExpenseDocument } from '../models/Expense';


/**
 * POST /api/expenses
 * Create a new expense with AI categorization
 */
export const createExpense: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new APIError(401, 'Not authenticated');
    }

    const { amount, description, date, category } = req.body;

    // Validation
    if (!amount || !description || !date) {
      throw new APIError(400, 'Amount, description, and date are required');
    }

    if (amount <= 0) {
      throw new APIError(400, 'Amount must be greater than 0');
    }

    // Use provided category or auto-categorize
    let finalCategory = category;
    if (!finalCategory) {
      finalCategory = await categorizeExpense(description);
    }

    // Create expense
    const expense = await ExpenseDB.create({
      userId: req.userId,
      amount,
      description,
      date: new Date(date),
      category: finalCategory as any,
    });

    res.status(201).json({
      message: 'Expense created successfully',
      expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/expenses
 * Get all expenses for authenticated user
 * Optional query: month (YYYY-MM format)
 */
export const getExpenses: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new APIError(401, 'Not authenticated');
    }

    const { month } = req.query;

    let expenses;
    if (month && typeof month === 'string') {
      expenses = await ExpenseDB.findByUserIdAndMonth(req.userId, month);
    } else {
      expenses = await ExpenseDB.findByUserId(req.userId);
    }

    res.json({
      expenses,
      count: expenses.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/expenses/monthly/:month
 * Get expenses and stats for a specific month (YYYY-MM)
 */
export const getMonthlyExpenses: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new APIError(401, 'Not authenticated');
    }

    const { month } = req.params;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      throw new APIError(400, 'Month format should be YYYY-MM');
    }

    const expenses = await ExpenseDB.findByUserIdAndMonth(req.userId, month);

    // Calculate totals by category
    const categoryBreakdown = expenses.reduce(
      (acc, expense) => {
        const existing = acc.find((c) => c.category === expense.category);
        if (existing) {
          existing.amount += expense.amount;
          existing.count += 1;
        } else {
          acc.push({
            category: expense.category,
            amount: expense.amount,
            count: 1,
          });
        }
        return acc;
      },
      [] as Array<{ category: string; amount: number; count: number }>,
    );

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Generate AI insights
    const user = await UserDB.findById(req.userId);
    const insights = await generateMonthlyInsights(
      expenses,
      user?.monthlyBudgetLimit || 5000,
    );

    // Check budget alert
    const budgetAlert = checkBudgetAlert(
      totalAmount,
      user?.monthlyBudgetLimit || 5000,
    );

    res.json({
      month,
      totalAmount,
      expenseCount: expenses.length,
      categoryBreakdown,
      expenses,
      insights,
      budgetAlert,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/expenses/daily
 * Get daily expense totals (grouped by date)
 */
export const getDailyExpenses: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new APIError(401, 'Not authenticated');
    }

    const expenses = await ExpenseDB.findByUserId(req.userId);

    // Group by date
    const dailyTotals = expenses.reduce(
      (acc, expense) => {
        const dateStr = expense.date.toISOString().split('T')[0]; // YYYY-MM-DD
        const existing = acc.find((d) => d.date === dateStr);

        if (existing) {
          existing.total += expense.amount;
          existing.count += 1;
          existing.expenses.push(expense);
        } else {
          acc.push({
            date: dateStr,
            total: expense.amount,
            count: 1,
            expenses: [expense],
          });
        }

        return acc;
      },
      [] as Array<{ date: string; total: number; count: number; expenses: any[] }>,
    );

    // Sort by date descending
    dailyTotals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json({
      dailyTotals,
      totalDays: dailyTotals.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/expenses/:id
 * Update an expense
 */
export const updateExpense: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new APIError(401, 'Not authenticated');
    }

    const { id } = req.params;
    const { amount, description, date, category } = req.body;

    const updated = await ExpenseDB.update(id, {
      amount,
      description,
      date: date ? new Date(date) : undefined,
      category,
    });

    if (!updated) {
      throw new APIError(404, 'Expense not found');
    }

    res.json({
      message: 'Expense updated successfully',
      expense: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/expenses/:id
 * Delete an expense
 */
export const deleteExpense: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new APIError(401, 'Not authenticated');
    }

    const { id } = req.params;
    const deleted = await ExpenseDB.delete(id);

    if (!deleted) {
      throw new APIError(404, 'Expense not found');
    }

    res.json({
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/expenses/stats/overall
 * Get overall expense statistics
 */
export const getOverallStats: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new APIError(401, 'Not authenticated');
    }

    const expenses = await ExpenseDB.findByUserId(req.userId);

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const averageExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;

    const categoryBreakdown = expenses.reduce(
      (acc, expense) => {
        const existing = acc.find((c) => c.category === expense.category);
        if (existing) {
          existing.amount += expense.amount;
        } else {
          acc.push({
            category: expense.category,
            amount: expense.amount,
          });
        }
        return acc;
      },
      [] as Array<{ category: string; amount: number }>,
    );

    const monthlyBreakdown = expenses.reduce(
      (acc, expense) => {
        const monthStr = expense.date.toISOString().slice(0, 7); // YYYY-MM
        const existing = acc.find((m) => m.month === monthStr);
        if (existing) {
          existing.total += expense.amount;
        } else {
          acc.push({
            month: monthStr,
            total: expense.amount,
          });
        }
        return acc;
      },
      [] as Array<{ month: string; total: number }>,
    );

    res.json({
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      averageExpense: parseFloat(averageExpense.toFixed(2)),
      expenseCount: expenses.length,
      categoryBreakdown,
      monthlyBreakdown,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/expenses/months-archive
 * Get all months with expense data (for archive/folder view)
 */
export const getMonthsArchive: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new APIError(401, 'Not authenticated');
    }

    const months = await ExpenseDB.findMonthsArchive(req.userId);

    res.json(months);
  } catch (error) {
    next(error);
  }
};

