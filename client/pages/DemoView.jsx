/**
 * Demo View
 * Shows the table layout with sample expenses for demonstration
 */

import { ExpenseTable } from '../components/ExpenseTable';
import { DateWiseSummary } from '../components/DateWiseSummary';
import { BudgetTracker } from '../components/BudgetTracker';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function DemoView() {
  // Sample expenses data
  const today = new Date();
  const sampleExpenses = [
    {
      _id: '1',
      amount: 45.50,
      description: 'Lunch at restaurant',
      category: 'Food',
      date: today.toISOString(),
    },
    {
      _id: '2',
      amount: 25.00,
      description: 'Coffee and snack',
      category: 'Food',
      date: today.toISOString(),
    },
    {
      _id: '3',
      amount: 12.50,
      description: 'Uber ride',
      category: 'Travel',
      date: new Date(today.getTime() - 86400000).toISOString(),
    },
    {
      _id: '4',
      amount: 89.99,
      description: 'Nike shoes',
      category: 'Shopping',
      date: new Date(today.getTime() - 86400000).toISOString(),
    },
    {
      _id: '5',
      amount: 60.00,
      description: 'Electricity bill',
      category: 'Bills',
      date: new Date(today.getTime() - 172800000).toISOString(),
    },
    {
      _id: '6',
      amount: 150.00,
      description: 'Internet subscription',
      category: 'Bills',
      date: new Date(today.getTime() - 172800000).toISOString(),
    },
    {
      _id: '7',
      amount: 75.00,
      description: 'Flight to NYC',
      category: 'Travel',
      date: new Date(today.getTime() - 259200000).toISOString(),
    },
    {
      _id: '8',
      amount: 200.00,
      description: 'Grocery shopping',
      category: 'Shopping',
      date: new Date(today.getTime() - 259200000).toISOString(),
    },
  ];

  const categoryBreakdown = [
    { category: 'Food', amount: 70.50 },
    { category: 'Travel', amount: 87.50 },
    { category: 'Shopping', amount: 289.99 },
    { category: 'Bills', amount: 210.00 },
  ];

  const totalAmount = 657.99;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              ExpenseTrack Demo
            </h1>
            <p className="text-sm text-gray-600">Table-based expense view with date-wise grouping</p>
          </div>

          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Date Wise Summary */}
        <div className="mb-8">
          <DateWiseSummary expenses={sampleExpenses} />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Budget and Table */}
          <div className="lg:col-span-2 space-y-8">
            {/* Budget Tracker */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <BudgetTracker
                currentSpending={totalAmount}
                monthlyBudget={5000}
              />
            </div>

            {/* Expense Table - Date Wise */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                📊 Transactions by Date (Table View)
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Expenses are automatically grouped by date. Each date shows the total amount spent 
                and number of transactions for that day.
              </p>
              <ExpenseTable
                expenses={sampleExpenses}
                onEdit={() => {}}
                onDelete={() => {}}
                isLoading={false}
              />
            </div>
          </div>

          {/* Right Column - Category Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Spending by Category
            </h3>
            <CategoryBreakdown
              categoryBreakdown={categoryBreakdown}
              totalAmount={totalAmount}
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            ✨ New Table-Based Features
          </h2>
          <ul className="space-y-2 text-blue-800">
            <li className="flex gap-2">
              <span>📅</span>
              <span>
                <strong>Date-Wise Grouping:</strong> All expenses are automatically grouped by date
              </span>
            </li>
            <li className="flex gap-2">
              <span>🏷️</span>
              <span>
                <strong>Category Icons:</strong> Each expense shows a small category emoji icon
                (🍔 Food, 🚗 Travel, 🛍️ Shopping, 📄 Bills, 📌 Other)
              </span>
            </li>
            <li className="flex gap-2">
              <span>📊</span>
              <span>
                <strong>Daily Totals:</strong> Each date section shows total amount and transaction count
              </span>
            </li>
            <li className="flex gap-2">
              <span>📋</span>
              <span>
                <strong>Table Format:</strong> Clean table layout with Category, Description, Amount, and Actions columns
              </span>
            </li>
            <li className="flex gap-2">
              <span>🎨</span>
              <span>
                <strong>Color Coded:</strong> Categories are color-coded for easy identification
              </span>
            </li>
            <li className="flex gap-2">
              <span>📱</span>
              <span>
                <strong>Responsive Design:</strong> Fully responsive for desktop and mobile devices
              </span>
            </li>
          </ul>
        </div>

        {/* How to Test */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-green-900 mb-4">
            ✅ How to Test in Your Dashboard
          </h2>
          <ol className="space-y-2 text-green-800 list-decimal list-inside">
            <li>
              Go to <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold underline">Login</Link>
            </li>
            <li>Use demo credentials: demo@example.com / demo123</li>
            <li>View the dashboard with pre-loaded expenses</li>
            <li>Add new expenses using the "Add New Expense" button</li>
            <li>Expenses will automatically appear in the table, grouped by date</li>
            <li>Edit or delete expenses using the action buttons in each row</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
