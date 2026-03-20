/**
 * Dashboard Page
 * Main application page showing expense tracking, AI insights, budget tracking
 * Features:
 * - Monthly expense overview
 * - AI-powered categorization
 * - Budget tracking with alerts
 * - Category breakdown
 * - Daily expense totals
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { expenseAPI } from '../services/api';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseTable } from '../components/ExpenseTable';
import { BudgetTracker } from '../components/BudgetTracker';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { InsightCard } from '../components/InsightCard';
import { DateWiseSummary } from '../components/DateWiseSummary';
import { MonthYearSelector } from '../components/MonthYearSelector';
import { CurrencySelector } from '../components/CurrencySelector';
import { MonthArchive } from '../components/MonthArchive';
import { UserAvatar } from '../components/UserAvatar';
import { LogOut, Plus, Settings, AlertCircle, DollarSign, X } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Get current date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // State - selectedDate for day-based navigation
  const [selectedDate, setSelectedDate] = useState(new Date(today));
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 1-12 for highlighting
  const [selectedYear, setSelectedYear] = useState(today.getFullYear()); // for highlighting
  const [expenses, setExpenses] = useState([]);
  const [monthlyData, setMonthlyData] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBudgetEditing, setIsBudgetEditing] = useState(false);
  const [newBudgetLimit, setNewBudgetLimit] = useState(user?.monthlyBudgetLimit || 5000);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(user?.currency || 'USD');
  const [monthsArchive, setMonthsArchive] = useState([]);
  const [isLoadingArchive, setIsLoadingArchive] = useState(false);

  // Load monthly expenses whenever selected date changes
  useEffect(() => {
    // Update month/year state for highlighting in archive
    setSelectedMonth(selectedDate.getMonth() + 1);
    setSelectedYear(selectedDate.getFullYear());
    loadMonthlyData();
  }, [selectedDate]);

  // Load months archive on component mount
  useEffect(() => {
    loadMonthsArchive();
  }, []);

  // Convert selected date to YYYY-MM format for API
  function getMonthString() {
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    return `${selectedDate.getFullYear()}-${month}`;
  }

  // Get selected date as YYYY-MM-DD format
  function getDateString() {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async function loadMonthlyData() {
    setIsLoading(true);
    setError(null);
    try {
      const monthString = getMonthString();
      const data = await expenseAPI.getMonthlyExpenses(monthString);
      setMonthlyData(data);

      // Show all expenses for the selected month (grouped by date in the table)
      setExpenses(data.expenses || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading expenses:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // Handler for month/year selection (dropdown)
  function handleMonthChange(month) {
    const newDate = new Date(selectedDate);
    newDate.setMonth(month - 1);
    setSelectedDate(new Date(newDate));
  }

  // Handler for year selection (dropdown)
  function handleYearChange(year) {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    setSelectedDate(new Date(newDate));
  }

  // Navigate to previous day
  function handlePreviousDay() {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  }

  // Navigate to next day
  function handleNextDay() {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  }

  // Go back to today
  function handleToday() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    setSelectedDate(new Date(now));
  }

  async function loadMonthsArchive() {
    setIsLoadingArchive(true);
    try {
      const data = await expenseAPI.getMonthsArchive();
      setMonthsArchive(data);
    } catch (err) {
      console.error('Error loading months archive:', err);
      // Don't set error state for archive - it's not critical
    } finally {
      setIsLoadingArchive(false);
    }
  }

  function handleMonthArchiveSelect(month, year) {
    // Navigate to first day of selected month
    const newDate = new Date(year, month - 1, 1);
    setSelectedDate(newDate);
  }

  async function handleAddExpense(formData) {
    setIsLoading(true);
    try {
      await expenseAPI.createExpense(
        formData.amount,
        formData.description,
        formData.date,
        formData.category
      );
      await loadMonthlyData();
      await loadMonthsArchive();
      setIsFormOpen(false);
      setEditingExpense(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEditExpense(expense) {
    setEditingExpense(expense);
    setIsFormOpen(true);
  }

  async function handleDeleteExpense(expenseId) {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    setIsLoading(true);
    try {
      await expenseAPI.deleteExpense(expenseId);
      await loadMonthlyData();
      await loadMonthsArchive();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateBudget() {
    if (newBudgetLimit <= 0) {
      setError('Budget must be greater than 0');
      return;
    }

    setIsLoading(true);
    try {
      await useAuth().updateBudget(newBudgetLimit);
      setIsBudgetEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCurrencyChange(currency) {
    setSelectedCurrency(currency);
    setIsLoading(true);
    try {
      await useAuth().updateUserCurrency(currency);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Authenticated</h2>
          <p className="text-gray-600 mb-6">Please log in to access the dashboard</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">ExpenseTrack</h1>
            <p className="text-sm text-gray-600">Welcome, {user.name}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              <UserAvatar
                name={user.name}
                image={user.profileImage}
                size="md"
              />
              <span className="text-sm font-semibold text-gray-700 hidden sm:inline">{user.name}</span>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Settings"
            >
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Settings Modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-slide-up max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Settings className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Budget Setting */}
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">💰 Monthly Budget</h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Monthly Budget Limit ({user?.currencySymbol || '$'})
                    </label>
                    <input
                      type="number"
                      value={newBudgetLimit}
                      onChange={(e) => setNewBudgetLimit(Number(e.target.value))}
                      min="1"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Set your monthly spending limit. You'll receive alerts when approaching this limit.
                    </p>
                  </div>
                </div>

                {/* Currency Setting */}
                <div className="pb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    <DollarSign className="w-5 h-5 inline mr-2" />
                    Currency
                  </h3>
                  <CurrencySelector
                    currentCurrency={selectedCurrency}
                    onCurrencyChange={handleCurrencyChange}
                    isLoading={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-3">
                    All amounts will be displayed using the selected currency symbol.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 pt-6 flex gap-3">
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleUpdateBudget}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? '⏳ Saving...' : '✅ Save Budget'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Month Year Selector - with day navigation */}
        <MonthYearSelector
          selectedDate={selectedDate}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
          onNavigatePrevious={handlePreviousDay}
          onNavigateNext={handleNextDay}
          onToday={handleToday}
        />

        {/* Date Wise Summary */}
        <div className="mb-8">
          <DateWiseSummary expenses={expenses} />
        </div>

        {/* Month Archive - Shows all months with data */}
        <div className="mb-8">
          <MonthArchive
            months={monthsArchive}
            isLoading={isLoadingArchive}
            onMonthSelect={handleMonthArchiveSelect}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Budget and Insights */}
          <div className="lg:col-span-2 space-y-8">
            {/* Budget Tracker */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <BudgetTracker
                currentSpending={monthlyData?.totalAmount || 0}
                monthlyBudget={user.monthlyBudgetLimit}
                budgetAlert={monthlyData?.budgetAlert}
                onEditClick={() => setIsBudgetEditing(true)}
              />
            </div>

            {/* Insights */}
            {monthlyData && (
              <InsightCard
                insights={monthlyData.insights}
                isLoading={isLoading}
              />
            )}

            {/* Add Expense Button */}
            <button
              onClick={() => {
                setEditingExpense(null);
                setIsFormOpen(true);
              }}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-teal-700 transition shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Expense
            </button>

            {/* Expense Table - Date Wise */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Transactions by Date</h3>
              <ExpenseTable
                expenses={expenses}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Right Column - Category Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Spending by Category</h3>
            <CategoryBreakdown
              categoryBreakdown={monthlyData?.categoryBreakdown || []}
              totalAmount={monthlyData?.totalAmount || 0}
            />
          </div>
        </div>

        {/* Stats */}
        {monthlyData && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ${monthlyData.totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{monthlyData.expenseCount}</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Avg. Expense</p>
              <p className="text-2xl font-bold text-gray-900">
                ${monthlyData.expenseCount > 0 ? (monthlyData.totalAmount / monthlyData.expenseCount).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Expense Form Modal */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleAddExpense}
        initialData={editingExpense}
        isLoading={isLoading}
        defaultDate={getDateString()}
      />
    </div>
  );
}
