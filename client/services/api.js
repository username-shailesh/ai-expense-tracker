/**
 * API Service
 * Handles all HTTP requests to the backend with authentication
 * Manages JWT token storage and attachment
 */

const API_URL = '/api';

/**
 * Get JWT token from localStorage
 */
function getToken() {
  return localStorage.getItem('authToken');
}

/**
 * Set JWT token in localStorage
 */
function setToken(token) {
  localStorage.setItem('authToken', token);
}

/**
 * Clear JWT token from localStorage
 */
function clearToken() {
  localStorage.removeItem('authToken');
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization header if token exists
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

/**
 * ==================== AUTHENTICATION ====================
 */

export const authAPI = {
  /**
   * Sign up new user
   */
  async signup(email, password, name, monthlyBudgetLimit = 5000) {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, monthlyBudgetLimit }),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  /**
   * Log in user
   */
  async login(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  /**
   * Log out user
   */
  logout() {
    clearToken();
  },

  /**
   * Get current user info
   */
  async getCurrentUser() {
    return apiRequest('/auth/me');
  },

  /**
   * Update monthly budget limit
   */
  async updateBudgetLimit(monthlyBudgetLimit) {
    return apiRequest('/auth/update-budget', {
      method: 'PUT',
      body: JSON.stringify({ monthlyBudgetLimit }),
    });
  },

  /**
   * Update user currency preference
   */
  async updateCurrency(currency) {
    return apiRequest('/auth/update-currency', {
      method: 'PUT',
      body: JSON.stringify({ currency }),
    });
  },
};

/**
 * ==================== EXPENSES ====================
 */

export const expenseAPI = {
  /**
   * Create new expense
   */
  async createExpense(amount, description, date, category = null) {
    return apiRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify({ amount, description, date, category }),
    });
  },

  /**
   * Get all expenses or filtered by month
   */
  async getExpenses(month = null) {
    const query = month ? `?month=${month}` : '';
    return apiRequest(`/expenses${query}`);
  },

  /**
   * Get expenses for specific month with stats and insights
   */
  async getMonthlyExpenses(month) {
    return apiRequest(`/expenses/monthly/${month}`);
  },

  /**
   * Get daily expense totals
   */
  async getDailyExpenses() {
    return apiRequest('/expenses/daily');
  },

  /**
   * Get overall statistics
   */
  async getOverallStats() {
    return apiRequest('/expenses/stats/overall');
  },

  /**
   * Get all months with expense data (for archive/folder view)
   */
  async getMonthsArchive() {
    return apiRequest('/expenses/months-archive');
  },

  /**
   * Update expense
   */
  async updateExpense(expenseId, amount, description, date, category) {
    return apiRequest(`/expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify({ amount, description, date, category }),
    });
  },

  /**
   * Delete expense
   */
  async deleteExpense(expenseId) {
    return apiRequest(`/expenses/${expenseId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Export token management for custom usage
 */
export const tokenAPI = {
  getToken,
  setToken,
  clearToken,
  isAuthenticated() {
    return !!getToken();
  },
};
