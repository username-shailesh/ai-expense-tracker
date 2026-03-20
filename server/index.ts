import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { initializeDatabase } from "./services/db";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth";

// Controllers
import { signup, login, getCurrentUser, updateBudgetLimit, updateCurrency } from "./controllers/authController";
import {
  createExpense,
  getExpenses,
  getMonthlyExpenses,
  getDailyExpenses,
  updateExpense,
  deleteExpense,
  getOverallStats,
  getMonthsArchive,
} from "./controllers/expenseController";

export function createServer() {
  const app = express();

  // Initialize database (non-blocking)
  initializeDatabase().catch(err => console.error('Database initialization error:', err));

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ==================== AUTHENTICATION ROUTES ====================
  // POST /api/auth/signup - Create new account
  app.post("/api/auth/signup", signup);

  // POST /api/auth/login - Login user
  app.post("/api/auth/login", login);

  // GET /api/auth/me - Get current user (requires auth)
  app.get("/api/auth/me", authMiddleware, getCurrentUser);

  // PUT /api/auth/update-budget - Update budget limit (requires auth)
  app.put("/api/auth/update-budget", authMiddleware, updateBudgetLimit);

  // PUT /api/auth/update-currency - Update currency (requires auth)
  app.put("/api/auth/update-currency", authMiddleware, updateCurrency);

  // ==================== EXPENSE ROUTES ====================
  // POST /api/expenses - Create new expense (requires auth)
  app.post("/api/expenses", authMiddleware, createExpense);

  // GET /api/expenses - Get all expenses or by month (requires auth)
  app.get("/api/expenses", authMiddleware, getExpenses);

  // GET /api/expenses/monthly/:month - Get monthly expenses (requires auth)
  app.get("/api/expenses/monthly/:month", authMiddleware, getMonthlyExpenses);

  // GET /api/expenses/daily - Get daily totals (requires auth)
  app.get("/api/expenses/daily", authMiddleware, getDailyExpenses);

  // GET /api/expenses/stats/overall - Get overall statistics (requires auth)
  app.get("/api/expenses/stats/overall", authMiddleware, getOverallStats);

  // GET /api/expenses/months-archive - Get all months with expense data (requires auth)
  app.get("/api/expenses/months-archive", authMiddleware, getMonthsArchive);

  // PUT /api/expenses/:id - Update expense (requires auth)
  app.put("/api/expenses/:id", authMiddleware, updateExpense);

  // DELETE /api/expenses/:id - Delete expense (requires auth)
  app.delete("/api/expenses/:id", authMiddleware, deleteExpense);

  // ==================== EXAMPLE/DEMO ROUTES ====================
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // ==================== ERROR HANDLING ====================
  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
